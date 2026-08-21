import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MonitorSessions.css";
import CalWeekView from "../sessions/Calweekview.jsx";
import ZoneModal from "../sessions/ZoneModal.jsx";
import BookingDrawer from "./BookingDrawer.jsx";
import AvailabilityDrawer from "./AvailabilityDrawer.jsx";
import ProposeCancelDrawer from "./ProposeCancelDrawer.jsx";
import ProposeSessionDrawer from "./ProposeSessionDrawer.jsx";
import CancelSessionModal from "./CancelSessionModal.jsx";
import SchedulingDrawer from "./SchedulingDrawer.jsx";
import {
  fetchMonitorSchedule,
  selectMonitorScheduleError,
  selectMonitorScheduleGroups,
  selectMonitorScheduleLoading,
  markReservationCancellationRequested,
  clearMonitorSchedule,
} from "../redux/reducers/monitorScheduleSlice.jsx";
import {
  fetchPlacesByZone,
  fetchZones,
  selectPlacesForZone,
  selectPlacesStatusForZone,
  selectZones,
  selectZonesStatus,
} from "../redux/reducers/locationSlice.jsx";
import {
  fetchMonitorProposals,
  selectMonitorProposalsError,
  selectMonitorProposalsItems,
  selectMonitorProposalsLoading,
  createProposals,
} from "../redux/reducers/monitorProposalsSlice.jsx";
import { deleteMonitorProposal } from "../redux/reducers/monitorProposalsSlice.jsx";
import { requestReservationCancellation, storeMonitorReservations } from "../redux/reducers/reservationSlice.jsx";
import { deleteMonitorReservation } from "../redux/reducers/reservationSlice.jsx";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.4 2.4 4.6-5" />
  </svg>
);

const IconSlotCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

export const DEFAULT_EVENTS = [
  {
    id: 1,
    type: "reservation",
    status: "Séance",
    date: "2026-05-19",
    startTime: "08:00",
    endTime: "09:00",
    candidate: "Mohamed Rahmouni",
    place: "32 Boulevard Andre Netwiller, Toulouse",
    offer: "Pass permis Manuelle F10",
    color: "linear-gradient(180deg, #062a33 0%, #04161c 100%)",
    accentColor: "#7cc44d",
    email: "rahmounimohamed313@gmail.com",
    mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
    reminder: "dans 44 minutes",
  },
  {
    id: 2,
    type: "cancelled",
    status: "Annulation en cours de traitement.",
    date: "2026-05-20",
    startTime: "08:00",
    endTime: "09:00",
    candidate: "Mohamed Rahmouni",
    place: "32 Boulevard Andre Netwiller, Toulouse",
    offer: "Pass permis Manuelle F10",
    color: "linear-gradient(180deg, #0e5a31 0%, #0a2d20 100%)",
    accentColor: "#22c55e",
    email: "rahmounimohamed313@gmail.com",
    mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
    reminder: "dans 44 minutes",
  },
  {
    id: 3,
    type: "offer",
    status: "Une séance a été proposée",
    date: "2026-05-22",
    startTime: "09:00",
    endTime: "10:00",
    candidate: "Keita El Hadji",
    place: "Toulouse, McDonald's Les Arenes",
    offer: "Automatic F5 Driving Licence Pass",
    color: "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)",
    accentColor: "#60a5fa",
    email: "ekeita934@gmail.com",
    mapLocation: "TOULOUSE, Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit",
    reminder: "dans 1 heure",
  },
  {
    id: 4,
    type: "reservation",
    status: "Séance",
    date: "2026-05-23",
    startTime: "08:00",
    endTime: "10:00",
    candidate: "Youzouria Tamime",
    place: "32 Boulevard Andre Netwiller, Toulouse",
    offer: "Pass permis Manuelle F10",
    color: "linear-gradient(180deg, #062a33 0%, #04161c 100%)",
    accentColor: "#7cc44d",
    email: "youzouria@gmail.com",
    mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
    reminder: "dans 2 heures",
  },
  {
    id: 5,
    type: "availability",
    status: "Disponible",
    date: "2026-05-23",
    startTime: "07:00",
    endTime: "08:00",
    candidate: null,
    place: "Toulouse, McDonald's Les Arenes",
    offer: "",
    color: "linear-gradient(180deg, #ffffff 0%, #f3fff7 100%)",
    accentColor: "#2dd881",
    email: "",
    mapLocation: "Toulouse, McDonald's Les Arenes",
    reminder: "in 15 minutes",
  },
  {
    id: 6,
    type: "availability",
    status: "Disponible",
    date: "2026-05-24",
    startTime: "09:00",
    candidate: null,
    place: "Toulouse, McDonald's Les Arenes",
    offer: "",
    color: "linear-gradient(180deg, #ffffff 0%, #f3fff7 100%)",
    accentColor: "#2dd881",
    email: "",
    mapLocation: "Toulouse, McDonald's Les Arenes",
    reminder: "in 15 minutes",
  },
];

function parseIsoDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + mondayOffset);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getEndOfWeek(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

function isSameDay(left, right) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function isDateWithinWeek(date, weekStart) {
  const weekEnd = getEndOfWeek(weekStart);
  return date >= weekStart && date <= weekEnd;
}

function buildMonthGrid(monthCursor, selectedWeekStart) {
  const monthStart = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
  const gridStart = getStartOfWeek(monthStart);
  const cells = [];

  for (let index = 0; index < 42; index += 1) {  
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    cells.push({
      key: formatIsoDate(cellDate),
      date: cellDate,
      isCurrentMonth: cellDate.getMonth() === monthCursor.getMonth(),
      isSelectedWeek: isDateWithinWeek(cellDate, selectedWeekStart),
      isSelectedStart: isSameDay(cellDate, selectedWeekStart),
      isSelectedEnd: isSameDay(cellDate, getEndOfWeek(selectedWeekStart)),
    });
  }

  return cells;
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

function buildDrawerReservation(event) {
  const isCancelled = event.type === "cancelled";
  const isCancellationRequested = Boolean(event.cancellationRequested || event.pendingCancellation);

  return {
    ...event,
    ...(event.drawer ?? {}),
    sourceEventId: event.id,
    status: isCancelled ? "cancelled" : event.status,
    date: parseIsoDate(event.date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    timeLabel: `${event.startTime} to ${event.endTime}`,
    contextLabel: "Candidat",
    mapLocation: event.drawer?.mapLocation ?? event.mapLocation ?? event.location ?? "Lieu",
    candidateAvatar: event.drawer?.candidateAvatar ?? event.candidateAvatar ?? null,
    phone: event.drawer?.phone ?? event.phone ?? "",
    email: event.drawer?.email ?? event.email ?? "",
    offer: event.drawer?.offer ?? event.offer ?? event.title ?? "",
    reminder: event.drawer?.reminder ?? event.reminder ?? getReminderText(event.date),
    lieuUrl: event.drawer?.lieuUrl ?? event.lieuUrl ?? "",
    lastComment: event.lastComment ?? null,
    commentCount: event.commentCount ?? 0,
    training_id: event.training_id ?? event.trainingId ?? event.sourceReservation?.training_id ?? null,
    trainingId: event.trainingId ?? event.training_id ?? event.sourceReservation?.training_id ?? null,
    cancellationRequested: isCancellationRequested,
    pendingCancellation: isCancellationRequested,
    displayStatus: isCancelled
      ? "Annulation en cours de traitement."
      : isCancellationRequested
        ? "Demande d'annulation envoyée."
        : event.status,
  };
}

function buildCancelledReservation(event, justification) {
  return {
    ...event,
    type: "reservation",
    status: "Demande d'annulation envoyée",
    displayStatus: "Demande d'annulation envoyée.",
    cancellationRequested: true,
    pendingCancellation: true,
    training_id: event.training_id ?? event.trainingId ?? null,
    cancellationReason: justification,
  };
}

function buildAvailabilityFromSlot(slot, zone, place) {
  return {
    id: slot.id ?? Date.now(),
    type: "availability",
    status: "Disponible",
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    candidate: null,
    place: place || zone?.name || "Lieu sélectionné",
    offer: "",
    color: "linear-gradient(180deg, #ffffff 0%, #f3fff7 100%)",
    accentColor: "#2dd881",
    email: "",
    mapLocation: place || zone?.name || "Lieu sélectionné",
    reminder: "à présent",
  };
}

function buildProposalFromAvailability(availability, candidate, note) {
  return {
    ...availability,
    type: "offer",
    status: "Une séance a été proposée",
    candidate: candidate?.name ?? "Candidat",
    email: candidate?.email ?? "",
    phone: candidate?.phone ?? "",
    progress: candidate?.progress ?? 0,
    seancePasse: candidate?.seancePasse ?? 26,
    seanceAvenir: candidate?.seanceAvenir ?? 0,
    balanceUtilise: candidate?.balanceUtilise ?? 26,
    balanceReste: candidate?.balanceReste ?? 0,
    color: "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)",
    accentColor: "#60a5fa",
    mapLocation: availability.mapLocation || availability.place,
    proposalNote: note,
    sourceAvailability: {
      place: availability.place,
      mapLocation: availability.mapLocation,
      reminder: availability.reminder,
    },
  };
}

function restoreAvailabilityFromProposal(proposal) {
  return {
    ...proposal,
    type: "availability",
    status: "Disponible",
    candidate: null,
    email: "",
    phone: "",
    offer: "",
    progress: undefined,
    seancePasse: undefined,
    seanceAvenir: undefined,
    balanceUtilise: undefined,
    balanceReste: undefined,
    color: "linear-gradient(180deg, #ffffff 0%, #f3fff7 100%)",
    accentColor: "#2dd881",
    place: proposal.sourceAvailability?.place || proposal.place,
    mapLocation: proposal.sourceAvailability?.mapLocation || proposal.mapLocation || proposal.place,
    reminder: proposal.sourceAvailability?.reminder || proposal.reminder,
    proposalNote: undefined,
    sourceAvailability: undefined,
  };
}

function safeHexColor(value, fallbackIndex = 0) {
  if (typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) {
    return value.trim();
  }

  const fallbackColors = ["#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6"];
  return fallbackColors[fallbackIndex % fallbackColors.length];
}

function hexToRgb(hex) {
  const normalized = safeHexColor(hex);
  const raw = normalized.slice(1);
  const chunks = raw.length === 3 ? raw.split("").map((ch) => ch + ch) : raw.match(/.{2}/g);
  if (!chunks) return { r: 14, g: 165, b: 233 };
  const [r, g, b] = chunks.map((part) => Number.parseInt(part, 16));
  return { r, g, b };
}

function mixWithWhite(hex, ratio = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r) + (0.587 * g) + (0.114 * b);
  return luminance > 165 ? "#1f2937" : "#ffffff";
}

function normalizeLabel(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.label || [value.first_name, value.last_name].filter(Boolean).join(" ").trim() || "";
}

function getEventLabel(event) {
  if (event.type === "availability") return "Disponibilité";
  if (event.type === "offer") return "Proposition";
  if (event.type === "cancelled") return "Annulée";
  return "Réservation";
}

function EventCard({ event, isSelected = false, selectedCandidatName = "", slotState = null, isLeadVisibleSlot = true }) {
  const isAvailability = event.type === "availability";
  const isOffer = event.type === "offer";
  const isCancelled = event.type === "cancelled";
  const isCancellationRequested = Boolean(event.cancellationRequested || event.pendingCancellation);
  const showProposalPreview = isAvailability && isSelected && Boolean(selectedCandidatName);
  const fallbackIndex = String(event.id ?? "").split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) || 0;
  const accent = safeHexColor(isSelected ? "#2563eb" : event.accentColor, fallbackIndex);
  const readableColor = getReadableTextColor(accent);
  const softAccent = mixWithWhite(accent, 0.84);
  const background = isSelected
    ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
    : typeof event.color === "string" && event.color.includes("gradient")
      ? event.color
      : isAvailability
        ? "linear-gradient(135deg, rgba(34, 197, 94, 0.14) 0%, rgba(34, 197, 94, 0.24) 100%)"
        : isOffer
          ? "linear-gradient(135deg, rgba(236, 72, 153, 0.14) 0%, rgba(244, 114, 182, 0.24) 100%)"
          : isCancelled
            ? "linear-gradient(135deg, rgba(107, 114, 128, 0.18) 0%, rgba(156, 163, 175, 0.24) 100%)"
            : `linear-gradient(135deg, ${accent} 0%, ${softAccent} 100%)`;

  const cardClassName = [
    "ms-event-card",
    isAvailability ? "ms-event-card--availability" : "",
    isOffer ? "ms-event-card--offer" : "",
    isCancelled ? "ms-event-card--cancelled" : "",
    isCancellationRequested ? "ms-event-card--pending-cancellation" : "",
    isSelected ? "ms-event-card--selected" : "",
    !isLeadVisibleSlot ? "ms-event-card--compact" : "",
  ].filter(Boolean).join(" ");

  const candidateLabel = normalizeLabel(event.candidate) || "Séance";
  const placeLabel = normalizeLabel(event.place) || normalizeLabel(event.mapLocation);
  const monitorLabel = normalizeLabel(event.monitor) || normalizeLabel(event.monitorName);
  const offerLabel = normalizeLabel(event.offer);
  const title = showProposalPreview
    ? `Séance pour ${selectedCandidatName}`
    : candidateLabel || placeLabel || getEventLabel(event);
  const timeLabel = event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime || "";

  return (
    <div
      className={cardClassName}
      style={{
        background,
        color: readableColor,
        "--ms-event-accent": accent,
        "--ms-event-soft": softAccent,
      }}
    >
      <div className="ms-event-head">
        <span className="ms-event-status">
          {showProposalPreview ? "Proposition sélectionnée" : event.status}
        </span>
        {timeLabel && <span className="ms-event-time">{timeLabel}</span>}
      </div>

      {isLeadVisibleSlot ? (
        <>
          {isOffer ? (
            /* ── Proposal / offer card layout ── */
            <div className="ms-event-body">
              <div className="ms-event-candidate-row">
                {event.candidateAvatar ? (
                  <img
                    src={event.candidateAvatar}
                    alt={candidateLabel}
                    className="ms-event-candidate-avatar"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="ms-event-candidate-avatar-fallback">
                    {(candidateLabel.charAt(0) || "?").toUpperCase()}
                  </div>
                )}
                <strong className="ms-event-candidate-name">{candidateLabel}</strong>
              </div>
              {placeLabel && (
                <span className="ms-event-copy" style={{ marginTop: 4 }}>
                  📍 {placeLabel}
                </span>
              )}
            </div>
          ) : (
          <div className="ms-event-body">
            <strong className="ms-event-title">{title}</strong>
            <span className="ms-event-copy">
              {showProposalPreview
                ? `Une séance sera proposée au candidat ${selectedCandidatName} à ${placeLabel || "ce lieu"}`
                : isAvailability
                  ? `Disponible ${placeLabel || ""}`
                  : placeLabel || "Lieu non défini"}
            </span>
            {(offerLabel || placeLabel) && (
              <div className="ms-event-meta">
                {offerLabel && <span className="ms-event-chip">{offerLabel}</span>}
                {placeLabel && <span className="ms-event-chip ms-event-chip--soft">{placeLabel}</span>}
              </div>
            )}
          </div>
          )}

          {!isOffer && (
          <div className="ms-event-footer">
            <span className="ms-event-footer-main">
              {monitorLabel || normalizeLabel(event.mapLocation) || (isCancelled ? "Annulation" : "Séance")}
            </span>
            {event.reminder && <span className="ms-event-footer-note">{event.reminder}</span>}
          </div>
          )}
        </>
      ) : (
        <div className="ms-event-compact">
          <span className="ms-event-compact-tag">Suite</span>
          <strong className="ms-event-compact-title">{candidateLabel || placeLabel || getEventLabel(event)}</strong>
          <span className="ms-event-compact-time">{timeLabel}</span>
        </div>
      )}
    </div>
  );
}

export function SuccessModal({ onClose, message = "Les réservations ont été créées avec succès" }) {
  return (
    <div className="ms-modal-backdrop" onClick={onClose}>
      <div className="ms-success-modal" onClick={(event) => event.stopPropagation()}>
        <div className="ms-success-top">
          <IconCheck />
          <span>Succès</span>
        </div>
        <div className="ms-success-body">
          <p>{message}</p>
        </div>
        <div className="ms-success-actions">
          <button type="button" className="ms-secondary-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default function MonitorSessions({
  variant = "monitor",
  mode = "default",
  title,
  subtitle,
  allowAvailabilityCreation = variant === "monitor" && mode !== "proposal",
  candidate = null,
  events: controlledEvents,
  onEventsChange,
  onOpenProposeSession,
  onOpenAllSessions,
  onProposalCreated,
  initialSelectedAvailabilityIds = [],
  monitorId = null,
}) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const initialWeekStart = useMemo(() => getStartOfWeek(new Date()), []);
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [monthCursor, setMonthCursor] = useState(new Date(initialWeekStart.getFullYear(), initialWeekStart.getMonth(), 1));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [internalEvents, setInternalEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [activeAvailability, setActiveAvailability] = useState(null);
  const [activeProposal, setActiveProposal] = useState(null);
  const [showProposeDrawer, setShowProposeDrawer] = useState(false);
  const [showCancelSessionModal, setShowCancelSessionModal] = useState(false);
  const [showSchedulingDrawer, setShowSchedulingDrawer] = useState(false);
  const [selectedAvailabilityIds, setSelectedAvailabilityIds] = useState(initialSelectedAvailabilityIds);
  const [successMessage, setSuccessMessage] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const reservationGroups = useSelector(selectMonitorScheduleGroups);
  const reservationLoading = useSelector(selectMonitorScheduleLoading);
  const reservationError = useSelector(selectMonitorScheduleError);
  const proposalItems = useSelector(selectMonitorProposalsItems);
  const proposalLoading = useSelector(selectMonitorProposalsLoading);
  const proposalError = useSelector(selectMonitorProposalsError);
  const zones = useSelector(selectZones);
  const zonesStatus = useSelector(selectZonesStatus);
  const currentZoneId = currentUser?.zone_id ?? null;
  const currentZone = useMemo(() => {
    const matchedZone = zones.find((zone) => String(zone.id) === String(currentZoneId));
    return matchedZone || null;
  }, [currentZoneId, zones]);
  const places = useSelector(selectPlacesForZone(currentZoneId));
  const placesStatus = useSelector(selectPlacesStatusForZone(currentZoneId));
const [cancelTargetBooking, setCancelTargetBooking] = useState(null);

  const apiEvents = useMemo(() => {
    // Build a map of reservation_id → proposal for quick lookup
    const proposalByReservationId = new Map(
      proposalItems.map((p) => [String(p.reservationId ?? p.id), p])
    );

    const scheduleEvents = reservationGroups.flatMap((group) =>
      (group.sessions || []).map((session) => {
        // If this availability has a proposal → show as offer card with candidate info
        if (session.type === "availability") {
          const proposal = proposalByReservationId.get(String(session.id));
          if (proposal) {
            return {
              ...session,
              type: "offer",
              status: "Une séance a été proposée",
              candidate: proposal.candidate || session.candidate,
              candidateAvatar: proposal.candidateAvatar ?? null,
              studentId: proposal.studentId ?? null,
              email: proposal.email ?? "",
              phone: proposal.phone ?? "",
              accentColor: "#60a5fa",
              color: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              proposalId: proposal.id,
              proposalNote: proposal.proposalNote ?? "",
            };
          }
        }
        return session;
      })
    );

    // Add proposals that don't have a matching availability in current week
    const scheduleIds = new Set(scheduleEvents.map((e) => String(e.id)));
    const standaloneProposals = proposalItems.filter(
      (p) => !scheduleIds.has(String(p.reservationId ?? ""))
    );

    return [...scheduleEvents, ...standaloneProposals];
  }, [proposalItems, reservationGroups]);

  const events = controlledEvents ?? internalEvents;
  const setEvents = onEventsChange ?? setInternalEvents;
  const isProposalMode = mode === "proposal";

  const pageTitle = title || (variant === "student" ? "Mes séances" : `Séances de ${weekStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`);
  const pageSubtitle = subtitle || (variant === "student" ? "Consultez les réservations et les disponibilités" : "Gérez vos séances et vos disponibilités");

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return date;
    }),
    [weekStart],
  );

  const monthGrid = useMemo(() => buildMonthGrid(monthCursor, weekStart), [monthCursor, weekStart]);

  const selectedProposalAvailabilities = useMemo(
    () => events.filter((event) => selectedAvailabilityIds.includes(event.id)),
    [events, selectedAvailabilityIds],
  );

  useEffect(() => {
    if (mode === "proposal") {
      setSelectedAvailabilityIds(initialSelectedAvailabilityIds);
    }
  }, [initialSelectedAvailabilityIds, mode]);

  useEffect(() => {
    if (variant !== "monitor" || mode !== "default" || controlledEvents) {
      return;
    }

    const date_1 = formatIsoDate(weekStart);
    const date_2 = formatIsoDate(getEndOfWeek(weekStart));
    // clear stale data immediately so the loading state shows cleanly
    dispatch(clearMonitorSchedule());
    dispatch(fetchMonitorSchedule({ date_1, date_2, all: true, monitor_id: monitorId }));
    dispatch(fetchMonitorProposals({ upcomming: true, status: 1 }));
  }, [controlledEvents, dispatch, mode, monitorId, variant, weekStart]);

  useEffect(() => {
    dispatch(fetchZones());
  }, [dispatch]);

  useEffect(() => {
    if (!currentZoneId) {
      return;
    }

    dispatch(fetchPlacesByZone(currentZoneId));
  }, [currentZoneId, dispatch]);

  useEffect(() => {
    if (variant !== "monitor" || mode !== "default" || controlledEvents) {
      return;
    }

    // setEvents is intentionally omitted from deps — we only want to sync
    // when the API data itself changes, not when the setter reference changes
    setInternalEvents(apiEvents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEvents, controlledEvents, mode, variant]);

  const handleSelectWeek = (date) => {
    const nextWeekStart = getStartOfWeek(date);
    setWeekStart(nextWeekStart);
    setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsCalendarOpen(false);
    setSelectedSlot(null);
  };

  const hasEventsAtSlot = (date, hour) => {
    const isoDate = formatIsoDate(date);
    const startTime = `${`${hour}`.padStart(2, "0")}:00`;
    return events.some((event) => event.date === isoDate && event.startTime === startTime);
  };

  const handleSlotClick = (date, hour) => {
    if (!allowAvailabilityCreation || hasEventsAtSlot(date, hour)) {
      return;
    }

    setSelectedSlot({
      date: formatIsoDate(date),
      startTime: `${`${hour}`.padStart(2, "0")}:00`,
      endTime: `${`${hour + 1}`.padStart(2, "0")}:00`,
      label: `${date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} ${`${hour}`.padStart(2, "0")}:00`,
    });
  };

  const handleCreateAvailability = async (zone, place) => {
    if (!selectedSlot || !zone || !place) {
      return;
    }

    setAvailabilityError("");

    try {
      const payload = {
        data: [{
          start_at: selectedSlot.startTime,
          end_at: selectedSlot.endTime,
          date: selectedSlot.date,
          // The database stores the slot duration here, not the start clock hour.
          hour: Math.max(1, (Number.parseInt(selectedSlot.endTime, 10) - Number.parseInt(selectedSlot.startTime, 10)) || 1),
          is_active: true,
        }],
        lieu_id: place.id ?? place.value ?? null,
        monitor_id: monitorId,
      };

      const response = await dispatch(storeMonitorReservations(payload)).unwrap();
      const created = response?.data?.[0] ?? response?.data?.data?.[0] ?? response?.data?.reservation?.[0] ?? null;

      // Dispatch fetch action to fetch reservations/availabilities and display them properly
      const date_1 = formatIsoDate(weekStart);
      const date_2 = formatIsoDate(getEndOfWeek(weekStart));
      dispatch(fetchMonitorSchedule({ date_1, date_2, all: true, monitor_id: monitorId }));

      setEvents((current) => [
        ...current,
        buildAvailabilityFromSlot(
          {
            ...selectedSlot,
            id: created?.id ?? Date.now(),
          },
          zone,
          place,
        ),
      ]);
      setShowZoneModal(false);
      setSelectedSlot(null);
      setSuccessMessage("Disponibilité créée avec succès");
    } catch (error) {
      setAvailabilityError(error?.message || "Impossible de créer la disponibilité.");
      // Let the location modal remain open and display the API error.
      throw error;
    }
  };

  const handleCancelAvailability = async (availabilityId) => {
    try {
      await dispatch(deleteMonitorReservation({ reservationId: availabilityId })).unwrap();
      const date_1 = formatIsoDate(weekStart);
      const date_2 = formatIsoDate(getEndOfWeek(weekStart));
      dispatch(fetchMonitorSchedule({ date_1, date_2, all: true, monitor_id: monitorId }));
      dispatch(fetchMonitorProposals({ upcomming: true, status: 1 }));
      setSuccessMessage("Disponibilité supprimée avec succès.");
    } catch (error) {
      console.error("Delete availability failed:", error);
    }
    setSelectedAvailabilityIds((current) => current.filter((id) => id !== availabilityId));
    setActiveAvailability(null);
  };

  const handleToggleProposalAvailability = (event) => {
    if (event.type !== "availability") {
      return;
    }

    setSelectedAvailabilityIds((current) => (
      current.includes(event.id)
        ? current.filter((id) => id !== event.id)
        : [...current, event.id]
    ));
  };

  const handleOpenEvent = (event) => {
    if (isProposalMode && event.type === "availability") {
      handleToggleProposalAvailability(event);
      return;
    }

    if (event.type === "availability") {
      setActiveAvailability(event);
      setActiveProposal(null);
      return;
    }

    if (event.type === "offer") {
      setActiveProposal(event);
      setActiveAvailability(null);
      return;
    }
    // console.log("RAW EVENT:", event); 
    setActiveBooking(buildDrawerReservation(event));
    setActiveAvailability(null);
    setActiveProposal(null);
  };

  const handleOpenCancelSessionModal = (booking) => {
    // console.log("BOOKING FROM DRAWER:", booking);
    setActiveBooking(booking);
    setCancelTargetBooking(booking); 

    setShowCancelSessionModal(true);
  };

const handleConfirmSessionCancellation = async ({ justification }) => {
    const trimmedJustification = justification.trim();
    const cancellationReason = trimmedJustification || "Aucune justification fournie.";
    const trainingId = cancelTargetBooking?.trainingId
      ?? cancelTargetBooking?.sourceReservation?.training_id
      ?? cancelTargetBooking?.sourceReservation?.training?.id
      ?? cancelTargetBooking?.training_id
      ?? null;

    if (!trainingId) {
      throw new Error("Training id is missing for this reservation.");
    }

    await dispatch(requestReservationCancellation({
      training_id: trainingId,
      comment: cancellationReason,
    })).unwrap();

    dispatch(markReservationCancellationRequested({
      reservationId: cancelTargetBooking?.sourceEventId ?? cancelTargetBooking?.id,
      trainingId,
      status: "Demande d'annulation envoyée",
      displayStatus: "Demande d'annulation envoyée.",
      cancellationReason,
    }));

    setActiveBooking((current) => (
      current ? buildCancelledReservation(current, cancellationReason) : current
    ));
    setShowCancelSessionModal(false);
    setCancelTargetBooking(null);   // ✅ cleanup
    setSuccessMessage("La demande d'annulation a été envoyée à l'administrateur.");
};
  const handleConfirmProposal = async ({ justification }) => {
    if (selectedProposalAvailabilities.length === 0) {
      return;
    }

    try {
      const studentId = candidate?.studentId ?? candidate?.id ?? candidate?.student_id ?? candidate?.user?.student?.id ?? null;
      const payload = {
        data: selectedProposalAvailabilities.map((availability) => ({
          reservation_id: availability.id,
          student_id: studentId,
          comment: justification || "",
        })),
      };

      await dispatch(createProposals(payload)).unwrap();

      // Reload fresh schedule and proposals from API to show the newly proposed sessions in blue style!
      const date_1 = formatIsoDate(weekStart);
      const date_2 = formatIsoDate(getEndOfWeek(weekStart));
      dispatch(fetchMonitorSchedule({ date_1, date_2, all: true, monitor_id: monitorId }));
      dispatch(fetchMonitorProposals({ upcomming: true, status: 1 }));

      setSelectedAvailabilityIds([]);
      setShowProposeDrawer(false);
      setSuccessMessage("Proposition de séance a envoyé avec succès");
      
      // Redirect to sessions tab after proposal created
      if (onProposalCreated) {
        onProposalCreated();
      }
    } catch (error) {
      alert(error?.message || "Impossible de proposer la séance.");
    }
  };

  const handleCancelProposal = async ({ proposalId, reservationId }) => {
    // Determine if this is a proposal (offer) or plain availability
    const isOffer = proposalId !== null && proposalId !== undefined;

    try {
      if (isOffer) {
        // DELETE /monitor/proposals/{proposalId}
        await dispatch(deleteMonitorProposal({ proposalId })).unwrap();
      } else if (reservationId) {
        // DELETE /monitor/reservations/{reservationId}
        await dispatch(deleteMonitorReservation({ reservationId })).unwrap();
      }

      // Re-fetch both schedule and proposals to refresh calendar
      const date_1 = formatIsoDate(weekStart);
      const date_2 = formatIsoDate(getEndOfWeek(weekStart));
      dispatch(fetchMonitorSchedule({ date_1, date_2, all: true, monitor_id: monitorId }));
      dispatch(fetchMonitorProposals({ upcomming: true, status: 1 }));

      setSuccessMessage(isOffer ? "Proposition annulée avec succès." : "Disponibilité supprimée avec succès.");
    } catch (error) {
      console.error("Cancel failed:", error);
      throw error;
    }

    setActiveProposal(null);
    setActiveAvailability(null);
  };

  const handleOpenProposalFlow = (proposalCandidate) => {
    onOpenProposeSession?.(proposalCandidate);
  };

  const handleOpenAvailabilityProposalFlow = (proposalCandidate, options = {}) => {
    onOpenProposeSession?.(proposalCandidate, options);
  };

  const handleSubmitSchedulingRequest = () => {
    setShowSchedulingDrawer(false);
    setSuccessMessage("Demande envoyée à la direction avec succès.");
  };

  const loading = reservationLoading || proposalLoading;
  const error = reservationError || proposalError;

  return (
    <div className={`ms-shell ms-shell--${variant}`}>
      <section className="ms-topbar">
        <div className="ms-topbar-copy">
          <div className="ms-topbar-icon">
            <IconCalendar />
          </div>
          <div>
            <h2>{pageTitle}</h2>
            <p>{pageSubtitle}</p>
          </div>
        </div>

        <div className="ms-topbar-actions">
          <button
            type="button"
            className="ms-icon-btn"
            aria-label="Ouvrir les paramètres de planification"
            onClick={() => setShowSchedulingDrawer(true)}
          >
            <IconSettings />
          </button>
          <button type="button" className="ms-nav-btn" onClick={() => handleSelectWeek(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 7))} aria-label="Semaine précédente">
            <IconArrowLeft />
          </button>
          <button type="button" className="ms-calendar-trigger" onClick={() => setIsCalendarOpen((open) => !open)}>
            <span>{weekStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            <IconChevronDown />
          </button>
          <button type="button" className="ms-nav-btn" onClick={() => handleSelectWeek(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7))} aria-label="Semaine suivante">
            <IconArrowRight />
          </button>
        </div>

        {isCalendarOpen && (
          <div className="ms-calendar-popover">
            <div className="ms-calendar-popover-header">
              <button
                type="button"
                className="ms-calendar-popover-btn"
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                aria-label="Mois précédent"
              >
                <IconArrowLeft />
              </button>

              <div className="ms-calendar-popover-title">
                <strong>{monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</strong>
                <span>Sélectionnez un jour pour charger sa semaine</span>
              </div>

              <button
                type="button"
                className="ms-calendar-popover-btn"
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                aria-label="Mois suivant"
              >
                <IconArrowRight />
              </button>
            </div>

            <div className="ms-calendar-grid">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className="ms-calendar-weekday">{label}</span>
              ))}

              {monthGrid.map((cell) => (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    "ms-calendar-day",
                    cell.isCurrentMonth ? "" : "ms-calendar-day--muted",
                    cell.isSelectedWeek ? "ms-calendar-day--selected" : "",
                    cell.isSelectedStart ? "ms-calendar-day--selected-edge" : "",
                    cell.isSelectedEnd ? "ms-calendar-day--selected-edge" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleSelectWeek(cell.date)}
                >
                  {cell.date.getDate()}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="ms-calendar-card">
        {variant === "monitor" && mode === "default" && loading && events.length === 0 && (
          <div className="ms-empty-state">
            <h2>Chargement des séances</h2>
            <p>Nous récupérons les réservations et propositions de la semaine sélectionnée.</p>
          </div>
        )}

        {variant === "monitor" && mode === "default" && error && events.length === 0 && (
          <div className="ms-empty-state">
            <h2>Impossible de charger les séances</h2>
            <p>{typeof error === "string" ? error : error?.message || "Une erreur est survenue."}</p>
          </div>
        )}

        <CalWeekView
          weekDates={weekDates}
          events={events}
          onSlotClick={handleSlotClick}
          onPrevWeek={() => handleSelectWeek(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 7))}
          onNextWeek={() => handleSelectWeek(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7))}
          interactive={allowAvailabilityCreation}
          onEventClick={handleOpenEvent}
          isSlotSelected={(date, hour) => selectedSlot?.date === formatIsoDate(date) && selectedSlot?.startTime === `${`${hour}`.padStart(2, "0")}:00`}
          getSlotClassName={(_date, _hour, slotEvents) => (slotEvents.length === 0 ? "ms-calendar-slot" : "")}
          renderEvent={(event, _date, _hour, slotState, meta = {}) => (
            <EventCard
              event={event}
              isSelected={isProposalMode && selectedAvailabilityIds.includes(event.id)}
              selectedCandidatName={candidate?.name ?? ""}
              slotState={slotState}
              isLeadVisibleSlot={meta.isLeadVisibleSlot ?? true}
            />
          )}
          renderSlotOverlay={({ isSelected, events: slotEvents }) => (
            isSelected && slotEvents.length === 0 ? (
              <div className="ms-slot-selected-indicator" aria-hidden="true">
                <IconSlotCalendar />
              </div>
            ) : null
          )}
        />

      {selectedSlot && allowAvailabilityCreation && !activeAvailability && !activeProposal && !activeBooking && !showProposeDrawer && (
          <div className="ms-slot-actions">
            <div className="ms-slot-actions-copy">
              <span>{selectedSlot.label}</span>
            </div>
            <div className="ms-slot-actions-buttons">
              <button type="button" className="ms-danger-btn" onClick={() => setSelectedSlot(null)}>
                Effacer
              </button>
              <button type="button" className="ms-success-btn" onClick={() => setShowZoneModal(true)}>
                Disponible for sessions
              </button>
            </div>
          </div>
        )}

      {availabilityError && (
        <div
          className="ms-error-banner"
          style={{
            margin: "0 0 14px",
            padding: "12px 14px",
            borderRadius: 14,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {availabilityError}
        </div>
      )}

        {isProposalMode && selectedProposalAvailabilities.length > 0 && !activeAvailability && !activeProposal && !activeBooking && !showProposeDrawer && (
          <div className="ms-slot-actions">
            <div className="ms-slot-actions-copy">
              <span>{selectedProposalAvailabilities.length} availabilit{selectedProposalAvailabilities.length > 1 ? "ies" : "y"} selected</span>
            </div>
            <div className="ms-slot-actions-buttons">
              <button type="button" className="ms-danger-btn" onClick={() => setSelectedAvailabilityIds([])}>
                Effacer
              </button>
              <button type="button" className="ms-success-btn" onClick={() => setShowProposeDrawer(true)}>
                Proposer une séance
              </button>
            </div>
          </div>
        )}
      </div>

      {showZoneModal && (
        <ZoneModal
          current={{ zone: currentZone, place: null }}
          zone={currentZone}
          places={places}
          loading={zonesStatus === "loading" || placesStatus === "loading"}
          onSave={handleCreateAvailability}
          onClose={() => setShowZoneModal(false)}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {showSchedulingDrawer && (
        <SchedulingDrawer
          onClose={() => setShowSchedulingDrawer(false)}
          onSubmit={handleSubmitSchedulingRequest}
        />
      )}

      {activeBooking && (
        <BookingDrawer
          booking={activeBooking}
          onClose={() => setActiveBooking(null)}
          onOpenProposeSession={handleOpenProposalFlow}
          onOpenAllSessions={onOpenAllSessions}
          onCancelSession={activeBooking.type === "reservation" ? handleOpenCancelSessionModal : undefined}
        />
      )}

    {showCancelSessionModal && (
      <CancelSessionModal
        onClose={() => {
          setShowCancelSessionModal(false);
          setCancelTargetBooking(null);
        }}
        onConfirm={handleConfirmSessionCancellation}
      />
    )}

      {activeAvailability && (
        <AvailabilityDrawer
          availability={activeAvailability}
          onClose={() => setActiveAvailability(null)}
          onCancelAvailability={() => handleCancelAvailability(activeAvailability.id)}
          onOpenProposeSession={handleOpenAvailabilityProposalFlow}
        />
      )}

      {activeProposal && (
        <ProposeCancelDrawer
          proposition={{
            name: activeProposal.candidate,
            phone: activeProposal.phone,
            media: activeProposal.candidateObj?.media ?? null,
            profilePhotoUrl: activeProposal.candidateObj?.profile_photo_url ?? null,
            candidateAvatarUrl: activeProposal.candidateAvatar ?? null,
            date: parseIsoDate(activeProposal.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            hour: `${activeProposal.startTime} à ${activeProposal.endTime}`,
            location: activeProposal.mapLocation || activeProposal.place,
            mapUrl: activeProposal.mapUrl ?? null,
          }}
          proposalId={activeProposal.proposalId ?? null}
          reservationId={activeProposal.id ?? null}
          onClose={() => setActiveProposal(null)}
          onCancel={handleCancelProposal}
        />
      )}

      {showProposeDrawer && (
        <ProposeSessionDrawer
          candidate={candidate}
          sessions={selectedProposalAvailabilities.map((availability) => ({
            id: availability.id,
            date: parseIsoDate(availability.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            start: availability.startTime,
            end: availability.endTime,
            location: availability.location || availability.place || availability.mapLocation || "",
            reservationId: availability.id,
          }))}
          onClose={() => setShowProposeDrawer(false)}
          onConfirm={handleConfirmProposal}
        />
      )}
    </div>
  );
}
