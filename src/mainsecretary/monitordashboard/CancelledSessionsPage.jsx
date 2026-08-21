import { useMemo, useState } from "react";
import "./CancelledSessionsPage.css";
import BookingDrawer from "./BookingDrawer.jsx";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const TABS = [
  { id: "all", label: "Toutes" },
  { id: "processing", label: "En cours" },
  { id: "validated", label: "Validées" },
];

const CANCELLED_SESSION_ENTRIES = [
  {
    id: 1,
    statusType: "processing",
    bannerText: "La demande d’annulation est en cours de traitement.",
    bannerColor: "#e07b00",
    booking: {
      status: "cancelled",
      date: "Mar 20 mai 2026",
      timeLabel: "08:00 à 09:00",
      reminder: "dans 44 minutes",
      mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
      contextLabel: "Candidat",
      candidate: "Mohamed Rahmouni",
      email: "rahmounimohamed313@gmail.com",
      offer: "Pass permis Manuelle F10",
      cancellationReason: "Rendez-vous",
      displayStatus: "La demande d’annulation est en cours de traitement.",
      place: "32 Boulevard Andre Netwiller, Toulouse",
      lastComment: null,
      commentCount: 0,
    },
  },
  {
    id: 2,
    statusType: "processing",
    bannerText: "La demande d’annulation est en cours de traitement.",
    bannerColor: "#e07b00",
    booking: {
      status: "cancelled",
      date: "Mer 21 mai 2026",
      timeLabel: "13:00 à 14:00",
      reminder: "dans 2 heures",
      mapLocation: "TOULOUSE, Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit",
      contextLabel: "Candidat",
      candidate: "Mouslim Djantaev",
      email: "mouslim.djantaev@gmail.com",
      offer: "Driving licence assessment time",
      cancellationReason: "Raison personnelle",
      displayStatus: "La demande d’annulation est en cours de traitement.",
      place: "Toulouse, McDonald's Les Arenes",
      lastComment: null,
      commentCount: 0,
    },
  },
  {
    id: 3,
    statusType: "validated",
    bannerText: "L’annulation a été validée.",
    bannerColor: "#2a7d4f",
    booking: {
      status: "passed",
      date: "Jeu 22 mai 2026",
      timeLabel: "09:00 à 10:00",
      reminder: "il y a 1 jour",
      mapLocation: "TOULOUSE, 32 Boulevard Andre Netwiller, 31200 Toulouse",
      contextLabel: "Candidat",
      candidate: "Angelina Chiarella",
      email: "angelina.chiarella@icloud.com",
      offer: "Driving licence pass, BA assessment time",
      displayStatus: "L’annulation a été validée.",
      place: "32 Boulevard Andre Netwiller, Toulouse",
      lastComment: null,
      commentCount: 0,
    },
  },
  {
    id: 4,
    statusType: "validated",
    bannerText: "L’annulation a été validée.",
    bannerColor: "#2a7d4f",
    booking: {
      status: "passed",
      date: "Ven 23 mai 2026",
      timeLabel: "10:00 à 11:00",
      reminder: "il y a 2 jours",
      mapLocation: "TOULOUSE, Toulouse, McDonald's Les Arenes, on the sidewalk at the metro exit",
      contextLabel: "Candidat",
      candidate: "Keita El hadji",
      email: "ekeita934@gmail.com",
      offer: "Automatic F5 Driving Licence Pass",
      displayStatus: "L’annulation a été validée.",
      place: "Toulouse, McDonald's Les Arenes",
      lastComment: "Exam 8:30 AM BA Colomiers",
      commentCount: 1,
    },
  },
];

export default function CancelledSessionsPage({ onBack }) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredEntries = useMemo(
    () => (
      activeTab === "all"
        ? CANCELLED_SESSION_ENTRIES
        : CANCELLED_SESSION_ENTRIES.filter((entry) => entry.statusType === activeTab)
    ),
    [activeTab],
  );

  return (
    <div className="cs-page">
      <header className="cs-header">
        <button className="cs-back-btn" onClick={onBack} aria-label="Retour">
          <IconArrowLeft />
        </button>
        <div className="cs-header-info">
          <span className="cs-header-title">Mes séances annulées</span>
          <span className="cs-header-sub">Suivez les annulations demandées et validées</span>
        </div>
      </header>

      <div className="cs-tabs-wrap">
        <div className="cs-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`cs-tab ${activeTab === tab.id ? "cs-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="cs-main">
        <span className="cs-count">{filteredEntries.length} séance{filteredEntries.length > 1 ? "s" : ""}</span>

        {filteredEntries.length === 0 ? (
          <div className="cs-empty">Aucune séance annulée pour ce statut.</div>
        ) : (
          <div className="cs-timeline">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className="cs-entry" style={{ "--i": index }}>
                <div className="cs-entry-meta">
                  <span className="cs-entry-date">{entry.booking.date}</span>
                  <span className="cs-entry-time">{entry.booking.timeLabel}</span>
                </div>

                <div className="cs-entry-body">
                  <div className="cs-dot-col" aria-hidden="true">
                    <span className="cs-dot" style={{ background: entry.bannerColor }} />
                    {index < filteredEntries.length - 1 && <span className="cs-line" />}
                  </div>

                  <button
                    type="button"
                    className="cs-card cs-card-button"
                    onClick={() => setSelectedBooking(entry.booking)}
                  >
                    <div className="cs-card-banner" style={{ background: entry.bannerColor }}>
                      {entry.bannerText}
                    </div>

                    <div className="cs-card-body">
                      <div className="cs-card-field">
                        <span className="cs-field-label">Candidat</span>
                        <span className="cs-field-value">{entry.booking.candidate}</span>
                      </div>

                      <div className="cs-card-divider" />

                      <div className="cs-card-field">
                        <span className="cs-field-label">Lieu</span>
                        <span className="cs-field-value">{entry.booking.place}</span>
                      </div>

                      <div className="cs-card-divider" />

                      <div className="cs-card-field">
                        <span className="cs-field-label">Offre</span>
                        <span className="cs-field-value">{entry.booking.offer}</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          primaryActionLabel="Appel immédiat"
        />
      )}
    </div>
  );
}
