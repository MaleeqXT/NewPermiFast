import { useState, useRef, useEffect } from "react";
import "./CandidateForm.css";
import { useNavigate } from "react-router-dom";
import { useCandidates } from "./CandidatesContext.jsx";
import FileManager from "../shared/FileManeger.jsx";

// ── Liste de produits pour le panneau modificateur ────────────────────────
const PRODUCTS = [
  "FORFAIT 6H AVEC CODE INTENSIF BM",
  "FORFAIT 6H BM",
  "FORFAIT 7H AVEC CODE INTENSIF BA",
  "FORFAIT 7H BA",
  "PASS RAPIDE 12H AVEC CODE INTENSIF BA",
  "PASS RAPIDE 12H AVEC CODE INTENSIF BM",
  "FORFAIT ACCÉLÉRÉ 12H BA",
  "FORFAIT RAPIDE 12H BM",
  "FORFAIT 15H BA",
  "FORFAIT 15H BM",
  "FORFAIT 20H BA",
  "FORFAIT PREMIUM 20H",
];

const GENRE_OPTIONS     = ["Masculin", "Féminin", "Autre"];
const WOULD_OPTIONS     = ["Voiture", "Moto", "Conduite accompagnée", "AM"];
const POSTAL_OPTIONS    = ["60100 - Creil", "31300 - Toulouse"];
const STATUS_OPTIONS    = ["Actif", "Inactif", "En attente"];
const OPERATION_OPTIONS = ["Addition (+)", "Soustraction (-)"];

// ── Icône œil ─────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

// ── Icône modificateur ────────────────────────────────────────────────────
const ModifierIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9cdd4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

