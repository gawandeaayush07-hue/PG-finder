/**
 * Shared (safe for browser AND server) recovery constants.
 */

export const RECOVERY_QUESTIONS = [
  { key: 'school', label: 'What was the name of your first school?' },
  { key: 'nickname', label: 'What was your childhood nickname?' },
  { key: 'pet', label: 'What was the name of your first pet?' },
  { key: 'teacher', label: 'Who was your favourite school teacher?' },
  { key: 'friend', label: 'What is the first name of your best friend in school?' },
  { key: 'mother', label: "What is your mother's first name?" },
] as const;

export type RecoveryQuestionKey = (typeof RECOVERY_QUESTIONS)[number]['key'];

export function isRecoveryQuestionKey(value: unknown): value is RecoveryQuestionKey {
  return typeof value === 'string' && RECOVERY_QUESTIONS.some((q) => q.key === value);
}

export const MIN_PASSWORD_LENGTH = 8;
