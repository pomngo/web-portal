import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "../services/api/axios";
import { ENDPOINTS } from "../services/api/endpoints";
import type { FlockItem } from "../types";

const buildListUrl = (filter?: string) => {
  const cleanFilter = (filter || "").trim();
  const query = cleanFilter
    ? cleanFilter.startsWith("?")
      ? `&${cleanFilter.slice(1)}`
      : cleanFilter.startsWith("&")
        ? cleanFilter
        : `&${cleanFilter}`
    : "";
  return `${ENDPOINTS.CAMPAIGN.LIST}${query}`;
};

const normalizeFlockList = (payload: unknown): FlockItem[] => {
  const raw =
    typeof payload === "object" && payload !== null && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;

  if (Array.isArray(raw)) return raw as FlockItem[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.result)) return obj.result as FlockItem[];
    if (Array.isArray(obj.results)) return obj.results as FlockItem[];
    if (Array.isArray(obj.data)) return obj.data as FlockItem[];
  }

  return [];
};

// 1. Hook for all flocks list
export const useFlocks = (filter = "") => {
  return useQuery<FlockItem[], Error>({
    queryKey: ["flocks", filter],
    queryFn: async ({ signal }) => {
      const url = buildListUrl(filter);
      const res = await api.get(url, { signal });
      return normalizeFlockList(res.data);
    },
  });
};

// 2. Hook for infinite paginated flocks list
export const useInfiniteFlocks = (filter = "", offset = 5) => {
  return useInfiniteQuery<{ items: FlockItem[]; page: number }, Error>({
    queryKey: ["flocks", "infinite", filter, offset],
    queryFn: async ({ pageParam = 1, signal }) => {
      const pageNum = pageParam as number;
      const paginatedFilter = filter
        ? `${filter}&page=${pageNum}&offset=${offset}`
        : `page=${pageNum}&offset=${offset}`;
      const url = buildListUrl(paginatedFilter);
      const res = await api.get(url, { signal });
      const items = normalizeFlockList(res.data);
      return { items, page: pageNum };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.items.length === offset ? lastPage.page + 1 : undefined;
    },
  });
};

// 3. Hook for specific flock details
export const useFlockDetails = (flockId: number) => {
  return useQuery<any, Error>({
    queryKey: ["flockDetails", flockId],
    queryFn: async ({ signal }) => {
      const res = await api.get(`${ENDPOINTS.CAMPAIGN.DETAILS(flockId)}`, { signal });
      const flockData = res.data?.result ?? res.data?.data ?? res.data;
      return flockData;
    },
    enabled: !!flockId && !isNaN(flockId),
  });
};
