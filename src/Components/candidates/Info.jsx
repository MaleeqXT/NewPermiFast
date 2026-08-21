import { useState,useEffect } from "react";
import "./Info.css";
import { useLocation, useNavigate } from "react-router-dom";
// import { useCandidates } from "./CandidatesContext.jsx";
import TabInfo     from "./Tabinfo.jsx";
import TabBalance  from "./TabBalance.jsx";
import TabSkills   from "./TabSkills.jsx";
import TabBasket   from "./TabBasket.jsx";
import TabContract from "./TabContract.jsx";
import FileManager from "../shared/FileManeger.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCandidateById,selectSelectedCandidate,selectSelectedCandidateLoading,clearSelectedCandidate,updateCandidate  } from "../../redux/reducers/candidateSlice.jsx";

const BASE_URL = import.meta.env.VITE_API_URL;



const STATUS_OPTIONS = ["active", "onhold", "archived"];
const STATUS_LABEL   = { active: "Actif", onhold: "En attente", archived: "Archivé" };
const STATUS_COLORS  = {
  active:   { bg: "#dcfce7", color: "#166534" },
  onhold:   { bg: "#dbeafe", color: "#1e40af" },
  archived: { bg: "#fef9c3", color: "#854d0e" },
};

const BLANK = {
  first_name: "", last_name: "", email: "", tel: "", sexe: "Femme",
  dob: "", would: "Voiture", postal: "", address: "", neph: "",
  date_code: "", balanceAvailable: "0", estimation: "0",
  status: "active", cpf: 1, boite_type: "1",
};

function candidateToForm(data) {
  if (!data) return BLANK;
  return {
    ...BLANK,
    first_name: data.nom    ?? "",
    last_name:  data.prenom ?? "",
    would:     data.permis ?? "Voiture",
    status:    data.status ?? "active",
    balanceAvailable: data.balance ?? "0",
  };
}

function getInitials(first_name, last_name) {
  return ((first_name?.[0] || "") + (last_name?.[0] || "")).toUpperCase() || "?";
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
    const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectSelectedCandidate);
  const loading = useSelector(selectSelectedCandidateLoading);

  const location = useLocation();
  const navigate = useNavigate();
  // const { selectedCandidateId, selectedCandidate, updateCandidate } = useCandidates();

  const routeCandidate = location.state?.candidate ?? null;
  const routeAutoConnect = location.state?.autoConnect ?? autoConnect;
  // const resolvedCandidate = candidateProp ?? selectedCandidate ?? routeCandidate;
  // const initial = candidateToForm(resolvedCandidate);

    useEffect(() => {
    if (id) dispatch(fetchCandidateById(id));
    return () => dispatch(clearSelectedCandidate());
  }, [id]);



  const [form, setForm]           = useState(BLANK);
  const [committed, setCommitted] = useState(BLANK);
  const [photo, setPhoto]         = useState(null);
  const [activeTab, setActiveTab]   = useState("info");
  const [toastMessage, setToastMessage] = useState("");
const [hasInitialized, setHasInitialized] = useState(false);  
  const [mediaFile, setMediaFile] = useState(null);  // ← yeh add karo (missing tha)
const [errors, setErrors] = useState({}); 


useEffect(() => {
  if (!user || hasInitialized) return;   // ← yeh check add karo
  const populated = {
    ...BLANK,
    first_name: user.first_name ?? "",
    last_name:  user.last_name  ?? "",
    email:     user.email      ?? "",
    phone:       user.phone      ?? "",
    sexe:     user.sexe       ?? "Femme",
    date_naissance:       user.date_naissance ?? "",
    postal:    user.postal     ?? "",
    adresse :   user.adresse    ?? "",
    ville:      user.ville      ?? "",
    neph:      user.student?.neph ?? "",
    date_code:  user.student?.date_code ?? "",
    balanceAvailable: user.student?.balance ?? "0",
    estimation: user.student?.estimation ?? "0",
    status:    user.status == 1 ? "active" : "archived",
    is_cpf: user.student?.is_cpf == 1 ? 1:0,
    boite_type:user.student?.boite_type == 1 ? 1:0,
  };
  setForm(populated);
  setCommitted(populated);
  setPhoto(user.media ? `${BASE_URL}/storage/${user.media}` : null);
  setHasInitialized(true);   // ← yeh add karo
}, [user, hasInitialized]);


  const [nameModal, setNameModal] = useState(false);


  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

const handleSave = async () => {
  const formData = new FormData();

  formData.append('first_name', form.first_name);
  formData.append('last_name', form.last_name);
  formData.append('email', form.email);
  formData.append('phone', form.phone);
  formData.append('sexe', form.sexe);
  formData.append('date_naissance', form.date_naissance);
  formData.append('postal', form.postal || '');
  formData.append('adresse', form.adresse || '');
  formData.append('ville', form.ville || '');
  formData.append('status', form.status === 'active' ? 1 : 2);

  formData.append('neph', form.neph || '');
  formData.append('date_code', form.date_code || '');
  formData.append('balance', form.balanceAvailable ?? 0);
  formData.append('is_cpf', form.is_cpf ? 1 : 0);
  formData.append('boite_type', form.boite_type);

  if (form.password) {
    formData.append('password', form.password);
    formData.append('password_confirmation', form.password_confirmation);
  }

  if (mediaFile && mediaFile instanceof File) {
    formData.append('media', mediaFile);
  }

  formData.append('_method', 'PUT');

  try {
    await dispatch(updateCandidate({ id, formData })).unwrap();  // ← naam galat hai, neeche fix karenge
    setCommitted(form);
    setToastMessage("Les informations ont été modifiées avec succès.");
    setErrors({});
  } catch (err) {
    if (err?.errors) {
      setErrors(err.errors);
      setToastMessage("Veuillez corriger les erreurs.");
    } else {
      setToastMessage(err?.message || "Une erreur est survenue.");
    }
  }
};

  const handleCancel = () => setForm(committed);
  const fullName = `${committed.first_name} ${committed.last_name}`.trim();
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
                <span className="cp-admin-val">{committed.first_name} {committed.last_name}</span>
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
              onSelect={(src, file) => {
                  setPhoto(src);
                  setMediaFile(file.file); // ✅ actual File object
              }}
   
            />

            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">CPF</span>
                <label className="cp-toggle">
                  <input type="checkbox" checked={form.is_cpf} onChange={e => set("is_cpf", e.target.checked)} />
                  <span className="cp-toggle-track" />
                </label>
              </div>
            <div className="cp-right-row" style={{ marginTop:16 }}>
            <span className="cp-right-label">Type de boîte</span>
            <div className="cp-box-toggle">
              {[
                { label: "Manuelle", value: 0 },
                { label: "Auto",     value: 1 },
              ].map(opt => (
                <button
                  key={opt.value}
                  className={`cp-box-opt${form.boite_type === opt.value ? " sel" : ""}`}
                  onClick={() => set("boite_type", opt.value)}
                >
                  {opt.label}
                </button>
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
             { key: "first_name", label: "Nom", placeholder: "Nom de famille" },
            { key: "last_name", label: "Prénom", placeholder: "Prénom" },
          ]}
          values={{ last_name: form.last_name, first_name: form.first_name }}
          onSave={(updated) => {
            set("last_name",  updated.last_name);
            set("first_name", updated.first_name);
            setCommitted(prev => ({
              ...prev,
              last_name:  updated.last_name,
              first_name: updated.first_name,
            }));
          }}
          onClose={() => setNameModal(false)}
        />
      )}
    </div>
  );
}
