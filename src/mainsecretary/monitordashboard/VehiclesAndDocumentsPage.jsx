import { useState, useRef } from "react";
import "./VehiclesAndDocumentsPage.css";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconWarning = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/><path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/>
    <path d="M14 17H10"/><path d="M17 9H7l-2 4v4h14v-4z"/>
    <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
  </svg>
);
const IconId = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/>
    <path d="M14 9h4M14 12h4M14 15h2"/>
  </svg>
);
const IconLicense = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M8 9h8M8 13h4"/>
  </svg>
);
const IconDiploma = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const LEGAL_STATUS_OPTIONS = [
  "EI - Entreprise individuelle - sans TVA",
  "SARL - Société à responsabilité limitée",
  "SA - Société anonyme",
  "SAS - Société par actions simplifiée",
  "SASU - Société par actions simplifiée unipersonnelle",
  "SC - Société civile",
  "SCA - Société en commandite par actions",
  "SCIC - Société coopérative d’intérêt collectif",
];

function AddDocumentMenu({ onClose, onAdd, onPhoto }) {
  return (
    <div className="vd-doc-menu">
      <button className="vd-doc-menu-item" onClick={() => { onAdd(); onClose(); }}>
        <IconPlus /> Ajouter un document
      </button>
      <div className="vd-doc-menu-divider" />
      <button className="vd-doc-menu-item" onClick={() => { onPhoto(); onClose(); }}>
        <span style={{ fontSize: 16 }}>📷</span> Prendre une photo
      </button>
    </div>
  );
}

