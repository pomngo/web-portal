export type CardType = "large" | "small" | "wide" | "tall";

export interface FlockItem {
  id: number;
  name?: string;
  flock_name?: string;
  location: string;
  member_count?: number;
  participants_count?: number;
  cover_image_s3key?: string | null;
  description?: string;
  [key: string]: any;
}

export interface ActivityItem {
  id: number;
  name: string;
  campaign_location: string;
  flock_members_count?: number;
  joined_member_count?: number;
  title?: string;
  cover_image_s3key?: string;
  last_cover_image?: string | null;
  image?: string;
  [key: string]: any;
}

