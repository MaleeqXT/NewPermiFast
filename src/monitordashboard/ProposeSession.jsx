import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProposeSession.css";
import MonitorSessions from "./MonitorSessions.jsx";
import {
  fetchStudentStats,
  selectStudentStatsById,
  selectStudentStatsLoadingById,
  selectStudentStatsErrorById,
} from "../redux/reducers/studentStatsSlice.jsx";

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

function CandidateCardSkeleton() {
  return (
    <div className="ps-candidate-card ps-candidate-card--loading">
      <div className="ps-identity-row">
        <div className="ps-avatar ps-skeleton" style={{ background: "#e5e7eb" }} />
        <div className="ps-identity-info">
          <div className="ps-skeleton ps-skeleton--line" style={{ width: "60%", height: 14, marginBottom: 6 }} />
          <div className="ps-skeleton ps-skeleton--line" style={{ width: "80%", height: 12 }} />
        </div>
      </div>
      <div className="ps-stats-grid" style={{ marginTop: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="ps-stat-box" style={{ borderTopColor: "#e5e7eb" }}>
            <div className="ps-skeleton ps-skeleton--line" style={{ width: "40%", height: 20, marginBottom: 8 }} />
            <div className="ps-skeleton ps-skeleton--line" style={{ width: "80%", height: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateCard({ candidate, stats, loading }) {
  if (loading) return <CandidateCardSkeleton />;

  const name  = candidate?.name  ?? "—";
  const email = candidate?.email ?? "";
  const phone = candidate?.phone ?? "";

  // map API response fields → display values
  const seancePasse    = stats?.reservations?.passed   ?? candidate?.seancePasse    ?? 0;
  const seanceAvenir   = stats?.reservations?.upcoming ?? candidate?.seanceAvenir   ?? 0;
  const balanceUtilise = stats?.balance?.used          ?? candidate?.balanceUtilise ?? 0;
  const balanceReste   = stats?.balance?.rest          ?? candidate?.balanceReste   ?? 0;

  // competences progress: if API gives competences.done, use that as a raw count
  // progress % = done / (done + remaining) * 100, but API only gives done count
  // fall back to candidate.progress if no better data
  const progressPct = candidate?.progress ?? 0;

  return (
    <div className="ps-candidate-card">
      <div className="ps-identity-row">
        <div className="ps-avatar">{getInitials(name)}</div>
        <div className="ps-identity-info">
          <div className="ps-name">{name}</div>
          {email && <div className="ps-email">{email}</div>}
        </div>
        {phone ? (
          <a href={`tel:${phone}`} className="ps-phone-btn" aria-label="Appeler le candidat">
            <IconPhone />
          </a>
        ) : (
          <button type="button" className="ps-phone-btn" disabled aria-label="Numéro non disponible">
            <IconPhone />
          </button>
        )}
      </div>

      <div className="ps-progress-section">
        <div className="ps-progress-header">
          <span className="ps-progress-title">Progression des compétences</span>
          <span className="ps-progress-pct">{progressPct}%</span>
        </div>
        <ProgressBar percent={progressPct} />
      </div>

      <div className="ps-stats-grid">
        <StatBox num={seancePasse}    label="Séances passées"  accent="#f59e0b" />
        <StatBox num={seanceAvenir}   label="Séances à venir"  accent="#3b82f6" />
        <StatBox num={balanceUtilise} label="Solde utilisé"    accent="#f97316" />
        <StatBox num={balanceReste}   label="Solde restant"    accent="#22c55e" />
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
  onProposalCreated,
  initialSelectedAvailabilityIds = [],
}) {
  const dispatch   = useDispatch();
  const studentId  = candidate?.studentId ?? null;

  const stats   = useSelector((state) => selectStudentStatsById(state, studentId));
  const loading = useSelector((state) => selectStudentStatsLoadingById(state, studentId));
  const error   = useSelector((state) => selectStudentStatsErrorById(state, studentId));

  // fetch stats when component mounts (or studentId changes)
  useEffect(() => {
    if (!studentId) return;
    dispatch(fetchStudentStats(studentId));
  }, [dispatch, studentId]);

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
        <CandidateCard candidate={candidate} stats={stats} loading={loading && !stats} />

        {error && !stats && (
          <p className="ps-error-text">
            {typeof error === "string" ? error : error?.message || "Impossible de charger les statistiques du candidat."}
          </p>
        )}

        <MonitorSessions
          variant="monitor"
          mode="proposal"
          candidate={candidate}
          events={events}
          onEventsChange={onEventsChange}
          onOpenProposeSession={onOpenProposeSession}
          onProposalCreated={onProposalCreated}
          initialSelectedAvailabilityIds={initialSelectedAvailabilityIds}
        />
      </div>
    </div>
  );
}
