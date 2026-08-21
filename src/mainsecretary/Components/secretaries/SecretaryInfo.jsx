import { useState } from "react";
import "../candidates/Info.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SecretaryInfo1 from './SecretaryInfo1.jsx';
import FileManager from "../shared/FileManeger.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";

const BLANK = {
  firstName: "", lastName: "", email: "", tel: "", genre: "Women",
  dob: "", postal: "", address: "", neph: "",
  codeDate: "", balanceAvailable: "0", estimation: "0",
  status: "active", cpf: true, boxType: "Manuel",
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
    firstName: data.nom    ?? "",
    lastName:  data.prenom ?? "",
    email:     data.email  ?? "",
    status:    normalizeStatus(data.status),
    balanceAvailable: data.balance ?? "0",
  };
}

const TABS = [{ id: "info", label: "Informations et documents" }];

export default function CandidateProfile({ candidateId, initialData, onSaveProfile, onBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const sourceData = initialData ?? location.state?.secretary ?? null;
  const initial = candidateToForm(sourceData);

  const [form,       setForm]       = useState(initial);
  const [committed,  setCommitted]  = useState(initial);
  const [photo,      setPhoto]      = useState(sourceData?.photo ?? null);
  const [activeTab,  setActiveTab]  = useState("info");
  const [toastMessage, setToastMessage] = useState("");

  // ── modal flag ────────────────────────────────────────────────────────
  const [nameModal, setNameModal] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    setCommitted(form);
    setToastMessage("Les informations ont été modifiées avec succès.");
    if (onSaveProfile) onSaveProfile(candidateId, form, photo);
  };

  const handleCancel = () => setForm(committed);

  const fullName = `${committed.firstName} ${committed.lastName}`.trim();

  // ── pass onOpenNameModal so SecretaryInfo1's ✎ button works ──────────
  const saveProps = {
    form, set,
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
                  {committed.tel ? `+33${committed.tel.replace(/^0/, "")}` : "—"}
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
                  <option value="onhold">En attente</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>

            <FileManager
              selectedSrc={photo}
              onSelect={(src) => setPhoto(src)}
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
