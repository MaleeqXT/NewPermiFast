import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http";

function normalizeComment(item, fallback = {}) {
  if (!item) return null;

  return {
    id: item.id ?? fallback.id ?? null,
    student_id: item.student_id ?? item.studentId ?? fallback.student_id ?? fallback.studentId ?? null,
    reservation_id: item.reservation_id ?? item.reservationId ?? fallback.reservation_id ?? fallback.reservationId ?? null,
    comment: item.comment ?? item.note ?? item.message ?? "",
    created_at: item.created_at ?? item.createdAt ?? fallback.created_at ?? fallback.createdAt ?? null,
    updated_at: item.updated_at ?? item.updatedAt ?? fallback.updated_at ?? fallback.updatedAt ?? null,
    raw: item,
  };
}

function normalizeCommentsPayload(payload, fallback = {}) {
  const raw =
    payload?.data?.data ||
    payload?.data ||
    payload?.comments?.data ||
    payload?.comments ||
    payload?.items ||
    payload?.results ||
    [];

  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizeComment(item, fallback))
      .filter(Boolean)
      .sort((left, right) => {
        const leftTime = new Date(left.updated_at || left.created_at || 0).getTime();
        const rightTime = new Date(right.updated_at || right.created_at || 0).getTime();
        return rightTime - leftTime;
      });
  }

  if (raw && typeof raw === "object") {
    return [normalizeComment(raw, fallback)].filter(Boolean);
  }

  return [];
}

export const fetchReservationComments = createAsyncThunk(
  "comments/fetchReservationComments",
  async ({ reservationId }, { rejectWithValue }) => {
    try {
      const response = await http.get(`/reservations/${reservationId}/comments`);
      return {
        reservationId,
        payload: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load comments" });
    }
  }
);

export const addReservationComment = createAsyncThunk(
  "comments/addReservationComment",
  async ({ reservationId, studentId, comment }, { rejectWithValue }) => {
    try {
      const response = await http.post(`/reservations/${reservationId}/comments`, {
        student_id: studentId,
        comment,
      });

      return {
        reservationId,
        payload: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to add comment" });
    }
  }
);

export const updateReservationComment = createAsyncThunk(
  "comments/updateReservationComment",
  async ({ reservationId, commentId, comment }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("comment", comment);

      const response = await http.post(`/reservations/${reservationId}/comments/${commentId}`, formData);

      return {
        reservationId,
        commentId,
        payload: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to update comment" });
    }
  }
);

export const deleteReservationComment = createAsyncThunk(
  "comments/deleteReservationComment",
  async ({ reservationId, commentId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const response = await http.post(`/reservations/${reservationId}/comments/${commentId}`, formData);
      return {
        reservationId,
        commentId,
        payload: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to delete comment" });
    }
  }
);

function upsertComment(items = [], nextComment) {
  if (!nextComment) return items;
  const index = items.findIndex((item) => String(item.id) === String(nextComment.id));
  if (index === -1) return [nextComment, ...items];
  const copy = [...items];
  copy[index] = nextComment;
  return copy;
}

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    byReservationId: {},
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearReservationComments(state, action) {
      const reservationId = action.payload;
      if (reservationId) {
        delete state.byReservationId[reservationId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservationComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationComments.fulfilled, (state, action) => {
        state.loading = false;
        const { reservationId, payload } = action.payload;
        state.byReservationId[reservationId] = {
          items: normalizeCommentsPayload(payload, { reservationId }),
          loading: false,
          saving: false,
          error: null,
          loaded: true,
        };
      })
      .addCase(fetchReservationComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReservationComment.pending, (state, action) => {
        state.saving = true;
        state.error = null;
        const reservationId = action.meta.arg?.reservationId;
        if (reservationId) {
          state.byReservationId[reservationId] = {
            ...(state.byReservationId[reservationId] || {}),
            saving: true,
          };
        }
      })
      .addCase(addReservationComment.fulfilled, (state, action) => {
        state.saving = false;
        const { reservationId, payload } = action.payload;
        const nextComment = normalizeComment(payload?.data ?? payload, { reservationId });
        const current = state.byReservationId[reservationId] || { items: [] };
        state.byReservationId[reservationId] = {
          ...current,
          items: nextComment ? [nextComment, ...(current.items || [])] : (current.items || []),
          saving: false,
          error: null,
          loaded: true,
        };
      })
      .addCase(addReservationComment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        const reservationId = action.meta.arg?.reservationId;
        if (reservationId && state.byReservationId[reservationId]) {
          state.byReservationId[reservationId].saving = false;
        }
      })
      .addCase(updateReservationComment.pending, (state, action) => {
        state.saving = true;
        state.error = null;
        const reservationId = action.meta.arg?.reservationId;
        if (reservationId) {
          state.byReservationId[reservationId] = {
            ...(state.byReservationId[reservationId] || {}),
            saving: true,
          };
        }
      })
      .addCase(updateReservationComment.fulfilled, (state, action) => {
        state.saving = false;
        const { reservationId, commentId, payload } = action.payload;
        const nextComment = normalizeComment(payload?.data ?? payload, {
          reservationId,
          id: commentId,
        });
        const current = state.byReservationId[reservationId] || { items: [] };
        state.byReservationId[reservationId] = {
          ...current,
          items: upsertComment(current.items || [], nextComment),
          saving: false,
          error: null,
          loaded: true,
        };
      })
      .addCase(updateReservationComment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        const reservationId = action.meta.arg?.reservationId;
        if (reservationId && state.byReservationId[reservationId]) {
          state.byReservationId[reservationId].saving = false;
        }
      })
      .addCase(deleteReservationComment.pending, (state, action) => {
        state.saving = true;
        state.error = null;
        const reservationId = action.meta.arg?.reservationId;
        if (reservationId) {
          state.byReservationId[reservationId] = {
            ...(state.byReservationId[reservationId] || {}),
            saving: true,
          };
        }
      })
      .addCase(deleteReservationComment.fulfilled, (state, action) => {
        state.saving = false;
        const { reservationId, commentId } = action.payload;
        const current = state.byReservationId[reservationId] || { items: [] };
        state.byReservationId[reservationId] = {
          ...current,
          items: (current.items || []).filter((item) => String(item.id) !== String(commentId)),
          saving: false,
          error: null,
          loaded: true,
        };
      })
      .addCase(deleteReservationComment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        const reservationId = action.meta.arg?.reservationId;
        if (reservationId && state.byReservationId[reservationId]) {
          state.byReservationId[reservationId].saving = false;
        }
      });
  },
});

export const { clearReservationComments } = commentsSlice.actions;
export default commentsSlice.reducer;

export const selectReservationComments = (state, reservationId) =>
  state.comments?.byReservationId?.[reservationId] || {
    items: [],
    loading: false,
    saving: false,
    error: null,
    loaded: false,
  };
