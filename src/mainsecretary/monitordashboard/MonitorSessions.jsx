import { useEffect, useMemo, useState } from "react";
import "./MonitorSessions.css";
import CalWeekView from "../sessions/Calweekview.jsx";
import ZoneModal from "../sessions/ZoneModal.jsx";
import BookingDrawer from "./BookingDrawer.jsx";
import AvailabilityDrawer from "./AvailabilityDrawer.jsx";
import ProposeCancelDrawer from "./ProposeCancelDrawer.jsx";
import ProposeSessionDrawer from "./ProposeSessionDrawer.jsx";
import CancelSessionModal from "./CancelSessionModal.jsx";
import SchedulingDrawer from "./SchedulingDrawer.jsx";

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
    displayStatus: isCancelled ? "Annulation en cours de traitement." : event.status,
  };
}

function buildCancelledReservation(event, justification) {
  return {
    ...event,
    type: "cancelled",
    status: "cancelled",
    displayStatus: "Annulation en cours de traitement.",
    cancellationReason: justification,
  };
}

function buildAvailabilityFromSlot(slot, zone, place) {
  return {
    id: Date.now(),
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

function EventCard({ event, isSelected = false, selectedCandidatName = "" }) {
  const isAvailability = event.type === "availability";
  const isOffer = event.type === "offer";
  const isCancelled = event.type === "cancelled";
  const showProposalPreview = isAvailability && isSelected && Boolean(selectedCandidatName);

  return (
    <div
      className={[
        "ms-event-card",
        isAvailability ? "ms-event-card--availability" : "",
        isOffer ? "ms-event-card--offer" : "",
        isCancelled ? "ms-event-card--cancelled" : "",
        isSelected ? "ms-event-card--selected" : "",
      ].filter(Boolean).join(" ")}
      style={{
        background: isSelected ? "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)" : event.color,
        "--ms-event-accent": isSelected ? "#2563eb" : event.accentColor,
      }}
    >
      <div className="ms-event-head">
        <span className="ms-event-status">
          {showProposalPreview ? "Proposition sélectionnée" : event.status}
        </span>
      </div>

      {showProposalPreview ? (
        <div className="ms-event-body">
          <span className="ms-event-offer-copy">
            Une séance sera proposée au candidat <strong>{selectedCandidatName}</strong> in <strong>{event.place}</strong>
          </span>
        </div>
      ) : isAvailability ? (
        <div className="ms-event-body">
          <strong>Disponible to</strong>
          <span>{event.place}</span>
          <div className="ms-event-pill">{event.startTime} to {event.endTime}</div>
        </div>
      ) : isOffer ? (
        <div className="ms-event-body">
          <span className="ms-event-offer-copy">
            Une séance a été proposée to candidate <strong>{event.candidate}</strong> in <strong>{event.place}</strong>
          </span>
        </div>
      ) : (
        <div className="ms-event-body">
          <strong>{event.candidate}</strong>
          <span>{event.place}</span>
          <div className="ms-event-pill">{event.startTime} to {event.endTime}</div>
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
  initialSelectedAvailabilityIds = [],
}) {
  const initialWeekStart = useMemo(() => getStartOfWeek(parseIsoDate("2026-05-18")), []);
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [monthCursor, setMonthCursor] = useState(new Date(initialWeekStart.getFullYear(), initialWeekStart.getMonth(), 1));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [internalEvents, setInternalEvents] = useState(DEFAULT_EVENTS);
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

  const handleCreateAvailability = (zone, place) => {
    if (!selectedSlot || !zone || !place) {
      return;
    }

    setEvents((current) => [...current, buildAvailabilityFromSlot(selectedSlot, zone, place)]);
    setShowZoneModal(false);
    setSelectedSlot(null);
    setSuccessMessage("Disponibilité créée avec succès");
  };

  const handleCancelAvailability = (availabilityId) => {
    setEvents((current) => current.filter((event) => event.id !== availabilityId));
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
      return;
    }

    if (event.type === "offer") {
      setActiveProposal(event);
      return;
    }

    setActiveBooking(buildDrawerReservation(event));
  };

  const handleOpenCancelSessionModal = (booking) => {
    setActiveBooking(booking);
    setShowCancelSessionModal(true);
  };

  const handleConfirmSessionCancellation = ({ justification }) => {
    if (!activeBooking?.sourceEventId) {
      return;
    }

    const trimmedJustification = justification.trim();
    const cancellationReason = trimmedJustification || "Aucune justification fournie.";

    setEvents((current) => current.map((event) => (
      event.id === activeBooking.sourceEventId
        ? {
            ...event,
            type: "cancelled",
            status: "Annulation en cours de traitement.",
            cancellationReason,
          }
        : event
    )));

    setActiveBooking((current) => (
      current ? buildCancelledReservation(current, cancellationReason) : current
    ));
    setShowCancelSessionModal(false);
    setSuccessMessage("Annulation de séance réussie.");
  };

  const handleConfirmProposal = ({ justification }) => {
    if (selectedProposalAvailabilities.length === 0) {
      return;
    }

    const selectedIds = new Set(selectedProposalAvailabilities.map((availability) => availability.id));

    setEvents((current) => current.map((event) => (
      selectedIds.has(event.id)
        ? buildProposalFromAvailability(event, candidate, justification)
        : event
    )));

    setSelectedAvailabilityIds([]);
    setShowProposeDrawer(false);
    setSuccessMessage("Proposition de séance a envoyé avec succès");
  };

  const handleCancelProposal = (proposalId) => {
    setEvents((current) => current.map((event) => (
      event.id === proposalId ? restoreAvailabilityFromProposal(event) : event
    )));
    setActiveProposal(null);
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
          renderEvent={(event) => (
            <EventCard
              event={event}
              isSelected={isProposalMode && selectedAvailabilityIds.includes(event.id)}
              selectedCandidatName={candidate?.name ?? ""}
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

        {selectedSlot && allowAvailabilityCreation && (
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

        {isProposalMode && selectedProposalAvailabilities.length > 0 && (
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
          current={{ zone: null, place: null }}
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
          onClose={() => setShowCancelSessionModal(false)}
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
            media: activeProposal.candidateObj?.media ?? activeProposal.candidateObj?.profile_photo_url ?? null,
            profilePhotoUrl: activeProposal.candidateObj?.profile_photo_url ?? null,
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
          onClose={() => setActiveProposal(null)}
          onCancel={() => handleCancelProposal(activeProposal.id)}
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
            location: availability.place,
          }))}
          onClose={() => setShowProposeDrawer(false)}
          onConfirm={handleConfirmProposal}
        />
      )}
    </div>
  );
}



