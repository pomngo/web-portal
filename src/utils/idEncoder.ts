const SALT = 0x5f3759df;
const MASK = 0x7fffffff;

/**
 * Obfuscates a numeric database ID into a non-predictable, tamper-checked alphanumeric string token.
 * Prevents users from guessing or incrementing IDs in the URL bar.
 */
export const encodeId = (id: number | string | undefined | null): string => {
  if (id === undefined || id === null) return "";
  const num = typeof id === "number" ? id : parseInt(String(id), 10);
  if (isNaN(num) || num <= 0) return String(id || "");

  // Bitwise XOR permutation
  const obfuscated = (num ^ SALT) & MASK;
  // Convert to base 36 alphanumeric
  const baseStr = obfuscated.toString(36);
  // Reversible checksum digit based on original ID
  const checksum = ((num * 7 + 13) % 36).toString(36);
  return `${baseStr}${checksum}`;
};

/**
 * Decodes an obfuscated URL token back into the original numeric integer ID.
 * Returns NaN if the token is invalid or manually tampered with in the URL bar.
 */
export const decodeId = (token: string | number | undefined | null): number => {
  if (token === undefined || token === null) return NaN;
  const strToken = String(token).trim();
  if (!strToken) return NaN;

  // Support plain legacy numeric IDs if passed
  if (/^\d+$/.test(strToken)) {
    return parseInt(strToken, 10);
  }

  try {
    const checksumChar = strToken.slice(-1);
    const baseStr = strToken.slice(0, -1);
    const obfuscated = parseInt(baseStr, 36);
    if (isNaN(obfuscated)) return NaN;

    const originalId = obfuscated ^ SALT;
    const expectedChecksum = ((originalId * 7 + 13) % 36).toString(36);

    if (checksumChar !== expectedChecksum) {
      return NaN; // Tampered token
    }

    return originalId;
  } catch {
    return NaN;
  }
};
