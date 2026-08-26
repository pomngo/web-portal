import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "../services/api/axios";
import { ENDPOINTS } from "../services/api/endpoints";
import type { ActivityItem } from "../types";

const buildListUrl = (filter?: string) => {
  const cleanFilter = (filter || "").trim();
  if (!cleanFilter) return ENDPOINTS.ACTIVITY.LIST;
  const separator = ENDPOINTS.ACTIVITY.LIST.includes("?") ? "&" : "?";
  const query = cleanFilter.startsWith("?") || cleanFilter.startsWith("&") ? cleanFilter.slice(1) : cleanFilter;
  return `${ENDPOINTS.ACTIVITY.LIST}${separator}${query}`;
};

const normalizeActivityList = (payload: any): ActivityItem[] => {
  const data = payload?.data ?? payload;
  return data?.result ?? data?.results ?? data ?? [];
};

// 1. Hook for all activities list
export const useActivities = (filter = "") => {
  return useQuery<ActivityItem[], Error>({
    queryKey: ["activities", filter],
    queryFn: async ({ signal }) => {
      const url = buildListUrl(filter);
      const res = await api.get(url, { signal });
      return normalizeActivityList(res.data);
    },
  });
};

// 2. Hook for infinite paginated activities list
export const useInfiniteActivities = (filter = "", offset = 5) => {
  return useInfiniteQuery<{ items: ActivityItem[]; page: number }, Error>({
    queryKey: ["activities", "infinite", filter, offset],
    queryFn: async ({ pageParam = 1, signal }) => {
      const pageNum = pageParam as number;
      const paginatedFilter = filter
        ? `${filter}&page=${pageNum}&offset=${offset}`
        : `page=${pageNum}&offset=${offset}`;
      const url = buildListUrl(paginatedFilter);
      const res = await api.get(url, { signal });
      const items = normalizeActivityList(res.data);
      return { items, page: pageNum };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.items.length === offset ? lastPage.page + 1 : undefined;
    },
  });
};

// 3. Hook for specific activity details
export const useActivityDetails = (activityId: number) => {
  return useQuery<any, Error>({
    queryKey: ["activityDetails", activityId],
    queryFn: async ({ signal }) => {
      const res = await api.get(`${ENDPOINTS.ACTIVITY.DETAILS(activityId)}`, { signal });
      const activityData = res.data?.result ?? res.data?.data ?? res.data;
      return activityData;
    },
    enabled: !!activityId && !isNaN(activityId),
  });
};
