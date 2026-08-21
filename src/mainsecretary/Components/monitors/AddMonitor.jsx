import { useState, useRef } from "react";
import "./AddMonitor.css";
import { useNavigate } from "react-router-dom";
import { useMonitors } from "./MonitorsContext.jsx";
import FileManager from "../shared/FileManeger.jsx";

const GENRE_OPTIONS = ["Homme", "Femme", "Autre"];
const WOULD_OPTIONS = ["Toulouse", "Creil", "Autres"];
const POSTAL_OPTIONS = ["60100 - Creil", "31300 - Toulouse", "75001 - Paris", "69001 - Lyon", "13001 - Marseille"];
const ZONES = [
  { id: 1, name: "Autres" },
  { id: 2, name: "SAINT DENIS" },
  { id: 3, name: "TOULOUSE" },
  { id: 4, name: "CREIL" },
];
const PLACES_BY_ZONE = {
  1: ["Place de la République", "Rue des Lilas"],
  2: ["Allée Ernesto Che Guevara"],
  3: [
    "32 Boulevard André Netwiller, 31200 Toulouse",
    "Toulouse, McDonald's Les Arènes, on the sidewalk at the metro exit",
  ],
  4: ["CREIL Agency"],
};
const STATUS_OPTIONS = ["Actif", "Inactif", "En attente"];

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

