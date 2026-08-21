import { useMemo, useState } from "react";
import "./SettingsPage.css";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const MENU = [
  {
    group: "Suivi et évaluation",
    items: [
      { label: "Mes candidats", displayLabel: "Mes candidats", icon: "👤" },
      { label: "Mes séances proposées", displayLabel: "Mes séances proposées", icon: "📅" },
      { label: "Mes séances annulées", displayLabel: "Mes séances annulées", icon: "✕" },
    ],
  },
  {
    group: "Paramètres",
    items: [
      { label: "Lieux", displayLabel: "Lieux", icon: "📍" },
      { label: "Facturation", displayLabel: "Facturation", icon: "💳" },
      { label: "Véhicules et documents", displayLabel: "Véhicules et documents", icon: "🚗" },
    ],
  },
];

const BASE_URL = import.meta.env.VITE_API_URL;

function getInitials(user) {
  const first = user?.first_name?.[0] || user?.name?.[0] || "";
  const last = user?.last_name?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U";
}

function resolveAvatar(user) {
  if (!user) return null;
  return user.media ? `${BASE_URL}/storage/${user.media}` : user.profile_photo_url || null;
}

export default function SettingsPage({ user, onClose, onNavigate, onLogout }) {
  const [hovered, setHovered] = useState(null);
  const avatarSrc = useMemo(() => resolveAvatar(user), [user]);
  const displayName = useMemo(() => (
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || user?.name || "Utilisateur"
  ), [user]);
  const displayEmail = user?.email || "—";

  return (
    <div className="sp-page">
      <header className="sp-topbar">
        <button className="sp-close-btn" onClick={onClose}>
          <IconArrowLeft />
          <span>Fermer</span>
        </button>
        <span className="sp-topbar-title">Paramètres</span>
        <span className="sp-topbar-spacer" />
      </header>

      <main className="sp-main">
        <div className="sp-profile-card">
          <div className="sp-avatar">
            {avatarSrc ? (
              <img className="sp-avatar-img" src={avatarSrc} alt={displayName} />
            ) : (
              <span>{getInitials(user)}</span>
            )}
          </div>
          <div className="sp-profile-info">
            <p className="sp-profile-name">{displayName}</p>
            <p className="sp-profile-email">{displayEmail}</p>
          </div>
          <button
            className="sp-profile-arrow"
            onClick={() => onNavigate?.("profile")}
          >
            →
          </button>
        </div>

        {MENU.map((group) => (
          <section key={group.group} className="sp-group">
            <p className="sp-group-label">{group.group}</p>
            <div className="sp-group-list">
              {group.items.map((item) => {
                const key = group.group + item.label;
                return (
                  <button
                    key={key}
                    className={`sp-row ${hovered === key ? "sp-row--hover" : ""}`}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onNavigate?.(item.label)}
                  >
                    <span className="sp-row-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="sp-row-label">{item.displayLabel ?? item.label}</span>
                    <span className="sp-row-arrow">›</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <div className="sp-footer">
          <button className="sp-logout-btn" onClick={onLogout}>
            Se déconnecter
          </button>
        </div>
      </main>
    </div>
  );
}
