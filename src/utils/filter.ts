// src/utils/filter.ts
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQueryClient, QueryClient } from "@tanstack/react-query";

// Keyword mapping to make client-side interest filtering feel real and intelligent
export const matchFilter = (item: any, filter: string): boolean => {
  if (!filter) return true;
  const normalizedFilter = filter.toLowerCase().trim();
  if (!normalizedFilter) return true;

  const keywordMap: Record<string, string[]> = {
    adventure: ["obstacle", "race", "trip", "ride", "trek", "adventure", "camp", "outdoor", "climb", "hike", "nature", "riders", "motorcycle", "wheels", "trail"],
    social: ["campfire", "meetup", "night", "party", "social", "gathering", "hangout", "club", "meet", "connect", "campfire night", "talk"],
    creative: ["art", "craft", "design", "paint", "drawing", "rangoli", "creative"],
    tech: ["tech", "hackathon", "coding", "web", "app", "developer", "engineers"],
    wellness: ["yoga", "wellness", "meditation", "healthy", "morning"],
    culinary: ["feast", "food", "street food", "culinary", "cooking", "eat", "dining", "restaurant", "cafe", "hops"],
    history: ["history", "fort", "museum", "historical", "heritage"],
    music: ["music", "concert", "singer", "mic", "band", "acoustic", "jam"],
    photography: ["photography", "photo", "camera", "shoot", "walk"],
    travel: ["travel", "tour", "explore", "trip", "coastal", "beach", "road", "highway"],
    fitness: ["fitness", "gym", "run", "jog", "cycling", "workout", "sports", "wheels"],
    gaming: ["gaming", "game", "board game", "play"],
    movies: ["movies", "film", "cinema", "show", "theater"],
    nature: ["nature", "trees", "lake", "sunset", "river", "park", "garden", "outdoor"]
  };

  const keywords = keywordMap[normalizedFilter] || [normalizedFilter];

  const searchFields = [
    item.name,
    item.title,
    item.description,
    item.campaign_location,
    item.location
  ].filter(Boolean).map(s => s.toLowerCase());

  return searchFields.some(field =>
    keywords.some(keyword => field.includes(keyword))
  );
};

export const filterFlock = (flock: any, searchParams: URLSearchParams, selectedFilter = "") => {
  const location = searchParams.get("location");
  const interest = selectedFilter || searchParams.get("interest");
  const date = searchParams.get("created_date");

  if (location) {
    const locLower = location.toLowerCase().trim();
    const flockLoc = (flock.location || "").toLowerCase();
    if (!flockLoc.includes(locLower)) return false;
  }

  if (interest) {
    if (!matchFilter(flock, interest)) return false;
  }

  if (date) {
    const itemDate = (flock.created_at || "").substring(0, 10);
    if (itemDate && itemDate !== date) return false;
  }

  return true;
};

export const filterActivity = (activity: any, searchParams: URLSearchParams, selectedFilter = "", ignoreInterest = false) => {
  const location = searchParams.get("location");
  const interest = selectedFilter || searchParams.get("interest");
  const date = searchParams.get("created_date");

  if (location) {
    const locLower = location.toLowerCase().trim();
    const actLoc = (activity.campaign_location || "").toLowerCase();
    if (!actLoc.includes(locLower)) return false;
  }

  if (interest && !ignoreInterest) {
    if (!matchFilter(activity, interest)) return false;
  }

  if (date) {
    const itemDate = (activity.created_at || "").substring(0, 10);
    if (itemDate && itemDate !== date) return false;
  }

  return true;
};

// Evicts queries matching the cleared parameter from React Query Cache
export const evictFilterFromCache = (queryClient: QueryClient, paramName: string, prevValue: string) => {
  if (!prevValue) return;

  const queries = queryClient.getQueryCache().getAll();
  queries.forEach((query) => {
    const key = query.queryKey;
    if (key[0] === "activities" || key[0] === "flocks") {
      const filterStr = key.find(k => typeof k === "string" && k.includes(`${paramName}=`));
      if (filterStr) {
        queryClient.removeQueries({ queryKey: key });
      }
    }
  });
};

// React hook to sync filters across page navigations using sessionStorage
export const useSyncFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const syncRun = useRef(false);

  const prevFilters = useRef({
    location: "",
    interest: "",
    date: ""
  });

  useEffect(() => {
    if (syncRun.current) return;
    syncRun.current = true;

    const savedLoc = sessionStorage.getItem("global_loc");
    const savedInt = sessionStorage.getItem("global_int");
    const savedDate = sessionStorage.getItem("global_date");

    const newParams = new URLSearchParams(window.location.search);
    let changed = false;

    if (savedLoc && !newParams.get("location")) {
      newParams.set("location", savedLoc);
      changed = true;
    }
    if (savedInt && !newParams.get("interest")) {
      newParams.set("interest", savedInt);
      changed = true;
    }
    if (savedDate && !newParams.get("created_date")) {
      newParams.set("created_date", savedDate);
      changed = true;
    }

    if (changed) {
      setSearchParams(newParams, { replace: true });
    }
  }, [setSearchParams]);

  useEffect(() => {
    const loc = searchParams.get("location") || "";
    const interest = searchParams.get("interest") || "";
    const date = searchParams.get("created_date") || "";

    // If a filter is manually cleared, evict it from React Query Cache
    if (prevFilters.current.location && !loc) {
      evictFilterFromCache(queryClient, "location", prevFilters.current.location);
    }
    if (prevFilters.current.interest && !interest) {
      evictFilterFromCache(queryClient, "interest", prevFilters.current.interest);
    }
    if (prevFilters.current.date && !date) {
      evictFilterFromCache(queryClient, "created_date", prevFilters.current.date);
    }

    prevFilters.current = { location: loc, interest, date };

    if (loc) sessionStorage.setItem("global_loc", loc);
    else sessionStorage.removeItem("global_loc");

    if (interest) sessionStorage.setItem("global_int", interest);
    else sessionStorage.removeItem("global_int");

    if (date) sessionStorage.setItem("global_date", date);
    else sessionStorage.removeItem("global_date");
  }, [searchParams, queryClient]);
};
