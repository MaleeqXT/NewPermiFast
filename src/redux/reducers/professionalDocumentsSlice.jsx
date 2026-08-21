import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http.jsx";

// GET /monitor/documents/professionnel
// Response: { data: null | { autorisations: { autorisation, visite, media: [...] }, date_creation, denomination_social, forme_juridique, num_autorisation, siret } }
export const fetchProfessionalDocuments = createAsyncThunk(
  "professionalDocuments/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/documents/professionnel");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load professional documents" });
    }
  }
);

// POST /monitor/documents/professionnel
// Payload:
// {
//   denomination_social: string,
//   forme_juridique: string,
//   siret: string,
//   num_autorisation: string,
//   date_creation: string,       // "YYYY-MM-DD"
//   autorisations: {
//     autorisation: string,      // auth date "YYYY-MM-DD"
//     visite: string,            // visit date "YYYY-MM-DD"
//     media: [id1, id2, ...]
//   }
// }
export const storeProfessionalDocuments = createAsyncThunk(
  "professionalDocuments/store",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await http.post("/monitor/documents/professionnel", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to save professional documents" });
    }
  }
);

// Helper — flatten storage_media from autorisations.media array
function normalizeMediaList(mediaArr = []) {
  return mediaArr.map((item) => {
    const sm = item.storage_media ?? {};
    return {
      id:    sm.id    ?? item.storage_media_id ?? item.id,
      name:  sm.name  ?? "",
      path:  sm.path  ?? "",
      thumb: sm.thumb ?? "",
      type:  sm.type  ?? "",
    };
  });
}

const professionalDocumentsSlice = createSlice({
  name: "professionalDocuments",
  initialState: {
    // fetched data
    data:         null,   // raw server data (or null if not set yet)
    savedMedia:   [],     // normalized media list from autorisations.media
    fetching:     false,
    fetchError:   null,

    // save state
    saving:   false,
    success:  null,
    error:    null,
  },
  reducers: {
    clearProfessionalState: (state) => {
      state.saving  = false;
      state.success = null;
      state.error   = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetch ──────────────────────────────────────────────────────────
      .addCase(fetchProfessionalDocuments.pending, (state) => {
        state.fetching   = true;
        state.fetchError = null;
      })
      .addCase(fetchProfessionalDocuments.fulfilled, (state, action) => {
        state.fetching  = false;
        const raw = action.payload?.data ?? null;
        state.data = raw;
        // API returns instructor_permission (not autorisations)
        state.savedMedia = normalizeMediaList(raw?.instructor_permission?.media ?? []);
      })
      .addCase(fetchProfessionalDocuments.rejected, (state, action) => {
        state.fetching   = false;
        state.fetchError = action.payload;
        state.data       = null;
        state.savedMedia = [];
      })

      // ── store ──────────────────────────────────────────────────────────
      .addCase(storeProfessionalDocuments.pending, (state) => {
        state.saving  = true;
        state.success = null;
        state.error   = null;
      })
      .addCase(storeProfessionalDocuments.fulfilled, (state, action) => {
        state.saving  = false;
        state.success = action.payload?.success ?? true;
      })
      .addCase(storeProfessionalDocuments.rejected, (state, action) => {
        state.saving  = false;
        state.success = false;
        state.error   = action.payload;
      });
  },
});

export const { clearProfessionalState } = professionalDocumentsSlice.actions;
export default professionalDocumentsSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectProfessionalData       = (state) => state.professionalDocuments.data;
export const selectProfessionalSavedMedia = (state) => state.professionalDocuments.savedMedia;
export const selectProfessionalFetching   = (state) => state.professionalDocuments.fetching;
export const selectProfessionalFetchError = (state) => state.professionalDocuments.fetchError;
export const selectProfessionalSaving     = (state) => state.professionalDocuments.saving;
export const selectProfessionalSuccess    = (state) => state.professionalDocuments.success;
export const selectProfessionalError      = (state) => state.professionalDocuments.error;
