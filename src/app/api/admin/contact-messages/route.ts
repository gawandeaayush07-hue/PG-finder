import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: NextRequest) {
  try {
    const check = await requireAdmin(request);
    if (!check.ok) return check.response;
    const { db } = check;

    const { data, error } = await db
      .from('contact_messages')
      .select('id, ticket_id, name, email, category, message, status, email_sent, created_at, handled_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Admin list messages failed', error);
      return NextResponse.json({ error: 'Could not load messages.' }, { status: 500 });
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (error: unknown) {
    console.error('Admin messages list unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const check = await requireAdmin(request);
    if (!check.ok) return check.response;
    const { db } = check;

    const body: { id?: string; status?: 'NEW' | 'DONE' } = await request.json();
    if (!body.id || (body.status !== 'NEW' && body.status !== 'DONE')) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const { error } = await db
      .from('contact_messages')
      .update({
        status: body.status,
        handled_at: body.status === 'DONE' ? new Date().toISOString() : null,
      })
      .eq('id', body.id);

    if (error) {
      console.error('Admin update message failed', error);
      return NextResponse.json({ error: 'Could not update the message.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Admin messages update unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
