import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';

function getPersonName(person) {
    if (!person) return null;
    if (typeof person === "string") return person;
    return (
        person.name ||
        person.label ||
        person.title ||
        [person.first_name, person.last_name].filter(Boolean).join(" ").trim() ||
        [person.prenom, person.nom].filter(Boolean).join(" ").trim() ||
        person.full_name ||
        null
    );
}

function getPersonId(person) {
    if (!person) return null;
    if (typeof person === "string") return person;
    return (
        person.student?.id ??
        person.user?.student?.id ??
        person.monitor?.id ??
        person.user?.monitor?.id ??
        person.student_id ??
        person.monitor_id ??
        person.value ??
        person.id ??
        null
    );
}

function getCandidateSource(item = {}) {
    return (
        item.student ??
        item.training?.student ??
        item.training?.student?.user ??
        item.candidate ??
        item.user ??
        null
    );
}

function getMonitorSource(item = {}) {
    return item.monitor?.user?.monitor ?? item.monitor?.user ?? item.user?.monitor ?? item.monitor ?? item.instructor ?? null;
}

function getPlaceSource(item = {}) {
    return item.lieu ?? item.place ?? item.location ?? item.lieu_id ?? null;
}

export function normalizeReservationItem(item = {}) {
    const candidate = getCandidateSource(item);
    const monitor = getMonitorSource(item);
    const place = getPlaceSource(item);
    const offer = item.offer ?? null;

    const date = item.date ?? item.reservation_date ?? item.day ?? item.start_date ?? "";
    const startTime = item.startTime ?? item.start_at ?? item.start ?? item.start_time ?? "";
    const endTime = item.endTime ?? item.end_at ?? item.end ?? item.end_time ?? "";

    return {
        ...item,
        training_id: item.training_id ?? item.training?.id ?? item.training?.training_id ?? null,
        trainingId: item.training_id ?? item.training?.id ?? item.training?.training_id ?? null,
        id: item.id ?? `${date}-${startTime}-${getPersonId(candidate) ?? getPersonId(monitor) ?? Math.random()}`,
        date,
        startTime,
        endTime,
        color: item.color ?? item.hex_color ?? "#6366f1",
        type: item.type ?? (item.is_available ? "availability" : "reservation"),
        is_active: item.is_active ?? item.active ?? null,
        candidate: candidate
            ? {
                id: getPersonId(candidate),
                name: getPersonName(candidate),
                user: candidate.user ?? null,
            }
            : null,
        monitor: monitor
            ? {
                id: getPersonId(monitor),
                name: getPersonName(monitor),
                user: monitor.user ?? null,
            }
            : null,
        place: place
            ? {
                id: place.id ?? place.value ?? item.lieu_id ?? item.place_id ?? null,
                name: getPersonName(place) ?? place.name ?? place.label ?? item.place_name ?? item.lieu_name ?? "",
                zoneId: place.zone_id ?? place.zone?.id ?? item.zone_id ?? null,
            }
            : (item.place_name || item.lieu_name
                ? {
                    id: item.place_id ?? item.lieu_id ?? null,
                    name: item.place_name ?? item.lieu_name ?? "",
                }
                : null),
        offer: offer
            ? {
                id: offer.id ?? item.offer_id ?? null,
                name: getPersonName(offer) ?? offer.name ?? offer.label ?? item.offer_name ?? "",
            }
            : (item.offer_name
                ? {
                    id: item.offer_id ?? null,
                    name: item.offer_name,
                }
                : null),
    };
}

