import { useState } from "react";
import "./Competences.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

// ── Competences data from screenshot ─────────────────────────────────────────
const COMPETENCES = [
  {
    id: 1,
    title: "Maîtriser le maniement du véhicule dans un trafic faible ou nul",
    label: "Compétence 1",
    progress: 0,
  },
  {
    id: 2,
    title: "Appréhender la route et circuler dans des conditions normales",
    label: "Compétence 2",
    progress: 0,
  },
  {
    id: 3,
    title: "Circuler dans des conditions difficiles et partager la route avec les autres usagers",
    label: "Compétence 3",
    progress: 0,
  },
  {
    id: 4,
    title: "Pratiquer une conduite autonome, sûre et économique",
    label: "Compétence 4",
    progress: 0,
  },
  {
    id: 5,
    title: "Maîtriser les situations d'urgence et les pannes",
    label: "Compétence 5",
    progress: 0,
  },
  {
    id: 6,
    title: "Connaître les règles de la route et le code de la route",
    label: "Compétence 6",
    progress: 0,
  },
];

const TOTAL_SEGMENTS = 14;

// ── Progress bar — same as StudentDashboard ───────────────────────────────────
function ProgressBar({ percent }) {
  const filled = Math.round((percent / 100) * TOTAL_SEGMENTS);
  return (
    <div className="comp-progress-bar">
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
        <div
          key={i}
          className={`comp-progress-seg${i < filled ? " comp-progress-seg--filled" : ""}`}
        />
      ))}
    </div>
  );
}

// ── Single competence card ────────────────────────────────────────────────────
function CompetenceCard({ comp }) {
  return (
    <div className="comp-card">
      <div className="comp-card-header">
        <div className="comp-card-num">{comp.id}</div>
        <span className="comp-card-title">{comp.title}</span>
      </div>
      <ProgressBar percent={comp.progress} />
      <div className="comp-card-label">{comp.label}</div>
    </div>
  );
}

// ── Main Competences component ────────────────────────────────────────────────
export default function Competences({ onBack, onOpenNotifications, notifCount = 0 }) {
  return (
    <div className="comp-page">

      {/* ── Page header — matches Commander style ── */}
      <div className="comp-head">
        <div className="comp-head-left">
          <button className="comp-back-btn" onClick={onBack}>
            <IconBack />
          </button>
          <div className="comp-head-text">
            <h1 className="comp-head-title">Compétences</h1>
            <p className="comp-head-sub">Suivi des compétences</p>
          </div>
        </div>

        {/* Notification bell — navigates to notifications like in accueil */}
        <button
          className="comp-notif-btn"
          onClick={onOpenNotifications}
          aria-label="Notifications"
        >
          <IconBell />
          {notifCount > 0 && (
            <span className="comp-notif-badge">{notifCount}</span>
          )}
        </button>
      </div>

      {/* ── Competence cards list ── */}
      <div className="comp-list">
        {COMPETENCES.map(comp => (
          <CompetenceCard key={comp.id} comp={comp} />
        ))}
      </div>
    </div>
  );
}