// ── Menu déroulant de produits avec recherche ─────────────────────────────
function ProductDropdown({ value, onChange }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = PRODUCTS.filter(p => p.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="nc-product-wrapper" ref={ref}>
      <button className="nc-select-trigger" onClick={() => setOpen(o => !o)}>
        <span>{value || "Sélectionner un produit"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="nc-product-dropdown">
          <div className="nc-product-search-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              className="nc-product-search"
              placeholder="Recherche par mot-clé"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="nc-product-list">
            {filtered.map(p => (
              <div
                key={p}
                className={`nc-product-option ${value === p ? "selected" : ""}`}
                onClick={() => { onChange(p); setOpen(false); setSearch(""); }}
              >
                {p}
              </div>
            ))}
            {filtered.length === 0 && <div className="nc-product-empty">Aucun résultat</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────
export default function NewCandidate({ onBack }) {
  const { addCandidate } = useCandidates();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "admin@pf.com", telephone: "",
    genre: "", dob: "", would: "", postal: "", address: "",
    neph: "", codeDate: "", password: "", confirmPassword: "",
    status: "", cpf: true, boxType: "Manuel",
    balanceAvailable: "0", estimation: "0",
  });
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photo, setPhoto]             = useState(null);
  const [errors, setErrors]           = useState({});

  const [modifierOpen, setModifierOpen]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [pay, setPay]                         = useState("0");
  const [operation, setOperation]             = useState("Addition (+)");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = true;
    if (!form.lastName.trim())  e.lastName  = true;
    if (!form.email.trim())     e.email     = true;
    if (!form.telephone.trim()) e.telephone = true;
    if (!form.would)            e.would     = true;
    if (!form.postal)           e.postal    = true;
    if (!form.address.trim())   e.address   = true;
    if (!form.neph.trim())      e.neph      = true;
    if (form.password && form.password !== form.confirmPassword) e.confirmPassword = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleReturn() {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/candidates", { state: { fromSecretaryDashboard: true } });
  }

  function handleSave() {
    if (!validate()) return;
    addCandidate(form, photo);
    handleReturn();
  }

  return (
    <div className="nc-root">

      {/* ══ COLONNE GAUCHE ══════════════════════════════════════════════ */}
      <div className="nc-left">

        {/* En-tête */}
        <div className="nc-header">
          <button className="nc-back-btn" onClick={handleReturn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <h1 className="nc-title">Nouveau candidat</h1>
        </div>

        {/* ── Carte 1 : Informations générales ── */}
        <div className="nc-card">
          <h2 className="nc-card-title">Informations générales</h2>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.firstName ? "error" : ""}`}>
              <label>Prénom <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
            </div>
            <div className={`nc-field ${errors.lastName ? "error" : ""}`}>
              <label>Nom <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
            </div>
          </div>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.email ? "error" : ""}`}>
              <label>E-mail <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.email} onChange={e => set("email", e.target.value)} type="email" />
            </div>
            <div className={`nc-field ${errors.telephone ? "error" : ""}`}>
              <label>Téléphone <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.telephone} onChange={e => set("telephone", e.target.value)} type="tel" />
            </div>
          </div>

          <div className="nc-grid-2">
            <div className="nc-field">
              <label>Genre</label>
              <select className="nc-input nc-select" value={form.genre} onChange={e => set("genre", e.target.value)}>
                <option value="">Genre</option>
                {GENRE_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="nc-field">
              <label>Date de naissance</label>
              <input className="nc-input" value={form.dob} onChange={e => set("dob", e.target.value)} type="date" placeholder="jj/mm/aaaa" />
            </div>
          </div>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.would ? "error" : ""}`}>
              <label>Ville <span className="nc-req">*</span></label>
              <select className="nc-input nc-select" value={form.would} onChange={e => set("would", e.target.value)}>
                <option value="">Ville</option>
                <option value="60100 - Creil">60100 - Creil</option>
                <option value="31300 - Toulouse">31300 - Toulouse</option>
              </select>
            </div>
            <div className={`nc-field ${errors.postal ? "error" : ""}`}>
              <label>Code postal <span className="nc-req">*</span></label>
              <select className="nc-input nc-select" value={form.postal} onChange={e => set("postal", e.target.value)}>
                <option value="">Code postal</option>
                {POSTAL_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className={`nc-field ${errors.address ? "error" : ""}`}>
            <label>Adresse <span className="nc-req">*</span></label>
            <textarea className="nc-input nc-textarea" value={form.address} onChange={e => set("address", e.target.value)} rows={3} />
          </div>
        </div>

        {/* ── Carte 2 : Solde ── */}
        <div className="nc-card">
          <h2 className="nc-card-title">Solde</h2>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.neph ? "error" : ""}`}>
              <label>Neph <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.neph} onChange={e => set("neph", e.target.value)} />
            </div>
            <div className="nc-field">
              <label>Date du code</label>
              <input className="nc-input" value={form.codeDate} onChange={e => set("codeDate", e.target.value)} type="date" placeholder="jj/mm/aaaa" />
            </div>
          </div>

          <div className="nc-balance-row">
            <div className="nc-balance-left">
              <span className="nc-balance-label">Solde disponible</span>
              <button className="nc-modifier-btn" onClick={() => setModifierOpen(true)}>
                <ModifierIcon />
                Modifier
              </button>
            </div>
            <div className="nc-balance-right">
              <span className="nc-balance-label">Estimation</span>
              <span className="nc-balance-val">{form.estimation}</span>
            </div>
          </div>
        </div>

        {/* ── Carte 3 : Changer le mot de passe ── */}
        <div className="nc-card">
          <h2 className="nc-card-title">Changer le mot de passe</h2>

          <div className="nc-field">
            <label>Mot de passe <span className="nc-req">*</span></label>
            <div className="nc-pwd-wrapper">
              <input
                className="nc-input nc-pwd-input"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={e => set("password", e.target.value)}
                minLength={8}
              />
              <button className="nc-eye-btn" onClick={() => setShowPwd(v => !v)} type="button">
                <EyeIcon open={showPwd} />
              </button>
            </div>
            {form.password && form.password.length < 8 && (
              <span className="nc-field-hint">Minimum 8 caractères</span>
            )}
          </div>

          <div className={`nc-field ${errors.confirmPassword ? "error" : ""}`}>
            <label>Confirmer le mot de passe <span className="nc-req">*</span></label>
            <div className="nc-pwd-wrapper">
              <input
                className="nc-input nc-pwd-input"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={e => set("confirmPassword", e.target.value)}
              />
              <button className="nc-eye-btn" onClick={() => setShowConfirm(v => !v)} type="button">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && <span className="nc-field-error">Les mots de passe ne correspondent pas</span>}
          </div>
        </div>

      </div>

      {/* ══ PANNEAU DROIT ════════════════════════════════════════════════ */}
      <aside className="nc-right">

        {/* Statut */}
        <div className="nc-right-card">
          <select className="nc-input nc-select nc-status-select" value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="">Statut</option>
            {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Photo */}
        <FileManager
          selectedSrc={photo}
          onSelect={(src) => setPhoto(src)}
        />

        {/* Bascule CPF */}
        <div className="nc-right-card nc-right-row">
          <span className="nc-right-label">CPF</span>
          <label className="nc-toggle">
            <input type="checkbox" checked={form.cpf} onChange={e => set("cpf", e.target.checked)} />
            <span className="nc-toggle-track" />
          </label>
        </div>

        {/* Type de boîte */}
        <div className="nc-right-card nc-right-row">
          <span className="nc-right-label">Type de boîte</span>
          <div className="nc-box-toggle">
            {["Manuel", "Auto"].map(opt => (
              <button
                key={opt}
                className={`nc-box-opt ${form.boxType === opt ? "sel" : ""}`}
                onClick={() => set("boxType", opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Ajouter le candidat */}
        <button className="nc-add-btn" type="button" onClick={handleSave}>
          Ajouter le candidat
        </button>
        <button
          className="cp-action-btn cp-action-giveup"
          type="button"
          style={{ marginTop: 10 }}
          onClick={() => (onBack ? onBack() : navigate("/candidates"))}
        >
          Abandonner
        </button>

      </aside>

      {/* ══ PANNEAU MODIFICATEUR (glisse depuis la droite) ══════════════ */}
      {modifierOpen && (
        <>
          <div className="nc-overlay" onClick={() => setModifierOpen(false)} />
          <div className="nc-modifier-panel">

            {/* En-tête du panneau */}
            <div className="nc-mod-header">
              <button className="nc-mod-back" onClick={() => setModifierOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Retour
              </button>
              <span className="nc-mod-title">Le solde est un solde.</span>
            </div>

            {/* Sélectionner un produit */}
            <div className="nc-mod-section">
              <ProductDropdown value={selectedProduct} onChange={setSelectedProduct} />
            </div>

            {/* Rangée Paiement + Opération */}
            <div className="nc-mod-row">
              <div className="nc-mod-pay">
                <label className="nc-mod-label">Paiement</label>
                <div className="nc-pay-input-row">
                  <input
                    className="nc-input"
                    value={pay}
                    onChange={e => setPay(e.target.value)}
                    type="number"
                    min="0"
                  />
                  <span className="nc-pay-unit">h</span>
                </div>
              </div>

              <div className="nc-mod-operation">
                <label className="nc-mod-label">Opération</label>
                <div className="nc-operation-row">
                  <select
                    className="nc-input nc-select"
                    value={operation}
                    onChange={e => setOperation(e.target.value)}
                  >
                    {OPERATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <button className="nc-op-clear" onClick={() => setOperation("Addition (+)")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des barèmes */}
            <div className="nc-mod-section">
              <div className="nc-scales-card">
                <span className="nc-scales-title">Liste des barèmes</span>
              </div>
            </div>

            {/* Enregistrer */}
            <div className="nc-mod-footer">
              <button className="nc-mod-save" onClick={() => setModifierOpen(false)}>
                Enregistrer
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
