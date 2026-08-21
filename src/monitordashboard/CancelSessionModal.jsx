import { useState } from "react";
import "./CancelSessionModal.css";

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default function CancelSessionModal({ onClose, onConfirm }) {
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    const trimmedJustification = justification.trim();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onConfirm?.({ justification: trimmedJustification });
    } catch (error) {
      setErrorMessage(error?.message || "La demande n’a pas pu être envoyée.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="csm-backdrop" onClick={onClose}>
      <div className="csm-modal" onClick={(event) => event.stopPropagation()}>
        <div className="csm-header">
          <button type="button" className="csm-close-btn" onClick={onClose} aria-label="Fermer">
            <IconX />
          </button>
          <h2 className="csm-title">Annuler la séance</h2>
        </div>

        <div className="csm-body">
          <div className="csm-icon-wrap" aria-hidden="true">
            <IconX />
          </div>
          <h3 className="csm-heading">Demande d’annulation</h3>
          <p className="csm-sub">Ajoutez une justification avant d’envoyer la demande à l’administrateur.</p>
          <textarea
            className="csm-textarea"
            placeholder="Écrivez votre commentaire ici..."
            value={justification}
            onChange={(event) => setJustification(event.target.value)}
            rows={4}
          />
          {errorMessage && <p className="csm-sub csm-sub--error">{errorMessage}</p>}
        </div>

        <div className="csm-footer">
          <button type="button" className="csm-btn csm-btn--ghost" onClick={onClose} disabled={isSubmitting}>
            Fermer
          </button>
          <button type="button" className="csm-btn csm-btn--danger" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer la demande"}
          </button>
        </div>
      </div>
    </div>
  );
}
