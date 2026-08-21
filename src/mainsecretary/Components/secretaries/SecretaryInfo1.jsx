import { useState } from "react";
import "../candidates/Tabinfo.css";

const EyeOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function SecretaryInfo1({
  form,
  set,
  committed,
  onSave,
  onCancel,
  savedFlash,
  onOpenNameModal,
  onConnect,
}) {
  const [neph,        setNeph]       = useState("191175102179");
  const [codeDate,    setCodeDate]   = useState("");
  const [balance,     setBalance]    = useState(0);
  const [estimation,  setEstimation] = useState(0);
  const [password,    setPassword]   = useState("");
  const [confirm,     setConfirm]    = useState("");
  const [showPass,    setShowPass]   = useState(false);
  const [showConf,    setShowConf]   = useState(false);

  return (
    <>
      {/* ══ 1. Informations personnelles ══ */}
      <section className="cp-section">
        <h2 className="cp-section-title">Informations personnelles</h2>

        <div className="cp-name-row">
          <div className="cp-name-col">
            <span className="cp-field-label">Nom</span>
            <strong className="cp-field-val">{committed.firstName}</strong>
          </div>
          <div className="cp-name-col">
            <span className="cp-field-label">Prénom</span>
            <strong className="cp-field-val">{committed.lastName}</strong>
          </div>
          <button className="cp-edit-icon" title="Modifier le nom" onClick={onOpenNameModal}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        <div className="cp-divider" />

        <div className="cp-field-block">
          <label className="cp-label">E-mail *</label>
          <input className="cp-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Téléphone *</label>
          <input className="cp-input" value={form.tel} onChange={e => set("tel", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Genre</label>
          <select className="cp-input" value={form.genre} onChange={e => set("genre", e.target.value)}>
            <option>Femme</option>
            <option>Homme</option>
            <option>Autre</option>
          </select>
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Date de naissance</label>
          <input className="cp-input" type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Code postal *</label>
          <input className="cp-input" value={form.postal} onChange={e => set("postal", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Adresse *</label>
          <textarea className="cp-input cp-textarea" rows={3} value={form.address} onChange={e => set("address", e.target.value)} />
        </div>
      </section>

      {/* ══ 2. Solde ══ */}
      <section className="cp-section" style={{ marginTop: 20 }}>
        <h2 className="cp-section-title">Solde</h2>

        <div className="ti-balance-inputs">
          <div className="ti-input-group">
            <label className="ti-input-label">NEPH <span className="ti-req">*</span></label>
            <input className="ti-input" value={neph} onChange={e => setNeph(e.target.value)} />
          </div>
          <div className="ti-input-group">
            <label className="ti-input-label">Date du code</label>
            <input className="ti-input" type="date" value={codeDate} onChange={e => setCodeDate(e.target.value)} />
          </div>
        </div>

        <div className="ti-balance-stats">
          <div className="ti-stat">
            <span className="ti-stat-label">Solde<br />disponible</span>
            <span className="ti-stat-val">{balance}</span>
          </div>
          <div className="ti-stat">
            <span className="ti-stat-label">Estimation</span>
            <span className="ti-stat-val">{estimation}</span>
          </div>
        </div>
      </section>

      {/* ══ 3. Mot de passe ══ */}
      <section className="cp-section" style={{ marginTop: 20 }}>
        <h2 className="cp-section-title">Changer le mot de passe</h2>

        <div className="ti-input-group" style={{ marginBottom: 14 }}>
          <label className="ti-input-label">Mot de passe <span className="ti-req">*</span></label>
          <div className="ti-pw-wrap">
            <input
              className="ti-input"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
            <button className="ti-pw-toggle" type="button" onClick={() => setShowPass(o => !o)}>
              {showPass ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
        </div>

        <div className="ti-input-group">
          <label className="ti-input-label">Confirmer le mot de passe <span className="ti-req">*</span></label>
          <div className="ti-pw-wrap">
            <input
              className="ti-input"
              type={showConf ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Confirmer le mot de passe"
            />
            <button className="ti-pw-toggle" type="button" onClick={() => setShowConf(o => !o)}>
              {showConf ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
        </div>
      </section>

      {/* ══ Bouton connexion ══ */}
      <div className="ti-action-row">
        <button className="ti-action-btn ti-action-btn--connect" onClick={onConnect}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Connecter
        </button>
      </div>

      {/* ══ Barre de sauvegarde ══ */}
      <div className="cp-save-bar">
        <button className="cp-btn-cancel" onClick={onCancel}>Annuler</button>
        <button className="cp-btn-save" onClick={onSave}>Enregistrer</button>
      </div>
    </>
  );
}
