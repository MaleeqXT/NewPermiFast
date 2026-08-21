import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http.jsx";

// POST /media/store
// Payload: FormData with media: (binary file)
// Response: { storageMedia: { id, name, path, thumb, type, is_active } }
export const uploadMedia = createAsyncThunk(
  "mediaControl/upload",
  async ({ file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("media", file);
      const response = await http.post("/media/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // response.data.storageMedia = { id, name, path, thumb, type, is_active }
      return response.data.storageMedia ?? response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to upload media" }
      );
    }
  }
);

const mediaControlSlice = createSlice({
  name: "mediaControl",
  initialState: {
    // uploaded: array of storageMedia objects { id, name, path, thumb, type }
    uploaded: [],
    uploading: false,
    error: null,
  },
  reducers: {
    removeUploadedMedia: (state, action) => {
      // action.payload: id to remove
      state.uploaded = state.uploaded.filter((m) => m.id !== action.payload);
    },
    clearUploadedMedia: (state) => {
      state.uploaded = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMedia.pending, (state) => {
        state.uploading = true;
        state.error     = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.uploading = false;
        // push the new storageMedia object into uploaded list
        state.uploaded.push(action.payload);
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploading = false;
        state.error     = action.payload;
      });
  },
});

export const { removeUploadedMedia, clearUploadedMedia } = mediaControlSlice.actions;
export default mediaControlSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectUploadedMedia    = (state) => state.mediaControl.uploaded;
export const selectMediaUploading   = (state) => state.mediaControl.uploading;
export const selectMediaUploadError = (state) => state.mediaControl.error;
