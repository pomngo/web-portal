import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api/axios";
import { ENDPOINTS } from "../../services/api/endpoints";

export interface ActivityItem {
  id: number;
  name: string;
  campaign_location: string;
  flock_members_count: number;
  title?: string;
  cover_image_s3key?: string;
  image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type ActivityPageArgs = {
  page?: number;
  offset?: number;
  filter?: string;
};

interface ActivityState {
  activities: ActivityItem[];
  selected_activities: ActivityItem | null;
  selected_activities_id: number | null;
  selected_activities_loading: boolean;
  loading: boolean;
  page: number;
  offset: number;
  hasMore: boolean;
  error: string | null;
  errorStatus: number | null;
  isInitialized: boolean;
}

const initialState: ActivityState = {
  activities: [],
  selected_activities: null,
  selected_activities_id: null,
  selected_activities_loading: false,
  loading: true,
  page: 1,
  offset: 5,
  hasMore: true,
  error: null,
  errorStatus: null,
  isInitialized: false,
};

const buildListUrl = (filter?: string) => {
  const cleanFilter = (filter || "").trim();
  if (!cleanFilter) return ENDPOINTS.ACTIVITY.LIST;
  const separator = ENDPOINTS.ACTIVITY.LIST.includes("?") ? "&" : "?";
  const query = cleanFilter.startsWith("?") || cleanFilter.startsWith("&") ? cleanFilter.slice(1) : cleanFilter;
  return `${ENDPOINTS.ACTIVITY.LIST}${separator}${query}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const listActivities = createAsyncThunk<any, string | void>(
  "activities/listActivities",
  async (filter: string | void, { rejectWithValue }) => {
    try {
      const url = buildListUrl(typeof filter === "string" ? filter : "");
      const res = await api.get(url);
      if (res.status === 200) {
        return res.data;
      } else {
        console.error("Failed to fetch activities", res.status, res.statusText);
        return rejectWithValue("Failed get activities");
      }
    } catch (error: unknown) {
      console.error("listActivities error", error);
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message
          : error instanceof Error
            ? error.message
            : "Unknown error";
      return rejectWithValue(message || "Unknown error");
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchActivitiesPage = createAsyncThunk<any, ActivityPageArgs | void>(
  "activities/fetchActivitiesPage",
  async (params: ActivityPageArgs | void, { rejectWithValue }) => {
    try {
      const page = params?.page ?? 1;
      const offset = params?.offset ?? 5;
      const filter = params?.filter
        ? `${params.filter}&page=${page}&offset=${offset}`
        : `page=${page}&offset=${offset}`;
      const url = buildListUrl(filter);
      const res = await api.get(url);
      if (res.status === 200) {
        return { data: res.data, page, offset };
      } else {
        console.error("Failed to fetch activities", res.status, res.statusText);
        return rejectWithValue("Failed get activities");
      }
    } catch (error: unknown) {
      console.error("fetchActivitiesPage error", error);
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message
          : error instanceof Error
            ? error.message
            : "Unknown error";
      return rejectWithValue(message || "Unknown error");
    }
  }
);

export const getActivitiesDetails = createAsyncThunk(
  "activities/getActivitiesDetails",
  async (activitiesId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`${ENDPOINTS.ACTIVITY.DETAILS(activitiesId)}`);
      if (res.status === 200) {
        return res.data;
      } else {
        console.error("Failed to fetch activities", res.status, res.statusText);
        return rejectWithValue({ message: "Failed get activities", status: res.status });
      }
    } catch (error: unknown) {
      console.error("listActivities error", error);
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : null;
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message || (error as any).response?.data?.detail
          : error instanceof Error
            ? error.message
            : "Unknown error";
      return rejectWithValue({ message: message || "Unknown error", status });
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listActivities.fulfilled, (state, action) => {
        const data = action.payload?.data ?? action.payload;
        state.activities = data?.result ?? data?.results ?? data ?? [];
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(listActivities.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error = typeof payload === "string" ? payload : null;
        state.isInitialized = true;
      })
      .addCase(fetchActivitiesPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesPage.fulfilled, (state, action) => {
        const payload = action.payload?.data ?? action.payload;
        const page = action.payload?.page ?? 1;
        const offset = action.payload?.offset ?? state.offset;

        // Extract the inner data layer if wrapped by helpers.success_response
        const innerData = payload?.data ?? payload;
        const items = innerData?.result ?? innerData?.results ?? innerData ?? [];

        state.activities = page > 1 ? [...state.activities, ...items] : items;
        state.page = page;
        state.offset = offset;
        state.hasMore = Array.isArray(items) ? items.length === offset : false;
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(fetchActivitiesPage.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        const payload = action.payload;
        state.error = typeof payload === "string" ? payload : null;
        state.isInitialized = true;
      })
      .addCase(getActivitiesDetails.pending, (state) => {
        state.selected_activities_loading = true;
        state.selected_activities = null;
        state.selected_activities_id = null;
        state.error = null;
        state.errorStatus = null;
      })
      .addCase(getActivitiesDetails.fulfilled, (state, action) => {
        const activityData = action.payload?.result ?? action.payload?.data ?? action.payload;
        state.selected_activities = activityData;
        state.selected_activities_id = activityData?.id ?? null;
        state.selected_activities_loading = false;
        state.error = null;
        state.errorStatus = null;
      })
      .addCase(getActivitiesDetails.rejected, (state, action) => {
        state.selected_activities_loading = false;
        state.selected_activities = null;
        state.selected_activities_id = null;
        const payload = action.payload;
        if (payload && typeof payload === "object" && "message" in payload) {
          state.error = (payload as { message: string }).message;
          state.errorStatus = (payload as { status?: number | null }).status ?? null;
        } else {
          state.error = typeof payload === "string" ? payload : "Failed to load details";
          state.errorStatus = null;
        }
      });
  },
});

export default activitiesSlice.reducer;
