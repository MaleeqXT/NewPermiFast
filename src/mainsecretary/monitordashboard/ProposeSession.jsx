import "./ProposeSession.css";
import MonitorSessions from "./MonitorSessions.jsx";

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

const SEGMENTS = 14;

function ProgressBar({ percent = 0 }) {
  const filled = Math.round((percent / 100) * SEGMENTS);

  return (
    <div className="ps-progress-bar">
      {Array.from({ length: SEGMENTS }, (_, index) => (
        <div key={index} className={`ps-progress-seg${index < filled ? " ps-progress-seg--filled" : ""}`} />
      ))}
    </div>
  );
}

function StatBox({ num, label, accent }) {
  return (
    <div className="ps-stat-box" style={{ borderTopColor: accent }}>
      <div className="ps-stat-num" style={{ color: accent }}>{num}</div>
      <div className="ps-stat-label">{label}</div>
    </div>
  );
}

function CandidateCard({ candidate }) {
  const data = {
    name: candidate?.name ?? "Keita El hadji",
    email: candidate?.email ?? "ekeita934@gmail.com",
    phone: candidate?.phone ?? "0758853165",
    progress: candidate?.progress ?? 0,
    seancePasse: candidate?.seancePasse ?? 26,
    seanceAvenir: candidate?.seanceAvenir ?? 0,
    balanceUtilise: candidate?.balanceUtilise ?? 26,
    balanceReste: candidate?.balanceReste ?? 0,
  };

  return (
    <div className="ps-candidate-card">
      <div className="ps-identity-row">
        <div className="ps-avatar">{getInitials(data.name)}</div>
        <div className="ps-identity-info">
          <div className="ps-name">{data.name}</div>
          <div className="ps-email">{data.email}</div>
        </div>
        <button type="button" className="ps-phone-btn" aria-label="Appeler le candidat">
          <IconPhone />
        </button>
      </div>

      <div className="ps-progress-section">
        <div className="ps-progress-header">
          <span className="ps-progress-title">Progression des compétences</span>
          <span className="ps-progress-pct">{data.progress}%</span>
        </div>
        <ProgressBar percent={data.progress} />
      </div>

      <div className="ps-stats-grid">
        <StatBox num={data.seancePasse} label="Dernière séance" accent="#f59e0b" />
        <StatBox num={data.seanceAvenir} label="Séance à venir" accent="#3b82f6" />
        <StatBox num={data.balanceUtilise} label="Solde utilisé" accent="#f97316" />
        <StatBox num={data.balanceReste} label="Solde restant" accent="#22c55e" />
      </div>
    </div>
  );
}

export default function ProposeSession({
  candidate,
  onBack,
  events,
  onEventsChange,
  onOpenProposeSession,
  initialSelectedAvailabilityIds = [],
}) {
  return (
    <div className="ps-page">
      <div className="ps-page-header">
        <button type="button" className="ps-back-button" onClick={onBack}>
          <IconArrowLeft />
          <span>Retour</span>
        </button>
        <div className="ps-page-copy">
          <h1>Proposer une séance</h1>
          <p>Planifiez une nouvelle séance pour le candidat sélectionné.</p>
        </div>
      </div>

      <div className="ps-root">
        <CandidateCard candidate={candidate} />
        <MonitorSessions
          variant="monitor"
          mode="proposal"
          candidate={candidate}
          events={events}
          onEventsChange={onEventsChange}
          onOpenProposeSession={onOpenProposeSession}
          initialSelectedAvailabilityIds={initialSelectedAvailabilityIds}
        />
      </div>
    </div>
  );
}
