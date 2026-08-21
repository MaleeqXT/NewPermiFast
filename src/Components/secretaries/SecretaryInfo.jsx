import { useState,useEffect } from "react";
import "../candidates/Info.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SecretaryInfo1 from './SecretaryInfo1.jsx';
import FileManager from "../shared/FileManeger.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSecretaryById } from "../../redux/reducers/adminSecretarySlice.jsx";
import { updateSecretary } from "../../redux/reducers/adminSecretarySlice.jsx";
const BASE_URL = import.meta.env.VITE_API_URL;
const BLANK = {
  first_name: "", lastName: "", email: "", phone: "", sexe: "Women",
  date_naissance: "", postal: "", adresse: "", neph: "",
  date_of_code: "", balanceAvailable: "0", estimation: "0",
  status: "active", cpf: true, boxType: "Manuel",
  password: "", password_confirmation: "",

};

function normalizeStatus(status) {
  if (!status) return "active";
  const normalized = String(status).toLowerCase();
  if (normalized === "active" || normalized === "inactive" || normalized === "onhold" || normalized === "archived") {
    return normalized;
  }
  return "active";
}

function candidateToForm(data) {
  if (!data) return BLANK;
  return {
    ...BLANK,
    first_name: data.nom    ?? "",
    last_name:  data.prenom ?? "",
    email:     data.email  ?? "",
    status:    normalizeStatus(data.status),
    balanceAvailable: data.balance ?? "0",
  };
}

const TABS = [{ id: "info", label: "Informations et documents" }];

