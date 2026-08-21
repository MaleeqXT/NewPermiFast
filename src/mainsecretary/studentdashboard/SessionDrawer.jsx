import { useState } from "react";
import "./SessionDrawer.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCalendar  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;
const IconClock     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconPerson    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconBell      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const IconChevR     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconX         = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconMapPin    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconCopy      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const IconCheck     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconExtLink   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

// ── Fake map thumbnail using SVG (streets pattern) ────────────────────────────
function MapThumbnail({ onClick }) {
  return (
    <div className="sdr-map-thumb" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick()}>
      {/* Simple street-map SVG that looks like the screenshot */}
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
        <rect width="400" height="160" fill="#e8e0d8"/>
        {/* Block fills */}
        <rect x="0"   y="0"   width="120" height="70"  fill="#f5f0eb" rx="2"/>
        <rect x="130" y="0"   width="100" height="55"  fill="#f5f0eb" rx="2"/>
        <rect x="240" y="0"   width="160" height="80"  fill="#f5f0eb" rx="2"/>
        <rect x="0"   y="80"  width="90"  height="80"  fill="#f5f0eb" rx="2"/>
        <rect x="100" y="65"  width="120" height="95"  fill="#f5f0eb" rx="2"/>
        <rect x="230" y="90"  width="170" height="70"  fill="#f5f0eb" rx="2"/>
        {/* Roads */}
        <rect x="120" y="0"   width="10"  height="160" fill="#fff" opacity="0.9"/>
        <rect x="230" y="0"   width="10"  height="160" fill="#fff" opacity="0.9"/>
        <rect x="0"   y="60"  width="400" height="8"   fill="#fff" opacity="0.9"/>
        <rect x="0"   y="85"  width="400" height="6"   fill="#fff" opacity="0.7"/>
        {/* Accent road (blue-ish) */}
        <path d="M 0 72 Q 100 68 200 75 Q 300 82 400 78" stroke="#a8c4e8" strokeWidth="3" fill="none"/>
        {/* Pin */}
        <circle cx="210" cy="58" r="10" fill="#e91e63" opacity="0.9"/>
        <path d="M210 58 L210 75" stroke="#e91e63" strokeWidth="2"/>
        <circle cx="210" cy="56" r="4" fill="#fff"/>
      </svg>
      <div className="sdr-map-overlay-hint">Appuyez pour ouvrir</div>
    </div>
  );
}

