import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http";

function normalizeProposal(item = {}, dateKey = "") {
  // The proposal wraps a reservation — extract nested reservation fields
  const reservation = item.reservation ?? null;

  // student comes directly from item.student (not item.candidate)
  const studentUser = item.student?.user ?? null;

  const monitorUser = reservation?.monitor?.user ?? null;

  // Place comes from reservation.lieu
  const place = reservation?.lieu ?? item.lieu ?? null;

  const offer = item.offer ?? item.training?.offer ?? null;

  // Date from datef or reservation.date
  const date = item.datef ?? reservation?.date ?? item.date ?? dateKey ?? "";

  // Time from reservation
  const startTime = reservation?.start_at ?? item.start_at ?? "";
  const endTime   = reservation?.end_at   ?? item.end_at   ?? "";

  const BASE = import.meta.env.VITE_API_URL ?? "";

  // candidate name
  const candidateName =
    [studentUser?.first_name, studentUser?.last_name].filter(Boolean).join(" ").trim() ||
    studentUser?.name ||
    "";

  // candidate avatar
  const avatarRaw = studentUser?.media ?? null;
  let candidateAvatarUrl = null;
  if (typeof avatarRaw === "string") {
    candidateAvatarUrl = avatarRaw.startsWith("http")
      ? avatarRaw
      : `${BASE}/storage/${avatarRaw}`;
  } else if (typeof avatarRaw === "object" && avatarRaw?.path) {
    candidateAvatarUrl = avatarRaw.path.startsWith("http")
      ? avatarRaw.path
      : `${BASE}/storage/${avatarRaw.path}`;
  }
  if (!candidateAvatarUrl) {
    candidateAvatarUrl = studentUser?.profile_photo_url ?? null;
  }

  const placeName  = place?.name ?? "";
  const zoneLabel  = place?.zone?.name ?? "";
  const locationLabel = zoneLabel ? `${zoneLabel}, ${placeName}` : placeName;

  return {
    id:             item.id,
    type:           "offer",
    status:         "Une séance a été proposée",
    date,
    startTime,
    endTime,
    candidate:      candidateName || "Candidat",
    candidateAvatar: candidateAvatarUrl,
    candidateObj:   studentUser,
    studentId:      item.student_id ?? item.student?.id ?? null,
    email:          studentUser?.email ?? "",
    phone:          studentUser?.phone ?? "",
    place:          placeName,
    zoneName:       zoneLabel,
    mapLocation:    locationLabel,
    mapUrl:         place?.url ?? null,
    offer:          offer?.name ?? "",
    color:          "#dbeafe",
    accentColor:    "#60a5fa",
    reminder:       "",
    proposalNote:   item.comment ?? "",
    monitorId:      monitorUser?.monitor?.id ?? reservation?.monitor_id ?? null,
    monitorName:    monitorUser?.name ?? "",
    reservationId:  item.reservation_id ?? reservation?.id ?? null,
    source:         item,
  };
}

function normalizeProposalList(payload) {
  // API returns { "2026-07-18": [...], ... }  (date-keyed object)
  const raw = payload?.data?.data || payload?.data || payload?.proposals || payload || {};

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.entries(raw).flatMap(([dateKey, items]) => {
      if (!Array.isArray(items)) return [];
      return items.map((item) => normalizeProposal(item, dateKey));
    });
  }

  if (Array.isArray(raw)) {
    return raw.map((item) => normalizeProposal(item));
  }

  return [];
}

export const fetchMonitorProposals = createAsyncThunk(
  "monitorProposals/fetch",
  async ({ upcomming = true, status = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/proposals", {
        params: { upcomming, status },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load proposals" });
    }
  }
);

export const createProposals = createAsyncThunk(
  "monitorProposals/createMany",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await http.post("/monitor/proposals/create-many", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to propose session" });
    }
  }
);

export const fetchAllProposals = createAsyncThunk(
  "monitorProposals/fetchAll",
  async ({ search = "" } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (search && search.trim()) {
        params.search = search.trim();
      }
      const response = await http.get("/monitor/proposals", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load all proposals" });
    }
  }
);

const monitorProposalsSlice = createSlice({
  name: "monitorProposals",
  initialState: {
    items: [],
    allProposals: [],
    loading: false,
    allProposalsLoading: false,
    error: null,
  },
  reducers: {
    clearMonitorProposals(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    clearAllProposals(state) {
      state.allProposals = [];
      state.allProposalsLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitorProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitorProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeProposalList(action.payload);
      })
      .addCase(fetchMonitorProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProposals.pending, (state) => {
        state.allProposalsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProposals.fulfilled, (state, action) => {
        state.allProposalsLoading = false;
        state.allProposals = normalizeProposalList(action.payload);
      })
      .addCase(fetchAllProposals.rejected, (state, action) => {
        state.allProposalsLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteMonitorProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMonitorProposal.fulfilled, (state, action) => {
        state.loading = false;
        const { proposalId } = action.payload;
        state.items = state.items.filter((item) => String(item.id) !== String(proposalId));
        state.allProposals = state.allProposals.filter((item) => String(item.id) !== String(proposalId));
      })
      .addCase(deleteMonitorProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMonitorProposals, clearAllProposals } = monitorProposalsSlice.actions;
export default monitorProposalsSlice.reducer;

export const selectMonitorProposalsItems = (state) => state.monitorProposals?.items ?? [];
export const selectMonitorProposalsLoading = (state) => state.monitorProposals?.loading ?? false;
export const selectAllProposals = (state) => state.monitorProposals?.allProposals ?? [];
export const selectAllProposalsLoading = (state) => state.monitorProposals?.allProposalsLoading ?? false;
export const selectMonitorProposalsError = (state) => state.monitorProposals?.error ?? null;

export const deleteMonitorProposal = createAsyncThunk(
    'monitorProposals/deleteOne',
    async ({ proposalId }, { rejectWithValue }) => {
        try {
            const response = await http.delete(`/monitor/proposals/${proposalId}`);
            return { proposalId, payload: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to delete proposal' });
        }
    }
);
