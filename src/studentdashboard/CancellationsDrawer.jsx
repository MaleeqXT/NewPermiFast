import { useEffect, useMemo, useState } from "react";
import FileManager from "../Components/shared/FileManeger.jsx";
import PhotoUploader from "../Components/shared/PhotoUploader.jsx";
import "./CancellationsDrawer.css";

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.79.59 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.44-1.25a2 2 0 0 1 2.11-.45c.85.27 1.74.47 2.64.59A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconAttachment = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.2-9.19a4 4 0 1 1 5.65 5.66L9.4 17.42a2 2 0 1 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const IconStatusApproved = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.2 2.2L15.5 9.5" />
  </svg>
);

const IconStatusPending = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5" />
    <path d="M12 16h.01" />
  </svg>
);

function StatusBanner({ statusLabel, statusTone }) {
  return (
    <div className={`cd-status-banner cd-status-banner--${statusTone}`}>
      <span className="cd-status-icon">
        {statusTone === "approved" ? <IconStatusApproved /> : <IconStatusPending />}
      </span>
      <span>{statusLabel}</span>
    </div>
  );
}

function AddChoiceModal({ onClose, onChoose }) {
  return (
    <div className="cd-choice-overlay" onClick={onClose}>
      <div className="cd-choice-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="cd-choice-btn" onClick={() => onChoose("file")}>Ajouter un document</button>
        <button className="cd-choice-btn" onClick={() => onChoose("photo")}>Prendre une photo</button>
        <button className="cd-choice-btn cd-choice-btn--close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

function PhotoPickerModal({ selectedMedia, onSelect, onClose }) {
  return (
    <div className="cd-media-overlay" onClick={onClose}>
      <div className="cd-media-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="cd-media-header">
          <div className="cd-media-title">Prendre une photo</div>
          <button className="cd-media-close" onClick={onClose}>Fermer</button>
        </div>

        <PhotoUploader
          selectedImage={selectedMedia}
          onSelect={onSelect}
          title="Vos photos"
          subtitle="Choisissez une photo et elle sera ajoutée directement dans la zone de pièce jointe."
          actionLabel="Téléverser votre photo"
        />
      </div>
    </div>
  );
}

function ContactAvatar({ candidate, selectedMedia }) {
  if (selectedMedia) {
    return <img src={selectedMedia} alt={candidate} className="cd-contact-avatar-image" />;
  }

  const initials = candidate
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return <span>{initials || "NA"}</span>;
}

export default function CancellationsDrawer({ entry, onClose }) {
  const [selectedMedia, setSelectedMedia] = useState("");
  const [pickerState, setPickerState] = useState(null);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [photoUploaderOpen, setPhotoUploaderOpen] = useState(false);

  useEffect(() => {
    setSelectedMedia("");
    setPickerState(null);
    setFileManagerOpen(false);
    setPhotoUploaderOpen(false);
  }, [entry?.id]);

  const isJustified = entry?.tab === "justified" || entry?.statusTone === "approved";

  const contactTitle = useMemo(() => {
    if (!entry) return "";
    return isJustified ? entry.candidate : `Candidat : ${entry.candidate}`;
  }, [entry, isJustified]);

  if (!entry) return null;

  return (
    <>
      <div className="cd-overlay" onClick={onClose} />

      <aside className="cd-drawer">
        <div className="cd-header">
          <button className="cd-close" onClick={onClose}>{isJustified ? "Fermer" : "Fermer"}</button>
          <div className="cd-title">{isJustified ? "Détails de séance" : "Détails de séance"}</div>
          <div className="cd-spacer" />
        </div>

        <div className="cd-body">
          <div className={`cd-contact-card ${isJustified ? "cd-contact-card--approved" : "cd-contact-card--pending"}`}>
            <div className="cd-contact-avatar">
              <ContactAvatar candidate={entry.candidate} selectedMedia={selectedMedia} />
            </div>

            <div className="cd-contact-info">
              <div className="cd-contact-name">{contactTitle}</div>
              <div className="cd-contact-phone">{isJustified ? "Séance annulée" : "0601284520"}</div>
            </div>

            <button className="cd-phone-btn" aria-label="Appeler">
              <IconPhone />
            </button>
          </div>

          <StatusBanner statusLabel={entry.statusLabel} statusTone={entry.statusTone} />

          {!isJustified && (
            <div className="cd-details-card">
              <div className="cd-detail-row">
                <span>Date de réservation</span>
                <strong>{entry.reservationDate}</strong>
              </div>
              <div className="cd-detail-row">
                <span>Heure</span>
                <strong>{entry.timeRange}</strong>
              </div>
              <div className="cd-detail-row">
                <span>Date d'annulation</span>
                <strong>{entry.cancelDate}</strong>
              </div>
              <div className="cd-detail-row">
                <span>Statut de l'annulation</span>
                <span className={`cd-pill cd-pill--${entry.statusTone}`}>{entry.shortStatus}</span>
              </div>
            </div>
          )}

          <div className="cd-justification-card">
            <div className="cd-section-title">Justification</div>
            <textarea className="cd-textarea" value={entry.reason} readOnly />
          </div>

          <div className="cd-file-card">
            <div className="cd-file-left">
              <div className="cd-file-icon">
                {selectedMedia ? <img src={selectedMedia} alt="Attachment" className="cd-file-preview" /> : <IconAttachment />}
              </div>
              <span>{selectedMedia ? "Pièce jointe ajoutée" : "Vide pour le moment"}</span>
            </div>
            <button className="cd-add-btn" onClick={() => setPickerState("menu")}>
              {"+ Ajouter"}
            </button>
          </div>

          {pickerState === "file" && (
            <FileManager
              variant="hidden"
              openOverride={fileManagerOpen}
              onRequestClose={() => {
                setFileManagerOpen(false);
                setPickerState(null);
              }}
              selectedSrc={selectedMedia}
              onSelect={setSelectedMedia}
            />
          )}

        </div>

        <div className="cd-footer">
          <button className={`cd-confirm-btn ${isJustified ? "cd-confirm-btn--approved" : "cd-confirm-btn--pending"}`}>
            {isJustified ? "Confirmer" : "Confirmer"}
          </button>
        </div>
      </aside>

      {pickerState === "menu" ? (
        <AddChoiceModal
          onClose={() => setPickerState(null)}
          onChoose={(next) => {
            if (next === "file") {
              setPickerState("file");
              setFileManagerOpen(true);
              return;
            }

            setPickerState(null);
            setPhotoUploaderOpen(true);
          }}
        />
      ) : null}

      {photoUploaderOpen ? (
        <PhotoPickerModal
          selectedMedia={selectedMedia}
          onSelect={(src) => {
            setSelectedMedia(src);
            setPhotoUploaderOpen(false);
          }}
          onClose={() => setPhotoUploaderOpen(false)}
        />
      ) : null}
    </>
  );
}
