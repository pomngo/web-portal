/**
 * Location Normalization Utilities
 * Safely parses, sanitizes, and normalizes URL location parameters for display, SEO, and backend queries.
 */

export interface NormalizedLocation {
  raw: string;
  query: string;
  displayName: string;
  canonicalSlug: string;
  isValid: boolean;
}

export const normalizeLocationSlug = (rawSlug?: string): NormalizedLocation => {
  if (!rawSlug || typeof rawSlug !== "string") {
    return {
      raw: "",
      query: "",
      displayName: "",
      canonicalSlug: "",
      isValid: false,
    };
  }

  // 1. Safely decode URI components
  let decoded = "";
  try {
    decoded = decodeURIComponent(rawSlug.trim());
  } catch {
    decoded = rawSlug.trim();
  }

  // 2. Remove malicious/unsafe characters and control characters
  const sanitized = Array.from(decoded)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127 && !'<>"{}[]\\^`|'.includes(char);
    })
    .join("")
    .trim();

  if (!sanitized || sanitized.length > 100) {
    return {
      raw: rawSlug,
      query: "",
      displayName: "",
      canonicalSlug: "",
      isValid: false,
    };
  }

  // 3. Convert hyphens or underscores to spaces for query search and display
  // e.g. "navi-mumbai" -> "navi mumbai"
  const spacedText = sanitized.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  // 4. Title case for display name (e.g. "Navi Mumbai", "Pune")
  const displayName = spacedText
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // 5. Canonical slug format (e.g. "navi-mumbai")
  const canonicalSlug = spacedText.toLowerCase().replace(/\s+/g, "-");

  return {
    raw: rawSlug,
    query: spacedText,
    displayName: displayName || sanitized,
    canonicalSlug: canonicalSlug || sanitized.toLowerCase(),
    isValid: displayName.length > 0,
  };
};
