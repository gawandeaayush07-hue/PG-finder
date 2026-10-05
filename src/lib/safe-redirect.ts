/**
 * Validates whether a redirect path is safe against open redirect vulnerabilities
 * and HTTP response splitting / control character injection.
 *
 * Rules:
 * 1. Must be a non-empty string starting with '/' and not '//'.
 * 2. Must not contain scheme delimiters ('://') or backslashes ('\\').
 * 3. Must not contain tab, newline, carriage return, or any ASCII control characters (\x00-\x1f, \x7f).
 */
export function isSafeRedirect(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Must be a relative path starting with a single '/'
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false;
  }

  // Reject scheme-relative or absolute URL attempts and backslashes
  if (path.includes('://') || path.includes('\\')) {
    return false;
  }

  // Reject tab, newline, carriage return, or any ASCII control character (\x00-\x1f, \x7f)
  for (let i = 0; i < path.length; i++) {
    const code = path.charCodeAt(i);
    if ((code >= 0 && code <= 31) || code === 127) {
      return false;
    }
  }

  return true;
}
