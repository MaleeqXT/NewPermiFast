import { useState } from "react";
import "../studentdashboard/SessionDrawer.css";
import "./ProposeCancelDrawer.css";

const IconCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;
const IconClock    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconChevR    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCopy     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const IconCheckV   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconExtLink  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

function getInitials(name = "") {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function MapThumbnail({ onClick }) {
  return (
    <div className="sdr-map-thumb" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick()}>
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
        <rect width="400" height="160" fill="#e8e0d8"/>
        <rect x="0"   y="0"   width="120" height="70"  fill="#f5f0eb" rx="2"/>
        <rect x="130" y="0"   width="100" height="55"  fill="#f5f0eb" rx="2"/>
        <rect x="240" y="0"   width="160" height="80"  fill="#f5f0eb" rx="2"/>
        <rect x="0"   y="80"  width="90"  height="80"  fill="#f5f0eb" rx="2"/>
        <rect x="100" y="65"  width="120" height="95"  fill="#f5f0eb" rx="2"/>
        <rect x="230" y="90"  width="170" height="70"  fill="#f5f0eb" rx="2"/>
        <rect x="120" y="0"   width="10"  height="160" fill="#fff" opacity="0.9"/>
        <rect x="230" y="0"   width="10"  height="160" fill="#fff" opacity="0.9"/>
        <rect x="0"   y="60"  width="400" height="8"   fill="#fff" opacity="0.9"/>
        <rect x="0"   y="85"  width="400" height="6"   fill="#fff" opacity="0.7"/>
        <path d="M 0 72 Q 100 68 200 75 Q 300 82 400 78" stroke="#a8c4e8" strokeWidth="3" fill="none"/>
        <circle cx="210" cy="58" r="10" fill="#e91e63" opacity="0.9"/>
        <path d="M210 58 L210 75" stroke="#e91e63" strokeWidth="2"/>
        <circle cx="210" cy="56" r="4" fill="#fff"/>
      </svg>
      <div className="sdr-map-overlay-hint">Appuyez pour ouvrir</div>
    </div>
  );
}

function MapModal({ location, mapUrl, onClose }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  function handleCopy() {
    navigator.clipboard.writeText(location).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="sdr-modal-backdrop" onClick={onClose}>
      <div className="sdr-modal" onClick={e => e.stopPropagation()}>
        <div className="sdr-modal-header">
          <span className="sdr-modal-title">Rejoindre le lieu convenu</span>
          <button className="sdr-modal-x" onClick={onClose}><IconX /></button>
        </div>
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
        <div className="sdr-modal-loc">
          <div className="sdr-modal-loc-title">Lieu de rendez-vous</div>
          <div className="sdr-modal-loc-sub">{location}</div>
        </div>
        <div className="sdr-modal-actions">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="sdr-modal-btn sdr-modal-btn--dark">
            Ouvrir dans Google Maps <IconExtLink />
          </a>
          <button className={`sdr-modal-btn sdr-modal-btn--ghost ${copied ? "sdr-modal-btn--copied" : ""}`} onClick={handleCopy}>
            {copied ? <><IconCheckV /> Copié !</> : <><IconCopy /> Copier l’adresse</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropositionDrawer({ proposition, onClose, onCancel, proposalId, reservationId }) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const data = {
    name: proposition?.name ?? "Youzouria Tamime",
    phone: proposition?.phone ?? "0767288927",
    date: proposition?.date ?? "Jeudi 21 mai 2026",
    hour: proposition?.hour ?? "",
    location: proposition?.location ?? "TOULOUSE, Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro",
    media: proposition?.media ?? null,
    profilePhotoUrl: proposition?.profilePhotoUrl ?? null,
    candidateAvatarUrl: proposition?.candidateAvatarUrl ?? null,
    mapUrl: proposition?.mapUrl ?? null,
  };

  const initials = getInitials(data.name);
  const apiBase = import.meta.env.VITE_API_URL ?? "";
  
  // Priority: candidateAvatarUrl (full URL from normalization) → media (relative path) → profilePhotoUrl (fallback)
  let avatarSrc = null;
  if (data.candidateAvatarUrl) {
    avatarSrc = data.candidateAvatarUrl;
  } else if (data.media) {
    avatarSrc = data.media.startsWith("http") 
      ? data.media 
      : `${apiBase}/storage/${data.media}`;
  } else if (data.profilePhotoUrl) {
    avatarSrc = data.profilePhotoUrl;
  }

  const handleCancel = async () => {
    if (!onCancel) return;
    setCancelling(true);
    setCancelError("");
    try {
      await onCancel({ proposalId, reservationId });
    } catch (error) {
      setCancelError(error?.message || "Une erreur est survenue.");
      setCancelling(false);
      return;
    }
    setCancelling(false);
    onClose();
  };

  return (
    <>
      <div className="sdr-overlay" onClick={onClose} />

      <div className="sdr-drawer">
        <div className="sdr-header">
          <button className="pd-header-close" onClick={onClose}>Fermer</button>
          <span className="sdr-header-title">Proposition</span>
          <span style={{ width: 56 }} />
        </div>

        <div className="sdr-body">
          <div className="pd-avatar-card">
            {avatarSrc ? (
              <img src={avatarSrc} alt={data.name} className="pd-avatar" style={{ borderRadius: "50%", objectFit: "cover", width: "42px", height: "42px" }} />
            ) : (
              <div className="pd-avatar">{initials}</div>
            )}
            <div className="pd-avatar-info">
              <div className="pd-name">{data.name}</div>
              {data.phone && <div className="pd-phone">{data.phone}</div>}
            </div>
          </div>

          <div className="sdr-section-card">
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
                <span className="sdr-detail-val">{data.hour}</span>
              </div>
            </div>
          </div>

          <div className="sdr-section-label-text">Point de rendez-vous</div>

          <div className="sdr-map-section">
            <MapThumbnail onClick={() => setShowMapModal(true)} />
            <button className="sdr-location-row" onClick={() => setShowMapModal(true)}>
              <span className="sdr-location-name">{data.location}</span>
              <IconChevR />
            </button>
          </div>
        </div>

        <div className="sdr-footer">
          {cancelError && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 8px", textAlign: "center" }}>{cancelError}</p>}
          <button
            className="pd-cancel-btn"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? "Annulation..." : "Annuler cette proposition"}
          </button>
        </div>
      </div>

      {showMapModal && (
        <MapModal location={data.location} mapUrl={data.mapUrl} onClose={() => setShowMapModal(false)} />
      )}
    </>
  );
}
