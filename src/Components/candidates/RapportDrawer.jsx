import { useState } from "react";
import "./RapportDrawer.css";

// ── Sample data matching the screenshot ───────────────────────────────────
const RAPPORT_DATA = [
  {
    date: "17 Mars 2026",
    sessions: [
      {
        id: 1,
        time: "10:00 - 11:00",
        title: "Pass permis Heure d'évaluation BM",
        monitor: "Moniteur S.",
        note: "Évaluation post examen Renforcer l'allure à l'approche",
        done: true,
      },
    ],
  },
  {
    date: "04 Déc 2025",
    sessions: [
      {
        id: 2,
        time: "08:00 - 09:00",
        title: "Examen boite manuelle",
        monitor: "Moniteur E. Soumaya",
        note: null,
        done: true,
      },
    ],
  },
  {
    date: "03 Déc 2025",
    sessions: [
      {
        id: 3,
        time: "09:00 - 10:00",
        title: "Pass permis Manuelle F5",
        monitor: "Moniteur S. SAMY",
        note: "Préparation examen",
        done: true,
      },
    ],
  },
  {
    date: "29 Nov 2025",
    sessions: [
      {
        id: 4,
        time: "09:00 - 10:00",
        title: "Pass permis Manuelle F5",
        monitor: "Moniteur E. Soumaya",
        note: null,
        done: true,
      },
    ],
  },
  {
    date: "27 Nov 2025",
    sessions: [
      {
        id: 5,
        time: "09:00 - 10:00",
        title: "Pass permis Manuelle F5",
        monitor: "Moniteur E. Soumaya",
        note: null,
        done: true,
      },
    ],
  },
  {
    date: "20 Nov 2025",
    sessions: [
      {
        id: 6,
        time: "10:00 - 11:00",
        title: "Pass permis Heure d'évaluation BA",
        monitor: "Moniteur S. SAMY",
        note: "Bilan de formation",
        done: false,
      },
    ],
  },
  {
    date: "14 Nov 2025",
    sessions: [
      {
        id: 7,
        time: "09:00 - 10:00",
        title: "Pass permis Manuelle F5",
        monitor: "Moniteur E. Soumaya",
        note: null,
        done: false,
      },
    ],
  },
  {
    date: "07 Nov 2025",
    sessions: [
      {
        id: 8,
        time: "14:00 - 15:00",
        title: "Examen boite automatique",
        monitor: "Moniteur S. SAMY",
        note: "Passage examen blanc",
        done: false,
      },
    ],
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function RapportDrawer({ onClose }) {
  const [search, setSearch] = useState("");

  const filtered = RAPPORT_DATA.filter(group =>
    !search ||
    group.sessions.some(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.monitor.toLowerCase().includes(search.toLowerCase()) ||
      (s.note || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  // Count totals
  const totalSessions = RAPPORT_DATA.reduce((acc, g) => acc + g.sessions.length, 0);
  const doneSessions  = RAPPORT_DATA.reduce((acc, g) => acc + g.sessions.filter(s => s.done).length, 0);

  return (
    <>
      <div className="rd-overlay" onClick={onClose} />
      <div className="rd-drawer">

        {/* ── Header ── */}
        <div className="rd-header">
          <div className="rd-header-left">
            <h2 className="rd-title">Rapport des heures</h2>
            <div className="rd-summary">
              <span className="rd-summary-done">{doneSessions} effectuées</span>
              <span className="rd-summary-dot">·</span>
              <span className="rd-summary-total">{totalSessions} total</span>
            </div>
          </div>
          <button className="rd-close" onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* ── Search ── */}
        <div className="rd-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="rd-search-input"
            placeholder="Rechercher une session..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── Timeline ── */}
        <div className="rd-body">
          {filtered.length === 0 ? (
            <div className="rd-empty">Aucun résultat</div>
          ) : (
            filtered.map((group, gi) => (
              <div key={gi} className="rd-group">

                {/* Date label */}
                <div className="rd-date-label">{group.date}</div>

                {/* Sessions */}
                {group.sessions.map(session => (
                  <div key={session.id} className="rd-session-row">

                    {/* Timeline dot + line */}
                    <div className="rd-timeline">
                      <div className={`rd-dot ${session.done ? "rd-dot--done" : "rd-dot--pending"}`}>
                        {session.done && <IconCheck />}
                      </div>
                      <div className="rd-line" />
                    </div>

                    {/* Card */}
                    <div className={`rd-card ${session.done ? "rd-card--done" : "rd-card--pending"}`}>
                      {/* Time */}
                      <div className="rd-time">
                        <IconClock />
                        <span>{session.time}</span>
                      </div>

                      {/* Title + monitor */}
                      <div className="rd-card-title">{session.title}</div>
                      <div className="rd-card-monitor">
                        par <strong>{session.monitor}</strong>
                      </div>

                      {/* Optional note */}
                      {session.note && (
                        <div className="rd-card-note">{session.note}</div>
                      )}

                      {/* Status tag */}
                      <div className={`rd-tag ${session.done ? "rd-tag--done" : "rd-tag--pending"}`}>
                        {session.done ? "Effectuée" : "En attente"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <div className="rd-footer">
          <button className="rd-footer-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </>
  );
}