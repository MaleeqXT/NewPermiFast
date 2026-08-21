import { useState, useEffect } from "react";

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
import "../candidates/Info.css";
import "./AddMonitor.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useMonitors } from "./MonitorsContext.jsx";
import FileManager from "../shared/FileManeger.jsx";
import TabInfo from "../candidates/Tabinfo.jsx";
import Document from "../shared/Document.jsx";
import Attatchments from "../shared/Attatchments.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";

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

const BLANK = {
  firstName: "", lastName: "", email: "", tel: "", genre: "Women",
  dob: "", would: "Voiture", postal: "", address: "",
  iban: "", bic: "", department: "", authorizationNumber: "", carRates: "", tuitionFees: "",
  password: "", confirmPassword: "",
  status: "active", cpf: true, boxType: "Manuel", locations: [],
};

function monitorToForm(data) {
  if (!data) return BLANK;
  return {
    ...BLANK,
    firstName: data.prenom ?? "",
    lastName: data.nom ?? "",
    email: data.email ?? "",
    tel: data.tel ?? "",
    would: data.would ?? "Voiture",
    status: data.status ?? "active",
    postal: data.postal ?? "",
    iban: data.iban ?? "",
    bic: data.bic ?? "",
    department: data.department ?? "",
    authorizationNumber: data.authorizationNumber ?? "",
    carRates: data.carRates ?? "",
    tuitionFees: data.tuitionFees ?? "",
    password: "",
    confirmPassword: "",
    locations: Array.isArray(data.locations) ? data.locations : [],
  };
}

const TABS = [
  { id: "info", label: "Informations et documents" },
  { id: "invoices", label: "Factures et paiements" },
  { id: "attachments", label: "Pièces jointes" },
];
const FULL_WIDTH_TABS = ["invoices", "attachments"];

