import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReservation, fetchReservations } from "../../redux/reducers/reservationSlice";
import { fetchZones, fetchPlacesByZone } from "../../redux/reducers/locationSlice";
import { fetchStudents } from "../../redux/reducers/candidateSlice";
import { fetchMonitors } from "../../redux/reducers/monitorsSlice";
import { fetchOffers } from "../../redux/reducers/offerSlice";
import "./Sessions.css";
import "./SessionsWeek.css";

import { MONTHS, getWeekDates, weekRangeLabel } from "./CalConstants.js";
import CalMonthView          from "./CalMonthView.jsx";
import CalWeekView           from "./Calweekview.jsx";
import CalReservationDrawer  from "./Calreservationdrawer.jsx";
import ReservationDetailDrawer from "./ReservationDetailDrawer.jsx";
import ZoneModal             from "./ZoneModal.jsx";
import CandidatesModal       from "./CandidatesModal.jsx";
import MonitorsModal         from "./MonitorsModal.jsx";

// ── Icônes ────────────────────────────────────────────────────────────────────
const IconChevL   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconPerson  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const IconRefresh = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const IconInfo    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function buildReservationFormData(reservation) {
  const formData = new FormData();
  const append = (key, value) => {
    if (value !== undefined && value !== null && value !== "") formData.append(key, value);
  };
  const startAt = reservation.start_at ?? reservation.startTime;
  const endAt = reservation.end_at ?? reservation.endTime;
  const [startHour, startMinute] = String(startAt ?? "").split(":").map(Number);
  const [endHour, endMinute] = String(endAt ?? "").split(":").map(Number);
  const duration = Number.isFinite(startHour) && Number.isFinite(startMinute) && Number.isFinite(endHour) && Number.isFinite(endMinute)
    ? Math.max(1, Math.ceil(((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60))
    : 1;

  append("date", reservation.date);
  append("start_at", startAt);
  append("end_at", endAt);
  append("hour", reservation.hour ?? duration);
  append("is_active", reservation.enabled ? 1 : 0);
  append("color", reservation.color);
  append("lieu_id", reservation.lieu_id ?? reservation.place?.id);
  append("monitor_id", reservation.monitor_id ?? reservation.monitor?.id);
  append("student_id", reservation.student_id ?? reservation.candidate?.id);
  append("offer_id", reservation.offer_id ?? reservation.offer?.id);
  return formData;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="cal-toast">
      <div className="cal-toast-top">
        <IconInfo /> Succès
        <button className="cal-toast-close" onClick={onClose}>✕</button>
      </div>
      <div className="cal-toast-bottom">{message}</div>
    </div>
  );
}

// ── Calendrier principal ──────────────────────────────────────────────────────
export default function Calendar() {
  const now = new Date();
  const dispatch = useDispatch();
  const events = useSelector((state) => state.reservation?.list ?? []);
  const zones = useSelector((state) => state.locations?.zones ?? []);
  const placesByZone = useSelector((state) => state.locations?.placesByZone ?? {});
  const students = useSelector((state) => state.candidates?.list ?? []);
  const monitors = useSelector((state) => state.monitors?.list ?? []);
  const offers = useSelector((state) => state.offers?.list ?? []);

  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view,  setView]  = useState("Mois");
  const [mode,  setMode]  = useState("Réservation");

  // État des filtres de la page principale — transmis comme préremplissage dans le tiroir
  const [zone,       setZone]       = useState(null);
  const [place,      setPlace]      = useState(null);
  const [monFilters, setMonFilters] = useState([]);
  const [candFilter, setCandFilter] = useState([]);

  const [weekAnchor,  setWeekAnchor]  = useState(now.getDate());

  // Visibilité des modales / tiroir
  const [showZone,    setShowZone]    = useState(false);
  const [showCand,    setShowCand]    = useState(false);
  const [showMon,     setShowMon]     = useState(false);
  const [showNewRes,  setShowNewRes]  = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [clickedDate, setClickedDate] = useState(null);
  const [clickedHour, setClickedHour] = useState(null);
  const [toast,       setToast]       = useState(null);

  const weekDates   = getWeekDates(year, month, weekAnchor);
  const periodTitle = view === "Semaine" ? weekRangeLabel(weekDates) : `${MONTHS[month]} ${year}`;
  const currentPlaces = placesByZone[zone?.id]?.items ?? [];
  const calendarMonitors = monitors.map((item) => {
    const monitor = item.monitor ?? item;
    const user = item.user ?? monitor.user ?? item;
    const name = user.name ?? monitor.name ?? "Moniteur";
    return { id: monitor.id ?? item.monitor_id ?? item.id, name, initials: getInitials(name), color: "#e0f2fe", text: "#0369a1" };
  }).filter((item) => item.id);
  const calendarCandidates = students.map((item) => {
    const student = item.student ?? item;
    const user = item.user ?? student.user ?? item;
    const name = user.name ?? student.name ?? "Candidat";
    return { id: student.id ?? item.student_id ?? item.id, name, color: "#e0f2fe", text: "#0369a1" };
  }).filter((item) => item.id);
  const calendarOffers = offers.map((item) => ({ id: item.id, name: item.name ?? item.title ?? "Offre", balance: item.balance ?? "" })).filter((item) => item.id);

  useEffect(() => {
    dispatch(fetchZones());
    dispatch(fetchStudents({ page: 1, status: 1 }));
    dispatch(fetchMonitors({ page: 1, status: 1 }));
    dispatch(fetchOffers({ page: 1, status: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (zone?.id) dispatch(fetchPlacesByZone(zone.id));
  }, [dispatch, zone?.id]);

  // ── Navigation ────────────────────────────────────────────────────────────
  function prevPeriod() {
    if (month === 0) { setYear(y => y-1); setMonth(11); } else setMonth(m => m-1);
  }
  function nextPeriod() {
    if (month === 11) { setYear(y => y+1); setMonth(0);  } else setMonth(m => m+1);
  }
  function prevWeek() {
    const d = new Date(weekDates[0]); d.setDate(d.getDate() - 7);
    setYear(d.getFullYear()); setMonth(d.getMonth()); setWeekAnchor(d.getDate());
  }
  function nextWeek() {
    const d = new Date(weekDates[6]); d.setDate(d.getDate() + 1);
    setYear(d.getFullYear()); setMonth(d.getMonth()); setWeekAnchor(d.getDate());
  }

  // Formate une Date en heure locale — évite le décalage UTC (ex. UTC+1 minuit → jour précédent)
  function localDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  useEffect(() => {
    dispatch(fetchReservations({
      view: "week",
      start: localDateStr(weekDates[0]),
      end: localDateStr(weekDates[6]),
      ...(zone?.id ? { zone_id: zone.id } : {}),
      ...(place?.id ? { lieu_id: place.id } : {}),
      ...(monFilters.length ? { monitor_id: monFilters.map((monitor) => monitor.id) } : {}),
      ...(candFilter.length ? { student_id: candFilter.map((candidate) => candidate.id).filter(Boolean) } : {}),
      disp: mode === "Disponibilité" ? "true" : "false",
    }));
  }, [dispatch, year, month, weekAnchor, zone?.id, place?.id, monFilters, candFilter, mode]);

  // ── Gestionnaires de clics ────────────────────────────────────────────────
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
    setSelectedReservation(reservation);
  }

  async function handleSaveReservation(res) {
    const result = await dispatch(addReservation({ formData: buildReservationFormData(res) })).unwrap();
    await dispatch(fetchReservations({
      view: "week",
      start: localDateStr(weekDates[0]),
      end: localDateStr(weekDates[6]),
      disp: mode === "Disponibilité" ? "true" : "false",
    }));
    return result;
    setToast("Réservation ajoutée avec succès.");
  }

  // Dérive le nom du candidat prérempli
  const prefillCandidateStr = candFilter[0]
    ? (typeof candFilter[0] === "string" ? candFilter[0] : candFilter[0].name ?? null)
    : null;

  return (
    <div className="cal-page">

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Barre supérieure ── */}
      <div className="cal-topbar">
        <div className="cal-month-nav">
          {view === "Mois" && <button className="cal-nav-btn" onClick={prevPeriod}><IconChevL /></button>}
          <h1 className="cal-month-title">{periodTitle}</h1>
          {view === "Mois" && <button className="cal-nav-btn" onClick={nextPeriod}><IconChevR /></button>}
        </div>
        <button
          className="cal-btn cal-btn--green cal-btn--new-res"
          onClick={() => { setClickedDate(null); setClickedHour(null); setShowNewRes(true); }}
        >
          + Nouvelle réservation
        </button>
      </div>

      {/* ── Barre de filtres ── */}
      <div className="cal-filterbar">
        <div className="cal-filter-left">
          <button className="cal-filter-pill" onClick={() => setShowZone(true)}>
            Zone : <strong>{zone?.name ?? "—"}</strong>&nbsp;&nbsp;
            {place
              ? <span className="cal-filter-place">{typeof place === "string" ? place : place}</span>
              : <span className="cal-filter-dim">Sélectionner un lieu</span>}
          </button>
          <button className="cal-filter-pill" onClick={() => setShowMon(true)}>
            <IconPerson />
            {monFilters.length > 0
              ? <><span>{monFilters.length} Moniteur{monFilters.length > 1 ? "s" : ""} :</span>
                  {monFilters.slice(0,3).map(m => (
                    <div key={m.id} className="cal-mon-pill-avatar" style={{ background: m.color, color: m.text }}>
                      {m.initials}
                    </div>
                  ))}</>
              : <span>Moniteurs</span>}
          </button>
          <button className="cal-filter-pill" onClick={() => setShowCand(true)}>
            <IconPerson />
            {candFilter.length > 0
              ? <><span>{candFilter.length} candidat{candFilter.length > 1 ? "s" : ""} :</span>
                  {candFilter.slice(0,3).map((c) => {
                    const name = typeof c === "string" ? c : c?.name;
                    return (
                      <div key={name} className="cal-mon-pill-avatar">
                        {getInitials(name)}
                      </div>
                    );
                  })}
                </>
              : <span>Candidats</span>}
          </button>
        </div>
        <div className="cal-filter-right">
          <div className="cal-view-group">
            {["Semaine","Mois"].map(v => (
              <button key={v} className={`cal-view-btn ${view===v?"cal-view-btn--active":""}`} onClick={() => setView(v)}>{v}</button>
            ))}
          </div>
          <div className="cal-view-group">
            {["Réservation","Disponibilité"].map(v => (
              <button key={v} className={`cal-view-btn ${mode===v?"cal-view-btn--active":""}`} onClick={() => setMode(v)}>{v}</button>
            ))}
          </div>
          <button className="cal-nav-btn"><IconRefresh /></button>
        </div>
      </div>

      {/* ── Vue calendrier ── */}
      {view === "Mois" ? (
        <CalMonthView
          year={year}
          month={month}
          events={events}
          onDayClick={handleDayClick}
          onEventClick={handleOpenReservation}
        />
      ) : (
        <div className="cal-grid-card">
          <CalWeekView
            weekDates={weekDates}
            events={events}
            onSlotClick={handleSlotClick}
            onPrevWeek={prevWeek}
            onNextWeek={nextWeek}
            onEventClick={handleOpenReservation}
          />
        </div>
      )}

      {/* ── Modales de filtres de la page principale ── */}
      {showZone && (
        <ZoneModal
          current={{ zone, place }} zones={zones} places={currentPlaces}
          onSave={(z, p) => { setZone(z); setPlace(p); }}
          onClose={() => setShowZone(false)}
        />
      )}
      {showCand && (
        <CandidatesModal
          selected={candFilter} candidates={calendarCandidates}
          onSave={setCandFilter}
          onClose={() => setShowCand(false)}
        />
      )}
      {showMon && (
        <MonitorsModal
          selected={monFilters} monitors={calendarMonitors}
          onSave={setMonFilters}
          onClose={() => setShowMon(false)}
        />
      )}

      {/* ── Tiroir Nouvelle Réservation ── */}
      {showNewRes && (
        <CalReservationDrawer
          onSave={handleSaveReservation}
          onClose={() => setShowNewRes(false)}
          defaultDate={clickedDate}
          defaultHour={clickedHour}
          prefillZone={zone}
          prefillPlace={place}
          prefillMonitor={monFilters[0] ?? null}
          prefillCandidate={prefillCandidateStr}
          zones={zones}
          places={currentPlaces}
          monitors={calendarMonitors}
          candidates={calendarCandidates}
          offers={calendarOffers}
        />
      )}

      {selectedReservation && (
        <ReservationDetailDrawer
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}

    </div>
  );
}
