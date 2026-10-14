import { useEffect } from "react";

export type SEODomain = "main" | "events";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  domain?: SEODomain;
  ogType?: string;
  ogImage?: string;
  robots?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DOMAIN_MAP: Record<SEODomain, string> = {
  events: "https://events.flockngo.com",
  main: "https://flockngo.com",
};

export const useSEO = ({
  title,
  description,
  keywords,
  canonicalPath,
  domain = "events",
  ogType = "website",
  ogImage,
  robots,
  noindex,
  schema,
}: SEOProps) => {
  const schemaStr = schema ? JSON.stringify(schema) : "";

  useEffect(() => {
    // 1. Title Tag
    if (title) {
      document.title = title;
    }

    // Helper for Meta Tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', "name", "description", description);
    }

    // 3. Meta Keywords (only set when provided; remove if absent to avoid stale spam keywords)
    const existingKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywords && keywords.trim()) {
      setMetaTag('meta[name="keywords"]', "name", "keywords", keywords.trim());
    } else if (existingKeywordsTag) {
      existingKeywordsTag.remove();
    }

    // 4. Robots Tag (defaults to index, follow; handles noindex for private/draft/404)
    const robotsContent = noindex
      ? "noindex, nofollow"
      : robots || "index, follow, max-image-preview:large";
    setMetaTag('meta[name="robots"]', "name", "robots", robotsContent);

    // 5. Canonical URL
    const baseUrl = DOMAIN_MAP[domain] || DOMAIN_MAP.events;
    const cleanPath = canonicalPath || window.location.pathname;
    const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    const fullCanonicalUrl = `${baseUrl}${normalizedPath === "/" ? "/" : normalizedPath.replace(/\/$/, "")}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullCanonicalUrl);

    // 6. Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    setMetaTag('meta[property="og:url"]', "property", "og:url", fullCanonicalUrl);
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "FlocknGo Events");
    setMetaTag('meta[property="og:locale"]', "property", "og:locale", "en_IN");
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);
    }

    // 7. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (ogImage) {
      setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
    }

    // 8. Structured Data (JSON-LD Schema)
    const scriptId = "flockngo-jsonld-schema";
    let existingScript = document.getElementById(scriptId);

    if (schemaStr) {
      if (!existingScript) {
        existingScript = document.createElement("script");
        existingScript.id = scriptId;
        existingScript.setAttribute("type", "application/ld+json");
        document.head.appendChild(existingScript);
      }
      existingScript.textContent = schemaStr;
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [title, description, keywords, canonicalPath, domain, ogType, ogImage, robots, noindex, schemaStr]);
};