export default function MonitorsInfo({ monitor: monitorProp = null, onBack, autoConnect = false }) {
  const { monitors, updateMonitor } = useMonitors();
  const location = useLocation();
  const navigate = useNavigate();
  const routeAutoConnect = location.state?.autoConnect ?? autoConnect;

  const monitorId = location.state?.monitorId;
  const monitor = monitorProp ?? (monitorId ? monitors.find(m => m.id === monitorId) : location.state?.monitor);
  const initial = monitorToForm(monitor);

  const [form, setForm] = useState(initial);
  const [committed, setCommitted] = useState(initial);
  const [photo, setPhoto] = useState(monitor?.photo ?? null);
  const [activeTab, setActiveTab] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [nameModal, setNameModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [locations, setLocations] = useState(initial.locations || []);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (routeAutoConnect && monitor?.id) {
      navigate("/monitor-dashboard", {
        state: {
          fromSecretaryDashboard: true,
          returnTo: location.pathname || "/monitors-info",
          monitor_id: monitor?.id ?? null,
        },
        replace: true,
      });
    }
  }, [location.pathname, monitor?.id, navigate, routeAutoConnect]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  function syncLocations(nextLocations) {
    setLocations(nextLocations);
    setForm(prev => ({
      ...prev,
      locations: nextLocations.map(({ zoneId, zoneName, place }) => ({ zoneId, zoneName, place })),
    }));
  }

  function handleAddLocation() {
    if (!selectedZone || !selectedPlace) return;
    const zone = ZONES.find(item => String(item.id) === String(selectedZone));
    if (!zone) return;
    const next = [...locations, { id: Date.now() + Math.random(), zoneId: zone.id, zoneName: zone.name, place: selectedPlace }];
    syncLocations(next);
    setSelectedPlace("");
  }

  function handleRemoveLocation(index) {
    const next = locations.filter((_, currentIndex) => currentIndex !== index);
    syncLocations(next);
  }

  const handleSave = () => {
    const nextForm = { ...form, locations: locations.map(({ zoneId, zoneName, place }) => ({ zoneId, zoneName, place })) };
    setCommitted(nextForm);
    setForm(nextForm);
    setToastMessage("Les informations ont été modifiées avec succès.");
    if (monitor?.id) updateMonitor(monitor.id, nextForm, photo);
  };

  const handleCancel = () => setForm(committed);
  const fullName = `${committed.firstName} ${committed.lastName}`.trim();
  const saveProps = {
    form,
    set,
    onSave: handleSave,
    onCancel: handleCancel,
    onOpenNameModal: () => setNameModal(true),
    showRapport: false,
    onConnect: () => navigate("/monitor-dashboard", {
      state: {
        fromSecretaryDashboard: true,
        returnTo: location.pathname || "/monitors-info",
        monitor_id: monitor?.id ?? null,
      },
    }),
    showBalanceSection: false,
    showPasswordSection: false,
  };
  const isFullWidth = FULL_WIDTH_TABS.includes(activeTab);

  return (
    <div className="cp-page">
      {toastMessage && <ActionToast message={toastMessage} onClose={() => setToastMessage("")} />}
      <div className="cp-header">
        <button
          className="cp-back"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            navigate(-1);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </button>
        <h1 className="cp-title">{fullName || "—"}</h1>
      </div>

      <div className="cp-tabs-bar">
        <div className="cp-tabs-pill">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`cp-tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isFullWidth && (
        <div className="cp-fullwidth-tab">
          {activeTab === "invoices" && <Document />}
          {activeTab === "attachments" && <Attatchments />}
        </div>
      )}

      {activeTab === "info" && (
        <div className="cp-body">
          <div className="cp-form-card">
            <TabInfo
              {...saveProps}
              committed={committed}
              beforeActions={
                <>
            <div className="nc-card" style={{ marginTop: 20 }}>
              <h2 className="nc-card-title">Informations bancaires</h2>
              <div className="nc-field">
                <input className="nc-input nc-placeholder-input" placeholder="IBAN" value={form.iban} onChange={e => set("iban", e.target.value)} />
              </div>
              <div className="nc-field">
                <input className="nc-input nc-placeholder-input" placeholder="BIC" value={form.bic} onChange={e => set("bic", e.target.value)} />
              </div>
            </div>

            <div className="nc-card" style={{ marginTop: 20 }}>
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

            <div className="nc-card" style={{ marginTop: 20 }}>
              <h2 className="nc-card-title">Zones et lieux</h2>
              <div className="nc-area-row">
                <select
                  className="nc-input nc-select nc-zone-select"
                  value={selectedZone}
                  onChange={e => { setSelectedZone(e.target.value); setSelectedPlace(""); }}
                >
                  <option value="">Zone</option>
                  {ZONES.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
                <select
                  className="nc-input nc-select nc-place-select"
                  value={selectedPlace}
                  disabled={!selectedZone}
                  onChange={e => setSelectedPlace(e.target.value)}
                >
                  <option value="">{selectedZone ? "Lieu" : "Sélectionnez une zone"}</option>
                  {(PLACES_BY_ZONE[selectedZone] || []).map(place => <option key={place} value={place}>{place}</option>)}
                </select>
                <button className="nc-add-place-btn" type="button" onClick={handleAddLocation} disabled={!selectedZone || !selectedPlace}>Ajouter</button>
              </div>
              {locations.length > 0 && (
                <div className="nc-places-list">
                  {locations.map((item, index) => (
                    <div key={item.id} className="nc-place-tag">
                      <span className="nc-place-zone">{item.zoneName}</span>
                      <span>{item.place}</span>
                      <button className="nc-place-remove" type="button" onClick={() => handleRemoveLocation(index)} aria-label="Supprimer la localisation">-</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="nc-card" style={{ marginTop: 20 }}>
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
                </>
              }
            />
          </div>

          <aside className="cp-right">
            <div className="cp-admin-card">
              <h3 className="cp-admin-title">Informations administratives</h3>
              <div className="cp-admin-row">
                <span className="cp-admin-label">E-mail</span>
                <span className="cp-admin-val">{committed.email || "â€”"}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">TÃ©lÃ©phone</span>
                <span className="cp-admin-val">
                  {committed.tel ? `+33${committed.tel.replace(/^0/, "")}` : "â€”"}
                </span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Code postal / Ville</span>
                <span className="cp-admin-val">{committed.postal || "â€”"}</span>
              </div>
            </div>

            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">Statut</span>
                <select className="cp-input" value={form.status} onChange={e => set("status", e.target.value)}>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="onhold">En attente</option>
                  <option value="archived">ArchivÃ©</option>
                </select>
              </div>
            </div>

            <FileManager
              selectedSrc={photo}
              onSelect={(src) => setPhoto(src)}
            />

            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">CPF</span>
                <label className="cp-toggle">
                  <input type="checkbox" checked={form.cpf} onChange={e => set("cpf", e.target.checked)} />
                  <span className="cp-toggle-track" />
                </label>
              </div>
              <div className="cp-right-row" style={{ marginTop: 16 }}>
                <span className="cp-right-label">Type de boÃ®te</span>
                <div className="cp-box-toggle">
                  {["Manuel", "Auto"].map(opt => (
                    <button key={opt} className={`cp-box-opt${form.boxType === opt ? " sel" : ""}`} onClick={() => set("boxType", opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="nc-add-btn" type="button" onClick={handleSave}>
              Modifier le moniteur
            </button>
            <button className="cp-action-btn cp-action-giveup" type="button" onClick={handleCancel}>Abandonner</button>
          </aside>
        </div>
      )}

      {nameModal && (
        <EditFieldModal
          title="Modifier le nom"
          fields={[
             { key: "firstName", label: "Nom", placeholder: "Nom de famille" },
            { key: "lastName", label: "Prénom", placeholder: "Prénom" },
          ]}
          values={{ lastName: form.lastName, firstName: form.firstName }}
          onSave={(updated) => {
            set("lastName", updated.lastName);
            set("firstName", updated.firstName);
            setCommitted(prev => ({
              ...prev,
              lastName: updated.lastName,
              firstName: updated.firstName,
            }));
          }}
          onClose={() => setNameModal(false)}
        />
      )}
    </div>
  );
}
