import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http.jsx";

// GET /monitor/documents/piece-identities
export const fetchIdentityDocuments = createAsyncThunk(
  "monitorDocuments/fetchIdentity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/documents/piece-identities");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load identity documents" });
    }
  }
);

// GET /monitor/documents/permis-conduit
export const fetchPermisDocuments = createAsyncThunk(
  "monitorDocuments/fetchPermis",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/documents/permis-conduit");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load permis documents" });
    }
  }
);

// GET /monitor/documents/diplom
export const fetchDiplomDocuments = createAsyncThunk(
  "monitorDocuments/fetchDiplom",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/documents/diplom-enseignant");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load diplom documents" });
    }
  }
);

// POST /monitor/documents
// Payload: { media_piece_identite: [...] } | { media_permis: [...] } | { media_diplom: [...] }
export const storeMonitorDocuments = createAsyncThunk(
  "monitorDocuments/store",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await http.post("/monitor/documents", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to save documents" });
    }
  }
);

function normalizeMediaList(data) {
  const mediaArr = data?.media ?? [];
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

const monitorDocumentsSlice = createSlice({
  name: "monitorDocuments",
  initialState: {
    identityMedia:      [],
    identityFetching:   false,
    identityFetchError: null,

    permisMedia:        [],
    permisFetching:     false,
    permisFetchError:   null,

    diplomMedia:        [],
    diplomFetching:     false,
    diplomFetchError:   null,

    saving:   false,
    success:  null,
    error:    null,
  },
  reducers: {
    clearDocumentsState: (state) => {
      state.saving  = false;
      state.success = null;
      state.error   = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIdentityDocuments.pending,   (state) => { state.identityFetching = true;  state.identityFetchError = null; })
      .addCase(fetchIdentityDocuments.fulfilled, (state, action) => { state.identityFetching = false; state.identityMedia = normalizeMediaList(action.payload?.data ?? {}); })
      .addCase(fetchIdentityDocuments.rejected,  (state, action) => { state.identityFetching = false; state.identityFetchError = action.payload; state.identityMedia = []; })

      .addCase(fetchPermisDocuments.pending,   (state) => { state.permisFetching = true;  state.permisFetchError = null; })
      .addCase(fetchPermisDocuments.fulfilled, (state, action) => { state.permisFetching = false; state.permisMedia = normalizeMediaList(action.payload?.data ?? {}); })
      .addCase(fetchPermisDocuments.rejected,  (state, action) => { state.permisFetching = false; state.permisFetchError = action.payload; state.permisMedia = []; })

      .addCase(fetchDiplomDocuments.pending,   (state) => { state.diplomFetching = true;  state.diplomFetchError = null; })
      .addCase(fetchDiplomDocuments.fulfilled, (state, action) => { state.diplomFetching = false; state.diplomMedia = normalizeMediaList(action.payload?.data ?? {}); })
      .addCase(fetchDiplomDocuments.rejected,  (state, action) => { state.diplomFetching = false; state.diplomFetchError = action.payload; state.diplomMedia = []; })

      .addCase(storeMonitorDocuments.pending,   (state) => { state.saving = true;  state.success = null; state.error = null; })
      .addCase(storeMonitorDocuments.fulfilled, (state, action) => { state.saving = false; state.success = action.payload?.success ?? true; })
      .addCase(storeMonitorDocuments.rejected,  (state, action) => { state.saving = false; state.success = false; state.error = action.payload; });
  },
});

export const { clearDocumentsState } = monitorDocumentsSlice.actions;
export default monitorDocumentsSlice.reducer;

export const selectIdentityMedia      = (state) => state.monitorDocuments.identityMedia;
export const selectIdentityFetching   = (state) => state.monitorDocuments.identityFetching;
export const selectIdentityFetchError = (state) => state.monitorDocuments.identityFetchError;

export const selectPermisMedia        = (state) => state.monitorDocuments.permisMedia;
export const selectPermisFetching     = (state) => state.monitorDocuments.permisFetching;
export const selectPermisFetchError   = (state) => state.monitorDocuments.permisFetchError;

export const selectDiplomMedia        = (state) => state.monitorDocuments.diplomMedia;
export const selectDiplomFetching     = (state) => state.monitorDocuments.diplomFetching;
export const selectDiplomFetchError   = (state) => state.monitorDocuments.diplomFetchError;

export const selectDocumentsSaving    = (state) => state.monitorDocuments.saving;
export const selectDocumentsSuccess   = (state) => state.monitorDocuments.success;
export const selectDocumentsError     = (state) => state.monitorDocuments.error;
