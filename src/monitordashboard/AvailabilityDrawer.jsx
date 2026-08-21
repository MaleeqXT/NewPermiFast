import { useState } from "react";
import { createPortal } from "react-dom";
import "./AvailabilityDrawer.css";
import SelectCandidateDrawer from "./SelectCandidateDrawer.jsx";

const IconCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;
const IconClock    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconChevR    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCopy     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const IconCheck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconExtLink  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IconDots     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
const IconClockBig = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconCalBig   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;

function MapThumbnail({ onClick }) {
  return (
    <div className="avd-map-thumb" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick()}>
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
        <rect width="400" height="160" fill="#e8e0d8"/>
        <rect x="0" y="0" width="120" height="70" fill="#f5f0eb" rx="2"/>
        <rect x="130" y="0" width="100" height="55" fill="#f5f0eb" rx="2"/>
        <rect x="240" y="0" width="160" height="80" fill="#f5f0eb" rx="2"/>
        <rect x="0" y="80" width="90" height="80" fill="#f5f0eb" rx="2"/>
        <rect x="100" y="65" width="120" height="95" fill="#f5f0eb" rx="2"/>
        <rect x="230" y="90" width="170" height="70" fill="#f5f0eb" rx="2"/>
        <rect x="120" y="0" width="10" height="160" fill="#fff" opacity="0.9"/>
        <rect x="230" y="0" width="10" height="160" fill="#fff" opacity="0.9"/>
        <rect x="0" y="60" width="400" height="8" fill="#fff" opacity="0.9"/>
        <rect x="0" y="85" width="400" height="6" fill="#fff" opacity="0.7"/>
        <path d="M 0 72 Q 100 68 200 75 Q 300 82 400 78" stroke="#a8c4e8" strokeWidth="3" fill="none"/>
        <circle cx="210" cy="58" r="10" fill="#e91e63" opacity="0.9"/>
        <path d="M210 58 L210 75" stroke="#e91e63" strokeWidth="2"/>
        <circle cx="210" cy="56" r="4" fill="#fff"/>
      </svg>
      <div className="avd-map-hint">Appuyez pour ouvrir</div>
    </div>
  );
}

function formatRemainingBalance(wallet) {
  const balance = Number(wallet?.total_balance ?? wallet?.balance ?? 0);
  return `${balance} h`;
}