function buildReservationFormData(reservation = {}) {
    const formData = new FormData();
    const append = (key, value) => {
        if (value === undefined || value === null || value === "") return;
        formData.append(key, value);
    };

    append("date", reservation.date);
    append("start_at", reservation.start_at ?? reservation.startTime);
    append("end_at", reservation.end_at ?? reservation.endTime);
    append("is_active", reservation.is_active ?? reservation.enabled ?? reservation.active ?? 1);
    const startTime = reservation.start_at ?? reservation.startTime;
    const endTime = reservation.end_at ?? reservation.endTime;
    const toMinutes = (time) => {
        const [hours, minutes] = String(time ?? "").split(":").map(Number);
        return Number.isFinite(hours) && Number.isFinite(minutes) ? (hours * 60) + minutes : null;
    };
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);
    const durationHours = startMinutes !== null && endMinutes !== null && endMinutes > startMinutes
        ? Math.ceil((endMinutes - startMinutes) / 60)
        : 1;
    append("hour", reservation.hour ?? durationHours);
    append("color", reservation.color);
    append("lieu_id", reservation.lieu_id ?? reservation.place?.id);
    append("monitor_id", reservation.monitor_id ?? reservation.monitor?.id);
    append("student_id", reservation.student_id ?? reservation.candidate?.id);
    append("offer_id", reservation.offer_id ?? reservation.offer?.id);

    return formData;
}

function normalizeReservationList(payload) {
    const raw =
        payload?.data?.data ||
        payload?.data ||
        payload?.reservations?.data ||
        payload?.reservations ||
        payload?.items ||
        payload?.results ||
        [];

    if (Array.isArray(raw)) {
        return raw.map(normalizeReservationItem);
    }

    if (raw && typeof raw === "object") {
        return Object.entries(raw).flatMap(([dateKey, items]) => {
            if (!Array.isArray(items)) return [];
                return items.map((item) =>
                normalizeReservationItem({
                    ...item,
                    date: item.date ?? item.datef ?? dateKey,
                    candidate: item.training?.student?.user ?? item.training?.student ?? item.student ?? item.candidate ?? item.user ?? null,
                    monitor: item.monitor?.user ?? item.monitor ?? null,
                    place: item.lieu ?? item.place ?? null,
                    offer: item.training?.offer ?? item.offer ?? null,
                    startTime: item.startTime ?? item.start_at ?? "",
                    endTime: item.endTime ?? item.end_at ?? "",
                })
            );
        });
    }

    return [];
}

export const fetchReservations = createAsyncThunk(
    'reservation/fetchReservations',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await http.get('/admin/reservations', {
                params,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to load reservations' });
        }
    }
);


