import { useState, useRef } from "react";
import "../candidates/Info.css";
import { Link, useLocation } from "react-router-dom";
import FileManager from "../shared/FileManeger.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";
import AdministratorInfo1 from "./AdministratorInfo1.jsx";

import { updateAdmin} from "../../redux/reducers/adminsSlice";
import { useDispatch } from "react-redux";


const BLANK = {
  firstName: "", lastName: "", email: "", tel: "",
  dob: "", postal: "", address: "", neph: "",
  codeDate: "", balanceAvailable: "0", estimation: "0",
  status: "Actif", cpf: true, boxType: "Manuel",
};

function candidateToForm(data) {
  if (!data) return BLANK;
  return {
    ...BLANK,
    firstName: data.first_name    ?? "",
    lastName:  data.last_name ?? "",
    email:     data.email  ?? "",
    tel:       data.phone  ?? "",
    address:   data.adresse    ?? "",
    status:    data.status ?? "Actif",
  };
}

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

const TABS = [
  { id: "info", label: "Informations et document" },
];

export default function CandidateProfile({ candidateId, initialData, onSaveProfile, onBack }) {
    const dispatch = useDispatch();

  const location   = useLocation();
  const sourceData = initialData ?? location.state?.admin ?? null;
  const initial    = candidateToForm(sourceData);

  const [form,       setForm]       = useState(initial);
  const [committed,  setCommitted]  = useState(initial);
  const [photo,      setPhoto]      = useState(sourceData?.photo ?? null);
  const [activeTab,  setActiveTab]  = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [nameModal,  setNameModal]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  const fileRef = useRef(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updateAdmin({
        id: sourceData.id,
        formData: {
          first_name: form.firstName,
          last_name:  form.lastName,
          email:      form.email,
          phone:      form.tel,
          status:     form.status,
          media:      photo ?? "",
        }
      })).unwrap();

      setCommitted(form);
      setToastMessage("Les informations ont été modifiées avec succès.");
    } catch (err) {
      setToastMessage("Erreur lors de la modification.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setForm(committed);

  const fullName = `${committed.firstName} ${committed.lastName}`.trim();

  const saveProps = {
    form, set,
    onSave:          handleSave,
    onCancel:        handleCancel,
    onOpenNameModal: () => setNameModal(true),
  };

  return (
    <div className="cp-page">
      {toastMessage && <ActionToast message={toastMessage} onClose={() => setToastMessage("")} />}

      {/* En-tête */}
      <div className="cp-header">
        <Link to="/administrations">
          <button className="cp-back" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>
        </Link>
        <h1 className="cp-title">{fullName || "—"}</h1>
      </div>

      {/* Onglets pill */}
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

      {/* Onglet informations */}
      {activeTab === "info" && (
        <div className="cp-body">
          <div className="cp-form-card">
            <AdministratorInfo1 {...saveProps} committed={committed} />
          </div>

          <aside className="cp-right">
            <div className="cp-admin-card">
              <h3 className="cp-admin-title">Informations administratives </h3>
              <div className="cp-admin-row">
                <span className="cp-admin-label">E-mail</span>
                <span className="cp-admin-val">{committed.email || "—"}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Numéro de téléphone</span>
                <span className="cp-admin-val">
                  {committed.tel ? `${committed.tel.replace(/^0/, "")}` : "—"}
                </span>
              </div>
           
            </div>

            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">Statut</span>
                <select className="cp-input" value={form.status} onChange={e => set("status", e.target.value)}>
                  <option value="1">Actif</option>
                  <option value="2">Inactif</option>
                  <option value="0">En attente</option>
                </select>
              </div>
            </div>

            <FileManager
              selectedSrc={photo}
              onSelect={(src) => setPhoto(src)}
            />

 

            <button className="nc-add-btn" onClick={handleSave}>
              Modifier l'administrateur
            </button>
            <button className="cp-action-btn cp-action-giveup">Abandonner</button>
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
            set("lastName",  updated.lastName);
            set("firstName", updated.firstName);
            setCommitted(prev => ({ ...prev, lastName: updated.lastName, firstName: updated.firstName }));
          }}
          onClose={() => setNameModal(false)}
        />
      )}
    </div>
  );
}
