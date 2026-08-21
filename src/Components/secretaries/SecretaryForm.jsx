import { useState, useRef, useEffect } from "react";
import "../candidates/CandidateForm.css";
import { Link, useNavigate } from "react-router-dom";
import FileManager from "../shared/FileManeger.jsx";

// const GENRE_OPTIONS  = ["Homme", "Femme", "Autre"];
// const POSTAL_OPTIONS = ["60100 - Creil", "31300 - Toulouse", "75001 - Paris", "69001 - Lyon", "13001 - Marseille"];
import { useDispatch } from "react-redux";
import { addSecretaries } from "../../redux/reducers/adminSecretarySlice.jsx";

// const STATUS_OPTIONS = ["Actif", "Inactif", "En attente"];

// ── Eye icon ──────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9cdd4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

// ── Main component ─────────────────────────────────────────────────────────
export default function NewCandidate({ onBack }) {
  const fileRef = useRef(null);
  const navigate = useNavigate();


  const dispatch = useDispatch();

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "admin@pf.com", phone: "",
    sexe: "", date_naissance: "", would: "", postal: "", adresse: "",
    neph: "", date_of_code: "", password: "", password_confirmation: "",
    status: "", sexe:"",cpf: true, boxType: "Manuel",
    balanceAvailable: "0", estimation: "0",
  });
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [media,       setMedia]       = useState(null);
  const [errors,      setErrors]      = useState({});
  const [mediaFile, setMediaFile] = useState(null);

  const [serverError, setServerError] = useState(null);

  const [submitting,  setSubmitting]  = useState(false);


  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleMedia(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setMedia(ev.target.result);
    reader.readAsDataURL(file);
  }

  function validate() {
    const e = {};
    if (!form.first_name.trim()) e.first_name = true;
    if (!form.last_name.trim())  e.last_name  = true;
    if (!form.email.trim())     e.email     = true;
    if (!form.phone.trim()) e.phone = true;
    // if (!form.postal)           e.postal    = true;
    if (!form.adresse.trim())   e.adresse   = true;
    if (!form.neph.trim())      e.neph      = true;
    if (!form.sexe.trim())      e.neph      = true;

    // if (!form.date_of_code.trim())      e.date_of_code= true;

    if (form.password && form.password !== form.password_confirmation) e.password_confirmation = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    //     console.log("mediaFile:", mediaFile);        // File object hai ya null?
    // console.log("media:", media); 
    // return;
const formData = new FormData();

// Sab fields add karo
formData.append('first_name', form.first_name);
formData.append('last_name',  form.last_name);
formData.append('email',      form.email);
formData.append('phone',      form.phone);
formData.append('sexe',       form.sexe       || '');
formData.append('date_naissance', form.date_naissance || '');
formData.append('postal',     form.postal     || '00000');
formData.append('adresse',    form.adresse);
formData.append('status',     form.status     || '1');
formData.append('password',   form.password);
formData.append('password_confirmation', form.password_confirmation);
formData.append('neph',       form.neph);
formData.append('date_of_code', form.date_of_code || '');

// Media file add karo
if (mediaFile) {
    formData.append('media', mediaFile.file || mediaFile); // ✅ sirf local upload pe lagega
}


if (!mediaFile && media ) {
    formData.append('media_url', mediaFile); // File object
}
    // if (validate()) alert("Secrétaire enregistrée !");
    //     if (!validate()) return;

    //         const payload = {
    //       first_name: form.first_name,
    //       last_name: form.last_name,
    //       email: form.email,
    //       phone: form.phone,
    //       sexe: form.sexe || null,
    //       date_naissance: form.date_naissance || null,
    //       postal:form.postal|| "00000", 
    //       adresse: form.adresse,
    //       status: form.status || "1",
    //       password: form.password,
    //       password_confirmation: form.password_confirmation,
    //           neph:form.neph,
    //       date_of_code:form.date_of_code,
    //       media:      media || null,
    // };
    // payload.append

       setSubmitting(true);
       try{
        await dispatch(addSecretaries(formData)).unwrap();
        navigate("/secretaries");
       }catch (err) {
      // Laravel validation errors: err.errors = { field: [messages] }
      if (err?.errors) {
        const backendErrors = {};
        Object.keys(err.errors).forEach(field => {
          backendErrors[field] = err.errors[field][0]; // pehla message
        });
        setErrors(prev => ({ ...prev, ...backendErrors }));
        setServerError("Veuillez corriger les erreurs ci-dessous.");
      } else {
        setServerError(err?.message || "Une erreur est survenue.");
      }
    } finally {
      setSubmitting(false);
    }
  
  }

  return (
    
    <div className="nc-root">
     {/* {serverError && (
            <div style={{ color: 'red', marginBottom: 10 }}>{serverError}</div>
        )} */}

      {/* ══ COLONNE GAUCHE ══════════════════════════════════════════════════ */}
      <div className="nc-left">

        {/* En-tête */}
        <div className="nc-header">
        <Link to="/secretaries">
            <button className="nc-back-btn" onClick={onBack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </button>
          </Link>
          <h1 className="nc-title">Nouvelle secrétaire</h1>
        </div>

        {/* ── Carte 1 : Informations générales ── */}
        <div className="nc-card">
          <h2 className="nc-card-title">Informations générales</h2>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.first_name ? "error" : ""}`}>
              <label>Prénom <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.first_name} onChange={e => set("first_name", e.target.value)} />
            </div>
            <div className={`nc-field ${errors.last_name ? "error" : ""}`}>
              <label>Nom <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.last_name} onChange={e => set("last_name", e.target.value)} />
            </div>
          </div>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.email ? "error" : ""}`}>
              <label>E-mail <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.email} onChange={e => set("email", e.target.value)} type="email" />
            </div>
            <div className={`nc-field ${errors.phone ? "error" : ""}`}>
              <label>Téléphone <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.phone} onChange={e => set("phone", e.target.value)} type="tel" />
            </div>
          </div>

          <div className="nc-grid-2">
            <div className="nc-field">
              <label>Genre</label>
              <select className="nc-input nc-select" value={form.sexe} onChange={e => set("sexe", e.target.value)}>
                <option value="">Genre</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="nc-field">
              <label>Date de naissance</label>
              <input className="nc-input" value={form.date_naissance} onChange={e => set("date_naissance", e.target.value)} type="date" placeholder="jj/mm/aaaa" />
            </div>
          </div>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.postal ? "error" : ""}`}> 
               <label>Postal <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.postal} onChange={e => set("postal", e.target.value)} type="tel" />
            </div>
            <div className="nc-field" />
          </div>

          <div className={`nc-field ${errors.adresse ? "error" : ""}`}>
            <label>Adresse <span className="nc-req">*</span></label>
            <textarea className="nc-input nc-textarea" value={form.adresse} onChange={e => set("adresse", e.target.value)} rows={3} />
          </div>
        </div>

        {/* ── Carte 2 : Solde ── */}
        <div className="nc-card">
          <h2 className="nc-card-title">Solde</h2>

          <div className="nc-grid-2">
            <div className={`nc-field ${errors.neph ? "error" : ""}`}>
              <label>NEPH <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.neph} onChange={e => set("neph", e.target.value)} />
            </div>
            <div className="nc-field">
              <label>Date du code</label>
              <input className="nc-input" value={form.date_of_code} onChange={e => set("date_of_code", e.target.value)} type="date" placeholder="jj/mm/aaaa" />
            </div>
          </div>

          <div className="nc-balance-row">
            <div className="nc-balance-left">
              <span className="nc-balance-label">Solde disponible</span>
            </div>
            <div className="nc-balance-right">
              <span className="nc-balance-label">Estimation</span>
              <span className="nc-balance-val">{form.estimation}</span>
            </div>
          </div>
        </div>

        {/* ── Carte 3 : Mot de passe ── */}
        <div className="nc-card">
          <h2 className="nc-card-title">Modifier le mot de passe</h2>

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
              <span className="nc-field-hint">8 caractères minimum</span>
            )}
          </div>

          <div className={`nc-field ${errors.password_confirmation ? "error" : ""}`}>
            <label>Confirmer le mot de passe <span className="nc-req">*</span></label>
            <div className="nc-pwd-wrapper">
              <input
                className="nc-input nc-pwd-input"
                type={showConfirm ? "text" : "password"}
                value={form.password_confirmation}
                onChange={e => set("password_confirmation", e.target.value)}
              />
              <button className="nc-eye-btn" onClick={() => setShowConfirm(v => !v)} type="button">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.password_confirmation && <span className="nc-field-error">Les mots de passe ne correspondent pas</span>}
          </div>
        </div>

      </div>

      {/* ══ PANNEAU DROIT ══════════════════════════════════════════════════ */}
      <aside className="nc-right">

        {/* Statut */}
        <div className="nc-right-card">
          <select className="nc-input nc-select nc-status-select" value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="">Statut</option>
            <option value="1">Actif</option>
            <option value="2">Inactif</option>
            {/* <option value="0">En attente</option> */}
          </select>
        </div>

        {/* Photo */}
        <FileManager
          selectedSrc={media}
          // onSelect={(src) => setMedia(src)}
            onSelect={(src, file) => {
              setMedia(src);       // preview ke liye
              setMediaFile(file.file);  // upload ke liye
              }}
        />

        {/* CPF */}
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

        {/* Bouton ajouter */}
        <button className="nc-add-btn" type="button" onClick={handleSave}>
          Ajouter la secrétaire
        </button>
        <button
          className="cp-action-btn cp-action-giveup"
          type="button"
          style={{ marginTop: 10 }}
          onClick={() => (onBack ? onBack() : navigate("/secretaries"))}
        >
          Abandonner
        </button>

      </aside>

    </div>
  );
}
