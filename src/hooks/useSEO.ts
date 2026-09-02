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
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const DOMAIN_MAP: Record<SEODomain, string> = {
  main: "https://flockngo.com",
  events: "https://events.flockngo.com",
};

export const useSEO = ({
  title,
  description,
  keywords,
  canonicalPath,
  domain = "main",
  ogType = "website",
  ogImage,
  schema,
}: SEOProps) => {
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

    // 3. Meta Keywords
    if (keywords) {
      setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
    }

    // 4. Robots Tag
    setMetaTag('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large");

    // 5. Canonical URL
    const baseUrl = DOMAIN_MAP[domain] || DOMAIN_MAP.main;
    const cleanPath = canonicalPath || window.location.pathname;
    const fullCanonicalUrl = `${baseUrl}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;

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
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "FlocknGo");
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

    if (schema) {
      if (!existingScript) {
        existingScript = document.createElement("script");
        existingScript.id = scriptId;
        existingScript.setAttribute("type", "application/ld+json");
        document.head.appendChild(existingScript);
      }
      existingScript.textContent = JSON.stringify(schema);
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      // Optional cleanup on unmount if needed
    };
  }, [title, description, keywords, canonicalPath, domain, ogType, ogImage, JSON.stringify(schema)]);
};
