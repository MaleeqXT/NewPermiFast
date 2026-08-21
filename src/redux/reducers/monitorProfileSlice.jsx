import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http.jsx";

export const fetchMonitorProfile = createAsyncThunk(
  "monitorProfile/fetch",
  async (monitorId = null, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/profile", {
        params: monitorId ? { monitor_id: monitorId } : undefined,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load monitor profile" });
    }
  }
);

export const updateMonitorProfile = createAsyncThunk(
  "monitorProfile/update",
  async ({ monitorId, formData }, { rejectWithValue }) => {
    try {
      const response = await http.post(`/monitor/profile/${monitorId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to update monitor profile" });
    }
  }
);

const monitorProfileSlice = createSlice({
  name: "monitorProfile",
  initialState: {
    profile: null,
    loading: false,
    saving: false,
    error: null,
    saveError: null,
  },
  reducers: {
    clearMonitorProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.saving = false;
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data ?? action.payload ?? null;
      })
      .addCase(fetchMonitorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMonitorProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateMonitorProfile.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?.data) {
          state.profile = action.payload.data;
        } else if (action.payload) {
          state.profile = action.payload;
        }
      })
      .addCase(updateMonitorProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearMonitorProfile } = monitorProfileSlice.actions;

export default monitorProfileSlice.reducer;

export const selectMonitorProfile = (state) => state.monitorProfile.profile;
export const selectMonitorProfileLoading = (state) => state.monitorProfile.loading;
export const selectMonitorProfileSaving = (state) => state.monitorProfile.saving;
export const selectMonitorProfileError = (state) => state.monitorProfile.error;
export const selectMonitorProfileSaveError = (state) => state.monitorProfile.saveError;
