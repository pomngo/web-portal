import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api/axios";
import { ENDPOINTS } from "../../services/api/endpoints";

type FlockItem = Record<string, any>;

interface FlockState {
  flocks: FlockItem[];
  selected_flock: FlockItem | null;
  selected_flock_loading: boolean,
  loading: boolean;
  error: string | null;
}

const initialState: FlockState = {
  flocks: [],
  selected_flock: null,
  selected_flock_loading: false,
  loading: true,
  error: null,
};

export const listFlocks = createAsyncThunk<any, string | undefined>(
  "flock/listFlocks",
  async (filter: string | undefined, { rejectWithValue }) => {
    try {
      const res = await api.get(`${ENDPOINTS.CAMPAIGN.LIST}/${filter}`);
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
      }).addCase(getFlockDetails.pending, (state) => {

        state.selected_flock = null
  state.selected_flock_loading = true;
}).addCase(getFlockDetails.fulfilled, (state, action) => {
  state.selected_flock =
    action.payload?.result ??
    action.payload?.data ??
    action.payload;

  state.selected_flock_loading = false;
})
  },
});

export const {} = flockSlice.actions;
export default flockSlice.reducer;