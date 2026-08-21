import { useState } from "react";
import "./Notifications.css";

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const IconDoc = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const SAMPLE = [
  {
    id: 1,
    type: "session",
    title: "Nouvelle séance réservée",
    body: "Votre séance du mardi 13 mai à 13h00 avec Lea Lambreday-Mondas a été confirmée.",
    time: "Il y a 2 heures",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Mise à jour de votre contrat",
    body: "Votre contrat de formation a été mis à jour. Consultez-le dans votre espace.",
    time: "Il y a 5 heures",
    read: false,
  },
  {
    id: 3,
    type: "doc",
    title: "Document disponible",
    body: "Votre attestation de formation est maintenant disponible en téléchargement.",
    time: "Hier a 18h30",
    read: true,
  },
  {
    id: 4,
    type: "session",
    title: "Rappel de séance",
    body: "Rappel : séance demain à 10h00 avec Jean Dupont à l'agence CREIL.",
    time: "Hier a 09h00",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Solde d'heures mis à jour",
    body: "Votre solde d'heures de conduite a été mis à jour : 10h disponibles.",
    time: "Il y a 3 jours",
    read: true,
  },
];

const TYPE_ICON = { session: <IconCalendar />, info: <IconInfo />, doc: <IconDoc /> };
const TYPE_COLOR = { session: "#2563eb", info: "#f59e0b", doc: "#8b5cf6" };
const TYPE_BG = { session: "#dbeafe", info: "#fef3c7", doc: "#ede9fe" };

export default function Notifications({ onBack }) {
  const [items, setItems] = useState(SAMPLE);

  const unreadCount = items.filter((n) => !n.read).length;

  function markRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function remove(id) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="notif-page">
      <div className="notif-header">
        <button className="notif-back" onClick={onBack}>
          <IconBack />
        </button>
        <div className="notif-header-center">
          <span className="notif-header-title">Notifications</span>
          {unreadCount > 0 && <span className="notif-unread-badge">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAllRead}>
            Tout lire
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="notif-empty">
          <div className="notif-empty-icon">
            <IconBell />
          </div>
          <div className="notif-empty-title">Aucune notification</div>
          <div className="notif-empty-sub">Vous n'avez pas encore de notifications.</div>
        </div>
      ) : (
        <div className="notif-list">
          {items.map((notif) => (
            <div
              key={notif.id}
              className={`notif-item ${!notif.read ? "notif-item--unread" : ""}`}
              onClick={() => markRead(notif.id)}
            >
              {!notif.read && <div className="notif-dot" />}

              <div
                className="notif-icon-wrap"
                style={{ background: TYPE_BG[notif.type], color: TYPE_COLOR[notif.type] }}
              >
                {TYPE_ICON[notif.type]}
              </div>

              <div className="notif-text">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-body">{notif.body}</div>
                <div className="notif-time">{notif.time}</div>
              </div>

              <div className="notif-actions">
                {!notif.read && (
                  <button
                    className="notif-action-btn notif-action-read"
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(notif.id);
                    }}
                    title="Marquer comme lu"
                  >
                    <IconCheck />
                  </button>
                )}
                <button
                  className="notif-action-btn notif-action-del"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(notif.id);
                  }}
                  title="Supprimer"
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