function DocumentsSection({ docs, setDocs }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setDocs(prev => [...prev, { name: file.name, id: Date.now() }]);
  };

  const removeDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

  return (
    <div className="vd-docs-section">
      <div className="vd-docs-header">
        <span className="vd-docs-title">Documents à téléverser</span>
        <div style={{ position: "relative" }}>
          <button className="vd-add-btn" onClick={() => setMenuOpen(o => !o)}>
            <IconPlus />
          </button>
          {menuOpen && (
            <>
              <div className="vd-menu-backdrop" onClick={() => setMenuOpen(false)} />
              <AddDocumentMenu
                onClose={() => setMenuOpen(false)}
                onAdd={() => fileRef.current?.click()}
                onPhoto={() => fileRef.current?.click()}
              />
            </>
          )}
        </div>
        <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
      </div>
      {docs.length === 0 ? (
        <div className="vd-docs-empty">Aucun document téléversé pour le moment.</div>
      ) : (
        <div className="vd-docs-list">
          {docs.map(doc => (
            <div key={doc.id} className="vd-doc-row">
              <span className="vd-doc-icon">📄</span>
              <span className="vd-doc-name">{doc.name}</span>
              <button className="vd-doc-delete" onClick={() => removeDoc(doc.id)}><IconTrash /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VehiclesPage({ onBack }) {
  const [vehicles] = useState([]);
  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={onBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Véhicule</span>
        <button className="vd-header-action"><IconPlus /></button>
      </header>
      <main className="vd-main">
        {vehicles.length === 0 ? (
          <div className="vd-empty-card">
            <IconWarning />
            <p className="vd-empty-title">Vous n’avez aucun véhicule</p>
            <p className="vd-empty-sub">Commencez par ajouter un véhicule</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function IdentityDocumentPage({ onBack }) {
  const [docs, setDocs] = useState([]);
  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={onBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Pièce d’identité</span>
      </header>
      <main className="vd-main">
        <div className="vd-info-box">
          <p className="vd-info-text">Vous devez fournir <strong>1</strong> pièce d’identité.</p>
          <p className="vd-info-text" style={{ marginTop: 6 }}>Nous acceptons :</p>
          <ul className="vd-info-list">
            <li>Carte d’identité (recto et verso)</li>
            <li>Passeport</li>
          </ul>
        </div>
        <DocumentsSection docs={docs} setDocs={setDocs} />
      </main>
      <footer className="vd-footer">
        <button className="vd-save-btn">Enregistrer</button>
      </footer>
    </div>
  );
}

function DrivingLicensePage({ onBack }) {
  const [docs, setDocs] = useState([]);
  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={onBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Permis de conduire</span>
      </header>
      <main className="vd-main">
        <div className="vd-info-box">
          <p className="vd-info-text">Veuillez fournir le recto et le verso de ce document.</p>
        </div>
        <DocumentsSection docs={docs} setDocs={setDocs} />
      </main>
      <footer className="vd-footer">
        <button className="vd-save-btn">Enregistrer</button>
      </footer>
    </div>
  );
}

function TeachingDiplomaPage({ onBack }) {
  const [docs, setDocs] = useState([{ name: "EXAM (2)", id: 1 }]);
  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={onBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Titre professionnel ECSR</span>
      </header>
      <main className="vd-main">
        <div className="vd-info-box">
          <p className="vd-info-text">BEPECASER ou qualification professionnelle de conduite</p>
        </div>
        <DocumentsSection docs={docs} setDocs={setDocs} />
      </main>
      <footer className="vd-footer">
        <button className="vd-save-btn">Enregistrer</button>
      </footer>
    </div>
  );
}

function ProfessionalDocumentsPage({ onBack }) {
  const [companyName, setCompanyName] = useState("");
  const [legalStatus, setLegalStatus] = useState("");
  const [legalOpen, setLegalOpen] = useState(false);
  const [creationDate, setCreationDate] = useState("");
  const [lace, setLace] = useState("");
  const [authNumber, setAuthNumber] = useState("");
  const [authDate, setAuthDate] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [docs, setDocs] = useState([]);

  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={onBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Documents professionnels</span>
      </header>
      <main className="vd-main">
        <section className="vd-section">
          <p className="vd-section-title">Informations sur l’entreprise</p>
          <div className="vd-form-group">
            <div className="vd-field">
              <label className="vd-field-label">Nom de l’entreprise</label>
              <input className="vd-input" placeholder="Nom de l’entreprise" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>

            <div className="vd-field" style={{ position: "relative" }}>
              <label className="vd-field-label">Statut juridique</label>
              <div className="vd-select-box" onClick={() => setLegalOpen(o => !o)}>
                <span style={{ color: legalStatus ? "#333" : "#ccc" }}>{legalStatus || "Statut juridique"}</span>
                <span style={{ fontSize: 12, color: "#ccc", transform: legalOpen ? "rotate(180deg)" : "none", transition: ".18s" }}>▾</span>
              </div>
              {legalOpen && (
                <>
                  <div className="vd-menu-backdrop" onClick={() => setLegalOpen(false)} />
                  <div className="vd-legal-dropdown">
                    {LEGAL_STATUS_OPTIONS.map(opt => (
                      <button key={opt} className={`vd-legal-option${legalStatus === opt ? " vd-legal-option--active" : ""}`}
                        onClick={() => { setLegalStatus(opt); setLegalOpen(false); }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="vd-field">
              <label className="vd-field-label">Date de création de l’entreprise</label>
              <input className="vd-input" type="date" placeholder="dd/mm/yyyy" value={creationDate} onChange={e => setCreationDate(e.target.value)} />
            </div>
            <div className="vd-field">
              <label className="vd-field-label">LACE</label>
              <input className="vd-input" placeholder="LACE" value={lace} onChange={e => setLace(e.target.value)} />
            </div>
            <div className="vd-field">
              <label className="vd-field-label">Numéro d’autorisation d’enseigner</label>
              <input className="vd-input" placeholder="Numéro d’autorisation d’enseigner" value={authNumber} onChange={e => setAuthNumber(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="vd-section">
          <p className="vd-section-title">Autorisation d’enseigner</p>
          <div className="vd-form-group">
            <div className="vd-field">
              <label className="vd-field-label">Date d’autorisation</label>
              <input className="vd-input" type="date" placeholder="dd/mm/yyyy" value={authDate} onChange={e => setAuthDate(e.target.value)} />
            </div>
            <div className="vd-field">
              <label className="vd-field-label">Date de visite</label>
              <input className="vd-input" type="date" placeholder="dd/mm/yyyy" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="vd-section">
          <p className="vd-section-title">Document(s) téléversé(s)</p>
          <DocumentsSection docs={docs} setDocs={setDocs} />
        </section>
      </main>
      <footer className="vd-footer">
        <button className="vd-save-btn">Enregistrer</button>
      </footer>
    </div>
  );
}

const MENU_ITEMS = [
  { key: "vehicles",       label: "Véhicules",              icon: <IconCar /> },
  { key: "identity",       label: "Pièce d’identité",        icon: <IconId /> },
  { key: "driving",        label: "Permis de conduire",      icon: <IconLicense /> },
  { key: "diploma",        label: "Titre professionnel",     icon: <IconDiploma /> },
  { key: "professional",   label: "Documents professionnels", icon: <IconBuilding /> },
];

export default function VehiclesAndDocumentsPage({ onBack }) {
  const [page, setPage] = useState(null);

  if (page === "vehicles") return <VehiclesPage onBack={() => setPage(null)} />;
  if (page === "identity") return <IdentityDocumentPage onBack={() => setPage(null)} />;
  if (page === "driving") return <DrivingLicensePage onBack={() => setPage(null)} />;
  if (page === "diploma") return <TeachingDiplomaPage onBack={() => setPage(null)} />;
  if (page === "professional") return <ProfessionalDocumentsPage onBack={() => setPage(null)} />;

  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={onBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Véhicules et documents</span>
      </header>
      <main className="vd-main">
        <p className="vd-hub-sub">Gérez votre véhicule et les documents requis ci-dessous.</p>
        <div className="vd-hub-list">
          {MENU_ITEMS.map((item, i) => (
            <button key={item.key} className="vd-hub-row" onClick={() => setPage(item.key)} style={{ "--i": i }}>
              <div className="vd-hub-icon">{item.icon}</div>
              <span className="vd-hub-label">{item.label}</span>
              <IconChevronRight />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
