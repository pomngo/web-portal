// Centralized URLs for external navigation & production constants
export const PRODUCTION_REDIRECT_URL = "https://web.flockngo.com/";

export const handleExternalRedirect = (url: string = PRODUCTION_REDIRECT_URL) => {
  window.location.href = url;
};
