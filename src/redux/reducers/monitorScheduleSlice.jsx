import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http";

function getTextValue(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return (
    item.name ||
    item.label ||
    [item.first_name, item.last_name].filter(Boolean).join(" ").trim() ||
    [item.prenom, item.nom].filter(Boolean).join(" ").trim() ||
    item.full_name ||
    ""
  );
}

function formatDateLabel(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getReminderText(dateStr) {
  if (!dateStr) return "";
  let resDate;
  if (dateStr.includes("-")) {
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      resDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }
  if (!resDate || Number.isNaN(resDate.getTime())) {
    resDate = new Date(dateStr);
  }
  if (Number.isNaN(resDate.getTime())) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  resDate.setHours(0, 0, 0, 0);

  const diffTime = resDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "aujourd'hui";
  } else if (diffDays === 1) {
    return "dans 1 jour";
  } else if (diffDays > 1) {
    return `dans ${diffDays} jours`;
  } else if (diffDays === -1) {
    return "hier";
  } else {
    return `il y a ${Math.abs(diffDays)} jours`;
  }
}

function getReservationStatus(reservationDate, startAt) {
  if (!reservationDate) return "upcoming";

  const current = new Date();
  const planned = new Date(`${reservationDate}T${startAt || "00:00"}:00`);
  if (Number.isNaN(planned.getTime())) return "upcoming";
  return planned < current ? "passed" : "upcoming";
}

function normalizeReservation(item = {}, dateKey = "") {
  const student = item.training?.student ?? item.student ?? null;
  const studentUser = student?.user ?? item.training?.student?.user ?? item.user ?? null;
  const monitor = item.monitor ?? item.training?.reservation?.monitor ?? null;
  const monitorUser = monitor?.user ?? null;
  const place = item.lieu ?? item.place ?? item.location ?? item.training?.reservation?.lieu ?? null;
  const offer = item.training?.offer ?? item.offer ?? null;
  // Laravel date casts may serialize as an ISO timestamp. The week grid uses
  // a YYYY-MM-DD key, so normalize every reservation to that same key.
  const rawReservationDate = item.date ?? item.datef ?? dateKey ?? "";
  const reservationDate = String(rawReservationDate).slice(0, 10);
  const startAt = item.start_at ?? item.startTime ?? (item.date_hour != null ? `${String(item.date_hour).padStart(2, "0")}:00` : "");
  const endAt = item.end_at ?? item.endTime ?? "";
  const candidateName = getTextValue(studentUser);
  const monitorName = getTextValue(monitorUser);
  const placeName = getTextValue(place) || place?.name || place?.label || "";
  const offerName = getTextValue(offer) || offer?.name || offer?.label || "";
  const phone = studentUser?.phone ?? "";
  const email = studentUser?.email ?? "";
  const studentId = student?.id ?? student?.student_id ?? studentUser?.student?.id ?? item.training?.student_id ?? null;
  const monitorId =
    monitor?.id ??
    monitor?.monitor_id ??
    monitorUser?.monitor?.id ??
    monitorUser?.monitor_id ??
    null;
  const status = getReservationStatus(reservationDate, startAt);

  const studentAvatarRaw = studentUser?.media ?? null;
  let studentAvatarUrl = null;
  if (studentAvatarRaw) {
    if (typeof studentAvatarRaw === "string") {
      studentAvatarUrl = studentAvatarRaw.startsWith("http")
        ? studentAvatarRaw
        : `${import.meta.env.VITE_API_URL ?? ""}/storage/${studentAvatarRaw}`;
    } else if (typeof studentAvatarRaw === "object" && studentAvatarRaw?.path) {
      studentAvatarUrl = studentAvatarRaw.path.startsWith("http")
        ? studentAvatarRaw.path
        : `${import.meta.env.VITE_API_URL ?? ""}/storage/${studentAvatarRaw.path}`;
    }
  }
  if (!studentAvatarUrl) {
    studentAvatarUrl = studentUser?.profile_photo_url ?? null;
  }

  return {
    id: item.id,
    type: item.training ? (item.type ?? "reservation") : "availability",
    status,
    training_id: item.training_id ?? item.training?.id ?? item.training?.training_id ?? null,
    trainingId: item.training_id ?? item.training?.id ?? item.training?.training_id ?? null,
    date: reservationDate,
    startTime: startAt,
    endTime: endAt,
    time: endAt ? `${startAt} - ${endAt}` : startAt,
    candidate: candidateName || "Candidat",
    candidateAvatar: studentAvatarUrl,
    location: placeName || "Lieu",
    place: placeName || "",
    mapLocation: place?.zone?.name ? `${place.zone.name}, ${placeName}` : placeName || "",
    title: offerName || "Réservation",
    zone: place?.zone?.name ?? "",
    color: item.color ?? null,
    accentColor: item.training?.offer?.color ?? item.color ?? null,
    isCancelled: Boolean(item.training?.cancellation),
    source: item,
    drawer: {
      id: item.id,
      type: "reservation",
      status,
      date: formatDateLabel(reservationDate),
      timeLabel: endAt ? `${startAt} à ${endAt}` : startAt,
      reminder: getReminderText(reservationDate),
      mapLocation: place?.zone?.name
        ? `${place.zone.name}, ${placeName}`
        : placeName || "Lieu",
      contextLabel: "Candidat",
      candidate: candidateName || "Candidat",
      candidateAvatar: studentAvatarUrl,
      email,
      phone,
      offer: offerName,
      accentColor: offer?.color ?? item.color ?? null,
      lastComment: null,
      commentCount: 0,
      studentId,
      monitorId,
      monitorName,
      place: placeName,
      zone: place?.zone?.name ?? "",
      lieuUrl: place?.url ?? "",
      training_id: item.training_id ?? item.training?.id ?? item.training?.training_id ?? null,
      trainingId: item.training_id ?? item.training?.id ?? item.training?.training_id ?? null,
      sourceReservation: item,
    },
  };
}

