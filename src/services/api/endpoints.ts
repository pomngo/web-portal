// src/services/api/endpoints.ts

export const ENDPOINTS = {
  BASE_URL: {
    BASE_API_URL: import.meta.env.VITE_API_BASE_URL,
    BASE_IMAGE_URL: (url: string)=>`${import.meta.env.VITE_IMAGE_URL}/${url}`,
  },
  CAMPAIGN: {
    LIST: "/public/flocks/?is_discoverable=true",
    DETAILS: (id: string | number) => `/public/flocks/?flock_id=${id}`,
  },
};