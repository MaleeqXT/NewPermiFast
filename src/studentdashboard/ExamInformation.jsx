import { useState } from "react";
import "./ExamInformation.css";

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

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4m0-4h.01" />
  </svg>
);

function SuccessModal({ onClose }) {
  return (
    <div className="ei-modal-backdrop" onClick={onClose}>
      <div className="ei-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ei-modal-header">
          <IconInfo />
          <span className="ei-modal-header-text">Succès</span>
        </div>
        <div className="ei-modal-body">
          <p className="ei-modal-msg">L'action a été effectuée avec succès.</p>
        </div>
        <div className="ei-modal-footer">
          <button className="ei-modal-close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_FORM = {
  neph: "220796100620",
  codeDate: "15/05/2026",
};

export default function ExamInformation({
  onBack = () => {},
  onOpenNotifications = () => {},
  notifCount = 0,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saved, setSaved] = useState(INITIAL_FORM);
  const [showModal, setShowModal] = useState(false);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const hasChanged = Object.keys(form).some((key) => form[key] !== saved[key]);
    if (hasChanged) {
      setSaved(form);
      setShowModal(true);
    }
  }

  return (
    <div className="ei-page">
      <div className="ei-hero">
        <div className="ei-hero-head">
          <button className="ei-back-btn" onClick={onBack} aria-label="Retour">
            <IconBack />
          </button>
          <h1 className="ei-title">Informations examen</h1>
          <button className="ei-bell-btn" onClick={onOpenNotifications} aria-label="Notifications">
            <IconBell />
            <span className="ei-bell-badge">{notifCount}</span>
          </button>
        </div>
      </div>

      <div className="ei-form-card">
        <div className="ei-section">
          <label className="ei-field">
            <span className="ei-label">NEPH <span className="ei-required">*</span></span>
            <input
              className="ei-input"
              value={form.neph}
              onChange={(e) => setField("neph", e.target.value)}
            />
          </label>

          <label className="ei-field">
            <span className="ei-label">Date du code</span>
            <input
              className="ei-input"
              value={form.codeDate}
              onChange={(e) => setField("codeDate", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="ei-save-bar">
        <button className="ei-save-btn" onClick={handleSave}>Enregistrer</button>
      </div>

      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
