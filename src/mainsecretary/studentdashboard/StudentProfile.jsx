import { useState } from "react";
import "./StudentProfile.css";
import FileManager from "../Components/shared/FileManeger.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>
  </svg>
);

// ── Success Modal ─────────────────────────────────────────────────────────
function SuccessModal({ onClose }) {
  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        {/* Header bar */}
        <div className="sp-modal-header">
          <IconInfo />
          <span className="sp-modal-header-text">Succès</span>
        </div>
        {/* Body */}
        <div className="sp-modal-body">
          <p className="sp-modal-msg">L'action a été effectuée avec succès.</p>
        </div>
        {/* Footer */}
        <div className="sp-modal-footer">
          <button className="sp-modal-close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

// ── Initial form values ───────────────────────────────────────────────────
const INITIAL_FORM = {
  firstName:       "Chiendent",
  name:            "Jennyfer",
  email:           "chiendent.jennyfer@gmail.com",
  genre:           "Women",
  phone:           "0745119804",
  dob:             "21/05/2004",
  would:           "",
  postal:          "",
  agency:          "Creil",
  address:         "64 av Claude Perocheh",
  password:        "",
  confirmPassword: "",
};

export default function StudentProfile({
  onBack              = () => {},
  onOpenNotifications = () => {},
  notifCount          = 0,
}) {
  const [photo,       setPhoto]       = useState(null);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form,        setForm]        = useState(INITIAL_FORM);
  const [saved,       setSaved]       = useState(INITIAL_FORM); // tracks what was last saved
  const [showModal,   setShowModal]   = useState(false);

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    // Only show modal if something actually changed
    const hasChanged = Object.keys(form).some(k => form[k] !== saved[k]);
    if (hasChanged) {
      setSaved(form); // commit the save
      setShowModal(true);
    }
  }

  return (
    <div className="sp-page">

      {/* ── Header ── */}
      <div className="sp-hero">
        <div className="sp-hero-head">
          <button className="sp-back-btn" onClick={onBack} aria-label="Retour">
            <IconBack />
          </button>
          <h1 className="sp-title">Profil</h1>
          <button className="sp-bell-btn" onClick={onOpenNotifications} aria-label="Notifications">
            <IconBell />
            <span className="sp-bell-badge">{notifCount}</span>
          </button>
        </div>

        <div className="sp-photo-strip-wrap">
          <FileManager
            selectedSrc={photo}
            onSelect={setPhoto}
            variant="profile-strip"
            title="Photo de profil"
            subtitle="Mettre à jour votre photo de profil"
            actionLabel="Changer"
          />
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="sp-form-card">

        {/* Personal information */}
        <div className="sp-section">
          <h2 className="sp-section-title">Informations personnelles</h2>

          <div className="sp-grid sp-grid--two">
            <label className="sp-field">
              <span className="sp-label">Prénom</span>
              <input className="sp-input" value={form.firstName} onChange={e => setField("firstName", e.target.value)} />
            </label>
            <label className="sp-field">
              <span className="sp-label">Nom</span>
              <input className="sp-input" value={form.name} onChange={e => setField("name", e.target.value)} />
            </label>
          </div>

          <label className="sp-field">
            <span className="sp-label">E-mail</span>
            <input className="sp-input" value={form.email} onChange={e => setField("email", e.target.value)} />
          </label>

          <label className="sp-field">
            <span className="sp-label">Genre</span>
            <select className="sp-input" value={form.genre} onChange={e => setField("genre", e.target.value)}>
              <option>Femme</option>
              <option>Homme</option>
              <option>Autre</option>
            </select>
          </label>

          <label className="sp-field">
            <span className="sp-label">Numéro de téléphone</span>
            <input className="sp-input" value={form.phone} onChange={e => setField("phone", e.target.value)} />
          </label>

          <label className="sp-field">
            <span className="sp-label">Date de naissance</span>
            <input className="sp-input" value={form.dob} onChange={e => setField("dob", e.target.value)} />
          </label>
        </div>

        {/* Address */}
        <div className="sp-section">
          <h2 className="sp-section-title">Adresse</h2>

          <label className="sp-field">
            <span className="sp-label">Adresse 1 <span className="sp-required">*</span></span>
            <input className="sp-input" value={form.would} onChange={e => setField("would", e.target.value)} />
          </label>

          <label className="sp-field">
            <span className="sp-label">Code postal 1 <span className="sp-required">*</span></span>
            <input className="sp-input" value={form.postal} onChange={e => setField("postal", e.target.value)} />
          </label>

          <label className="sp-field">
            <span className="sp-label">Agence</span>
            <select className="sp-input" value={form.agency} onChange={e => setField("agency", e.target.value)}>
              <option>Creil</option>
              <option>Paris</option>
              <option>Toulouse</option>
            </select>
          </label>

          <label className="sp-field">
            <span className="sp-label">Adresse</span>
            <textarea className="sp-input sp-textarea" value={form.address} onChange={e => setField("address", e.target.value)} />
          </label>
        </div>

        {/* Password */}
        <div className="sp-section">
          <h2 className="sp-section-title">Modifier votre mot de passe</h2>

          <label className="sp-field">
            <span className="sp-label">Mot de passe <span className="sp-required">*</span></span>
            <span className="sp-password-wrap">
              <input
                className="sp-input sp-password-input"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setField("password", e.target.value)}
              />
              <button className="sp-password-toggle" type="button" onClick={() => setShowPass(v => !v)}>
                <IconEye />
              </button>
            </span>
          </label>

          <label className="sp-field">
            <span className="sp-label">Confirmer le mot de passe <span className="sp-required">*</span></span>
            <span className="sp-password-wrap">
              <input
                className="sp-input sp-password-input"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={e => setField("confirmPassword", e.target.value)}
              />
              <button className="sp-password-toggle" type="button" onClick={() => setShowConfirm(v => !v)}>
                <IconEye />
              </button>
            </span>
          </label>
        </div>
      </div>

      {/* ── Sticky save bar ── */}
      <div className="sp-save-bar">
        <button className="sp-save-btn" onClick={handleSave}>Enregistrer</button>
      </div>

      {/* ── Success Modal ── */}
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
