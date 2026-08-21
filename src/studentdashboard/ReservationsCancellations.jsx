import { useMemo, useState } from "react";
import "./ReservationsCancellations.css";
import CancellationsDrawer from "./CancellationsDrawer.jsx";

const ENTRIES = [
  {
    id: 1,
    tab: "justified",
    date: "11 Dec 2025",
    title: "La réservation est annulée.",
    candidate: "SOW AISSATA",
    reason: "J'ai eu un changement d'emploi du temps à la dernière minute. Je travaille ce jour-là de 9h à 15h45.",
    time: "21:40",
    statusTone: "approved",
    statusLabel: "Réservation annulée et acceptée.",
    shortStatus: "Acceptée",
    reservationDate: "19/01/2026",
    timeRange: "08:00 a 09:00",
    cancelDate: "17/01/2026",
  },
  {
    id: 2,
    tab: "pending",
    date: "17 Janv 2026",
    title: "La demande d'annulation est en cours de traitement.",
    candidate: "SOW AISSATA",
    reason: "Je ne suis malheureusement pas dans l'Oise et je ne pourrai donc pas me présenter. J'aimerais déplacer l'heure de conduite.",
    time: "12:39",
    statusTone: "pending",
    statusLabel: "La demande d'annulation est en cours de traitement.",
    shortStatus: "En attente",
    reservationDate: "19/01/2026",
    timeRange: "08:00 a 09:00",
    cancelDate: "17/01/2026",
  },
];

const TABS = [
  { id: "all", label: "Tous" },
  { id: "justified", label: "Justifiées" },
  { id: "pending", label: "Non justifiées" },
];

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconApproved = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m8.5 12 2.5 2.5L15.5 10" />
  </svg>
);

const IconPending = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5" />
    <path d="m12 16 .01 0" />
  </svg>
);

function EntryIcon({ tone }) {
  return (
    <div className={`rc-entry-icon rc-entry-icon--${tone}`}>
      {tone === "approved" ? <IconApproved /> : <IconPending />}
    </div>
  );
}

function CancellationEntry({ entry, onOpen }) {
  return (
    <button className="rc-entry" onClick={() => onOpen(entry)}>
      <div className="rc-entry-left">
        <EntryIcon tone={entry.statusTone} />
      </div>

      <div className="rc-entry-card">
        <div className="rc-entry-date">{entry.date}</div>
        <div className={`rc-entry-status rc-entry-status--${entry.statusTone}`}>
          <span>{entry.title}</span>
          <span>{entry.time}</span>
        </div>
        <div className="rc-entry-meta">
          <span className="rc-entry-label">Candidat :</span>
          <span>{entry.candidate}</span>
        </div>
        <div className="rc-entry-meta">
          <span className="rc-entry-label">Raison :</span>
          <span>{entry.reason}</span>
        </div>
      </div>
    </button>
  );
}

export default function ReservationsCancellations({
  onBack = () => {},
  onOpenNotifications = () => {},
  notifCount = 0,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filteredEntries = useMemo(() => {
    if (activeTab === "all") return ENTRIES;
    return ENTRIES.filter((entry) => entry.tab === activeTab);
  }, [activeTab]);

  return (
    <>
      <div className="rc-page">
        <div className="rc-hero">
          <div className="rc-hero-head">
            <button className="rc-back-btn" onClick={onBack} aria-label="Back">
              <IconBack />
            </button>
            <h1 className="rc-title">Annulations des réservations</h1>
            <button className="rc-bell-btn" onClick={onOpenNotifications} aria-label="Notifications">
              <IconBell />
              <span className="rc-bell-badge">{notifCount}</span>
            </button>
          </div>
        </div>

        <div className="rc-tabs-card">
          <div className="rc-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`rc-tab${activeTab === tab.id ? " rc-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rc-list">
          {filteredEntries.map((entry) => (
            <CancellationEntry key={entry.id} entry={entry} onOpen={setSelectedEntry} />
          ))}
        </div>
      </div>

      {selectedEntry && <CancellationsDrawer entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
    </>
  );
}
