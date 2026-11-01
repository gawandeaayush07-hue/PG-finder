/**
 * Utility functions for Indian mobile number normalization and authentication email derivation.
 * Canonical phone format: +91XXXXXXXXXX (E.164)
 */

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
export const AUTH_EMAIL_DOMAIN = 'phone.pgfinder.app';

/**
 * Normalizes an Indian phone number string to canonical E.164 format (+91XXXXXXXXXX).
 * Accepts:
 *   - "9876543210"
 *   - "+91 98765 43210"
 *   - "+919876543210"
 *   - "09876543210"
 *   - "98765-43210"
 * Returns null if the number is not a valid 10-digit Indian mobile starting with 6-9.
 */
export function normalizePhone(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // Remove all non-digit characters except leading plus if present
  let cleaned = raw.trim().replace(/[\s\-()]/g, '');

  // Strip leading +91, 91, or 0 if followed by 10 digits
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // Check if exactly 10 digits starting with 6-9
  if (!INDIAN_MOBILE_REGEX.test(cleaned)) {
    return null;
  }

  return `+91${cleaned}`;
}

/**
 * Extracts 10-digit mobile number from a phone string or null if invalid.
 */
export function extract10Digits(raw: string): string | null {
  const normalized = normalizePhone(raw);
  if (!normalized) return null;
  return normalized.slice(3); // Remove '+91'
}

/**
 * Derives the hidden Supabase Auth login email from a phone number.
 * Example: +91 98765 43210 -> 919876543210@phone.pgfinder.app
 */
export function phoneToAuthEmail(rawOrNormalizedPhone: string): string | null {
  const digits = extract10Digits(rawOrNormalizedPhone);
  if (!digits) return null;
  return `91${digits}@${AUTH_EMAIL_DOMAIN}`;
}

/**
 * Checks whether an email address is an internal phone auth placeholder.
 */
export function isAuthPlaceholderEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase().trim();
  return lower.endsWith(`@${AUTH_EMAIL_DOMAIN}`) || lower.endsWith('@phone.pgfinder.invalid');
}

/**
 * Pretty-formats a canonical phone (+91XXXXXXXXXX) for display:
 * "+91 98765 43210"
 */
export function formatPhone(rawOrCanonical: string): string {
  const normalized = normalizePhone(rawOrCanonical);
  if (!normalized) return rawOrCanonical || '';
  const digits = normalized.slice(3);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * Generates a WhatsApp click-to-chat URL:
 * https://wa.me/91XXXXXXXXXX?text=...
 */
export function phoneToWhatsAppUrl(rawOrCanonical: string, prefilledMessage?: string): string | null {
  const digits = extract10Digits(rawOrCanonical);
  if (!digits) return null;
  const baseUrl = `https://wa.me/91${digits}`;
  if (prefilledMessage) {
    return `${baseUrl}?text=${encodeURIComponent(prefilledMessage)}`;
  }
  return baseUrl;
}

