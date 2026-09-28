// Centralized URLs for external navigation & environment constants
export const PROD_REDIRECT_URL = "https://web.flockngo.com";
export const UAT_REDIRECT_URL = "https://uat.flockngo.com";
export const DEV_REDIRECT_URL = "https://dev.flockngo.com";

export const DEFAULT_REDIRECT_URL =
  import.meta.env.VITE_REDIRECT_URL ||
  (import.meta.env.MODE === "release" || import.meta.env.MODE === "staging" || import.meta.env.MODE === "uat"
    ? UAT_REDIRECT_URL
    : import.meta.env.MODE === "development"
      ? DEV_REDIRECT_URL
      : PROD_REDIRECT_URL);

export const handleExternalRedirect = (url?: string | null) => {
  const targetUrl = url && url.trim() ? url : DEFAULT_REDIRECT_URL;
  window.location.href = targetUrl;
};
