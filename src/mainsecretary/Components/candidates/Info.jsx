import { useState } from "react";
import "./Info.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCandidates } from "./CandidatesContext.jsx";
import TabInfo     from "./Tabinfo.jsx";
import TabBalance  from "./TabBalance.jsx";
import TabSkills   from "./TabSkills.jsx";
import TabBasket   from "./TabBasket.jsx";
import TabContract from "./TabContract.jsx";
import FileManager from "../shared/FileManeger.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";


const STATUS_OPTIONS = ["active", "onhold", "archived"];
const STATUS_LABEL   = { active: "Actif", onhold: "En attente", archived: "Archivé" };
const STATUS_COLORS  = {
  active:   { bg: "#dcfce7", color: "#166534" },
  onhold:      { bg: "#dbeafe", color: "#1e40af" },
  archived: { bg: "#fef9c3", color: "#854d0e" },
};

const BLANK = {
  firstName: "", lastName: "", email: "", tel: "", genre: "Femme",
  dob: "", would: "Voiture", postal: "", address: "", neph: "",
  codeDate: "", balanceAvailable: "0", estimation: "0",
  status: "active", cpf: true, boxType: "Manuelle",
};

function candidateToForm(data) {
  if (!data) return BLANK;
  return {
    ...BLANK,
    firstName: data.nom    ?? "",
    lastName:  data.prenom ?? "",
    would:     data.permis ?? "Voiture",
    status:    data.status ?? "active",
    balanceAvailable: data.balance ?? "0",
  };
}

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

const TABS = [
  { id:"info",     label:"Informations et documents" },
  { id:"balance",  label:"Solde / Zone" },
  { id:"skills",   label:"Compétences" },
  { id:"basket",   label:"Panier candidat" },
  { id:"contract", label:"Contrat / Évaluation" },
];

const FULL_WIDTH_TABS = ["balance", "skills", "basket", "contract"];

export default function CandidateProfile({ onBack, candidate: candidateProp = null, autoConnect = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCandidateId, selectedCandidate, updateCandidate } = useCandidates();
  const routeCandidate = location.state?.candidate ?? null;
  const routeAutoConnect = location.state?.autoConnect ?? autoConnect;
  const resolvedCandidate = candidateProp ?? selectedCandidate ?? routeCandidate;
  const initial = candidateToForm(resolvedCandidate);

  const [form, setForm]             = useState(initial);
  const [committed, setCommitted]   = useState(initial);
  const [photo, setPhoto]           = useState(resolvedCandidate?.photo ?? null);
  const [activeTab, setActiveTab]   = useState("info");
  const [toastMessage, setToastMessage] = useState("");

  const [nameModal, setNameModal] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    setCommitted(form);
    setToastMessage("Les informations ont été modifiées avec succès.");
    if (selectedCandidateId) updateCandidate(selectedCandidateId, form, photo);
  };

  const handleCancel = () => setForm(committed);
  const fullName = `${committed.firstName} ${committed.lastName}`.trim();
  const saveProps = { form, set, onSave: handleSave, onCancel: handleCancel, onOpenNameModal: () => setNameModal(true), autoConnect: routeAutoConnect };
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
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
        </button>
        <h1 className="cp-title">{fullName || "—"}</h1>
      </div>

      {/* Tabs — wrapped in scroll container for mobile */}
      <div className="cp-tabs-bar">
        <div className="cp-tabs-scroll">
          <div className="cp-tabs-pill">
            {TABS.map(tab => (
              <button key={tab.id} className={`cp-tab-btn${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isFullWidth && (
        <div className="cp-fullwidth-tab">
          {activeTab === "balance"  && <TabBalance />}
          {activeTab === "skills"   && <TabSkills />}
          {activeTab === "basket"   && <TabBasket />}
          {activeTab === "contract" && <TabContract />}
        </div>
      )}

      {activeTab === "info" && (
        <div className="cp-body">
          <div className="cp-form-card">
            <TabInfo {...saveProps} committed={committed} />
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="cp-right">
            <div className="cp-admin-card">
              <h3 className="cp-admin-title">Informations administratives</h3>

              <div className="cp-admin-row">
                <span className="cp-admin-label">Nom</span>
                <span className="cp-admin-val">{committed.firstName} {committed.lastName}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">E-mail</span>
                <span className="cp-admin-val">{committed.email || "—"}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Téléphone</span>
                <span className="cp-admin-val">{committed.tel ? `+33${committed.tel.replace(/^0/, "")}` : "—"}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Code postal / Ville</span>
                <span className="cp-admin-val">{committed.postal || "—"}</span>
              </div>
            </div>

            {/* ── Statut ── */}
            <div className="cp-right-card">
              <div className="cp-right-row" style={{ flexDirection:"column", alignItems:"flex-start", gap:8 }}>
                <span className="cp-right-label">Statut</span>
                <select className="cp-input" value={form.status} onChange={e => set("status", e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
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
              <div className="cp-right-row" style={{ marginTop:16 }}>
                <span className="cp-right-label">Type de boîte</span>
                <div className="cp-box-toggle">
                  {["Manuelle","Auto"].map(opt => (
                    <button key={opt} className={`cp-box-opt${form.boxType === opt ? " sel" : ""}`} onClick={() => set("boxType", opt)}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>

            <button className="cp-action-btn cp-action-modifier" onClick={handleSave}>
              Modifier le candidat
            </button>
            <button className="cp-action-btn cp-action-giveup">Abandonner</button>
          </aside>
        </div>
      )}

      {/* ── Modal ── */}
      {nameModal && (
        <EditFieldModal
          title="Modifier le nom"
          fields={[
            { key: "firstName", label: "Nom", placeholder: "Nom de famille" },
            { key: "lastName", label: "Prénom", placeholder: "Prénom" },
          ]}
          values={{ lastName: form.lastName, firstName: form.firstName }}
          onSave={(updated) => {
            set("lastName",  updated.lastName);
            set("firstName", updated.firstName);
            setCommitted(prev => ({
              ...prev,
              lastName:  updated.lastName,
              firstName: updated.firstName,
            }));
          }}
          onClose={() => setNameModal(false)}
        />
      )}
    </div>
  );
}
