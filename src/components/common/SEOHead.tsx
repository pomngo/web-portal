import React from "react";
import { useSEO } from "../../hooks/useSEO";
import type { SEODomain } from "../../hooks/useSEO";

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  domain?: SEODomain;
  ogType?: string;
  ogImage?: string;
  schemaType?: "WebSite" | "Organization" | "Event" | "SocialGroup" | "ItemList" | "BreadcrumbList" | "Custom";
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath,
  domain = "main",
  ogType = "website",
  ogImage,
  schemaType,
  schemaData,
}) => {
  // Build structured JSON-LD schema based on schemaType & schemaData
  let computedSchema: Record<string, any> | Array<Record<string, any>> | undefined = undefined;

  const dataObj = (!Array.isArray(schemaData) && typeof schemaData === "object" ? schemaData : {}) as Record<string, any>;

  if (schemaData && schemaType === "Custom") {
    computedSchema = schemaData;
  } else if (schemaType === "WebSite") {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "FlocknGo",
      "url": "https://flockngo.com",
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://flockngo.com/flocks/{search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };
  } else if (schemaType === "Organization" || schemaType === "SocialGroup") {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": dataObj.name || "FlocknGo",
      "description": description,
      "url": dataObj.url || "https://flockngo.com",
      "logo": "https://flockngo.com/flockgo_logo.png",
      ...(dataObj.location ? { "address": dataObj.location } : {}),
      ...(ogImage ? { "image": ogImage } : {}),
    };
  } else if (schemaType === "Event") {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": dataObj.name || title,
      "description": description,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": dataObj.location || "Local Event",
        "address": dataObj.location || "Local Event",
      },
      "organizer": {
        "@type": "Organization",
        "name": "FlocknGo",
        "url": "https://events.flockngo.com",
      },
      ...(dataObj.startDate ? { "startDate": dataObj.startDate } : {}),
      ...(ogImage ? { "image": ogImage } : {}),
    };
  } else if (schemaType === "ItemList" && Array.isArray(dataObj.items)) {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": dataObj.items.map((item: any, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": item.name || item.title || `Item ${idx + 1}`,
        "url": item.url || "https://flockngo.com",
      })),
    };
  } else if (schemaType === "BreadcrumbList" && Array.isArray(dataObj.breadcrumbs)) {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": dataObj.breadcrumbs.map((crumb: any, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.url,
      })),
    };
  }

  useSEO({
    title,
    description,
    keywords,
    canonicalPath,
    domain,
    ogType,
    ogImage,
    schema: computedSchema,
  });

  return null;
};

export default SEOHead;
