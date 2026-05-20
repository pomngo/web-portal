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
  selected_flock_loading: boolean;
  loading: boolean;
  page: number;
  offset: number;
  hasMore: boolean;
  error: string | null;
}

const initialState: FlockState = {
  flocks: [],
  selected_flock: null,
  selected_flock_loading: false,
  loading: true,
  page: 1,
  offset: 10,
  hasMore: true,
  error: null,
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
      const offset = params?.offset ?? 10;
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
  }
);

const flockSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
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
      })
      .addCase(listFlocks.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error = typeof payload === "string" ? payload : null;
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
      })
      .addCase(fetchFlocksPage.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        const payload = action.payload;
        state.error = typeof payload === "string" ? payload : null;
      })
      .addCase(getFlockDetails.pending, (state) => {
        state.selected_flock = null;
        state.selected_flock_loading = true;
      })
      .addCase(getFlockDetails.fulfilled, (state, action) => {
        state.selected_flock =
          action.payload?.result ?? action.payload?.data ?? action.payload;
        state.selected_flock_loading = false;
      })
  },
});

export const {} = flockSlice.actions;
export default flockSlice.reducer;