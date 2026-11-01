/**
 * Shared (safe for browser AND server) constants and validation for the Contact form.
 * Keep this file free of Node-only imports.
 */

export const CONTACT_CATEGORIES = [
  { key: 'student_inquiry', label: 'Student Housing / Tour Scheduling' },
  { key: 'owner_listing', label: 'PG Owner Listing & Verification' },
  { key: 'technical_bug', label: 'Technical Bug / App Feedback' },
  { key: 'billing_deposit', label: 'Deposit or Rent Clarification' },
  { key: 'press_partnership', label: 'Campus Partnership & Media' },
  { key: 'account_help', label: 'Account / Password Help' },
] as const;

export type ContactCategoryKey = (typeof CONTACT_CATEGORIES)[number]['key'];

export function isContactCategoryKey(value: unknown): value is ContactCategoryKey {
  return typeof value === 'string' && CONTACT_CATEGORIES.some((c) => c.key === value);
}

export function categoryLabel(key: string): string {
  return CONTACT_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  category: ContactCategoryKey;
  message: string;
}

export type ContactValidation = { ok: true; value: ContactInput } | { ok: false; error: string };

// Deliberately strict: no spaces, no "?" "&" "=" etc., so the address is safe in a mailto: link.
const SAFE_EMAIL = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function stripControlChars(input: string, keepNewlines: boolean): string {
  // eslint-disable-next-line no-control-regex
  const pattern = keepNewlines ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return input.replace(pattern, '');
}

export function validateContactInput(raw: unknown): ContactValidation {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid request.' };
  }
  const body = raw as Record<string, unknown>;

  const name = stripControlChars(String(body.name ?? ''), false).replace(/\s+/g, ' ').trim();
  if (name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax) {
    return { ok: false, error: `Please enter your name (${CONTACT_LIMITS.nameMin}-${CONTACT_LIMITS.nameMax} characters).` };
  }

  const email = stripControlChars(String(body.email ?? ''), false).trim().toLowerCase();
  if (email.length > CONTACT_LIMITS.emailMax || !SAFE_EMAIL.test(email)) {
    return { ok: false, error: 'Please enter a valid email address so we can reply to you.' };
  }

  if (!isContactCategoryKey(body.category)) {
    return { ok: false, error: 'Please choose a query category.' };
  }

  const message = stripControlChars(String(body.message ?? '').replace(/\r\n?/g, '\n'), true).trim();
  if (message.length < CONTACT_LIMITS.messageMin) {
    return { ok: false, error: `Please write a little more (at least ${CONTACT_LIMITS.messageMin} characters).` };
  }
  if (message.length > CONTACT_LIMITS.messageMax) {
    return { ok: false, error: `Your message is too long (maximum ${CONTACT_LIMITS.messageMax} characters).` };
  }

  return { ok: true, value: { name, email, category: body.category, message } };
}
