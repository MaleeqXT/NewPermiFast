import { useMemo, useState } from "react";
import "./AllSessions.css";
import BookingDrawer from "./BookingDrawer.jsx";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

function getInitials(name = "") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function ProgressBar({ percent = 0 }) {
  const total = 14;
  const filled = Math.round((percent / 100) * total);

  return (
    <div className="as-progress-bar">
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className={`as-progress-seg${index < filled ? " as-progress-seg--filled" : ""}`} />
      ))}
    </div>
  );
}

function StatBox({ num, label, accent }) {
  return (
    <div className="as-stat-box" style={{ borderTopColor: accent }}>
      <div className="as-stat-num" style={{ color: accent }}>{num}</div>
      <div className="as-stat-label">{label}</div>
    </div>
  );
}

function buildReservationForDrawer(session, candidate) {
  return {
    ...session,
    date: session.dateLabel,
    timeLabel: `${session.startTime} à ${session.endTime}`,
    contextLabel: "Candidat",
    displayStatus: "La date de la séance est passée",
    candidate: candidate.name,
    email: candidate.email,
    offer: session.offer,
    mapLocation: session.location,
    reminder: session.reminder ?? "Il y a 11 jours",
    lastComment: null,
    commentCount: 0,
  };
}

const FALLBACK_PAST_SESSIONS = [
  {
    id: "fallback-past-1",
    type: "reservation",
    status: "Séance",
    dateLabel: "28 avr. 2026",
    startTime: "07:00",
    endTime: "08:00",
    offer: "Pass permis boîte automatique F5",
    location: "Toulouse, McDonald's Les Arènes",
    reminder: "Il y a 11 jours",
  },
];

export default function AllSessions({
  candidate,
  events = [],
  onBack,
  onOpenProposeSession,
  onOpenCompetence,
  onOpenAllSessions,
}) {
  const [activeTab, setActiveTab] = useState("come");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const candidateData = {
    name: candidate?.name ?? "Keita El Hadji",
    email: candidate?.email ?? "ekeita934@gmail.com",
    progress: candidate?.progress ?? 0,
    seancePasse: candidate?.seancePasse ?? 26,
    seanceAvenir: candidate?.seanceAvenir ?? 0,
    balanceUtilise: candidate?.balanceUtilise ?? 26,
    balanceReste: candidate?.balanceReste ?? 0,
  };

  const pastSessions = useMemo(() => {
    const filtered = events
      .filter((event) => event.type === "reservation" && event.candidate === candidateData.name)
      .map((event) => ({
        id: event.id,
        type: event.type,
        status: event.status,
        dateLabel: new Date(event.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        startTime: event.startTime,
        endTime: event.endTime,
        offer: event.offer,
        location: event.mapLocation || event.place,
        reminder: event.reminder,
      }));

    return filtered.length > 0 ? filtered : FALLBACK_PAST_SESSIONS;
  }, [candidateData.name, events]);

  return (
    <div className="as-page">
      <div className="as-header">
        <button type="button" className="as-back-button" onClick={onBack}>
          <IconArrowLeft />
        </button>
        <h1>Toutes les réservations</h1>
      </div>

      <div className="as-profile-card">
        <div className="as-profile-top">
          <div className="as-avatar">{getInitials(candidateData.name)}</div>
          <div className="as-profile-copy">
            <div className="as-name">{candidateData.name}</div>
            <div className="as-email">{candidateData.email}</div>
          </div>
          <button type="button" className="as-phone-button" aria-label="Appeler le candidat">
            <IconPhone />
          </button>
        </div>

        <div className="as-skill-card">
          <div className="as-skill-header">
            <span>Progression des compétences</span>
            <span>{candidateData.progress}%</span>
          </div>
          <ProgressBar percent={candidateData.progress} />
          <div className="as-stats-grid">
            <StatBox num={candidateData.seancePasse} label="Dernière séance" accent="#f59e0b" />
            <StatBox num={candidateData.seanceAvenir} label="Séance à venir" accent="#3b82f6" />
            <StatBox num={candidateData.balanceUtilise} label="Solde utilisé" accent="#f59e0b" />
            <StatBox num={candidateData.balanceReste} label="Solde restant" accent="#9bf6a1" />
          </div>
        </div>
      </div>

      <div className="as-content-card">
        <div className="as-tabs">
          <button
            type="button"
            className={`as-tab${activeTab === "come" ? " as-tab--active" : ""}`}
            onClick={() => setActiveTab("come")}
          >
            À venir
          </button>
          <button
            type="button"
            className={`as-tab${activeTab === "past" ? " as-tab--active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Passées
          </button>
        </div>

        <div className="as-list">
          {activeTab === "come" && (
            <div className="as-empty">Aucune séance à venir.</div>
          )}

          {activeTab === "past" && pastSessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className="as-session-row"
              onClick={() => setSelectedBooking(buildReservationForDrawer(session, candidateData))}
            >
              <div className="as-session-top">
                <strong>{session.dateLabel}</strong>
                <span>{session.startTime} {session.endTime}</span>
              </div>
              <div className="as-session-offer">{session.offer}</div>
            </button>
          ))}
        </div>

        <div className="as-footer">
          <button
            type="button"
            className="as-propose-button"
            onClick={() => onOpenProposeSession?.(candidateData)}
          >
            Proposer une séance
          </button>
        </div>
      </div>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onOpenProposeSession={onOpenProposeSession}
          onOpenCompetence={onOpenCompetence}
          onOpenAllSessions={onOpenAllSessions}
        />
      )}
    </div>
  );
}
