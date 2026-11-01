/**
 * SERVER-ONLY helpers for password recovery (uses Node's crypto).
 * Never import this file from a client component.
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

// 32 characters, no look-alikes (no 0/O, 1/I). 256 % 32 === 0 so there is no modulo bias.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 30;
export const ADMIN_CODE_HOURS = 24;
export const REQUEST_COOLDOWN_MINUTES = 10;

function randomFromAlphabet(length: number): string {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

/** Personal recovery code shown once at signup, e.g. K7M2-QX9P-4WTD */
export function generateRecoveryCode(): string {
  const raw = randomFromAlphabet(12);
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

/** One-time temporary code the admin gives out, e.g. K7M2-QX9P */
export function generateAdminResetCode(): string {
  const raw = randomFromAlphabet(8);
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

/** Makes "k7m2 qx9p-4wtd" and "K7M2-QX9P-4WTD" compare equal. */
export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** Ignores case, spaces and punctuation so "Sunita ", "sunita" and "Sun-ita" match. */
export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s!-/:-@[-`{-~]/g, '');
}

/** Salted scrypt hash, stored as "saltHex:hashHex". */
export function hashSecret(secret: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(secret, salt, 32);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifySecret(secret: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(secret, Buffer.from(saltHex, 'hex'), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const DUMMY_HASH = hashSecret('dummy-value-for-timing');

/** Spend the same time as a real check, so unknown numbers are not distinguishable by speed. */
export function burnTime(secret: string): void {
  verifySecret(secret, DUMMY_HASH);
}
