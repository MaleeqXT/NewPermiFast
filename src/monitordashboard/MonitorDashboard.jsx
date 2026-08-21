import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MonitorDashboard.css";
import logoBlack from "../assets/logo-black.svg";
import BookingDrawer from "./BookingDrawer.jsx";
import MonitorSessions, { SuccessModal } from "./MonitorSessions.jsx";
import ProposeSession from "./ProposeSession.jsx";
import MonitorCompetence from "./MonitorCompetence.jsx";
import AllSessions from "./AllSessions.jsx";
import NoticeDrawer from "./NoticeDrawer.jsx";
import SessionList from "./SessionList.jsx";
import SettingsPage from "./SettingsPage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import CandidatesPage from "./CandidatesPage.jsx";
import CandidateProfileDrawer from "./CandidateProflileDrawer.jsx";
import ProposedSessionsList from "./ProposedSessionsList.jsx";
import ProposeCancelDrawer from "./ProposeCancelDrawer.jsx";
import LocationsPage from "./LocationsPage.jsx";
import InvoicesPage from "./InvoicesPage.jsx";
import CancelledSessionsPage from "./CancelledSessionsPage.jsx";
import VehiclesAndDocumentsPage from "./VehiclesAndDocumentsPage.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/reducers/authReducer.jsx";
import {
  fetchMonitorSchedule,
  selectMonitorScheduleError,
  selectMonitorScheduleGroups,
  selectMonitorScheduleLoading,
} from "../redux/reducers/monitorScheduleSlice.jsx";
import { selectMonitorProposalsItems } from "../redux/reducers/monitorProposalsSlice.jsx";
import { fetchMonitorProfile, selectMonitorProfile } from "../redux/reducers/monitorProfileSlice.jsx";

 
const resolveDisplayName = (user) => {
  if (!user) return "Admin";
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.name || "Admin";
};

