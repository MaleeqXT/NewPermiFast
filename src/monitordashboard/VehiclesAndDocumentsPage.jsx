import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./VehiclesAndDocumentsPage.css";
import {
  uploadMedia,
  removeUploadedMedia,
  clearUploadedMedia,
  selectUploadedMedia,
  selectMediaUploading,
  selectMediaUploadError,
} from "../redux/reducers/mediaControlSlice.jsx";
import {
  storeMonitorDocuments,
  fetchIdentityDocuments,
  fetchPermisDocuments,
  fetchDiplomDocuments,
  selectIdentityMedia,
  selectIdentityFetching,
  selectPermisMedia,
  selectPermisFetching,
  selectDiplomMedia,
  selectDiplomFetching,
  selectDocumentsSaving,
  selectDocumentsSuccess,
  selectDocumentsError,
  clearDocumentsState,
} from "../redux/reducers/monitorDocumentsSlice.jsx";
import {
  fetchProfessionalDocuments,
  storeProfessionalDocuments,
  selectProfessionalData,
  selectProfessionalSavedMedia,
  selectProfessionalFetching,
  selectProfessionalSaving,
  selectProfessionalSuccess,
  selectProfessionalError,
  clearProfessionalState,
} from "../redux/reducers/professionalDocumentsSlice.jsx";

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
  "SCIC - Société coopérative d'intérêt collectif",
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
            <p className="vd-empty-title">Vous n'avez aucun véhicule</p>
            <p className="vd-empty-sub">Commencez par ajouter un véhicule</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}

// ─── IdentityDocumentPage — Redux wired ──────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

