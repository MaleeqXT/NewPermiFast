import "./Sessions.css";
import "./SessionsWeek.css";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MONTHS, getWeekDates, weekRangeLabel } from "./CalConstants.js";
import CalMonthView from "./CalMonthView.jsx";
import CalWeekView from "./Calweekview.jsx";
import CalReservationDrawer from "./Calreservationdrawer.jsx";
import ReservationDetailDrawer from "./ReservationDetailDrawer.jsx";
import ZoneModal from "./ZoneModal.jsx";
import CandidatesModal from "./CandidatesModal.jsx";
import MonitorsModal from "./MonitorsModal.jsx";
import { addReservation, deleteReservation, fetchReservations, markReservationUnavailable, updateReservation } from "../redux/reducers/reservationSlice.jsx";
import { fetchPlacesByZone, selectPlacesForZone, selectPlacesStatusForZone } from "../redux/reducers/locationSlice.jsx";
import { fetchMonitors } from "../redux/reducers/monitorsSlice.jsx";
import { fetchStudents } from "../redux/reducers/candidateSlice.jsx";
import { fetchOffers } from "../redux/reducers/offerSlice.jsx";

const IconChevL = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconPerson = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const IconRefresh = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const IconInfo = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;

function getInitials(name) {
  if (!name) return "?";
  return String(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function localDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getMonthVisibleRange(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const firstDow = firstOfMonth.getDay();
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() + (firstDow === 0 ? -6 : 1 - firstDow));

  const lastOfMonth = new Date(year, month + 1, 0);
  const lastDow = lastOfMonth.getDay();
  const end = new Date(lastOfMonth);
  end.setDate(lastOfMonth.getDate() + (lastDow === 0 ? 0 : 7 - lastDow));

  return { start, end };
}

function toDateQueryValue(date) {
  return localDateStr(date);
}

function normalizeName(item) {
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

function getItemId(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return String(
    item.monitorId ??
    item.studentId ??
    item.monitor?.id ??
    item.monitor?.monitor_id ??
    item.student?.id ??
    item.student?.student_id ??
    item.user?.monitor?.id ??
    item.user?.student?.id ??
    item.id ??
    item.value ??
    normalizeName(item)
  );
}

function getReservationStudentId(reservation) {
  return String(
    reservation?.student_id ??
    reservation?.training?.student_id ??
    reservation?.training?.student?.id ??
    reservation?.candidate?.id ??
    reservation?.candidate?.student?.id ??
    reservation?.candidate?.user?.student?.id ??
    ""
  );
}

function formatReservationLabel(reservation) {
  const candidate = normalizeName(reservation.candidate);
  const monitor = normalizeName(reservation.monitor);
  const place = reservation.place?.name ?? reservation.place?.label ?? "";
  const time = reservation.startTime && reservation.endTime
    ? `${reservation.startTime} - ${reservation.endTime}`
    : reservation.startTime || "";

  return {
    title: candidate || "RÃ©servation",
    subtitle: [time, monitor, place].filter(Boolean).join(" â€¢ "),
  };
}

function buildReservationDrawerItem(reservation) {
  const studentUser =
    reservation.training?.student?.user ||
    reservation.candidate?.user ||
    reservation.candidate?.student?.user ||
    null;
  const student = reservation.training?.student || reservation.candidate || null;
  const monitorUser = reservation.monitor?.user || reservation.monitor || null;
  const place = reservation.place || null;
  const offer = reservation.offer || reservation.training?.offer || null;
  const mapLocation = [
    place?.name ?? place?.label ?? "",
    place?.zone?.name ? `(${place.zone.name})` : "",
  ].filter(Boolean).join(" ");

  const candidateName =
    studentUser?.name ||
    studentUser?.first_name ||
    studentUser?.last_name ||
    student?.name ||
    student?.user?.name ||
    "";

  const studentId =
    student?.id ??
    student?.student_id ??
    student?.user?.student?.id ??
    studentUser?.student_id ??
    studentUser?.student?.id ??
    reservation.student_id ??
    null;

  const monitorName =
    monitorUser?.name ||
    monitorUser?.first_name ||
    monitorUser?.last_name ||
    reservation.monitor?.name ||
    "";

  const monitorId =
    monitorUser?.monitor?.id ??
    monitorUser?.monitor_id ??
    reservation.monitor?.monitor?.id ??
    reservation.monitor?.monitor_id ??
    reservation.monitor_id ??
    reservation.monitorId ??
    reservation.monitor?.id ??
    monitorUser?.id ??
    null;

  return {
    ...reservation,
    type: reservation.type || "reservation",
    status: reservation.is_active === 1 ? "active" : "inactive",
    date: reservation.date,
    timeLabel: `${reservation.startTime}${reservation.endTime ? ` Ã  ${reservation.endTime}` : ""}`,
    contextLabel: "Candidat",
    displayStatus: reservation.is_active === 1 ? "RÃ©servation active" : "RÃ©servation inactive",
    candidate: candidateName || "Candidat",
    email: studentUser?.email || "",
    phone: studentUser?.phone || "",
    studentId,
    offer: offer?.name || offer?.label || "",
    mapLocation: mapLocation || place?.name || reservation.place?.name || "Lieu",
    reminder: reservation.reminder || "Ã€ prÃ©sent",
    lastComment: reservation.lastComment ?? reservation.training?.note ?? null,
    commentCount: reservation.commentCount ?? 0,
    accentColor: reservation.color,
    sourceReservation: reservation,
    monitorId,
    monitorName,
  };
}

function buildQuery({
  view,
  mode,
  start,
  end,
  zoneId,
  monitors,
  candidates,
  place,
}) {
  const query = {
    view: view === "Mois" ? "month" : "week",
    disp: mode === "DisponibilitÃ©",
    "monitor_id[]": monitors.map((item) => getItemId(item)).filter(Boolean),
    "student_id[]": candidates.map((item) => getItemId(item)).filter(Boolean),
    start: toDateQueryValue(start),
    end: toDateQueryValue(end),
    is_unrestricted: false,
  };

  if (zoneId) query.zone_id = zoneId;

  const placeId = place ? getItemId(place) : "";
  if (placeId) {
    query.lieu_id = placeId;
  }

  return query;
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="cal-toast">
      <div className="cal-toast-top">
        <IconInfo /> SuccÃ¨s
        <button className="cal-toast-close" onClick={onClose}>âœ•</button>
      </div>
      <div className="cal-toast-bottom">{message}</div>
    </div>
  );
}

export default function Sessions() {
  const now = new Date();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedSchool = useSelector((state) => state.schools.selected);
  const reservations = useSelector((state) => state.reservation.list);
  const reservationsLoading = useSelector((state) => state.reservation.loading);
  const reservationsError = useSelector((state) => state.reservation.error);
  const placesLoading = useSelector(selectPlacesStatusForZone(selectedSchool?.id));
  const places = useSelector(selectPlacesForZone(selectedSchool?.id));
  const monitors = useSelector((state) => state.monitors.list);
  const candidates = useSelector((state) => state.candidates.list);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState("Mois");
  const [mode, setMode] = useState("RÃ©servation");

  const [place, setPlace] = useState(null);
  const [monFilters, setMonFilters] = useState([]);
  const [candFilter, setCandFilter] = useState([]);

  const [weekAnchor, setWeekAnchor] = useState(now.getDate());
  const [showZone, setShowZone] = useState(false);
  const [showCand, setShowCand] = useState(false);
  const [showMon, setShowMon] = useState(false);
  const [showNewRes, setShowNewRes] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [clickedDate, setClickedDate] = useState(null);
  const [clickedHour, setClickedHour] = useState(null);
  const [toast, setToast] = useState(null);

  const zoneId = selectedSchool?.id ?? null;

  const weekDates = useMemo(() => getWeekDates(year, month, weekAnchor), [year, month, weekAnchor]);
  const visibleRange = useMemo(() => {
    if (view === "Mois") {
      return getMonthVisibleRange(year, month);
    }
    return {
      start: weekDates[0],
      end: weekDates[6],
    };
  }, [view, year, month, weekDates]);

  const resolvedPlace = useMemo(() => {
    if (!place) return null;
    const placeKey = getItemId(place);
    const match = places.find((item) => String(item.id ?? "") === String(placeKey));
    return match ?? place;
  }, [place, places]);

  const queryParams = useMemo(() => buildQuery({
    view,
    mode,
    start: visibleRange.start,
    end: visibleRange.end,
    zoneId,
    monitors: monFilters,
    candidates: candFilter,
    place: resolvedPlace,
  }), [view, mode, visibleRange, monFilters, candFilter, resolvedPlace]);

  // Keep the calendar scoped to the candidate filter even when an API response
  // contains extra records (for example, when the backend ignores an empty ID).
  const visibleReservations = useMemo(() => {
    if (!candFilter.length) return reservations;
    const studentIds = new Set(candFilter.map(getItemId).filter(Boolean));
    return reservations.filter((reservation) => studentIds.has(getReservationStudentId(reservation)));
  }, [reservations, candFilter]);

  const periodTitle = view === "Semaine"
    ? weekRangeLabel(weekDates)
    : `${MONTHS[month]} ${year}`;

  const prefillCandidateStr = candFilter[0]
    ? (typeof candFilter[0] === "string" ? candFilter[0] : candFilter[0].name ?? null)
    : null;

  useEffect(() => {
    if (!zoneId) return;
    dispatch(fetchPlacesByZone(zoneId));
  }, [dispatch, zoneId]);

  useEffect(() => {
    if (!zoneId) return;
    dispatch(fetchMonitors({ page: 1, search: "", status: "all" }));
    dispatch(fetchStudents({ page: 1, search: "", status: "" }));
    dispatch(fetchOffers({}));
  }, [dispatch, zoneId]);

  useEffect(() => {
    if (!zoneId) return;
    dispatch(fetchReservations(queryParams));
  }, [dispatch, zoneId, queryParams]);

  function prevPeriod() {
    if (month === 0) {
      setYear((value) => value - 1);
      setMonth(11);
      return;
    }
    setMonth((value) => value - 1);
  }

  function nextPeriod() {
    if (month === 11) {
      setYear((value) => value + 1);
      setMonth(0);
      return;
    }
    setMonth((value) => value + 1);
  }

  function prevWeek() {
    const d = new Date(weekDates[0]);
    d.setDate(d.getDate() - 7);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setWeekAnchor(d.getDate());
  }

  function nextWeek() {
    const d = new Date(weekDates[6]);
    d.setDate(d.getDate() + 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setWeekAnchor(d.getDate());
  }

  function handleDayClick(day) {
    if (!day) return;
    setClickedDate(localDateStr(new Date(year, month, day)));
    setClickedHour(null);
    setWeekAnchor(day);
    setShowNewRes(true);
  }

  function handleSlotClick(date, hour) {
    setClickedDate(localDateStr(date));
    setClickedHour(hour);
    setShowNewRes(true);
  }

  function handleOpenReservation(reservation) {
    setSelectedReservation(buildReservationDrawerItem(reservation));
  }

  function handleOpenEditReservation(reservation) {
    setEditingReservation(reservation);
    setSelectedReservation(null);
    setShowNewRes(true);
  }

  async function handleSaveReservation(reservation) {
    try {
      if (editingReservation?.id) {
        await dispatch(updateReservation({ reservationId: editingReservation.id, reservation })).unwrap();
        setToast("Réservation modifiée avec succès.");
      } else {
        const formData = new FormData();
        formData.append("date", reservation.date);
        formData.append("start_at", reservation.start_at);
        formData.append("end_at", reservation.end_at);
        formData.append("is_active", reservation.is_active);
        formData.append("hour", reservation.hour);
        formData.append("color", reservation.color);
        formData.append("lieu_id", reservation.lieu_id);
        formData.append("monitor_id", reservation.monitor_id);
        formData.append("offer_id", reservation.offer_id);
        formData.append("student_id", reservation.student_id);
        await dispatch(addReservation({ formData })).unwrap();
        setToast("Réservation ajoutée avec succès.");
      }
      await dispatch(fetchReservations(queryParams));
      setEditingReservation(null);
    } catch (error) {
      setToast(error?.message || (editingReservation?.id ? "La réservation n'a pas pu être modifiée." : "La réservation n'a pas pu être enregistrée."));
    }
  }

  async function handleDeleteReservation(reservation) {
    if (!reservation?.id) return;
    const confirmed = window.confirm("Supprimer cette rÃ©servation ?");
    if (!confirmed) return;

    try {
      await dispatch(deleteReservation({ reservationId: reservation.id })).unwrap();
      setSelectedReservation(null);
      await dispatch(fetchReservations(queryParams));
      setToast("RÃ©servation supprimÃ©e avec succÃ¨s.");
    } catch (error) {
      setToast(error?.message || "La rÃ©servation n'a pas pu Ãªtre supprimÃ©e.");
    }
  }

  async function handleMarkUnavailable(reservation) {
    if (!reservation?.id) return;

    try {
      await dispatch(markReservationUnavailable({ reservationId: reservation.id })).unwrap();
      setSelectedReservation(null);
      await dispatch(fetchReservations(queryParams));
      setToast("La réservation a été marquée comme indisponible.");
    } catch (error) {
      setToast(error?.message || "La réservation n'a pas pu être marquée comme indisponible.");
    }
  }

  function handleOpenEditFromDetail(reservation) {
    setSelectedReservation(null);
    setEditingReservation(reservation?.sourceReservation || reservation);
    setShowNewRes(true);
  }

  function handleOpenMonitor(monitorId) {
    if (!monitorId) return;
    navigate(`/monitors-info/${monitorId}`);
  }

  const selectedZoneLabel = selectedSchool?.name ?? "Zone";

  const activePlaceLabel = resolvedPlace
    ? (typeof resolvedPlace === "string" ? resolvedPlace : resolvedPlace.name ?? resolvedPlace.label ?? "â€”")
    : "SÃ©lectionner un lieu";

  const reservationErrorMessage = useMemo(() => {
    if (!reservationsError) return "";
    if (typeof reservationsError === "string") return reservationsError;
    if (reservationsError.message) return reservationsError.message;
    if (reservationsError.errors) return Object.values(reservationsError.errors).flat().filter(Boolean).join(" | ");
    return "Une erreur est survenue lors du chargement des rÃ©servations.";
  }, [reservationsError]);

  return (
    <div className="cal-page">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="cal-topbar">
        <div className="cal-month-nav">
          {view === "Mois" && <button className="cal-nav-btn" onClick={prevPeriod}><IconChevL /></button>}
          <h1 className="cal-month-title">{periodTitle}</h1>
          {view === "Mois" && <button className="cal-nav-btn" onClick={nextPeriod}><IconChevR /></button>}
        </div>

        <button
          className="cal-btn cal-btn--green cal-btn--new-res"
          onClick={() => {
            setClickedDate(null);
            setClickedHour(null);
            setShowNewRes(true);
          }}
        >
          + Nouvelle rÃ©servation
        </button>
      </div>

      <div className="cal-filterbar">
        <div className="cal-filter-left">
          <button className="cal-filter-pill" onClick={() => setShowZone(true)}>
            Zone : <strong>{selectedZoneLabel}</strong>&nbsp;&nbsp;
            <span className="cal-filter-place">{activePlaceLabel}</span>
          </button>

          <button className="cal-filter-pill" onClick={() => setShowMon(true)}>
            <IconPerson />
            {monFilters.length > 0
              ? (
                <>
                  <span>{monFilters.length} Moniteur{monFilters.length > 1 ? "s" : ""} :</span>
                  {monFilters.slice(0, 3).map((monitor) => {
                    const name = normalizeName(monitor);
                    return (
                      <div
                        key={getItemId(monitor)}
                        className="cal-mon-pill-avatar"
                        style={{ background: monitor.color || "#e0f2fe", color: monitor.text || "#0369a1" }}
                      >
                        {getInitials(name)}
                      </div>
                    );
                  })}
                </>
              )
              : <span>Moniteurs</span>}
          </button>

          <button className="cal-filter-pill" onClick={() => setShowCand(true)}>
            <IconPerson />
            {candFilter.length > 0
              ? (
                <>
                  <span>{candFilter.length} candidat{candFilter.length > 1 ? "s" : ""} :</span>
                  {candFilter.slice(0, 3).map((candidate) => {
                    const name = normalizeName(candidate);
                    return (
                      <div key={getItemId(candidate)} className="cal-mon-pill-avatar">
                        {getInitials(name)}
                      </div>
                    );
                  })}
                </>
              )
              : <span>Candidats</span>}
          </button>
        </div>

        <div className="cal-filter-right">
          <div className="cal-view-group">
            {["Semaine", "Mois"].map((value) => (
              <button
                key={value}
                className={`cal-view-btn ${view === value ? "cal-view-btn--active" : ""}`}
                onClick={() => setView(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="cal-view-group">
            {["RÃ©servation", "ZisponibilitÃ©"].map((value) => (
              <button
                key={value}
                className={`cal-view-btn ${mode === value ? "cal-view-btn--active" : ""}`}
                onClick={() => setMode(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <button
            className="cal-nav-btn"
            onClick={() => dispatch(fetchReservations(queryParams))}
            title="RafraÃ®chir"
          >
            <IconRefresh />
          </button>
        </div>
      </div>

      {reservationErrorMessage && (
        <div className="cal-toast" style={{ marginBottom: 18, borderColor: "#ef4444" }}>
          <div className="cal-toast-top" style={{ background: "#b91c1c" }}>
            <IconInfo /> Erreur
          </div>
          <div className="cal-toast-bottom">{reservationErrorMessage}</div>
        </div>
      )}

      {reservationsLoading && (
        <div className="cal-toast" style={{ marginBottom: 18 }}>
          <div className="cal-toast-top">
            <IconInfo /> Chargement
          </div>
          <div className="cal-toast-bottom">Les rÃ©servations sont en cours de chargement.</div>
        </div>
      )}

      {view === "Mois" ? (
        <CalMonthView
          year={year}
          month={month}
          events={visibleReservations}
          onDayClick={handleDayClick}
          onEventClick={handleOpenReservation}
        />
      ) : (
        <>
          <div className="cal-grid-card">
            <CalWeekView
              weekDates={weekDates}
               events={visibleReservations}
              onSlotClick={handleSlotClick}
              onPrevWeek={prevWeek}
              onNextWeek={nextWeek}
              onEventClick={(reservation) => handleOpenReservation(reservation)}
            />
          </div>

           {visibleReservations.length > 0 && (
            <div className="cal-grid-card" style={{ marginTop: 16, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#111827" }}>
                RÃ©servations chargÃ©es
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                 {visibleReservations.map((reservation) => {
                  const { title, subtitle } = formatReservationLabel(reservation);
                  return (
                    <button
                      type="button"
                      key={reservation.id}
                      className="cal-loaded-reservation"
                      style={{
                        border: "1px solid #e5e7eb",
                        borderLeft: `4px solid ${reservation.color || "#6366f1"}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: "#fff",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onClick={() => handleOpenReservation(reservation)}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        {title}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                        {reservation.date} {subtitle ? `â€¢ ${subtitle}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

       {!reservationsLoading && !reservationErrorMessage && visibleReservations.length === 0 && (
        <div className="cal-toast" style={{ marginTop: 18 }}>
          <div className="cal-toast-top">
            <IconInfo /> Aucun rÃ©sultat
          </div>
          <div className="cal-toast-bottom">
            Aucune rÃ©servation trouvÃ©e pour cette pÃ©riode et ces filtres.
          </div>
        </div>
      )}

      {showZone && (
        <ZoneModal
          current={{ zone: selectedSchool, place }}
          zone={selectedSchool}
          places={places}
          loading={placesLoading === "loading"}
          onSave={(nextZone, nextPlace) => {
            setPlace(nextPlace);
          }}
          onClose={() => setShowZone(false)}
        />
      )}

      {showCand && (
        <CandidatesModal
          selected={candFilter}
          items={candidates}
          onSave={setCandFilter}
          onClose={() => setShowCand(false)}
        />
      )}

      {showMon && (
        <MonitorsModal
          selected={monFilters}
          items={monitors}
          onSave={setMonFilters}
          onClose={() => setShowMon(false)}
        />
      )}

      {showNewRes && (
        <CalReservationDrawer
          onSave={handleSaveReservation}
          onClose={() => {
            setShowNewRes(false);
            setEditingReservation(null);
          }}
          defaultDate={clickedDate}
          defaultHour={clickedHour}
          prefillZone={selectedSchool}
          prefillPlace={resolvedPlace}
          prefillMonitor={monFilters[0] ?? null}
          prefillCandidate={prefillCandidateStr}
          mode={editingReservation ? "edit" : "create"}
          initialReservation={editingReservation}
          submitLabel={editingReservation ? "Mettre à jour" : "Enregistrer"}
        />
      )}

      {selectedReservation && (
        <ReservationDetailDrawer
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onOpenMonitor={handleOpenMonitor}
          onDeleteReservation={handleDeleteReservation}
          onMarkUnavailable={handleMarkUnavailable}
          onEditReservation={handleOpenEditFromDetail}
        />
      )}
    </div>
  );
}
