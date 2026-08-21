import { useState, useEffect } from "react";
import "./FilterDrawer.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// The "Aucun lieu" illustration — magnifier with X, matching the screenshot style
const IllustrationNoLieu = () => (
  <svg width="90" height="90" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer glow ring */}
    <circle cx="52" cy="52" r="38" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
    {/* Magnifier circle */}
    <circle cx="50" cy="50" r="24" fill="#fff" stroke="#38bdf8" strokeWidth="3"/>
    {/* X inside magnifier */}
    <line x1="42" y1="42" x2="58" y2="58" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="58" y1="42" x2="42" y2="58" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Magnifier handle */}
    <line x1="68" y1="68" x2="85" y2="85" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round"/>
    {/* Decorative dots */}
    <circle cx="20" cy="30" r="3" fill="#7dd3fc"/>
    <circle cx="88" cy="28" r="2" fill="#7dd3fc"/>
    <circle cx="15" cy="70" r="2" fill="#bae6fd"/>
    <circle cx="93" cy="72" r="3" fill="#bae6fd"/>
    {/* Small star/sparkle top-right of magnifier */}
    <path d="M78 20 L80 26 L86 28 L80 30 L78 36 L76 30 L70 28 L76 26 Z" fill="#38bdf8" opacity="0.45"/>
  </svg>
);

// ── Zone → Lieu mapping ───────────────────────────────────────────────────────
const ZONE_LIEUX = {
  "CREIL":       ["Agence CREIL"],
  "TOULOUSE":    ["Agence Toulouse Centre", "Agence Toulouse Nord"],
  "SAINT DENIS": ["Agence Saint-Denis", "Place de la République"],
  "PARIS":       ["Agence Paris 10", "Agence Paris 18"],
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function FilterDrawer({ onClose, onSave }) {
  const zone = "CREIL";
  const [zoneSelected, setZoneSelected] = useState(false);
  const [selectedLieu, setSelectedLieu] = useState(null);

  useEffect(() => {
    if (!zoneSelected) {
      setSelectedLieu(null);
    }
  }, [zoneSelected]);

  const lieux = zoneSelected ? (ZONE_LIEUX[zone.toUpperCase()] ?? []) : [];

  function handleSave() {
    if (onSave) onSave({ zone, lieu: selectedLieu, zoneSelected });
    if (onClose) onClose();
  }

  return (
    <>
      {/* Overlay — click to close */}
      <div className="fd-overlay" onClick={onClose} />

      {/* Drawer — slides in from right */}
      <div className="fd-drawer">

        {/* ── Header ── */}
        <div className="fd-header">
          <button className="fd-header-link" onClick={onClose}>Fermer</button>
          <span className="fd-header-title">Filtres</span>
          <button className="fd-header-link fd-header-link--save" onClick={handleSave}>Enregistrer</button>
        </div>

        {/* ── Yellow banner ── */}
        <div className="fd-banner">
          Choisissez les lieux correspondants à vos critères
        </div>

        {/* ── Body ── */}
        <div className="fd-body">

          {/* Zone */}
          <div className="fd-section">
            <div className="fd-section-label">Zone</div>
            <button
              type="button"
              className={`fd-zone-row ${zoneSelected ? "fd-zone-row--active" : ""}`}
              onClick={() => setZoneSelected(true)}
            >
              <span className="fd-zone-value">{zone}</span>
              {zoneSelected && (
                <span className="fd-zone-check"><IconCheck /></span>
              )}
            </button>
          </div>

          {/* Lieu */}
          <div className="fd-section">
            <div className="fd-section-label">Lieu</div>

            {lieux.length === 0 ? (
              /* Empty state — illustration + text */
              <div className="fd-no-lieu">
                <IllustrationNoLieu />
                <div className="fd-no-lieu-title">Aucun lieu</div>
                <div className="fd-no-lieu-sub">Sélectionnez une zone pour afficher les lieux</div>
              </div>
            ) : (
              /* Lieu list */
              <div className="fd-lieu-list">
                {lieux.map(lieu => (
                  <button
                    key={lieu}
                    className={`fd-lieu-item ${selectedLieu === lieu ? "fd-lieu-item--active" : ""}`}
                    onClick={() => setSelectedLieu(selectedLieu === lieu ? null : lieu)}
                  >
                    <div className="fd-lieu-bar" />
                    <span className="fd-lieu-name">{lieu}</span>
                    {selectedLieu === lieu && (
                      <span className="fd-lieu-check"><IconCheck /></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
