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
  robots?: string;
  noindex?: boolean;
  schemaType?: "WebSite" | "Organization" | "Event" | "SocialGroup" | "ItemList" | "BreadcrumbList" | "Custom";
  schemaData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath,
  domain = "events",
  ogType = "website",
  ogImage,
  robots,
  noindex,
  schemaType,
  schemaData,
}) => {
  // Build structured JSON-LD schema based on schemaType & schemaData
  let computedSchema: Record<string, unknown> | Array<Record<string, unknown>> | undefined = undefined;

  const dataObj = (!Array.isArray(schemaData) && typeof schemaData === "object" ? schemaData : {}) as Record<string, unknown>;
  const baseCanonicalUrl = `https://events.flockngo.com${canonicalPath ? (canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`) : ""}`;

  if (schemaData && schemaType === "Custom") {
    computedSchema = schemaData;
  } else if (schemaType === "WebSite") {
    const faqsList = Array.isArray(dataObj.faqs) ? (dataObj.faqs as Array<{ question: string; answer: string }>) : [];
    const graph: Array<Record<string, unknown>> = [
      {
        "@type": "WebSite",
        "@id": "https://events.flockngo.com/#website",
        "name": "FlocknGo Events",
        "alternateName": "FlocknGo",
        "url": "https://events.flockngo.com/",
        "description": description,
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://events.flockngo.com/activities?interest={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://events.flockngo.com/#organization",
        "name": "FlocknGo Events",
        "url": "https://events.flockngo.com/",
        "logo": "https://events.flockngo.com/flockgo_logo.png",
        "description": "FlocknGo Events is an event discovery and community platform helping people explore upcoming events, local activities, workshops, and gatherings across India.",
      },
    ];

    if (faqsList.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": "https://events.flockngo.com/#faq",
        "mainEntity": faqsList.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      });
    }

    computedSchema = {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  } else if (schemaType === "Organization" || schemaType === "SocialGroup") {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": dataObj.name || "FlocknGo Events",
      "description": description,
      "url": dataObj.url || "https://events.flockngo.com",
      "logo": "https://events.flockngo.com/flockgo_logo.png",
      ...(dataObj.location ? { "address": dataObj.location } : {}),
      ...(ogImage ? { "image": ogImage } : {}),
    };
  } else if (schemaType === "Event") {
    const eventLocationStr = dataObj.location || dataObj.city || "India";
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": dataObj.name || title,
      "description": description,
      "eventStatus": dataObj.eventStatus || "https://schema.org/EventScheduled",
      "eventAttendanceMode": dataObj.eventAttendanceMode || "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": dataObj.locationName || eventLocationStr,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": dataObj.city || eventLocationStr,
          "addressCountry": "IN",
        },
      },
      "organizer": {
        "@type": "Organization",
        "name": dataObj.organizerName || "FlocknGo Events",
        "url": "https://events.flockngo.com",
      },
      "offers": {
        "@type": "Offer",
        "url": dataObj.eventUrl || baseCanonicalUrl,
        "price": dataObj.price || "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        ...(dataObj.startDate ? { "validFrom": dataObj.startDate } : {}),
      },
      ...(dataObj.startDate ? { "startDate": dataObj.startDate } : {}),
      ...(dataObj.endDate ? { "endDate": dataObj.endDate } : {}),
      ...(ogImage ? { "image": [ogImage] } : {}),
    };
  } else if (schemaType === "ItemList" && Array.isArray(dataObj.items)) {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": (dataObj.items as Array<Record<string, unknown>>).map((item, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": (item.name || item.title || `Item ${idx + 1}`) as string,
        "url": (item.url || "https://events.flockngo.com") as string,
      })),
    };
  } else if (schemaType === "BreadcrumbList" && Array.isArray(dataObj.breadcrumbs)) {
    computedSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": (dataObj.breadcrumbs as Array<Record<string, unknown>>).map((crumb, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name as string,
        "item": crumb.url as string,
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
    robots,
    noindex,
    schema: computedSchema,
  });

  return null;
};

export default SEOHead;

