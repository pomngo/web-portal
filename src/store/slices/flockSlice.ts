import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api/axios";
import { ENDPOINTS } from "../../services/api/endpoints";

type FlockItem = Record<string, any>;

type FlockPageArgs = {
  page?: number;
  offset?: number;
  filter?: string;
};

interface FlockState {
  flocks: FlockItem[];
  selected_flock: FlockItem | null;
  selected_flock_id: number | null;
  selected_flock_loading: boolean;
  loading: boolean;
  page: number;
  offset: number;
  hasMore: boolean;
  error: string | null;
  errorStatus: number | null;
  isInitialized: boolean;
}

const initialState: FlockState = {
  flocks: [],
  selected_flock: null,
  selected_flock_id: null,
  selected_flock_loading: false,
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
  const query = cleanFilter
    ? cleanFilter.startsWith("?")
      ? `&${cleanFilter.slice(1)}`
      : cleanFilter.startsWith("&")
      ? cleanFilter
      : `&${cleanFilter}`
    : "";
  return `${ENDPOINTS.CAMPAIGN.LIST}${query}`;
};

export const listFlocks = createAsyncThunk<any, string | void>(
  "flock/listFlocks",
  async (filter: string | void, { rejectWithValue }) => {
    try {
      const url = buildListUrl(typeof filter === "string" ? filter : "");
      const res = await api.get(url);
      if (res.status === 200) {
        return res.data;
      } else {
        console.error("Failed to fetch flocks", res.status, res.statusText);
        return rejectWithValue("Failed get flocks");
      }
    } catch (error: unknown) {
      console.error("listFlocks error", error);
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.message
          : error instanceof Error
          ? error.message
          : "Unknown error";
      return rejectWithValue(message || "Unknown error");
    }
  },
);

export const fetchFlocksPage = createAsyncThunk<any, FlockPageArgs | void>(
  "flock/fetchFlocksPage",
  async (params: FlockPageArgs | void, { rejectWithValue }) => {
    try {
      const page = params?.page ?? 1;
      const offset = params?.offset ?? 5;
      const filter = params?.filter ? `${params.filter}&page=${page}&offset=${offset}` : `page=${page}&offset=${offset}`;
      const url = buildListUrl(filter);
      const res = await api.get(url);
      if (res.status === 200) {
        return { data: res.data, page, offset };
      } else {
        console.error("Failed to fetch flocks", res.status, res.statusText);
        return rejectWithValue("Failed get flocks");
      }
    } catch (error: unknown) {
      console.error("fetchFlocksPage error", error);
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.message
          : error instanceof Error
          ? error.message
          : "Unknown error";
      return rejectWithValue(message || "Unknown error");
    }
  },
);

export const getFlockDetails = createAsyncThunk(
  "flock/getFlockDetails",
  async (flockId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${ENDPOINTS.CAMPAIGN.DETAILS(flockId)}`
      );
      if (res.status === 200) {
        return res.data;
      } else {
        console.error("Failed to fetch flocks", res.status, res.statusText);
        return rejectWithValue({ message: "Failed get flocks", status: res.status });
      }
    } catch (error: unknown) {
      console.error("listFlocks error", error);
      const status = typeof error === "object" && error !== null && "response" in error
        ? (error as any).response?.status
        : null;
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.message || (error as any).response?.data?.detail
          : error instanceof Error
          ? error.message
          : "Unknown error";
      return rejectWithValue({ message: message || "Unknown error", status });
    }
  }
);

const flockSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {}
  ,
  extraReducers: (builder) => {
    builder
      .addCase(listFlocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listFlocks.fulfilled, (state, action) => {
        // Normalize response: prefer payload.result or payload.results arrays, otherwise payload itself
        const data = action.payload;
        state.flocks = data?.result ?? data?.results ?? data ?? [];
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(listFlocks.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error = typeof payload === "string" ? payload : null;
        state.isInitialized = true;
      })
      .addCase(fetchFlocksPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlocksPage.fulfilled, (state, action) => {
        const payload = action.payload?.data ?? action.payload;
        const page = action.payload?.page ?? 1;
        const offset = action.payload?.offset ?? state.offset;
        const items = payload?.result ?? payload?.results ?? payload ?? [];

        state.flocks = page > 1 ? [...state.flocks, ...items] : items;
        state.page = page;
        state.offset = offset;
        state.hasMore = Array.isArray(items) ? items.length === offset : false;
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(fetchFlocksPage.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        const payload = action.payload;
        state.error = typeof payload === "string" ? payload : null;
        state.isInitialized = true;
      })
      .addCase(getFlockDetails.pending, (state) => {
        state.selected_flock_loading = true;
        state.selected_flock = null;
        state.selected_flock_id = null;
        state.error = null;
        state.errorStatus = null;
      })
      .addCase(getFlockDetails.fulfilled, (state, action) => {
        const flockData = action.payload?.result ?? action.payload?.data ?? action.payload;
        state.selected_flock = flockData;
        state.selected_flock_id = flockData?.flock_details?.id ?? null;
        state.selected_flock_loading = false;
        state.error = null;
        state.errorStatus = null;
      })
      .addCase(getFlockDetails.rejected, (state, action) => {
        state.selected_flock_loading = false;
        state.selected_flock = null;
        state.selected_flock_id = null;
        const payload = action.payload;
        if (payload && typeof payload === "object" && "message" in payload) {
          state.error = (payload as any).message;
          state.errorStatus = (payload as any).status;
        } else {
          state.error = typeof payload === "string" ? payload : "Failed to load details";
          state.errorStatus = null;
        }
      })
  },
});

export default flockSlice.reducer;