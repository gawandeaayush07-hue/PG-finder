/**
 * Extracts neutral initials from a full name or email.
 * E.g. "Ayush Gawande" -> "AG", "Ayush" -> "A", "aarav@student.in" -> "A".
 */
export function getInitials(name?: string | null, fallbackEmail?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 1).toUpperCase();
  }
  if (fallbackEmail && fallbackEmail.trim()) {
    return fallbackEmail.trim()[0].toUpperCase();
  }
  return 'U';
}