function extractRaw(payload) {
  // Try common API response shapes in order of specificity
  const candidates = [
    payload?.data?.data,      // { data: { data: {...} } }
    payload?.data?.reservations, // { data: { reservations: {...} } }
    payload?.reservations,    // { reservations: {...} }
    payload?.data,            // { data: {...} }
    payload?.schedule?.data,  // { schedule: { data: {...} } }
    payload?.schedule,        // { schedule: {...} }
    payload,                  // raw payload itself
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    // Accept a non-empty array
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
    // Accept a non-empty plain object whose first value looks like an array of reservations
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      const keys = Object.keys(candidate);
      if (keys.length === 0) continue;
      // If first value is an array (date-keyed map) → accept
      if (Array.isArray(candidate[keys[0]])) return candidate;
      // If first value is a plain object that itself has array values → one level deeper
      const inner = candidate[keys[0]];
      if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        const innerKeys = Object.keys(inner);
        if (innerKeys.length > 0 && Array.isArray(inner[innerKeys[0]])) return inner;
      }
    }
  }

  if (import.meta.env.DEV) {
    console.warn("[monitorScheduleSlice] Could not extract usable raw data from payload:", payload);
  }
  return [];
}

function normalizeSchedulePayload(payload) {
  const raw = extractRaw(payload);

  if (import.meta.env.DEV) {
    console.log("[monitorScheduleSlice] extracted raw:", {
      rawType: Array.isArray(raw) ? "array" : typeof raw,
      rawKeys: !Array.isArray(raw) && raw && typeof raw === "object" ? Object.keys(raw).slice(0, 5) : [],
    });
  }

  const groups = [];

  if (raw && !Array.isArray(raw) && typeof raw === "object") {
    Object.entries(raw).forEach(([dateKey, items]) => {
      if (!Array.isArray(items)) {
        return;
      }
      groups.push({
        isoDate: dateKey,
        dateLabel: formatDateLabel(dateKey),
        sessions: items.map((item) => normalizeReservation(item, dateKey)),
      });
    });
    return groups;
  }

  if (Array.isArray(raw)) {
    const grouped = raw.reduce((acc, item) => {
      const dateKey = item.date ?? item.datef ?? "";
      if (!dateKey) return acc;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([dateKey, items]) => ({
      isoDate: dateKey,
      dateLabel: formatDateLabel(dateKey),
      sessions: items.map((item) => normalizeReservation(item, dateKey)),
    }));
  }

  return [];
}

export const fetchMonitorSchedule = createAsyncThunk(
  "monitorSchedule/fetch",
  async ({ date_1, date_2, all = true, monitor_id = null }, { rejectWithValue }) => {
    try {
      const response = await http.get("/monitor/reservations/schedule", {
        params: { date_1, date_2, all, ...(monitor_id ? { monitor_id } : {}) },
      });
      return {
        date_1,
        date_2,
        payload: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load schedule" });
    }
  }
);

const monitorScheduleSlice = createSlice({
  name: "monitorSchedule",
  initialState: {
    groups: [],
    loading: false,
    error: null,
    range: null,
  },
  reducers: {
    clearMonitorSchedule(state) {
      state.groups = [];
      state.loading = false;
      state.error = null;
      state.range = null;
    },
    markReservationCancellationRequested(state, action) {
      const { reservationId, trainingId, status, displayStatus, cancellationReason } = action.payload || {};

      state.groups = state.groups.map((group) => ({
        ...group,
        sessions: group.sessions.map((session) => {
          const matchesReservation = reservationId != null && String(session.id) === String(reservationId);
          const matchesTraining = trainingId != null && String(session.trainingId) === String(trainingId);

          if (!matchesReservation && !matchesTraining) {
            return session;
          }

          return {
            ...session,
            status: status || "Demande d'annulation envoyée",
            cancellationRequested: true,
            pendingCancellation: true,
            training_id: trainingId ?? session.training_id ?? null,
            trainingId: trainingId ?? session.trainingId ?? null,
            cancellationReason: cancellationReason || session.cancellationReason || "",
            displayStatus: displayStatus || "Demande d'annulation envoyée.",
            drawer: session.drawer
              ? {
                  ...session.drawer,
                  status: status || "Demande d'annulation envoyée",
                  cancellationRequested: true,
                  pendingCancellation: true,
                  training_id: trainingId ?? session.drawer.training_id ?? null,
                  trainingId: trainingId ?? session.drawer.trainingId ?? null,
                  cancellationReason: cancellationReason || session.cancellationReason || "",
                  displayStatus: displayStatus || "Demande d'annulation envoyée.",
                }
              : session.drawer,
          };
        }),
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitorSchedule.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.range = {
          date_1: action.meta.arg?.date_1 ?? null,
          date_2: action.meta.arg?.date_2 ?? null,
        };
      })
      .addCase(fetchMonitorSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const { date_1, date_2, payload } = action.payload;
        state.groups = normalizeSchedulePayload(payload);
        state.range = { date_1, date_2 };
      })
      .addCase(fetchMonitorSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMonitorSchedule, markReservationCancellationRequested } = monitorScheduleSlice.actions;
export default monitorScheduleSlice.reducer;

export const selectMonitorScheduleGroups = (state) => state.monitorSchedule?.groups ?? [];
export const selectMonitorScheduleLoading = (state) => state.monitorSchedule?.loading ?? false;
export const selectMonitorScheduleError = (state) => state.monitorSchedule?.error ?? null;
