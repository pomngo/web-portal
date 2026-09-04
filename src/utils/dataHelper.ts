/**
 * Data normalization helper utilities for web portal API payloads.
 * Solves data inconsistencies across detail views and listing cards.
 */

/**
 * Safely extracts total member / participant count from any flock or activity payload.
 * Handles all backend property variants (numbers, numeric strings, or member arrays).
 */
export const getMemberCount = (item: any): number => {
  if (!item || typeof item !== "object") return 0;

  // Candidate numeric property keys across all backend endpoints
  const candidateKeys = [
    "participants_count",
    "members_count",
    "member_count",
    "joined_member_count",
    "joined_members_count",
    "flock_members_count",
    "total_members",
    "total_participants",
    "participant_count",
    "users_count",
  ];

  for (const key of candidateKeys) {
    if (key in item && item[key] !== null && item[key] !== undefined) {
      const val = Number(item[key]);
      if (!isNaN(val) && val >= 0) return val;
    }
  }

  // Candidate array keys if backend returns arrays of member objects
  const arrayKeys = ["members", "participants", "joined_members", "users", "flock_members"];
  for (const key of arrayKeys) {
    if (Array.isArray(item[key])) {
      return item[key].length;
    }
  }

  return 0;
};

/**
 * Safely extracts location string from flock or activity object.
 */
export const getLocation = (item: any, fallback = "Location N/A"): string => {
  if (!item || typeof item !== "object") return fallback;
  return (
    item.location ||
    item.campaign_location ||
    item.flock_location ||
    item.city ||
    item.address ||
    fallback
  );
};

/**
 * Safely extracts title/name string from flock or activity object.
 */
export const getItemName = (item: any, fallback = "Community Item"): string => {
  if (!item || typeof item !== "object") return fallback;
  return (
    item.flock_name ||
    item.name ||
    item.title ||
    item.activity_name ||
    fallback
  );
};

/**
 * Safely extracts image URL or S3 key from flock or activity object.
 */
export const getImageUrl = (item: any, getS3Url?: (key: string) => string): string | undefined => {
  if (!item || typeof item !== "object") return undefined;

  const key =
    item.last_cover_image ||
    item.cover_image_s3key ||
    (Array.isArray(item.cover_image) ? item.cover_image[0] : item.cover_image) ||
    item.image ||
    item.banner ||
    item.s3_key;

  if (!key) return undefined;
  if (typeof key === "string" && (key.startsWith("http://") || key.startsWith("https://"))) {
    return key;
  }
  if (typeof key === "string" && getS3Url) {
    return getS3Url(key);
  }
  return undefined;
};
