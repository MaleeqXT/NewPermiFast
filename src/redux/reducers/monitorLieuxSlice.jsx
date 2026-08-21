import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http.jsx";

// GET /monitor/places
// Response: { zones: [ { id, name, lieux: [...ALL available lieux...] } ] }
// NOTE: this returns ALL available lieux for the zone, NOT just the monitor's selected ones.
// The monitor's selected lieux come from GET /monitor/profile -> monitor.lieux
export const fetchMonitorLieux = createAsyncThunk(
  "monitorLieux/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/places");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load lieux" });
    }
  }
);

// POST /monitor/places
// Body: { lieux: [id1, id2, ...] }
export const storeMonitorLieux = createAsyncThunk(
  "monitorLieux/store",
  async ({ lieux }, { rejectWithValue }) => {
    try {
      const response = await http.post("/monitor/places", { lieux });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to save lieux" });
    }
  }
);

const monitorLieuxSlice = createSlice({
  name: "monitorLieux",
  initialState: {
    // ALL available zones+lieux from GET /monitor/places (for the drawer list)
    zones: [],
    loading: false,
    saving: false,
    error: null,
    saveError: null,
  },
  reducers: {
    clearMonitorLieux: (state) => {
      state.zones      = [];
      state.loading    = false;
      state.saving     = false;
      state.error      = null;
      state.saveError  = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetch all available lieux ──────────────────────────────────────
      .addCase(fetchMonitorLieux.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchMonitorLieux.fulfilled, (state, action) => {
        state.loading = false;
        state.zones   = action.payload?.zones ?? [];
      })
      .addCase(fetchMonitorLieux.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── store selected lieux ───────────────────────────────────────────
      .addCase(storeMonitorLieux.pending, (state) => {
        state.saving    = true;
        state.saveError = null;
      })
      .addCase(storeMonitorLieux.fulfilled, (state, action) => {
        state.saving = false;
        // Store the ids that were just saved so the page can reflect immediately
        // without waiting for a profile re-fetch
        if (action.payload?.lieux) {
          state.lastSavedIds = action.payload.lieux.map(String);
        } else {
          // fallback: use the ids we sent (passed via meta.arg)
          state.lastSavedIds = (action.meta.arg?.lieux ?? []).map(String);
        }
      })
      .addCase(storeMonitorLieux.rejected, (state, action) => {
        state.saving    = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearMonitorLieux } = monitorLieuxSlice.actions;
export default monitorLieuxSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectMonitorLieuxZones     = (state) => state.monitorLieux.zones;
export const selectMonitorLieuxLoading   = (state) => state.monitorLieux.loading;
export const selectMonitorLieuxSaving    = (state) => state.monitorLieux.saving;
export const selectMonitorLieuxError     = (state) => state.monitorLieux.error;
export const selectMonitorLieuxSaveError = (state) => state.monitorLieux.saveError;