// ── Map Modal (screenshot 3) ──────────────────────────────────────────────────
function MapModal({ session, onClose }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.location)}`;

  function handleCopy() {
    navigator.clipboard.writeText(mapsUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="sdr-modal-backdrop" onClick={onClose}>
      <div className="sdr-modal" onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="sdr-modal-header">
          <span className="sdr-modal-title">Rejoindre le lieu convenu</span>
          <button className="sdr-modal-x" onClick={onClose}><IconX /></button>
        </div>

        {/* Map */}
        <div className="sdr-modal-map">
          <svg width="100%" height="100%" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
            <rect width="500" height="200" fill="#e8e0d8"/>
            <rect x="0"   y="0"   width="140" height="90"  fill="#f5f0eb" rx="2"/>
            <rect x="150" y="0"   width="120" height="70"  fill="#f5f0eb" rx="2"/>
            <rect x="280" y="0"   width="220" height="100" fill="#f5f0eb" rx="2"/>
            <rect x="0"   y="100" width="110" height="100" fill="#f5f0eb" rx="2"/>
            <rect x="120" y="80"  width="150" height="120" fill="#f5f0eb" rx="2"/>
            <rect x="280" y="110" width="220" height="90"  fill="#f5f0eb" rx="2"/>
            <rect x="140" y="0"   width="10"  height="200" fill="#fff" opacity="0.9"/>
            <rect x="275" y="0"   width="8"   height="200" fill="#fff" opacity="0.9"/>
            <rect x="0"   y="75"  width="500" height="9"   fill="#fff" opacity="0.9"/>
            <rect x="0"   y="100" width="500" height="7"   fill="#fff" opacity="0.7"/>
            <path d="M 0 84 Q 130 78 260 85 Q 380 92 500 86" stroke="#a8c4e8" strokeWidth="4" fill="none"/>
            <circle cx="265" cy="72" r="13" fill="#e91e63" opacity="0.9"/>
            <path d="M265 72 L265 92" stroke="#e91e63" strokeWidth="2.5"/>
            <circle cx="265" cy="69" r="5" fill="#fff"/>
          </svg>
        </div>

        {/* Location label */}
        <div className="sdr-modal-loc">
          <div className="sdr-modal-loc-title">Site de rendez-vous</div>
          <div className="sdr-modal-loc-sub">{session.location}</div>
        </div>

        {/* Action buttons */}
        <div className="sdr-modal-actions">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sdr-modal-btn sdr-modal-btn--dark"
          >
            Ouvrir dans Google Maps <IconExtLink />
          </a>
          <button
            className={`sdr-modal-btn sdr-modal-btn--ghost ${copied ? "sdr-modal-btn--copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? (
              <><IconCheck /> Copié !</>
            ) : (
              <><IconCopy /> Copier l'adresse</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main SessionDrawer ────────────────────────────────────────────────────────
export default function SessionDrawer({ session, onClose }) {
  const [showMapModal, setShowMapModal] = useState(false);

  // Default data matching screenshots if session doesn't have all fields
  const data = {
    date:       session?.date       || "Mar 17 Mars 2026",
    heure:      session?.heure      || `${session?.start || "10:00"} à ${session?.end || "11:00"}`,
    instructeur:session?.instructeur|| session?.monitor || "S. SAMY",
    rappel:     session?.rappel     || "il y a 2 mois",
    location:   session?.location   || "CREIL, Agence CREIL",
    offre:      session?.offre      || session?.title   || "Pass permis heure d'évaluation BM",
    commentaire:session?.commentaire|| "",
    isPast:     true,
  };

  return (
    <>
      {/* Overlay */}
      <div className="sdr-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="sdr-drawer">

        {/* ── Header ── */}
        <div className="sdr-header">
          <button className="sdr-header-link" onClick={onClose}>Fermer</button>
          <span className="sdr-header-title">Réservation</span>
          <span style={{ width: 56 }} />
        </div>

        {/* ── Scrollable body ── */}
        <div className="sdr-body">

          {/* Section: Séance details */}
          <div className="sdr-section-card">
            <div className="sdr-section-title-row">
              <div className="sdr-icon-circle">
                {/* Green calendar icon like screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2"/>
                  <path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
                </svg>
              </div>
              <span className="sdr-section-title">Détails de la séance</span>
            </div>

            {/* Past warning */}
            {data.isPast && (
              <div className="sdr-past-warning">
                <span className="sdr-bullet">•</span> La date de séance est passée
              </div>
            )}

            {/* Detail rows */}
            <div className="sdr-detail-rows">
              <div className="sdr-detail-row">
                <span className="sdr-detail-icon"><IconCalendar /></span>
                <span className="sdr-detail-label">Date</span>
                <span className="sdr-detail-colon">:</span>
                <span className="sdr-detail-val">{data.date}</span>
              </div>
              <div className="sdr-detail-row">
                <span className="sdr-detail-icon"><IconClock /></span>
                <span className="sdr-detail-label">Heure</span>
                <span className="sdr-detail-colon">:</span>
                <span className="sdr-detail-val">{data.heure}</span>
              </div>
              <div className="sdr-detail-row">
                <span className="sdr-detail-icon"><IconPerson /></span>
                <span className="sdr-detail-label">Instructeur</span>
                <span className="sdr-detail-colon">:</span>
                <span className="sdr-detail-val">{data.instructeur}</span>
              </div>
              <div className="sdr-detail-row">
                <span className="sdr-detail-icon"><IconBell /></span>
                <span className="sdr-detail-label">Rappel</span>
                <span className="sdr-detail-colon">:</span>
                <span className="sdr-detail-val sdr-detail-val--blue">{data.rappel}</span>
              </div>
            </div>
          </div>

          {/* Section: Point de rendez-vous */}
          <div className="sdr-section-label-text">Point de rendez-vous</div>

          <div className="sdr-map-section">
            <MapThumbnail onClick={() => setShowMapModal(true)} />
            <button className="sdr-location-row" onClick={() => setShowMapModal(true)}>
              <span className="sdr-location-name">{data.location}</span>
              <IconChevR />
            </button>
          </div>

          {/* Section: Offre */}
          <div className="sdr-section-label-text">Offre</div>
          <div className="sdr-offre-card">
            <div className="sdr-offre-icon">
              {/* Offer icon — matches screenshot (grey box icon) */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="14" x="3" y="5" rx="2"/>
                <path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>
              </svg>
            </div>
            <span className="sdr-offre-name">{data.offre}</span>
          </div>

          {/* Section: Commentaires */}
          <div className="sdr-section-label-text">Commentaires</div>
          <div className="sdr-comment-card">
            <div className="sdr-comment-label">Commentaires:</div>
            <div className="sdr-comment-text">
              {data.commentaire || "Aucun commentaire"}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="sdr-footer">
          <button className="sdr-cancel-btn">
            Annuler la séance 1h
          </button>
        </div>

      </div>

      {/* Map modal */}
      {showMapModal && (
        <MapModal
          session={data}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </>
  );
}