export default function MonitorForm({ onBack }) {
  const { addMonitor } = useMonitors();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", telephone: "",
    genre: "", dob: "", would: "", postal: "", address: "",
    password: "", confirmPassword: "",
    status: "", cpf: true, boxType: "Manuel",
    iban: "", bic: "",
    department: "", authorizationNumber: "",
    carRates: "", tuitionFees: "",
    locations: [],
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [locations, setLocations] = useState([]);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleAddLocation() {
    if (!selectedZone || !selectedPlace) return;
    const zone = ZONES.find(item => String(item.id) === String(selectedZone));
    if (!zone) return;
    const next = [...locations, { id: Date.now() + Math.random(), zoneId: zone.id, zoneName: zone.name, place: selectedPlace }];
    setLocations(next);
    set("locations", next.map(({ zoneId, zoneName, place }) => ({ zoneId, zoneName, place })));
    setSelectedPlace("");
  }

  function handleRemoveLocation(index) {
    const next = locations.filter((_, currentIndex) => currentIndex !== index);
    setLocations(next);
    set("locations", next.map(({ zoneId, zoneName, place }) => ({ zoneId, zoneName, place })));
  }

  function validate() {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = true;
    if (!form.lastName.trim()) nextErrors.lastName = true;
    if (!form.email.trim()) nextErrors.email = true;
    if (!form.telephone.trim()) nextErrors.telephone = true;
    if (!form.would) nextErrors.would = true;
    if (!form.postal) nextErrors.postal = true;
    if (!form.address.trim()) nextErrors.address = true;
    if (form.password && form.password !== form.confirmPassword) nextErrors.confirmPassword = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    addMonitor({ ...form, locations }, photo);
    navigate("/monitors");
  }

  function handleReturn() {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/monitors", { state: { fromSecretaryDashboard: true } });
  }

  return (
    <div className="nc-root">
      <div className="nc-left">
        <div className="nc-header">
          <button className="nc-back-btn" onClick={handleReturn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <h1 className="nc-title">Nouveau moniteur</h1>
        </div>

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
              <input className="nc-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className={`nc-field ${errors.telephone ? "error" : ""}`}>
              <label>Téléphone <span className="nc-req">*</span></label>
              <input className="nc-input" type="tel" value={form.telephone} onChange={e => set("telephone", e.target.value)} />
            </div>
          </div>
          <div className="nc-grid-2">
            <div className="nc-field">
              <label>Genre</label>
              <select className="nc-input nc-select" value={form.genre} onChange={e => set("genre", e.target.value)}>
                <option value="">Genre</option>
                {GENRE_OPTIONS.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className="nc-field">
              <label>Date de naissance</label>
              <input className="nc-input" type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
            </div>
          </div>
          <div className="nc-grid-2">
            <div className={`nc-field ${errors.would ? "error" : ""}`}>
              <label>Ville <span className="nc-req">*</span></label>
              <select className="nc-input nc-select" value={form.would} onChange={e => set("would", e.target.value)}>
                <option value="">Ville</option>
                {WOULD_OPTIONS.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div className={`nc-field ${errors.postal ? "error" : ""}`}>
              <label>Code postal <span className="nc-req">*</span></label>
              <select className="nc-input nc-select" value={form.postal} onChange={e => set("postal", e.target.value)}>
                <option value="">Code postal</option>
                {POSTAL_OPTIONS.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <div className={`nc-field ${errors.address ? "error" : ""}`}>
            <label>Adresse <span className="nc-req">*</span></label>
            <textarea className="nc-input nc-textarea" rows={3} value={form.address} onChange={e => set("address", e.target.value)} />
          </div>
        </div>

        <div className="nc-card">
          <h2 className="nc-card-title">Informations bancaires</h2>
          <div className="nc-field">
            <input className="nc-input nc-placeholder-input" placeholder="IBAN" value={form.iban} onChange={e => set("iban", e.target.value)} />
          </div>
          <div className="nc-field">
            <input className="nc-input nc-placeholder-input" placeholder="BIC" value={form.bic} onChange={e => set("bic", e.target.value)} />
          </div>
        </div>

        <div className="nc-card">
          <h2 className="nc-card-title">Autres informations</h2>
          <div className="nc-grid-2">
            <div className="nc-field">
              <input className="nc-input nc-placeholder-input" placeholder="Département" value={form.department} onChange={e => set("department", e.target.value)} />
            </div>
            <div className="nc-field">
              <input className="nc-input nc-placeholder-input" placeholder="Numéro d'autorisation" value={form.authorizationNumber} onChange={e => set("authorizationNumber", e.target.value)} />
            </div>
          </div>
          <div className="nc-grid-2">
            <div className="nc-field">
              <div className="nc-euro-wrap">
                <input className="nc-input nc-placeholder-input" placeholder="Tarif véhicule" type="number" min="0" value={form.carRates} onChange={e => set("carRates", e.target.value)} />
                <span className="nc-euro-symbol">€</span>
              </div>
            </div>
            <div className="nc-field">
              <div className="nc-euro-wrap">
                <input className="nc-input nc-placeholder-input" placeholder="Frais de formation" type="number" min="0" value={form.tuitionFees} onChange={e => set("tuitionFees", e.target.value)} />
                <span className="nc-euro-symbol">€</span>
              </div>
            </div>
          </div>
        </div>

        <div className="nc-card">
          <h2 className="nc-card-title">Zones et lieux</h2>
          <div className="nc-area-row">
            <select className="nc-input nc-select nc-zone-select" value={selectedZone} onChange={e => { setSelectedZone(e.target.value); setSelectedPlace(""); }}>
              <option value="">Zone</option>
              {ZONES.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
            <select className="nc-input nc-select nc-place-select" value={selectedPlace} disabled={!selectedZone} onChange={e => setSelectedPlace(e.target.value)}>
              <option value="">{selectedZone ? "Lieu" : "Sélectionnez une zone"}</option>
              {(PLACES_BY_ZONE[selectedZone] || []).map(place => <option key={place} value={place}>{place}</option>)}
            </select>
            <button className="nc-add-place-btn" onClick={handleAddLocation} disabled={!selectedZone || !selectedPlace}>Ajouter</button>
          </div>
          {locations.length > 0 && (
            <div className="nc-places-list">
              {locations.map((item, index) => (
                <div key={item.id} className="nc-place-tag">
                  <span className="nc-place-zone">{item.zoneName}</span>
                  <span>{item.place}</span>
                  <button className="nc-place-remove" onClick={() => handleRemoveLocation(index)} aria-label="Supprimer la localisation">-</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nc-card">
          <h2 className="nc-card-title">Modifier le mot de passe</h2>
          <div className="nc-field">
            <label>Mot de passe</label>
            <div className="nc-pwd-wrapper">
              <input className="nc-input nc-pwd-input" type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} />
              <button className="nc-eye-btn" type="button" onClick={() => setShowPwd(v => !v)}><EyeIcon open={showPwd} /></button>
            </div>
            {form.password && form.password.length < 8 && <span className="nc-field-hint">8 caractères minimum</span>}
          </div>
          <div className={`nc-field ${errors.confirmPassword ? "error" : ""}`}>
            <label>Confirmer le mot de passe</label>
            <div className="nc-pwd-wrapper">
              <input className="nc-input nc-pwd-input" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
              <button className="nc-eye-btn" type="button" onClick={() => setShowConfirm(v => !v)}><EyeIcon open={showConfirm} /></button>
            </div>
            {errors.confirmPassword && <span className="nc-field-error">Les mots de passe ne correspondent pas</span>}
          </div>
        </div>
      </div>

      <aside className="nc-right">
        <div className="nc-right-card">
          <select className="nc-input nc-select nc-status-select" value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="">Statut</option>
            {STATUS_OPTIONS.map(option => <option key={option}>{option}</option>)}
          </select>
        </div>

        <FileManager selectedSrc={photo} onSelect={(src) => setPhoto(src)} />

        <div className="nc-right-card nc-right-row">
          <span className="nc-right-label">CPF</span>
          <label className="nc-toggle">
            <input type="checkbox" checked={form.cpf} onChange={e => set("cpf", e.target.checked)} />
            <span className="nc-toggle-track" />
          </label>
        </div>

        <div className="nc-right-card nc-right-row">
          <span className="nc-right-label">Type de boîte</span>
          <div className="nc-box-toggle">
            {["Manuel", "Auto"].map(option => (
              <button key={option} className={`nc-box-opt ${form.boxType === option ? "sel" : ""}`} onClick={() => set("boxType", option)}>{option}</button>
            ))}
          </div>
        </div>

        <button className="nc-add-btn" type="button" onClick={handleSave}>Ajouter le moniteur</button>
        <button
          className="cp-action-btn cp-action-giveup"
          type="button"
          style={{ marginTop: 10 }}
          onClick={handleReturn}
        >
          Abandonner
        </button>
      </aside>
    </div>
  );
}
