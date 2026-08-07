// src/services/api/endpoints.ts

export const ENDPOINTS = {
  BASE_URL: {
    BASE_API_URL: import.meta.env.VITE_API_BASE_URL,
    BASE_IMAGE_URL: (url: string) => `${import.meta.env.VITE_IMAGE_URL}/${url}`,
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
