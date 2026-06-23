// Canonical production origin — used for absolute URLs in canonical tags,
// og:url, sitemap, and structured data (search engines want absolute URLs).
export const SITE_URL = "https://brunomind.com";

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
