import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createHash, randomInt } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { categoryLabel, validateContactInput, type ContactInput } from '@/lib/contact';
import { verifyTurnstile } from '@/lib/turnstile-server';

// At most 3 messages per visitor (by network address) every 10 minutes
const RATE_LIMIT_COUNT = 3;
const RATE_WINDOW_MINUTES = 10;

// Where the "new message" email goes. Override on Vercel with CONTACT_NOTIFY_EMAIL if needed.
const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'ayush.gawande25@pccoepune.org';

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || '';
}

function makeTicketId(): string {
  return `SUP-${randomInt(100000, 1000000)}`;
}

/** Best effort: a failed email never loses the message, it is already saved. */
async function sendNotificationEmail(ticketId: string, input: ContactInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const subject = `[PG Finder] ${categoryLabel(input.category)} (${ticketId})`.replace(/[\r\n]+/g, ' ');
  const text = [
    'New message from the PG Finder contact form',
    '',
    `Ticket:   ${ticketId}`,
    `Category: ${categoryLabel(input.category)}`,
    `From:     ${input.name} <${input.email}>`,
    `Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (India time)`,
    '',
    '----- Message -----',
    input.message,
    '-------------------',
    '',
    'Press Reply to answer them directly (Reply-To is set to their email).',
  ].join('\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PG Finder <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        reply_to: input.email,
        subject,
        text,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error('Contact email: Resend rejected the request', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.error('Contact email: request failed', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: NextRequest) {
  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

    // Honeypot: real people never see or fill this hidden field, bots usually do.
    // Pretend it worked so the bot learns nothing, but save nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true, ticketId: makeTicketId() });
    }

    const parsed = validateContactInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const input = parsed.value;

    const ip = clientIp(request);
    const captcha = await verifyTurnstile(
      typeof body.turnstileToken === 'string' ? body.turnstileToken : undefined,
      ip
    );
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: captcha.status });
    }

    let db: SupabaseClient;
    try {
      db = createAdminClient() as unknown as SupabaseClient;
    } catch (err: unknown) {
      console.error('Contact: admin client failed', err);
      return NextResponse.json({ error: 'Service is not configured. Please try again later.' }, { status: 500 });
    }

    // Rate limit by hashed network address (the raw address is never stored)
    const ipHash = createHash('sha256').update(`pgf-contact:${ip || 'unknown'}`).digest('hex').slice(0, 32);
    const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countError } = await db
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);

    if (countError) {
      console.error('Contact: rate limit check failed', countError);
      return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 500 });
    }

    if ((count ?? 0) >= RATE_LIMIT_COUNT) {
      return NextResponse.json(
        { error: `You have sent a few messages already. Please wait about ${RATE_WINDOW_MINUTES} minutes before sending another.` },
        { status: 429 }
      );
    }

    // Save the message (retry a couple of times in the unlikely event of a duplicate ticket number)
    let ticketId = '';
    let rowId = '';
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const candidate = makeTicketId();
      const { data, error } = await db
        .from('contact_messages')
        .insert({
          ticket_id: candidate,
          name: input.name,
          email: input.email,
          category: input.category,
          message: input.message,
          ip_hash: ipHash,
        })
        .select('id, ticket_id')
        .single();

      if (!error && data) {
        ticketId = String(data.ticket_id);
        rowId = String(data.id);
        lastError = null;
        break;
      }
      lastError = error;
      if (error?.code !== '23505') break; // only retry on a duplicate ticket number
    }

    if (!ticketId) {
      console.error('Contact: could not save message', lastError);
      return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 500 });
    }

    // Email notification (best effort)
    const emailed = await sendNotificationEmail(ticketId, input);
    if (emailed) {
      await db.from('contact_messages').update({ email_sent: true }).eq('id', rowId);
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (error: unknown) {
    console.error('Contact route unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
