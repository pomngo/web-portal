// Centralized URLs for external navigation & production constants
export const PRODUCTION_REDIRECT_URL = "https://web.flockngo.com/";

export const handleExternalRedirect = (url?: string | null) => {
  const targetUrl = url && url.trim() ? url : PRODUCTION_REDIRECT_URL;
  window.location.href = targetUrl;
};