export default function CandidateProfile({ candidateId, initialData, onSaveProfile, onBack }) {
    const { id } = useParams();
      const [photo,      setPhoto]      = useState();

    const dispatch = useDispatch();
    const { selected: secretaryData, selectedLoading } = useSelector(state => state.secretaries);

    useEffect(() => {
        if (id) dispatch(fetchSecretaryById(id));
    }, [id]);

    console.log(secretaryData);

    useEffect(() => {
    if (!secretaryData) return;
    
    const populated = {
        ...BLANK,
        first_name: secretaryData.user?.first_name ?? "",
        last_name:  secretaryData.user?.last_name  ?? "",
        email:     secretaryData.user?.email      ?? "",
        phone:       secretaryData.user?.phone       ?? "",
        sexe:     secretaryData.user?.sexe        ?? "",
        date_naissance:secretaryData.user?.date_naissance ?? "",
        postal:    secretaryData.user?.postal      ?? "",
        adresse:   secretaryData.user?.adresse     ?? "",
        neph:      secretaryData.neph              ?? "",
        date_of_code:  secretaryData.date_of_code      ?? "",
        status:    secretaryData.status == 1 ? "active" : "inactive",
    };

    setForm(populated);
    setCommitted(populated);
    setPhoto(secretaryData.user?.media 
        ? `${BASE_URL}/storage/${secretaryData.user.media}` 
        : null
    );
}, [secretaryData]);

  

  const location = useLocation();
  const navigate = useNavigate();
  // const sourceData = initialData ?? location.state?.secretary ?? null;
  // const initial = candidateToForm(sourceData);
  const initial = BLANK;
  const [form,       setForm]       = useState(initial);
  const [committed,  setCommitted]  = useState(initial);
  const [errors, setErrors] = useState({});

  const [activeTab,  setActiveTab]  = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [mediaFile, setMediaFile] = useState(null);


  // ── modal flag ────────────────────────────────────────────────────────
  const [nameModal, setNameModal] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // const handleSave = () => {
  //   setCommitted(form);
  //   setToastMessage("Les informations ont été modifiées avec succès.");
  //   if (onSaveProfile) onSaveProfile(candidateId, form, photo);
  // };

  const handleCancel = () => setForm(committed);

  const fullName = `${committed.first_name} ${committed.last_name}`.trim();

  // ── pass onOpenNameModal so SecretaryInfo1's ✎ button works ──────────
 const handleSave = async () => {
  // console.log(mediaFile);
  // console.log(mediaFile.file);
  
    const formData = new FormData();
    formData.append('first_name', form.first_name);
    formData.append('last_name',  form.last_name);
    formData.append('email',      form.email);
    formData.append('phone',      form.phone);
    formData.append('sexe',       form.sexe);
    formData.append('date_naissance', form.date_naissance);
    formData.append('postal',     form.postal     || '');
    formData.append('adresse',    form.adresse);
    formData.append('status',     form.status === 'active' ? 1 : 2);
    formData.append('neph',       form.neph       || '');
    formData.append('date_of_code', form.date_of_code || '');
    if (form.password) {
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);
    }
    
    // ✅ Sirf nai File object ho tabhi append karo:
   if (mediaFile && mediaFile.file instanceof File) {
    formData.append('media', mediaFile.file);
}
    // ❌ Purani image URL/base64 ko mat bhejo

    try {
        await dispatch(updateSecretary({ id, formData })).unwrap();
        setCommitted(form);
        setToastMessage("Les informations ont été modifiées avec succès.");
        setErrors("");
    } catch (err) {
        // 422 validation errors
        if (err?.errors) {
            setErrors(err.errors);
            setToastMessage("Veuillez corriger les erreurs.");
        } else {
            setToastMessage(err?.message || "Une erreur est survenue.");
        }
    }

};

  const saveProps = {
    form, set,  errors,
    onSave: handleSave,
    onCancel: handleCancel,
    onOpenNameModal: () => setNameModal(true),
    onConnect: () => navigate("/secretary-dashboard"),
  };



  return (
    <div className="cp-page">
      {toastMessage && <ActionToast message={toastMessage} onClose={() => setToastMessage("")} />}

      {/* En-tête */}
      <div className="cp-header">
        <Link to="/secretaries">
          <button className="cp-back" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>
        </Link>
        <h1 className="cp-title">{fullName || "—"}</h1>
      </div>

      {/* Onglets */}
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

      {/* Onglet info */}
      {activeTab === "info" && (
        <div className="cp-body">
          <div className="cp-form-card">
            <SecretaryInfo1 {...saveProps} committed={committed} />
          </div>

          <aside className="cp-right">
            {/* Carte informations administratives */}
            <div className="cp-admin-card">
              <h3 className="cp-admin-title">Informations administratives</h3>
              <div className="cp-admin-row">
                <span className="cp-admin-label">E-mail</span>
                <span className="cp-admin-val">{committed.email || "—"}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Téléphone</span>
                <span className="cp-admin-val">
                  {committed.phone ? `+33${committed.phone.replace(/^0/, "")}` : "—"}
                </span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Code postal / Ville</span>
                <span className="cp-admin-val">{committed.postal || "—"}</span>
              </div>
            </div>

            {/* Statut */}
            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">Statut</span>
                <select className="cp-input" value={form.status} onChange={e => set("status", e.target.value)}>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            <FileManager
              selectedSrc={photo}
              onSelect={(src, file) => {
                  setPhoto(src);
                  setMediaFile(file);  // ✅ actual File object
              }}
            />

            {/* CPF + Type de boîte */}
            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">CPF</span>
                <label className="cp-toggle">
                  <input type="checkbox" checked={form.cpf} onChange={e => set("cpf", e.target.checked)} />
                  <span className="cp-toggle-track" />
                </label>
              </div>
              <div className="cp-right-row" style={{ marginTop: 16 }}>
                <span className="cp-right-label">Type de boîte</span>
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
              Modifier la secrétaire
            </button>
            <button className="cp-action-btn cp-action-giveup">Abandonner</button>
          </aside>
        </div>
      )}

      {/* ── EditFieldModal — s'ouvre au clic sur ✎ dans SecretaryInfo1 ── */}
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
            setCommitted(prev => ({ ...prev, last_name: updated.last_name, first_name: updated.first_name }));
          }}
          onClose={() => setNameModal(false)}
        />
      )}
    </div>
  );
}
