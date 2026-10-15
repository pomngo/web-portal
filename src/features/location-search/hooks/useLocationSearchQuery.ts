import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../services/api/axios";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { FlockItem, ActivityItem } from "../../../types";

export interface LocationQueryResult<T> {
  items: T[];
  page: number;
  isFallback: boolean;
  totalCount: number;
}

interface ApiResponsePayload<T> {
  count?: number;
  next?: number | null;
  previous?: number | null;
  results?: T[];
}

const extractResults = <T>(
  payload: unknown
): { items: T[]; isFallback: boolean; totalCount: number } => {
  if (!payload || typeof payload !== "object") {
    return { items: [], isFallback: false, totalCount: 0 };
  }

  const obj = payload as { data?: unknown; results?: unknown; count?: unknown };
  const dataLayer = (obj.data && typeof obj.data === "object" ? obj.data : obj) as ApiResponsePayload<T>;

  let items: T[] = [];
  if (Array.isArray(dataLayer.results)) {
    items = dataLayer.results;
  } else if (Array.isArray(dataLayer)) {
    items = dataLayer as T[];
  }

  const isFallback = (items as Array<{ is_fallback?: boolean }>).some((item) => Boolean(item?.is_fallback));
  const totalCount = typeof dataLayer.count === "number" ? dataLayer.count : items.length;

  return { items, isFallback, totalCount };
};

/**
 * Infinite query for fetching discoverable flocks filtered by location.
 */
export const useLocationFlocks = (locationQuery: string, offset = 6) => {
  const cleanLoc = locationQuery.trim();

  return useInfiniteQuery<LocationQueryResult<FlockItem>, Error>({
    queryKey: ["location-search", "flocks", cleanLoc.toLowerCase(), offset],
    queryFn: async ({ pageParam = 1, signal }) => {
      const pageNum = Number(pageParam) || 1;
      const params = new URLSearchParams();
      params.set("location", cleanLoc);
      params.set("page", String(pageNum));
      params.set("offset", String(offset));

      const separator = ENDPOINTS.CAMPAIGN.LIST.includes("?") ? "&" : "?";
      const url = `${ENDPOINTS.CAMPAIGN.LIST}${separator}${params.toString()}`;

      const res = await api.get(url, { signal });
      const { items, isFallback, totalCount } = extractResults<FlockItem>(res.data);

      return {
        items,
        page: pageNum,
        isFallback,
        totalCount,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.items.length === offset ? lastPage.page + 1 : undefined;
    },
    enabled: Boolean(cleanLoc),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
};

/**
 * Infinite query for fetching public activities filtered by location.
 */
export const useLocationActivities = (locationQuery: string, offset = 6) => {
  const cleanLoc = locationQuery.trim();

  return useInfiniteQuery<LocationQueryResult<ActivityItem>, Error>({
    queryKey: ["location-search", "activities", cleanLoc.toLowerCase(), offset],
    queryFn: async ({ pageParam = 1, signal }) => {
      const pageNum = Number(pageParam) || 1;
      const params = new URLSearchParams();
      params.set("location", cleanLoc);
      params.set("page", String(pageNum));
      params.set("offset", String(offset));

      const separator = ENDPOINTS.ACTIVITY.LIST.includes("?") ? "&" : "?";
      const url = `${ENDPOINTS.ACTIVITY.LIST}${separator}${params.toString()}`;

      const res = await api.get(url, { signal });
      const { items, isFallback, totalCount } = extractResults<ActivityItem>(res.data);

      return {
        items,
        page: pageNum,
        isFallback,
        totalCount,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.items.length === offset ? lastPage.page + 1 : undefined;
    },
    enabled: Boolean(cleanLoc),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
};