export const addReservation = createAsyncThunk(
    'reservation/add',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`admin/reservations/reservation/store`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const storeMonitorReservations = createAsyncThunk(
    'reservation/storeMonitorReservations',
    async ({ data, lieu_id, monitor_id = null }, { rejectWithValue }) => {
        try {
            const response = await http.post('/monitor/reservations/store', {
                data,
                lieu_id,
                ...(monitor_id ? { monitor_id } : {}),
            });

            return response.data;
        } catch (error) {
            const payload = error.response?.data || {};
            const firstValidationError = Object.values(payload.errors || {}).flat()[0];
            return rejectWithValue({
                ...payload,
                message: firstValidationError || payload.details || payload.message || 'Unable to store monitor reservations',
            });
        }
    }
);

export const updateReservation = createAsyncThunk(
    'reservation/update',
    async ({ reservationId, reservation }, { rejectWithValue }) => {
        try {
            const formData = buildReservationFormData(reservation);
            const response = await http.put(`/admin/reservations/${reservationId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                reservationId,
                reservation,
                payload: response.data,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to update reservation' });
        }
    }
);

export const deleteReservation = createAsyncThunk(
    'reservation/delete',
    async ({ reservationId }, { rejectWithValue }) => {
        try {
            const response = await http.delete(`/admin/reservations/${reservationId}`);
            return {
                reservationId,
                payload: response.data,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to delete reservation' });
        }
    }
);

export const markReservationUnavailable = createAsyncThunk(
    'reservation/markUnavailable',
    async ({ reservationId }, { rejectWithValue }) => {
        try {
            const response = await http.put(`/admin/reservations/${reservationId}/annulation-session`, {});
            return {
                reservationId,
                payload: response.data,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to mark reservation unavailable' });
        }
    }
);

export const requestReservationCancellation = createAsyncThunk(
    'reservation/requestCancellation',
    async ({ training_id, comment }, { rejectWithValue }) => {
        try { 
            const response = await http.post('/monitor/cancellations', {
                training_id,
                comment,
            });

            return {
                training_id,
                comment,
                payload: response.data,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to request cancellation' });
        }
    }
);

export const deleteMonitorReservation = createAsyncThunk(
    'reservation/deleteMonitorReservation',
    async ({ reservationId }, { rejectWithValue }) => {
        try {
            const response = await http.delete(`/monitor/reservations/${reservationId}`);
            return { reservationId, payload: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unable to delete monitor reservation' });
        }
    }
);

function mergeReservationItems(currentItem, nextItem, snapshot) {
    if (!currentItem) return nextItem;
    if (!nextItem) return currentItem;

    const merged = {
        ...currentItem,
        ...nextItem,
        candidate: nextItem.candidate || currentItem.candidate,
        monitor: nextItem.monitor || currentItem.monitor,
        place: nextItem.place || currentItem.place,
        offer: nextItem.offer || currentItem.offer,
    };

    if (snapshot) {
        if (snapshot.student_id) {
            merged.candidate = {
                ...(merged.candidate || {}),
                id: snapshot.student_id,
                name: snapshot.student_name || merged.candidate?.name || "",
            };
        }
        if (snapshot.monitor_id) {
            merged.monitor = {
                ...(merged.monitor || {}),
                id: snapshot.monitor_id,
                name: snapshot.monitor_name || merged.monitor?.name || "",
            };
        }
        if (snapshot.lieu_id) {
            merged.place = {
                ...(merged.place || {}),
                id: snapshot.lieu_id,
                name: snapshot.place_name || merged.place?.name || "",
            };
        }
        if (snapshot.offer_id) {
            merged.offer = {
                ...(merged.offer || {}),
                id: snapshot.offer_id,
                name: snapshot.offer_name || merged.offer?.name || "",
            };
        }
        merged.date = snapshot.date || merged.date;
        merged.startTime = snapshot.start_at || snapshot.startTime || merged.startTime;
        merged.endTime = snapshot.end_at || snapshot.endTime || merged.endTime;
        merged.color = snapshot.color || merged.color;
        if (snapshot.is_active !== undefined || snapshot.enabled !== undefined) {
            merged.is_active = snapshot.is_active ?? snapshot.enabled;
        }
    }

    return merged;
}


const reservationSlice = createSlice({
    name: 'reservation',
    initialState: {
        list: [],
        loading: false,
        error: null,
        selectedReservation: [],
    },

        reducers: {},
        extraReducers: (builder) => {
          builder

           .addCase(fetchReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.list = normalizeReservationList(action.payload);
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReservation.fulfilled, (state, action) => {
                state.loading = false;
                const payloadItem = action.payload?.reservation ?? action.payload?.data ?? action.payload;
                state.list.unshift(normalizeReservationItem(payloadItem));
            })
            .addCase(addReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReservation.fulfilled, (state, action) => {
                state.loading = false;
                const { reservationId, reservation, payload } = action.payload;
                const payloadItem = payload?.reservation ?? payload?.data ?? payload;
                const normalizedNext = normalizeReservationItem({
                    ...(payloadItem || {}),
                    ...(reservation || {}),
                });
                const currentIndex = state.list.findIndex((item) => String(item.id) === String(reservationId));
                if (currentIndex === -1) {
                    state.list.unshift(normalizedNext);
                } else {
                    state.list[currentIndex] = mergeReservationItems(state.list[currentIndex], normalizedNext, reservation);
                }
            })
            .addCase(updateReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.loading = false;
                const { reservationId } = action.payload;
                state.list = state.list.filter((item) => String(item.id) !== String(reservationId));
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(markReservationUnavailable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markReservationUnavailable.fulfilled, (state, action) => {
                state.loading = false;
                const { reservationId } = action.payload;
                state.list = state.list.filter((item) => String(item.id) !== String(reservationId));
            })
            .addCase(markReservationUnavailable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteMonitorReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMonitorReservation.fulfilled, (state, action) => {
                state.loading = false;
                const { reservationId } = action.payload;
                state.list = state.list.filter((item) => String(item.id) !== String(reservationId));
            })
            .addCase(deleteMonitorReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });



    }

});

export default reservationSlice.reducer;