function IdentityDocumentPage({ onBack }) {
  const dispatch    = useDispatch();
  const fileRef     = useRef();

  // existing saved docs from server
  const identityMedia  = useSelector(selectIdentityMedia);
  const fetchLoading   = useSelector(selectIdentityFetching);

  // newly uploaded media (mediaControlSlice)
  const uploaded    = useSelector(selectUploadedMedia);
  const uploading   = useSelector(selectMediaUploading);
  const uploadError = useSelector(selectMediaUploadError);

  // save state
  const saving      = useSelector(selectDocumentsSaving);
  const saveSuccess = useSelector(selectDocumentsSuccess);
  const saveError   = useSelector(selectDocumentsError);

  // fetch existing identity docs on mount
  useEffect(() => {
    dispatch(fetchIdentityDocuments());
  }, [dispatch]);

  // after successful save → re-fetch + clear newly uploaded list
  useEffect(() => {
    if (saveSuccess === true) {
      dispatch(fetchIdentityDocuments());
      dispatch(clearUploadedMedia());
    }
  }, [saveSuccess, dispatch]);

  const handleBack = () => {
    dispatch(clearUploadedMedia());
    dispatch(clearDocumentsState());
    onBack();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    dispatch(uploadMedia({ file }));
  };

  const handleRemove = (id) => dispatch(removeUploadedMedia(id));

  const handleSave = () => {
    if (!uploaded.length) return;
    dispatch(clearDocumentsState());
    dispatch(storeMonitorDocuments({
      media_piece_identite: uploaded.map((m) => m.id),
    }));
  };

  const canSave = uploaded.length > 0 && !saving && !uploading;

  // render a thumbnail — image shows actual preview, pdf shows icon
  const renderThumb = (media) => {
    const isPdf = media.type === "pdf";
    if (isPdf) {
      return (
        <span className="vd-doc-thumb vd-doc-thumb--pdf">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
        </span>
      );
    }
    const src = media.thumb
      ? `${BASE_URL}${media.thumb}`
      : media.path
        ? `${BASE_URL}${media.path}`
        : null;
    return (
      <span className="vd-doc-thumb">
        {src
          ? <img src={src} alt={media.name} className="vd-doc-thumb-img" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          : <span style={{ fontSize: 20 }}>🖼️</span>
        }
      </span>
    );
  };

  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={handleBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Pièce d'identité</span>
      </header>

      <main className="vd-main">
        <div className="vd-info-box">
          <p className="vd-info-text">Vous devez fournir <strong>1</strong> pièce d'identité.</p>
          <p className="vd-info-text" style={{ marginTop: 6 }}>Nous acceptons :</p>
          <ul className="vd-info-list">
            <li>Carte d'identité (recto et verso)</li>
            <li>Passeport</li>
          </ul>
        </div>

        {/* ── Already saved documents ── */}
        {fetchLoading ? (
          <div className="vd-docs-empty">Chargement des documents...</div>
        ) : identityMedia.length > 0 && (
          <div className="vd-docs-section">
            <div className="vd-docs-header">
              <span className="vd-docs-title">Documents enregistrés</span>
            </div>
            <div className="vd-docs-list">
              {identityMedia.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── New upload section ── */}
        <div className="vd-docs-section vd-docs-section--upload">
          <div className="vd-docs-header">
            <span className="vd-docs-title">Ajouter des documents</span>
            <button
              className="vd-add-btn"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Ajouter un fichier"
            >
              {uploading ? "…" : <IconPlus />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {uploadError && (
            <p className="vd-error-text">
              {typeof uploadError === "string" ? uploadError : uploadError?.message || "Erreur lors du téléversement."}
            </p>
          )}

          {uploading && <div className="vd-docs-empty">Téléversement en cours...</div>}

          {!uploading && uploaded.length === 0 ? (
            <div className="vd-docs-empty">Aucun nouveau document sélectionné.</div>
          ) : (
            <div className="vd-docs-list">
              {uploaded.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                  <button className="vd-doc-delete" onClick={() => handleRemove(media.id)} disabled={saving} aria-label="Supprimer">
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {saveSuccess === true && <p className="vd-success-text">Documents enregistrés avec succès.</p>}
        {saveError && (
          <p className="vd-error-text">
            {typeof saveError === "string" ? saveError : saveError?.message || "Erreur lors de l'enregistrement."}
          </p>
        )}
      </main>

      <footer className="vd-footer">
        <button
          className={`vd-save-btn${canSave ? " vd-save-btn--active" : ""}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </footer>
    </div>
  );
}

function DrivingLicensePage({ onBack }) {
  const dispatch   = useDispatch();
  const fileRef    = useRef();

  // existing saved permis docs from server
  const permisMedia  = useSelector(selectPermisMedia);
  const fetchLoading = useSelector(selectPermisFetching);

  // newly uploaded media
  const uploaded    = useSelector(selectUploadedMedia);
  const uploading   = useSelector(selectMediaUploading);
  const uploadError = useSelector(selectMediaUploadError);

  // save state
  const saving      = useSelector(selectDocumentsSaving);
  const saveSuccess = useSelector(selectDocumentsSuccess);
  const saveError   = useSelector(selectDocumentsError);

  // fetch existing on mount
  useEffect(() => {
    dispatch(fetchPermisDocuments());
  }, [dispatch]);

  // after successful save → re-fetch + clear uploaded
  useEffect(() => {
    if (saveSuccess === true) {
      dispatch(fetchPermisDocuments());
      dispatch(clearUploadedMedia());
    }
  }, [saveSuccess, dispatch]);

  const handleBack = () => {
    dispatch(clearUploadedMedia());
    dispatch(clearDocumentsState());
    onBack();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    dispatch(uploadMedia({ file }));
  };

  const handleRemove = (id) => dispatch(removeUploadedMedia(id));

  // POST /monitor/documents with media_permis array
  const handleSave = () => {
    if (!uploaded.length) return;
    dispatch(clearDocumentsState());
    dispatch(storeMonitorDocuments({
      media_permis: uploaded.map((m) => m.id),
    }));
  };

  const canSave = uploaded.length > 0 && !saving && !uploading;

  const renderThumb = (media) => {
    const isPdf = media.type === "pdf";
    if (isPdf) {
      return (
        <span className="vd-doc-thumb vd-doc-thumb--pdf">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
        </span>
      );
    }
    const src = media.path ? `${BASE_URL}${media.path}` : null;
    return (
      <span className="vd-doc-thumb">
        {src
          ? <img src={src} alt={media.name} className="vd-doc-thumb-img" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          : <span style={{ fontSize: 20 }}>🖼️</span>
        }
      </span>
    );
  };

  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={handleBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Permis de conduire</span>
      </header>

      <main className="vd-main">
        <div className="vd-info-box">
          <p className="vd-info-text">Veuillez fournir le recto et le verso de ce document.</p>
        </div>

        {/* ── Already saved permis docs ── */}
        {fetchLoading ? (
          <div className="vd-docs-empty">Chargement des documents...</div>
        ) : permisMedia.length > 0 && (
          <div className="vd-docs-section">
            <div className="vd-docs-header">
              <span className="vd-docs-title">Documents enregistrés</span>
            </div>
            <div className="vd-docs-list">
              {permisMedia.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── New upload section ── */}
        <div className="vd-docs-section vd-docs-section--upload">
          <div className="vd-docs-header">
            <span className="vd-docs-title">Ajouter des documents</span>
            <button
              className="vd-add-btn"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Ajouter un fichier"
            >
              {uploading ? "…" : <IconPlus />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {uploadError && (
            <p className="vd-error-text">
              {typeof uploadError === "string" ? uploadError : uploadError?.message || "Erreur lors du téléversement."}
            </p>
          )}

          {uploading && <div className="vd-docs-empty">Téléversement en cours...</div>}

          {!uploading && uploaded.length === 0 ? (
            <div className="vd-docs-empty">Aucun nouveau document sélectionné.</div>
          ) : (
            <div className="vd-docs-list">
              {uploaded.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                  <button className="vd-doc-delete" onClick={() => handleRemove(media.id)} disabled={saving} aria-label="Supprimer">
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {saveSuccess === true && <p className="vd-success-text">Documents enregistrés avec succès.</p>}
        {saveError && (
          <p className="vd-error-text">
            {typeof saveError === "string" ? saveError : saveError?.message || "Erreur lors de l'enregistrement."}
          </p>
        )}
      </main>

      <footer className="vd-footer">
        <button
          className={`vd-save-btn${canSave ? " vd-save-btn--active" : ""}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </footer>
    </div>
  );
}

function TeachingDiplomaPage({ onBack }) {
  const dispatch   = useDispatch();
  const fileRef    = useRef();

  const diplomMedia  = useSelector(selectDiplomMedia);
  const fetchLoading = useSelector(selectDiplomFetching);
  const uploaded     = useSelector(selectUploadedMedia);
  const uploading    = useSelector(selectMediaUploading);
  const uploadError  = useSelector(selectMediaUploadError);
  const saving       = useSelector(selectDocumentsSaving);
  const saveSuccess  = useSelector(selectDocumentsSuccess);
  const saveError    = useSelector(selectDocumentsError);

  useEffect(() => { dispatch(fetchDiplomDocuments()); }, [dispatch]);

  useEffect(() => {
    if (saveSuccess === true) {
      dispatch(fetchDiplomDocuments());
      dispatch(clearUploadedMedia());
    }
  }, [saveSuccess, dispatch]);

  const handleBack = () => { dispatch(clearUploadedMedia()); dispatch(clearDocumentsState()); onBack(); };
  const handleFileChange = (e) => { const file = e.target.files[0]; if (!file) return; e.target.value = ""; dispatch(uploadMedia({ file })); };
  const handleRemove = (id) => dispatch(removeUploadedMedia(id));
  const handleSave = () => {
    if (!uploaded.length) return;
    dispatch(clearDocumentsState());
    dispatch(storeMonitorDocuments({ media_diplom: uploaded.map((m) => m.id) }));
  };

  const canSave = uploaded.length > 0 && !saving && !uploading;

  const renderThumb = (media) => {
    const isPdf = media.type === "pdf";
    if (isPdf) {
      return (
        <span className="vd-doc-thumb vd-doc-thumb--pdf">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
        </span>
      );
    }
    const src = media.path ? `${BASE_URL}${media.path}` : null;
    return (
      <span className="vd-doc-thumb">
        {src ? <img src={src} alt={media.name} className="vd-doc-thumb-img" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <span style={{ fontSize: 20 }}>🖼️</span>}
      </span>
    );
  };

  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={handleBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Diplôme d'enseignement</span>
      </header>
      <main className="vd-main">
        <div className="vd-info-box">
          <p className="vd-info-text">BEPECASER ou qualification professionnelle de conduite.</p>
        </div>

        {fetchLoading ? (
          <div className="vd-docs-empty">Chargement des documents...</div>
        ) : diplomMedia.length > 0 && (
          <div className="vd-docs-section">
            <div className="vd-docs-header"><span className="vd-docs-title">Documents enregistrés</span></div>
            <div className="vd-docs-list">
              {diplomMedia.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="vd-docs-section vd-docs-section--upload">
          <div className="vd-docs-header">
            <span className="vd-docs-title">Ajouter des documents</span>
            <button className="vd-add-btn" onClick={() => fileRef.current?.click()} disabled={uploading} title="Ajouter un fichier">
              {uploading ? "…" : <IconPlus />}
            </button>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFileChange} />
          </div>

          {uploadError && <p className="vd-error-text">{typeof uploadError === "string" ? uploadError : uploadError?.message || "Erreur lors du téléversement."}</p>}
          {uploading && <div className="vd-docs-empty">Téléversement en cours...</div>}

          {!uploading && uploaded.length === 0 ? (
            <div className="vd-docs-empty">Aucun nouveau document sélectionné.</div>
          ) : (
            <div className="vd-docs-list">
              {uploaded.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                  <button className="vd-doc-delete" onClick={() => handleRemove(media.id)} disabled={saving} aria-label="Supprimer"><IconTrash /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {saveSuccess === true && <p className="vd-success-text">Documents enregistrés avec succès.</p>}
        {saveError && <p className="vd-error-text">{typeof saveError === "string" ? saveError : saveError?.message || "Erreur lors de l'enregistrement."}</p>}
      </main>
      <footer className="vd-footer">
        <button className={`vd-save-btn${canSave ? " vd-save-btn--active" : ""}`} onClick={handleSave} disabled={!canSave}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </footer>
    </div>
  );
}

function ProfessionalDocumentsPage({ onBack }) {
  const dispatch  = useDispatch();
  const fileRef   = useRef();

  // server data
  const serverData  = useSelector(selectProfessionalData);
  const savedMedia  = useSelector(selectProfessionalSavedMedia);
  const fetching    = useSelector(selectProfessionalFetching);

  // new uploads
  const uploaded    = useSelector(selectUploadedMedia);
  const uploading   = useSelector(selectMediaUploading);
  const uploadError = useSelector(selectMediaUploadError);

  // save state
  const saving      = useSelector(selectProfessionalSaving);
  const saveSuccess = useSelector(selectProfessionalSuccess);
  const saveError   = useSelector(selectProfessionalError);

  // form fields — pre-filled from server data when available
  const [denominationSocial, setDenominationSocial] = useState("");
  const [formeJuridique,     setFormeJuridique]     = useState("");
  const [legalOpen,          setLegalOpen]          = useState(false);
  const [siret,              setSiret]              = useState("");
  const [numAutorisation,    setNumAutorisation]    = useState("");
  const [dateCreation,       setDateCreation]       = useState("");
  const [autorisation,       setAutorisation]       = useState("");
  const [visite,             setVisite]             = useState("");

  // fetch on mount
  useEffect(() => {
    dispatch(fetchProfessionalDocuments());
  }, [dispatch]);

  // pre-fill form when server data arrives
  useEffect(() => {
    if (!serverData) return;
    setDenominationSocial(serverData.denomination_social ?? "");
    setFormeJuridique(serverData.forme_juridique ?? "");
    setSiret(serverData.siret ?? "");
    setNumAutorisation(serverData.num_autorisation ?? "");
    setDateCreation(serverData.date_creation ?? "");
    // API returns instructor_permission (not autorisations)
    setAutorisation(serverData.instructor_permission?.autorisation ?? "");
    setVisite(serverData.instructor_permission?.visite ?? "");
  }, [serverData]);

  // after save → re-fetch + clear uploads
  useEffect(() => {
    if (saveSuccess === true) {
      dispatch(fetchProfessionalDocuments());
      dispatch(clearUploadedMedia());
    }
  }, [saveSuccess, dispatch]);

  const handleBack = () => {
    dispatch(clearUploadedMedia());
    dispatch(clearProfessionalState());
    onBack();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    dispatch(uploadMedia({ file }));
  };

  const handleRemove = (id) => dispatch(removeUploadedMedia(id));

  const handleSave = () => {
    dispatch(clearProfessionalState());
    // merge: existing saved media ids + newly uploaded ids
    const existingIds = savedMedia.map((m) => m.id);
    const newIds      = uploaded.map((m) => m.id);
    const allMediaIds = [...existingIds, ...newIds];

    dispatch(storeProfessionalDocuments({
      denomination_social: denominationSocial,
      forme_juridique:     formeJuridique,
      siret,
      num_autorisation:    numAutorisation,
      date_creation:       dateCreation,
      autorisations: {
        autorisation,
        visite,
        media: allMediaIds,
      },
    }));
  };

  const canSave = !saving && !uploading;

  const renderThumb = (media) => {
    const isPdf = media.type === "pdf";
    if (isPdf) {
      return (
        <span className="vd-doc-thumb vd-doc-thumb--pdf">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
        </span>
      );
    }
    const src = media.path ? `${BASE_URL}${media.path}` : null;
    return (
      <span className="vd-doc-thumb">
        {src
          ? <img src={src} alt={media.name} className="vd-doc-thumb-img" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          : <span style={{ fontSize: 20 }}>🖼️</span>
        }
      </span>
    );
  };

  return (
    <div className="vd-page">
      <header className="vd-header">
        <button className="vd-back-btn" onClick={handleBack}><IconArrowLeft /></button>
        <span className="vd-header-title">Documents professionnels</span>
      </header>

      <main className="vd-main">
        {fetching && <div className="vd-docs-empty">Chargement...</div>}

        {/* ── Company info ── */}
        <section className="vd-section">
          <p className="vd-section-title">Informations sur l'entreprise</p>
          <div className="vd-form-group">
            <div className="vd-field">
              <label className="vd-field-label">Dénomination sociale</label>
              <input className="vd-input" placeholder="Nom de l'entreprise" value={denominationSocial} onChange={(e) => setDenominationSocial(e.target.value)} />
            </div>

            <div className="vd-field" style={{ position: "relative" }}>
              <label className="vd-field-label">Forme juridique</label>
              <div className="vd-select-box" onClick={() => setLegalOpen((o) => !o)}>
                <span style={{ color: formeJuridique ? "#333" : "#ccc" }}>{formeJuridique || "Sélectionner"}</span>
                <span style={{ fontSize: 12, color: "#ccc", transform: legalOpen ? "rotate(180deg)" : "none", transition: ".18s" }}>▾</span>
              </div>
              {legalOpen && (
                <>
                  <div className="vd-menu-backdrop" onClick={() => setLegalOpen(false)} />
                  <div className="vd-legal-dropdown">
                    {LEGAL_STATUS_OPTIONS.map((opt) => (
                      <button key={opt} className={`vd-legal-option${formeJuridique === opt ? " vd-legal-option--active" : ""}`}
                        onClick={() => { setFormeJuridique(opt); setLegalOpen(false); }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="vd-field">
              <label className="vd-field-label">SIRET</label>
              <input className="vd-input" placeholder="Numéro SIRET" value={siret} onChange={(e) => setSiret(e.target.value)} />
            </div>

            <div className="vd-field">
              <label className="vd-field-label">Date de création</label>
              <input className="vd-input" type="date" value={dateCreation} onChange={(e) => setDateCreation(e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Teaching authorization ── */}
        <section className="vd-section">
          <p className="vd-section-title">Autorisation d'enseigner</p>
          <div className="vd-form-group">
            <div className="vd-field">
              <label className="vd-field-label">Numéro d'autorisation</label>
              <input className="vd-input" placeholder="Numéro d'autorisation d'enseigner" value={numAutorisation} onChange={(e) => setNumAutorisation(e.target.value)} />
            </div>
            <div className="vd-field">
              <label className="vd-field-label">Date d'autorisation</label>
              <input className="vd-input" type="date" value={autorisation} onChange={(e) => setAutorisation(e.target.value)} />
            </div>
            <div className="vd-field">
              <label className="vd-field-label">Date de visite</label>
              <input className="vd-input" type="date" value={visite} onChange={(e) => setVisite(e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Already saved documents ── */}
        {savedMedia.length > 0 && (
          <div className="vd-docs-section">
            <div className="vd-docs-header">
              <span className="vd-docs-title">Documents enregistrés</span>
            </div>
            <div className="vd-docs-list">
              {savedMedia.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── New upload section ── */}
        <div className="vd-docs-section vd-docs-section--upload">
          <div className="vd-docs-header">
            <span className="vd-docs-title">Documents à téléverser</span>
            <button className="vd-add-btn" onClick={() => fileRef.current?.click()} disabled={uploading} title="Ajouter un fichier">
              {uploading ? "…" : <IconPlus />}
            </button>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFileChange} />
          </div>

          {uploadError && <p className="vd-error-text">{typeof uploadError === "string" ? uploadError : uploadError?.message || "Erreur lors du téléversement."}</p>}
          {uploading && <div className="vd-docs-empty">Téléversement en cours...</div>}

          {!uploading && uploaded.length === 0 ? (
            <div className="vd-docs-empty">Aucun nouveau document sélectionné.</div>
          ) : (
            <div className="vd-docs-list">
              {uploaded.map((media) => (
                <div key={media.id} className="vd-doc-row">
                  {renderThumb(media)}
                  <span className="vd-doc-name">{media.name}</span>
                  <button className="vd-doc-delete" onClick={() => handleRemove(media.id)} disabled={saving} aria-label="Supprimer"><IconTrash /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {saveSuccess === true && <p className="vd-success-text">Documents enregistrés avec succès.</p>}
        {saveError && <p className="vd-error-text">{typeof saveError === "string" ? saveError : saveError?.message || "Erreur lors de l'enregistrement."}</p>}
      </main>

      <footer className="vd-footer">
        <button className={`vd-save-btn${canSave ? " vd-save-btn--active" : ""}`} onClick={handleSave} disabled={!canSave}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </footer>
    </div>
  );
}

const MENU_ITEMS = [
  { key: "vehicles",     label: "Véhicules",               icon: <IconCar /> },
  { key: "identity",     label: "Pièce d'identité",         icon: <IconId /> },
  { key: "driving",      label: "Permis de conduire",       icon: <IconLicense /> },
  { key: "diploma",      label: "Diplôme d'enseignement",      icon: <IconDiploma /> },
  { key: "professional", label: "Documents professionnels", icon: <IconBuilding /> },
];

export default function VehiclesAndDocumentsPage({ onBack }) {
  const [page, setPage] = useState(null);

  if (page === "vehicles")     return <VehiclesPage           onBack={() => setPage(null)} />;
  if (page === "identity")     return <IdentityDocumentPage   onBack={() => setPage(null)} />;
  if (page === "driving")      return <DrivingLicensePage     onBack={() => setPage(null)} />;
  if (page === "diploma")      return <TeachingDiplomaPage    onBack={() => setPage(null)} />;
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
