// src/services/api/endpoints.ts

export const ENDPOINTS = {
  BASE_URL: {
    BASE_API_URL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/campaign_api/v1",
    BASE_IMAGE_URL: (url: string) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const baseUrl = import.meta.env.VITE_IMAGE_URL || "https://du27z4qz38jyx.cloudfront.net";
      return `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    },
  },
  CAMPAIGN: {
    LIST: "/public/flocks/listing/",
    DETAILS: (id: string | number) => `/public/flocks/listing/?flock_id=${id}`,
  },
  ACTIVITY: {
    LIST: "/public/activities/listing/",
    DETAILS: (id: string | number) => `/public/activities/listing/?activity_id=${id}`,
  },
};
