export type CardType = "large" | "small" | "wide" | "tall";

export interface FlockItem {
  id: number;
  flock_name: string;
  location: string;
  participants_count: number;
  cover_image_s3key: string;
  description?: string;
  [key: string]: any;
}

export interface ActivityItem {
  id: number;
  name: string;
  campaign_location: string;
  flock_members_count: number;
  title?: string;
  cover_image_s3key?: string;
  image?: string;
  [key: string]: any;
}