const resolveDisplayAvatar = (user) => {
  if (!user) return null;
  return user.media ? `${import.meta.env.VITE_API_URL}/storage/${user.media}` : user.profile_photo_url || null;
};

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

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

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconSidebarToggle = ({ collapsed }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {collapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
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

const NAV_ITEMS = [
  { id: "accueil", label: "Accueil", icon: <IconHome /> },
  { id: "sessions", label: "Séances", icon: <IconCalendar /> },
  { id: "settings", label: "Paramètres", icon: <IconSettings /> },
];

const SESSIONS_DATA = [
  {
    isoDate: "2026-05-18",
    dateLabel: "18 mai 2026",
    sessions: [
      {
        id: 1,
        status: "passed",
        time: "07:00 - 08:00",
        title: "Séance de contrôle du permis de conduire",
        candidate: "Demba Camara",
        location: "At 32 Boulevard Andre Netwiller, 31200 Toulouse, TOULOUSE",
        drawer: {
          status: "passed",
          date: "Ven 08 mai 2026",
          timeLabel: "07:00 à 08:00",
          reminder: "il y a 11 jours",
          mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
          contextLabel: "Candidat",
          candidate: "Demba Camara",
          email: "demba.camara@gmail.com",
          offer: "Séance de contrôle du permis de conduire",
          lastComment: null,
          commentCount: 0,
        },
      },
      {
        id: 2,
        status: "cancelled",
        time: "08:00 - 09:00",
        title: "Séance de contrôle du permis de conduire",
        candidate: "Angelina Chiarella",
        location: "Reason: Appointment",
        drawer: {
          status: "cancelled",
          date: "Ven 08 mai 2026",
          timeLabel: "09:00 à 10:00",
          reminder: "il y a 11 jours",
          cancellationReason: "Appointment",
          mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
          contextLabel: "Candidat",
          candidate: "Angelina Chiarella",
          email: "angelina.chiarella@icloud.com",
          offer: "Pass permis, séance de contrôle BA",
          lastComment: null,
          commentCount: 0,
        },
      },
      {
        id: 3,
        status: "passed",
        time: "11:00 - 12:00",
        title: "Pass permis automatique F20",
        candidate: "Liudmila LACOMBE",
        location: "At 32 Boulevard Andre Netwiller, 31200 Toulouse, TOULOUSE",
        drawer: {
          status: "passed",
          date: "Ven 08 mai 2026",
          timeLabel: "11:00 à 12:00",
          reminder: "il y a 11 jours",
          mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
          contextLabel: "Candidat",
          candidate: "Liudmila LACOMBE",
          email: "liudmila.lacombe@gmail.com",
          offer: "Pass permis automatique F20",
          lastComment: null,
          commentCount: 0,
        },
      },
      {
        id: 4,
        status: "passed",
        time: "12:00 - 13:00",
        title: "Forfait BM 42 heures à temps plein",
        candidate: "Holidays",
        location: "At 32 Boulevard Andre Netwiller, 31200 Toulouse, TOULOUSE",
        drawer: {
          status: "passed",
          date: "Ven 08 mai 2026",
          timeLabel: "12:00 à 13:00",
          reminder: "il y a 11 jours",
          mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
          contextLabel: "Candidat",
          candidate: "Holidays",
          email: "holidays.package@gmail.com",
          offer: "Forfait BM 42 heures à temps plein",
          lastComment: null,
          commentCount: 0,
        },
      },
      {
        id: 5,
        status: "cancelled",
        time: "13:00 - 14:00",
        title: "Séance de contrôle du permis de conduire",
        candidate: "Mouslim Djantaev",
        location: "Reason: I",
        drawer: {
          status: "cancelled",
          date: "Ven 08 mai 2026",
          timeLabel: "13:00 à 14:00",
          reminder: "il y a 11 jours",
          cancellationReason: "I",
          mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
          contextLabel: "Candidat",
          candidate: "Mouslim Djantaev",
          email: "mouslim.djantaev@gmail.com",
          offer: "Séance de contrôle du permis de conduire",
          lastComment: null,
          commentCount: 0,
        },
      },
    ],
  },
  {
    isoDate: "2026-05-20",
    dateLabel: "20 mai 2026",
    sessions: [
      {
        id: 6,
        status: "passed",
        time: "09:00 - 10:00",
        title: "Pass permis automatique F5",
        candidate: "Keita El hadji",
        location: "In Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit, TOULOUSE",
        drawer: {
          status: "passed",
          date: "Ven 08 mai 2026",
          timeLabel: "09:00 à 10:00",
          reminder: "il y a 11 jours",
          mapLocation: "TOULOUSE, Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit",
          contextLabel: "Candidat",
          candidate: "Keita El hadji",
          email: "ekeita934@gmail.com",
          offer: "Pass permis automatique F5",
          lastComment: "Exam 8:30 AM BA Colomiers",
          commentCount: 1,
        },
      },
      {
        id: 7,
        status: "passed",
        time: "10:00 - 11:00",
        title: "Pass permis manuel F5",
        candidate: "Omar Dhouioui",
        location: "In Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit, TOULOUSE",
        drawer: {
          status: "passed",
          date: "Ven 08 mai 2026",
          timeLabel: "10:00 à 11:00",
          reminder: "il y a 11 jours",
          mapLocation: "TOULOUSE, Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit",
          contextLabel: "Candidat",
          candidate: "Omar Dhouioui",
          email: "omar.dhouioui@gmail.com",
          offer: "Pass permis manuel F5",
          lastComment: null,
          commentCount: 0,
        },
      },
    ],
  },
  {
    isoDate: "2026-05-27",
    dateLabel: "27 mai 2026",
    sessions: [
      { id: 5, status: "upcoming", time: "11:00 - 12:00", title: "Révision de conduite automatique", candidate: "Sarah Dumas", location: "À Toulouse, point de rendez-vous central, TOULOUSE" },
    ],
  },
];

const IconCheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#22c55e" />
    <polyline points="7 12 10.5 15.5 17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconXCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#e11d48" />
    <path d="M9 9 15 15" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M15 9 9 15" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IconCircleEmpty = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2" />
  </svg>
);

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

function shiftWeek(date, amount) {
  const shifted = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  shifted.setDate(shifted.getDate() + amount * 7);
  return getStartOfWeek(shifted);
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

function getWeekRangeLabel(weekStart) {
  const weekEnd = getEndOfWeek(weekStart);
  return `${weekStart.toLocaleDateString("en-CA")} to ${weekEnd.toLocaleDateString("en-CA")}`;
}

function getMonitorInitials(name) {
  return name
     
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPedagogicalEntryKey(kind, id) {
  return id ? `${kind}-${id}` : null;
}

function DashboardOverview({
  weekStart,
  onPreviousWeek,
  onNextWeek,
  onSelectWeek,
  isCalendrierOpen,
  onToggleCalendrier,
  monitorName,
  monitorAvatar,
}) {
  const [monthCursor, setMonthCursor] = useState(new Date(weekStart.getFullYear(), weekStart.getMonth(), 1));
  const monthGrid = useMemo(() => buildMonthGrid(monthCursor, weekStart), [monthCursor, weekStart]);
  const weekEnd = getEndOfWeek(weekStart);

  const handleSelectDay = (date) => {
    onSelectWeek(getStartOfWeek(date));
    onToggleCalendrier(false);
    setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <section className="md-page-overview">
      <div className="md-page-date-card">
        <div className="md-page-date-monitor">
          <div className="md-page-date-avatar">
            {monitorAvatar ? (
              <img src={monitorAvatar} alt={monitorName} className="md-monitor-avatar-img" />
            ) : (
              <span className="md-monitor-avatar-initials">{getMonitorInitials(monitorName)}</span>
            )}
          </div>

          <div className="md-page-date-copy">
            <span className="md-page-date-month">
              {weekStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <span className="md-page-date-value">
              {weekStart.toLocaleDateString("en-US", { day: "numeric", month: "short" })} - {weekEnd.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="md-page-date-actions">
          <button type="button" className="md-week-nav-btn" onClick={onPreviousWeek} aria-label="Semaine précédente">
            <IconArrowLeft />
          </button>

          <button type="button" className="md-calendar-trigger" onClick={() => onToggleCalendrier(!isCalendrierOpen)}>
            <span className="md-calendar-trigger-icon">
              <IconCalendar />
            </span>
            <span className="md-calendar-trigger-copy">
              <span className="md-calendar-trigger-label">Calendrier</span>
              <span className="md-calendar-trigger-range">{getWeekRangeLabel(weekStart)}</span>
            </span>
          </button>

          <button type="button" className="md-week-nav-btn" onClick={onNextWeek} aria-label="Semaine suivante">
            <IconArrowRight />
          </button>
        </div>

        {isCalendrierOpen && (
          <div className="md-calendar-popover">
            <div className="md-calendar-popover-header">
              <button
                type="button"
                className="md-calendar-month-btn"
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                aria-label="Mois précédent"
              >
                <IconArrowLeft />
              </button>

              <div className="md-calendar-popover-title">
                <h3>{monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
                <p>{getWeekRangeLabel(weekStart)}</p>
              </div>

              <button
                type="button"
                className="md-calendar-month-btn"
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                aria-label="Mois suivant"
              >
                <IconArrowRight />
              </button>
            </div>

            <div className="md-calendar-grid">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className="md-calendar-weekday">{label}</span>
              ))}

              {monthGrid.map((cell) => (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    "md-calendar-day",
                    cell.isCurrentMonth ? "" : "md-calendar-day--muted",
                    cell.isSelectedWeek ? "md-calendar-day--selected" : "",
                    cell.isSelectedStart ? "md-calendar-day--selected-start" : "",
                    cell.isSelectedEnd ? "md-calendar-day--selected-end" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleSelectDay(cell.date)}
                >
                  {cell.date.getDate()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyWeekState() {
  return (
    <div className="md-empty-state">
      <h2>Aucune réservation</h2>
      <p>Aucune réservation pour cette semaine. Sélectionnez une autre semaine dans le calendrier pour voir davantage de séances.</p>
    </div>
  );
}

function TabAccueil({ groups, onSelectBooking, loading = false, error = null }) {
  if (loading && groups.length === 0) {
    return (
      <div className="md-content-wrap">
        <div className="md-empty-state">
          <h2>Chargement du planning</h2>
          <p>Nous récupérons les réservations de la semaine sélectionnée.</p>
        </div>
      </div>
    );
  }

  if (error && groups.length === 0) {
    return (
      <div className="md-content-wrap">
        <div className="md-empty-state">
          <h2>Impossible de charger le planning</h2>
          <p>{typeof error === "string" ? error : error?.message || "Une erreur est survenue."}</p>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="md-content-wrap">
        <EmptyWeekState />
      </div>
    );
  }

  return (
    <div className="md-content-wrap">
      {groups.map((group) => (
        <div key={group.isoDate} className="md-day-group">
          <div className="md-day-header">
            <div className="md-day-dot" />
            <p className="md-day-label">
              Le <strong>{group.dateLabel},</strong> vous avez <strong>{group.sessions.length}</strong> séances disponibles ce jour :
            </p>
          </div>

          <div className="md-session-list">
            {group.sessions.map((session) => {
              const isCancellationRequested = Boolean(session.cancellationRequested || session.pendingCancellation);
              const isCancelled = session.status === "cancelled";
              const isPassed = session.status === "passed";
              const locationString = `À ${session.location}${session.zone ? ` , ${session.zone}` : ""}`;

              return (
                <div key={session.id} className="md-session-row">
                  <div className="md-session-icon">
                    {isCancelled ? (
                      <IconXCircle />
                    ) : isPassed ? (
                      <IconCheckCircle />
                    ) : session.candidateAvatar ? (
                      <img
                        src={session.candidateAvatar}
                        className="md-session-avatar-bullet"
                        alt={session.candidate}
                      />
                    ) : (
                      <div className="md-session-avatar-fallback-bullet">
                        {((session.candidate ?? "?").charAt(0) || "?").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`md-session-card md-session-card-button ${
                      isCancelled ? "md-session-card--cancelled" : isPassed ? "md-session-card--passed" : ""
                    }`}
                    onClick={() => onSelectBooking(session)}
                  >
                    <div className="md-session-card-top">
                      {isCancellationRequested ? (
                        <span className="md-session-status md-session-status--cancelled">
                          Demande d’annulation envoyée.
                        </span>
                      ) : isCancelled ? (
                        <span className="md-session-status md-session-status--cancelled">
                          Annulation en cours de traitement.
                        </span>
                      ) : (
                        <>
                          <span className={`md-session-status ${isPassed ? "md-session-status--passed-text" : "md-session-status--upcoming-loc"}`}>
                            {isPassed ? "La séance a été passée" : locationString}
                          </span>
                          <span className="md-session-time">{session.time}</span>
                        </>
                      )}
                    </div>
                    {(isCancelled || isCancellationRequested) && (
                      <div className="md-session-card-reason">
                        {session.cancellationReason || session.location}
                      </div>
                    )}
                    <div className="md-session-card-body">
                      <p className="md-session-title">
                        <strong>{session.title}</strong> avec le candidat <strong>{session.candidate}</strong>
                      </p>
                      {!isCancelled && !isCancellationRequested && isPassed && (
                        <p className="md-session-loc">{locationString}</p>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabSettings({
  view,
  onViewChange,
  onClose,
  user,
  onSelectCandidate,
  proposals,
  onSelectProposal,
  onLogout,
  monitorId,
}) {
  if (view === "profile") {
    return <ProfilePage monitorId={monitorId} onBack={() => onViewChange("settings")} />;
  }

  if (view === "candidates") {
    return (
      <CandidatesPage
        onBack={() => onViewChange("settings")}
        onSelect={onSelectCandidate}
      />
    );
  }

  if (view === "proposed") {
    return (
      <ProposedSessionsList
        onBack={() => onViewChange("settings")}
        onSelectProposal={onSelectProposal}
      />
    );
  }

  if (view === "locations") {
    return <LocationsPage user={user} onBack={() => onViewChange("settings")} />;
  }

  if (view === "invoices") {
    return <InvoicesPage onBack={() => onViewChange("settings")} />;
  }

  if (view === "cancelledSessions") {
    return <CancelledSessionsPage onBack={() => onViewChange("settings")} />;
  }

  if (view === "vehiclesAndDocuments") {
    return <VehiclesAndDocumentsPage onBack={() => onViewChange("settings")} />;
  }

  return (
    <SettingsPage
      user={user}
      onClose={onClose}
      onLogout={onLogout}
      onNavigate={(target) => {
        if (target === "profile") {
          onViewChange("profile");
        }

        if (target === "Mes candidats") {
          onViewChange("candidates");
        }

        if (target === "Mes séances proposées") {
          onViewChange("proposed");
        }

        if (target === "Lieux") {
          onViewChange("locations");
        }

        if (target === "Facturation") {
          onViewChange("invoices");
        }

        if (target === "Mes séances annulées") {
          onViewChange("cancelledSessions");
        }

        if (target === "Véhicules et documents") {
          onViewChange("vehiclesAndDocuments");
        }
      }}
    />
  );
}

export default function MonitorDashboard({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  // Admin preview opens this dashboard with the selected monitor in route state.
  // A direct monitor login has no target and therefore uses its own account.
  const viewedMonitorId = location.state?.monitor?.monitor?.id
    ?? (location.state?.monitor?.user_id ? location.state.monitor.id : null)
    ?? location.state?.monitor_id
    ?? null;
  const viewedMonitor = location.state?.monitor?.monitor
    ?? (location.state?.monitor?.user_id ? location.state.monitor : null);
  const displayUser = viewedMonitor?.user ?? location.state?.monitor ?? currentUser;
  const fetchedMonitorProfile = useSelector(selectMonitorProfile);
  const scheduleGroups = useSelector(selectMonitorScheduleGroups);
  const scheduleLoading = useSelector(selectMonitorScheduleLoading);
  const scheduleError = useSelector(selectMonitorScheduleError);
  const proposalItems = useSelector(selectMonitorProposalsItems);
  const [activeTab, setActiveTab] = useState("sessions");
  const [collapsed, setCollapsed] = useState(false);
  const initialWeekStart = useMemo(() => getStartOfWeek(new Date()), []);
  const [selectedWeekStart, setSelectedWeekStart] = useState(initialWeekStart);
  const [isCalendrierOpen, setIsCalendrierOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewListBooking, setReviewListBooking] = useState(null);
  const [noticeTarget, setNoticeTarget] = useState(null);
  const [reviewBySessionId, setReviewBySessionId] = useState({});
  const [pedagogicalByEntryId, setPedagogicalByEntryId] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [proposeCandidate, setProposeCandidate] = useState(null);
  const [proposeSelection, setProposeSelection] = useState({ preselectedAvailabilityIds: [] });
  const [competenceCandidate, setCompetenceCandidate] = useState(null);
  const [allSessionsCandidate, setAllSessionsCandidate] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [settingsView, setSettingsView] = useState("settings");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const monitorName = resolveDisplayName(fetchedMonitorProfile ?? displayUser);
  const monitorAvatar = resolveDisplayAvatar(fetchedMonitorProfile ?? displayUser);

  useEffect(() => {
    dispatch(fetchMonitorProfile(viewedMonitorId));
  }, [dispatch, viewedMonitorId]);

  useEffect(() => {
    const date_1 = formatIsoDate(selectedWeekStart);
    const date_2 = formatIsoDate(getEndOfWeek(selectedWeekStart));
    dispatch(fetchMonitorSchedule({ date_1, date_2, all: true, monitor_id: viewedMonitorId }));
  }, [dispatch, selectedWeekStart, viewedMonitorId]);

  // Keep sessionEvents (used by ProposeSession & AllSessions) in sync with Redux
  useEffect(() => {
    const allEvents = [
      ...scheduleGroups.flatMap((g) => g.sessions || []),
      ...proposalItems,
    ];
    setSessionEvents(allEvents);
  }, [scheduleGroups, proposalItems]);

  const handleOpenProposeSession = (candidate, options = {}) => {
    setProposeCandidate(candidate);
    setProposeSelection({
      preselectedAvailabilityIds: options.preselectedAvailabilityIds ?? [],
    });
    setCompetenceCandidate(null);
    setAllSessionsCandidate(null);
    setActiveTab("accueil");
    setIsCalendrierOpen(false);
    setSelectedBooking(null);
    setReviewListBooking(null);
  };

  const handleOpenCompetence = (candidate) => {
    setCompetenceCandidate(candidate);
    setProposeCandidate(null);
    setProposeSelection({ preselectedAvailabilityIds: [] });
    setAllSessionsCandidate(null);
    setActiveTab("accueil");
    setIsCalendrierOpen(false);
    setSelectedBooking(null);
    setReviewListBooking(null);
  };

  const handleOpenAllSessions = (candidate) => {
    setAllSessionsCandidate(candidate);
    setProposeCandidate(null);
    setProposeSelection({ preselectedAvailabilityIds: [] });
    setCompetenceCandidate(null);
    setActiveTab("accueil");
    setIsCalendrierOpen(false);
    setSelectedBooking(null);
    setReviewListBooking(null);
  };

  const handleSelectWelcomeBooking = (session) => {
    setSelectedBooking({
      ...session.drawer,
      reviewSessionId: session.id,
      reviewSession: session,
    });
  };

  const handleSaveNotice = ({ status, note }) => {
    if (!noticeTarget?.sessionId) {
      return;
    }

    setReviewBySessionId((current) => ({
      ...current,
      [noticeTarget.sessionId]: { status, note },
    }));
    setNoticeTarget(null);
        setSuccessMessage("OpÃ©ration effectuÃ©e avec succÃ¨s.");
  };

  const handleSavePedagogicalReview = (entryId, nextReview) => {
    if (!entryId) {
      return;
    }

    setPedagogicalByEntryId((current) => ({
      ...current,
      [entryId]: nextReview,
    }));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/loginpage", { replace: true });
  };

  const welcomeGroups = useMemo(
    () => scheduleGroups,
    [scheduleGroups],
  );

  const reviewSessions = useMemo(
    () => scheduleGroups.flatMap((group) => group.sessions.map((session) => ({
      id: session.id,
      date: session.drawer?.date ?? group.dateLabel,
      with: session.candidate,
      note: "",
      review: null,
      timeLabel: session.drawer?.timeLabel ?? `${session.startTime} to ${session.endTime}`,
      sourceSession: session,
    }))),
    [scheduleGroups],
  );

  const proposedSessions = useMemo(
    () => proposalItems.map((proposal) => ({
      id: proposal.id,
      date: proposal.date ? parseIsoDate(proposal.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : "",
      status: proposal.status || "Proposition",
      candidateName: proposal.candidate,
      candidateEmail: proposal.email,
      phone: proposal.phone,
      location: proposal.place || proposal.mapLocation || "",
      time: `${proposal.startTime || ""} to ${proposal.endTime || ""}`.trim(),
      offer: proposal.offer || "",
      pedagogicalReview: pedagogicalByEntryId[getPedagogicalEntryKey("proposal", proposal.id)],
    })),
    [pedagogicalByEntryId, proposalItems],
  );

  const handleCancelProposedSession = (proposalId) => {
    setSessionEvents((current) => current.map((event) => (
      event.id === proposalId
        ? {
            ...event,
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
            place: event.sourceAvailability?.place || event.place,
            mapLocation: event.sourceAvailability?.mapLocation || event.mapLocation || event.place,
            reminder: event.sourceAvailability?.reminder || event.reminder,
            proposalNote: undefined,
            sourceAvailability: undefined,
          }
        : event
    )));
    setSelectedProposal(null);
  };

  return (
    <div className="md-overlay">
      <aside className={`md-sidebar ${collapsed ? "md-sidebar--collapsed" : ""}`}>
        <div className="md-sidebar-top">
          <div className="md-sidebar-brand">
            <img src={logoBlack} alt="Easy Monitor logo" className="md-sidebar-logo" />
            {!collapsed && (
              <span className="md-sidebar-brand-name">
                Easy <span className="md-sidebar-brand-accent">Monitor</span>
              </span>
            )}
          </div>

          <button
            type="button"
            className="md-sidebar-toggle"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Développer la barre latérale" : "Réduire la barre latérale"}
          >
            <IconSidebarToggle collapsed={collapsed} />
          </button>
        </div>

        {!collapsed && (
          <button
            type="button"
            className="md-monitor-card"
            onClick={() => {
              setActiveTab("settings");
              setSettingsView("profile");
              setIsCalendrierOpen(false);
              setProposeCandidate(null);
              setProposeSelection({ preselectedAvailabilityIds: [] });
              setCompetenceCandidate(null);
              setAllSessionsCandidate(null);
              setReviewListBooking(null);
              setSelectedBooking(null);
            }}
          >
            <div className="md-monitor-avatar">
              {monitorAvatar ? (
                <img src={monitorAvatar} alt={monitorName} className="md-monitor-avatar-img" />
              ) : (
                <span className="md-monitor-avatar-initials">{getMonitorInitials(monitorName)}</span>
              )}
            </div>
            <span className="md-monitor-name">{monitorName}</span>
          </button>
        )}

        <nav className="md-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`md-nav-item ${activeTab === item.id ? "md-nav-item--active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === "settings") {
                  setSettingsView("settings");
                }
                setIsCalendrierOpen(false);
                setProposeCandidate(null);
                setProposeSelection({ preselectedAvailabilityIds: [] });
                setCompetenceCandidate(null);
                setAllSessionsCandidate(null);
                setReviewListBooking(null);
                setSelectedBooking(null);
                
              }}
              title={collapsed ? item.label : ""}
            >
              <span className="md-nav-icon">{item.icon}</span>
              {!collapsed && <span className="md-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="md-main">
        <header className="md-header">
          <div className="md-header-right">
            <div className="md-superadmin-pill" role="button" tabIndex={0}>
              <div className="md-superadmin-avatar">
                {monitorAvatar ? (
                  <img src={monitorAvatar} alt={monitorName} className="md-superadmin-avatar-img" />
                ) : (
                  getMonitorInitials(monitorName)
                )}
              </div>
              <span>{monitorName}</span>
              <IconChevronDown />
            </div>
            <button type="button" className="md-leave-btn" onClick={onClose}>
              Quitter
            </button>
          </div>
        </header>

        <main className="md-content">
          {activeTab === "accueil" && !proposeCandidate && !competenceCandidate && !allSessionsCandidate && !reviewListBooking && (
            <>
              <DashboardOverview
                weekStart={selectedWeekStart}
                onPreviousWeek={() => setSelectedWeekStart((current) => shiftWeek(current, -1))}
                onNextWeek={() => setSelectedWeekStart((current) => shiftWeek(current, 1))}
              onSelectWeek={setSelectedWeekStart}
              isCalendrierOpen={isCalendrierOpen}
              onToggleCalendrier={setIsCalendrierOpen}
              monitorName={monitorName}
              monitorAvatar={monitorAvatar}
            />
              <TabAccueil
                groups={welcomeGroups}
                onSelectBooking={handleSelectWelcomeBooking}
                loading={scheduleLoading}
                error={scheduleError}
              />
            </>
          )}
          {activeTab === "accueil" && reviewListBooking && (
            <SessionList
              sessions={reviewSessions}
              onBack={() => setReviewListBooking(null)}
              onSelect={(session) => {
                setNoticeTarget({
                  sessionId: session.id,
                  session: {
                    date: session.date,
                    timeLabel: session.timeLabel,
                  },
                });
              }}
            />
          )}
          {activeTab === "accueil" && proposeCandidate && (
            <ProposeSession
              candidate={proposeCandidate}
              onBack={() => {
                setProposeCandidate(null);
                setProposeSelection({ preselectedAvailabilityIds: [] });
              }}
              events={sessionEvents}
              onEventsChange={setSessionEvents}
              onOpenProposeSession={handleOpenProposeSession}
              onProposalCreated={() => setActiveTab("sessions")}
              initialSelectedAvailabilityIds={proposeSelection.preselectedAvailabilityIds}
            />
          )}
          {activeTab === "accueil" && competenceCandidate && (
            <MonitorCompetence onBack={() => setCompetenceCandidate(null)} />
          )}
          {activeTab === "accueil" && allSessionsCandidate && (
            <AllSessions
              candidate={allSessionsCandidate}
              events={sessionEvents}
              onBack={() => setAllSessionsCandidate(null)}
              onOpenProposeSession={handleOpenProposeSession}
              onOpenCompetence={handleOpenCompetence}
              onOpenAllSessions={handleOpenAllSessions}
            />
          )}
          {activeTab === "sessions" && (
            <MonitorSessions
              monitorId={viewedMonitorId}
              onOpenProposeSession={handleOpenProposeSession}
              onOpenAllSessions={handleOpenAllSessions}
              onProposalCreated={() => setActiveTab("sessions")}
            />
          )}
          {activeTab === "settings" && (
            <TabSettings
              view={settingsView}
              onViewChange={setSettingsView}
              onClose={() => setActiveTab("accueil")}
              user={currentUser}
              onSelectCandidate={setSelectedCandidate}
              proposals={proposedSessions}
              onSelectProposal={setSelectedProposal}
              onLogout={handleLogout}
              monitorId={viewedMonitorId}
            />
          )}
        </main>
      </div>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onOpenProposeSession={handleOpenProposeSession}
          onOpenCompetence={handleOpenCompetence}
          onOpenAllSessions={handleOpenAllSessions}
          review={reviewBySessionId[selectedBooking.reviewSessionId]}
          pedagogicalReview={pedagogicalByEntryId[getPedagogicalEntryKey("session", selectedBooking.reviewSessionId)]}
          onSavePedagogicalReview={(nextReview) => handleSavePedagogicalReview(getPedagogicalEntryKey("session", selectedBooking.reviewSessionId), nextReview)}
          primaryActionLabel={
            reviewBySessionId[selectedBooking.reviewSessionId]
              ? "Appel immédiat"
              : "Ajouter un avis et confirmer la session"
          }
          onOpenNotice={
            reviewBySessionId[selectedBooking.reviewSessionId]
              ? undefined
              : () => setNoticeTarget({
                  sessionId: selectedBooking.reviewSessionId,
                  session: selectedBooking,
                })
          }
          onOpenReviewList={() => {
            setReviewListBooking(selectedBooking);
            setSelectedBooking(null);
          }}
        />
      )}

      {noticeTarget && (
        <NoticeDrawer
          session={noticeTarget.session}
          initialReview={reviewBySessionId[noticeTarget.sessionId]}
          onClose={() => setNoticeTarget(null)}
          onSave={handleSaveNotice}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {selectedCandidate && (
        <CandidateProfileDrawer
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onPropose={(candidate) => {
            setSelectedCandidate(null);
            handleOpenProposeSession(candidate);
          }}
          onOpenCompetence={(candidate) => {
            setSelectedCandidate(null);
            handleOpenCompetence(candidate);
          }}
          onOpenAllSessions={(candidate) => {
            setSelectedCandidate(null);
            handleOpenAllSessions(candidate);
            
          }}
        />
      )}

      {selectedProposal && (
        <ProposeCancelDrawer
          proposition={{
            name: selectedProposal.candidateName,
            phone: selectedProposal.phone,
            date: parseIsoDate(selectedProposal.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            hour: selectedProposal.time,
            location: selectedProposal.location,
          }}
          onClose={() => setSelectedProposal(null)}
          onCancel={() => handleCancelProposedSession(selectedProposal.id)}
        />
      )}
    </div>
  );
}
