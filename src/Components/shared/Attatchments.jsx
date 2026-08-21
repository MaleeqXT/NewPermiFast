import { useState } from "react";
import "./Attatchments.css";
import FileManager from "./FileManeger.jsx";

// ── Icône état vide ───────────────────────────────────────────────────────
const DocIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9cdd4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
  </svg>
);

// ── Carte document individuelle ───────────────────────────────────────────
function DocumentCard({ title, subtitle, bullets, documents, onAdd }) {
  return (
    <div className="tb-doc-card">
      <div className="tb-doc-card-header">
        <div>
          <h3 className="tb-doc-title">{title}</h3>
          {subtitle && <p className="tb-doc-subtitle">{subtitle}</p>}
          {bullets && (
            <ul className="tb-doc-bullets">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
        <button className="tb-add-doc-btn" onClick={onAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Ajouter un document
        </button>
      </div>

      <div className="tb-doc-empty-area">
        {documents.length === 0 ? (
          <div className="tb-doc-empty">
            <DocIcon />
            <span className="tb-doc-empty-title">Aucun document</span>
            <span className="tb-doc-empty-sub">Aucun document n'a encore été ajouté.</span>
          </div>
        ) : (
          <div className="tb-doc-files">
            {documents.map((doc, i) => (
              <div key={i} className="tb-doc-file-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                <span className="tb-doc-file-name">{doc.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────
export default function TabBasket() {
  const [activeTab, setActiveTab] = useState("personal");

  const [identityDocs, setIdentityDocs] = useState([]);
  const [drivingDocs,  setDrivingDocs]  = useState([]);
  const [diplomaDocs,  setDiplomaDocs]  = useState([]);

  const [profForm, setProfForm] = useState({
    companyName:        "",
    companyDate:        "",
    place:              "",
    teachingAuthNumber: "",
    authDate:           "",
    visitDate:          "",
  });
  const [authDocs, setAuthDocs] = useState([]);

  const setProfField = (k, v) => setProfForm(f => ({ ...f, [k]: v }));

  const [currentSetter, setCurrentSetter] = useState(null);
  const [managerOpen,   setManagerOpen]   = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  function openFilePicker(setter) {
    setCurrentSetter(() => setter);
    setManagerOpen(true);
  }

  function handleDismiss() {
    setDrivingDocs([]);
    setDiplomaDocs([]);
    setAuthDocs([]);
    setProfForm({ companyName: "", companyDate: "", place: "", teachingAuthNumber: "", authDate: "", visitDate: "" });
  }

  function handleSave() {
    alert("Documents enregistrés !");
  }

  return (
    <div className="tb-attach-page">

      {/* En-tête */}
      <div className="tb-attach-header">
        <h1 className="tb-attach-title">Pièces jointes</h1>
      </div>

      {/* Onglets pill */}
      <div className="tb-attach-tabs">
        <div className="tb-attach-pill">
          <button
            className={`tb-attach-tab ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Documents personnels
          </button>
          <button
            className={`tb-attach-tab ${activeTab === "professional" ? "active" : ""}`}
            onClick={() => setActiveTab("professional")}
          >
            Documents professionnels
          </button>
        </div>
      </div>

      {/* ── ONGLET PERSONNEL ── */}
      {activeTab === "personal" && (
        <div className="tb-attach-body">
          <DocumentCard
            title="Document d'identité"
            subtitle={`${identityDocs.length} document(s) d'identité.`}
            bullets={["Carte d'identité (recto et verso)", "Le passeport"]}
            documents={identityDocs}
            onAdd={() => openFilePicker(setIdentityDocs)}
          />
          <div className="tb-attach-body">
            <DocumentCard
              title="Permis de conduire"
              subtitle="Veuillez fournir le recto et le verso de ce document."
              bullets={null}
              documents={drivingDocs}
              onAdd={() => openFilePicker(setDrivingDocs)}
            />
            <DocumentCard
              title="Diplôme d'enseignement | Titre professionnel ECSR"
              subtitle="BEPECASER ou Titre professionnel de conducteur"
              bullets={null}
              documents={diplomaDocs}
              onAdd={() => openFilePicker(setDiplomaDocs)}
            />
            <div className="tb-attach-footer">
              <button className="tb-dismiss-btn" onClick={handleDismiss}>Annuler</button>
              <button className="tb-save-docs-btn" onClick={handleSave}>Enregistrer les documents</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ONGLET PROFESSIONNEL ── */}
      {activeTab === "professional" && (
        <div className="tb-attach-body">

          {/* Carte 1 : Formulaire documents professionnels */}
          <div className="tb-doc-card">
            <h3 className="tb-doc-title">Documents professionnels</h3>

            <div className="tb-prof-grid">
              <div className="tb-prof-field">
                <input
                  className="tb-prof-input"
                  placeholder="Nom de l'entreprise"
                  value={profForm.companyName}
                  onChange={e => setProfField("companyName", e.target.value)}
                />
              </div>
              <div className="tb-prof-field">
                <div className="tb-prof-input tb-prof-date-field">
                  <span className="tb-prof-date-label">Date de création de l'entreprise</span>
                  <input
                    className="tb-prof-date-input"
                    type="date"
                    value={profForm.companyDate}
                    onChange={e => setProfField("companyDate", e.target.value)}
                    placeholder="jj/mm/aaaa"
                  />
                </div>
              </div>
              <div className="tb-prof-field">
                <input
                  className="tb-prof-input"
                  placeholder="Lieu"
                  value={profForm.place}
                  onChange={e => setProfField("place", e.target.value)}
                />
              </div>
              <div className="tb-prof-field">
                <input
                  className="tb-prof-input"
                  placeholder="Numéro d'autorisation d'enseigner"
                  value={profForm.teachingAuthNumber}
                  onChange={e => setProfField("teachingAuthNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Carte 2 : Autorisation d'enseigner */}
          <div className="tb-doc-card">
            <div className="tb-doc-card-header">
              <div>
                <h3 className="tb-doc-title">Autorisation d'enseigner</h3>
                <p className="tb-doc-subtitle">Veuillez fournir le recto et le verso de ce document.</p>
              </div>
              <button className="tb-add-doc-btn" onClick={() => openFilePicker(setAuthDocs)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Ajouter un document
              </button>
            </div>

            {/* Champs de dates */}
            <div className="tb-prof-grid">
              <div className="tb-prof-field">
                <div className="tb-prof-input tb-prof-date-field">
                  <span className="tb-prof-date-label">Date d'autorisation</span>
                  <input
                    className="tb-prof-date-input"
                    type="date"
                    value={profForm.authDate}
                    onChange={e => setProfField("authDate", e.target.value)}
                    placeholder="jj/mm/aaaa"
                  />
                </div>
              </div>
              <div className="tb-prof-field">
                <div className="tb-prof-input tb-prof-date-field">
                  <span className="tb-prof-date-label">Date de visite</span>
                  <input
                    className="tb-prof-date-input"
                    type="date"
                    value={profForm.visitDate}
                    onChange={e => setProfField("visitDate", e.target.value)}
                    placeholder="jj/mm/aaaa"
                  />
                </div>
              </div>
            </div>

            {/* Documents téléchargés */}
            <div className="tb-downloaded-section">
              <span className="tb-downloaded-label">Document(s) téléchargé(s)</span>
              <div className="tb-doc-empty-area" style={{ marginTop: 12 }}>
                {authDocs.length === 0 ? (
                  <div className="tb-doc-empty">
                    <DocIcon />
                    <span className="tb-doc-empty-title">Aucun document</span>
                    <span className="tb-doc-empty-sub">Aucun document n'a encore été ajouté.</span>
                  </div>
                ) : (
                  <div className="tb-doc-files">
                    {authDocs.map((doc, i) => (
                      <div key={i} className="tb-doc-file-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                        <span className="tb-doc-file-name">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="tb-attach-footer">
            <button className="tb-dismiss-btn" onClick={handleDismiss}>Annuler</button>
            <button className="tb-save-docs-btn" onClick={handleSave}>Enregistrer les documents</button>
          </div>

        </div>
      )}

      <FileManager
        variant="hidden"
        selectedSrc={selectedMedia}
        openOverride={managerOpen}
        onRequestClose={() => setManagerOpen(false)}
        onSelect={(src) => {
          setSelectedMedia(src);
          if (!src || !currentSetter) return;
          currentSetter((prev) => [...prev, { name: `Document ${prev.length + 1}`, url: src }]);
          setManagerOpen(false);
        }}
      />
    </div>
  );
}