function MapModal({ location, url, onClose }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  function handleCopy() {
    navigator.clipboard.writeText(location).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return createPortal(
    <div className="avd-modal-backdrop" onClick={onClose}>
      <div className="avd-modal" onClick={e => e.stopPropagation()}>
        <div className="avd-modal-header">
          <span className="avd-modal-title">Rejoindre le lieu convenu</span>
          <button className="avd-modal-x" onClick={onClose}><IconX /></button>
        </div>

        <div className="avd-modal-map">
          <MapThumbnail onClick={() => {}} />
        </div>

        <div className="avd-modal-loc">
          <div className="avd-modal-loc-title">Site de rendez-vous</div>
          <div className="avd-modal-loc-sub">{location}</div>
        </div>

        <div className="avd-modal-actions">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="avd-modal-btn avd-modal-btn--dark">
            Ouvrir dans Google Maps <IconExtLink />
          </a>
          <button className={`avd-modal-btn avd-modal-btn--ghost${copied ? " avd-modal-btn--copied" : ""}`} onClick={handleCopy}>
            {copied ? <><IconCheck /> Copié !</> : <><IconCopy /> Copier l'adresse</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatDate(isoOrStr) {
  if (!isoOrStr) return "—";
  const parts = isoOrStr.split("-");
  if (parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("fr-FR", { weekday:"long", month:"long", day:"numeric", year:"numeric" });
  }
  return isoOrStr;
}

export default function AvailabilityDrawer({
  availability,
  onClose,
  onCancelAvailability,
  onOpenProposeSession,
  onBook,
  booking = false,
  wallets,
  walletsLoading = false,
  walletsError = "",
  selectedOfferId,
  onSelectOffer,
}) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSelectCandidateDrawer, setShowSelectCandidateDrawer] = useState(false);

  if (!availability) return null;

  const data = {
    date: availability.date || "",
    startTime: availability.startTime || "08:00",
    endTime: availability.endTime || "09:00",
    location: availability.place || availability.mapLocation || "—",
  };

  const dateLabel = formatDate(data.date);
  const isStudentBooking = Array.isArray(wallets);
  const timeLabel = `${data.startTime} à ${data.endTime}`;

  const handleOpenCandidateSelection = () => {
    setMenuOpen(false);
    setShowSelectCandidateDrawer(true);
  };

  const handleSelectCandidate = (candidate) => {
    onClose();
    onOpenProposeSession?.(candidate, {
      preselectedAvailabilityIds: [availability.id],
    });
  };

  return (
    <>
      <div className="avd-overlay" onClick={onClose} />

      <div className={`avd-drawer ${showMapModal ? "avd-drawer--blurred" : ""}`}>
        <div className="avd-header">
          <button className="avd-header-link" onClick={onClose}>Fermer</button>
          <span className="avd-header-title">Disponibilité</span>
          <div className="avd-header-menu-wrapper">
            <button className="avd-header-dots" onClick={() => setMenuOpen(o => !o)} aria-label="Plus">
              <IconDots />
            </button>
            {menuOpen && (
              <div className="avd-header-menu-dropdown">
                <button type="button" className="avd-header-menu-item" onClick={handleOpenCandidateSelection}>
                  Proposer une séance
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="avd-body">
          <div className="avd-section-card">
            <div className="avd-section-title-row">
              <div className="avd-icon-circle"><IconCalBig /></div>
              <span className="avd-section-title">Détails de la séance</span>
            </div>

            <div className="avd-no-sessions">
              Aucune séance n’est disponible pour le moment.
            </div>

            <div className="avd-detail-rows">
              <div className="avd-detail-row">
                <span className="avd-detail-icon"><IconCalendar /></span>
                <span className="avd-detail-label">Date</span>
                <span className="avd-detail-colon">:</span>
                <span className="avd-detail-val">{dateLabel}</span>
              </div>
              <div className="avd-detail-row">
                <span className="avd-detail-icon"><IconClock /></span>
                <span className="avd-detail-label">Heure</span>
                <span className="avd-detail-colon">:</span>
                <span className="avd-detail-val">{timeLabel}</span>
              </div>
            </div>
          </div>

          <div className="avd-section-label">Point de rendez-vous</div>

          <div className="avd-map-section">
            <MapThumbnail onClick={() => setShowMapModal(true)} />
            <button className="avd-location-row" onClick={() => setShowMapModal(true)}>
              <span className="avd-location-name">{data.location}</span>
              <IconChevR />
            </button>
          </div>

          {isStudentBooking && (
            <div className="avd-notice-card">
              <div className="avd-notice-header">
                <span className="avd-notice-title">Mon offre</span>
              </div>
              {walletsLoading ? (
                <div className="avd-wallet-message">Chargement de vos offres…</div>
              ) : walletsError ? (
                <div className="avd-wallet-message avd-wallet-message--error">{walletsError}</div>
              ) : wallets.length === 0 ? (
                <div className="avd-wallet-message">Aucune offre achetée n’est disponible.</div>
              ) : (
                <div className="avd-wallet-list">
                  {wallets.map((wallet) => {
                    const isSelected = String(wallet.offer_id) === String(selectedOfferId);
                    const offerName = wallet.offer?.name || "Offre permis";

                    return (
                      <button
                        key={wallet.id || wallet.offer_id}
                        type="button"
                        className={`avd-wallet-item${isSelected ? " avd-wallet-item--selected" : ""}`}
                        onClick={() => onSelectOffer?.(wallet.offer_id)}
                      >
                        <span className="avd-wallet-offer-name">{offerName}</span>
                        <span className="avd-wallet-balance">Solde restant : <strong>{formatRemainingBalance(wallet)}</strong></span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!isStudentBooking && (
          <div className="avd-notice-card">
            <div className="avd-notice-header">
              <span className="avd-notice-title">Avis</span>
              <button className="avd-see-all-btn">Voir tous les avis →</button>
            </div>
            <div className="avd-notice-empty">
              <IconClockBig />
              <div className="avd-notice-empty-title">Aucun avis n’est disponible pour le moment.</div>
              <div className="avd-notice-empty-sub">Ajoutez un avis après la séance.</div>
            </div>
          </div>
          )}
        </div>

        <div className="avd-footer">
          {onBook ? (
            <button className="avd-cancel-btn" disabled={booking} onClick={onBook}>
              {booking ? "Réservation en cours…" : "Réserver cette séance"}
            </button>
          ) : (
            <button
              className="avd-cancel-btn"
              onClick={() => {
                onCancelAvailability?.();
                onClose();
              }}
            >
              Annuler la disponibilité
            </button>
          )}
        </div>
      </div>

      {showMapModal && (
        <MapModal location={data.location} url={availability.lieuUrl || availability.url} onClose={() => setShowMapModal(false)} />
      )}

      {showSelectCandidateDrawer && (
        <SelectCandidateDrawer
          onClose={() => setShowSelectCandidateDrawer(false)}
          onSelect={handleSelectCandidate}
        />
      )}
    </>
  );
}
