import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./FileManeger.css";

import image1  from '/src/assets/filemaneger/image1.png';
import image2  from '/src/assets/filemaneger/image2.png';
import image3  from '/src/assets/filemaneger/image3.png';
import image4  from '/src/assets/filemaneger/image4.png';
import image5  from '/src/assets/filemaneger/image5.png';
import image6  from '/src/assets/filemaneger/image6.png';
import image7  from '/src/assets/filemaneger/image7.png';
import image8  from '/src/assets/filemaneger/image8.png';
import image9  from '/src/assets/filemaneger/image9.png';
import image10 from '/src/assets/filemaneger/image10.png';
import image11 from '/src/assets/filemaneger/image11.png';
import image12 from '/src/assets/filemaneger/image12.png';
import image13 from '/src/assets/filemaneger/image13.png';
import image14 from '/src/assets/filemaneger/image14.png';
import image15 from '/src/assets/filemaneger/image15.png';
import image16 from '/src/assets/filemaneger/image16.png';
import image17 from '/src/assets/filemaneger/image17.png';
import image18 from '/src/assets/filemaneger/image18.png';
import image19 from '/src/assets/filemaneger/image19.png';
import image20 from '/src/assets/filemaneger/image20.png';
import image21 from '/src/assets/filemaneger/image21.png';
import image23 from '/src/assets/filemaneger/image23.png';
import image24 from '/src/assets/filemaneger/image24.jpg';

const STOCK_IMAGES = [
  image1, image2, image3, image4, image5, image6,
  image7, image8, image9, image10, image11, image12,
  image13, image14, image15, image16, image17, image18,
  image19, image20, image21, image23, image24,
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconSwap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const IconClose = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const IconUploadBox = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#c9cdd4" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// FileManagerModal  — slides up from the bottom, full viewport width
// ═══════════════════════════════════════════════════════════════════════════════
function FileManagerModal({ open, onClose, onSelect, selectedSrc }) {
  const [sidebarView, setSidebarView] = useState("stockings");
  const [tab,         setTab]         = useState("all");
  const [search,      setSearch]      = useState("");
  const [hovered,     setHovered]     = useState(null);
  const [localFiles,  setLocalFiles]  = useState([]);
  const fileRef = useRef(null);

  const allImages = [
    ...STOCK_IMAGES.map((src, i) => ({ id:`stock-${i}`, src, type:"image", name:`image${i+1}.png` })),
    ...localFiles,
  ];

  const filtered = allImages.filter(f => {
    if (tab === "images")    return f.type === "image";
    if (tab === "documents") return f.type === "document";
    return true;
  }).filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));

  const handleUpload = (e) => {         ``
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const isDoc = file.type.includes("pdf") || file.type.includes("word");
    reader.onload = ev => setLocalFiles(prev => [
        ...prev,
        { 
            id: `local-${Date.now()}`, 
            src: ev.target.result, 
            type: isDoc ? "document" : "image", 
            name: file.name,
            file: file  // ← File object bhi store karo
        }
    ]);
    reader.readAsDataURL(file);
    e.target.value = "";
};


  // const handleUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   const isDoc  = file.type.includes("pdf") || file.type.includes("word");
  //   reader.onload = ev => setLocalFiles(prev => [
  //     ...prev,
  //     { id:`local-${Date.now()}`, src:ev.target.result, type: isDoc ? "document" : "image", name:file.name }
  //   ]);
  //   reader.readAsDataURL(file);
  //   e.target.value = "";
  // };

  return createPortal(
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fm-backdrop${open ? " fm-backdrop--open" : ""}`}
        onClick={onClose}
      />

      {/* ── Bottom sheet — slides up from bottom, full width ── */}
      <div
        className={`fm-bottom-sheet${open ? " fm-bottom-sheet--open" : ""}`}
      >
        {/* drag handle */}
        <div className="fm-sheet-handle-row">
          <div className="fm-sheet-handle" />
        </div>

        {/* Header */}
        <div className="fm-drawer-header">
          <span className="fm-drawer-title">Gestion des fichiers</span>

          <div className="fm-tab-group">
            {[
              { key: "all",       label: "Tous" },
              { key: "images",    label: "Images" },
              { key: "documents", label: "Documents" },
            ].map(({ key, label }) => (
              <button key={key} className={`fm-tab-btn${tab === key ? " active" : ""}`} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>

          <div className="fm-search-box">
            <IconSearch />
            <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <button className="fm-close-btn" onClick={onClose}><IconClose /></button>
        </div>

        {/* Body */}
        <div className="fm-drawer-body">

          {/* ── Sidebar ── */}
          <div className="fm-sidebar">
            <button
              className={`fm-sidebar-btn${sidebarView === "upload" ? " fm-sidebar-btn--active" : ""}`}
              onClick={() => setSidebarView("upload")}
            >
              <IconDownload /> Télécharger des photos
            </button>

            <button
              className={`fm-sidebar-btn${sidebarView === "stockings" ? " fm-sidebar-btn--active" : ""}`}
              onClick={() => setSidebarView("stockings")}
            >
              <IconGrid /> Médias disponibles
            </button>

            <div className="fm-selected-label">Fichier sélectionné</div>

            {selectedSrc ? (
              <div className="fm-selected-wrap">
                <div className="fm-selected-preview">
                  <img src={selectedSrc} alt="sélectionné" className="fm-selected-img" />
                </div>
                <button className="fm-selected-delete" onClick={() => onSelect(null)}>
                  <IconTrash /> Supprimer
                </button>
              </div>
            ) : (
              <div className="fm-no-file">Aucun fichier disponible</div>
            )}

            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display:"none" }} onChange={handleUpload} />
          </div>

          {/* ── Main content ── */}
          <div className="fm-content">

            {sidebarView === "upload" && (
              <div className="fm-dropzone" onClick={() => fileRef.current.click()}>
                <IconUploadBox />
                <p className="fm-dropzone-title">Glisser et déposer</p>
                <p className="fm-dropzone-sub">Types d'images acceptés : png, jpeg, jpg, webp</p>
                <button className="fm-dropzone-btn" type="button" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                  Téléverser
                </button>
              </div>
            )}

            {sidebarView === "stockings" && tab === "documents" && (
              <div className="fm-dropzone" onClick={() => fileRef.current.click()}>
                <IconUploadBox />
                <p className="fm-dropzone-title">Glisser et déposer</p>
                <p className="fm-dropzone-sub">Types d'images acceptés : png, jpeg, jpg, webp</p>
                <button className="fm-dropzone-btn" type="button" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                  Téléverser
                </button>
              </div>
            )}

            {sidebarView === "stockings" && tab !== "documents" && (
              <div className="fm-grid">
                {filtered.map(file => (
                  <div
                    key={file.id}
                    className={`fm-grid-item${selectedSrc === file.src ? " fm-grid-item--selected" : ""}`}
                    onMouseEnter={() => setHovered(file.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <img src={file.src} alt={file.name} className="fm-grid-img" />
                    {(hovered === file.id || selectedSrc === file.src) && (
                      <div className="fm-grid-overlay">
                        <button
                          className={`fm-select-btn${selectedSrc === file.src ? " fm-select-btn--selected" : ""}`}
                          // onClick={() => onSelect(file.src)}
                          onClick={async () => {
                            // Uploaded files already have a File object. Stock
                            // images are bundled URLs, so convert them to a File
                            // before handing them to create/update forms.
                            let uploadFile = file.file;
                            if (!uploadFile && file.type === "image") {
                              const imageResponse = await fetch(file.src);
                              const imageBlob = await imageResponse.blob();
                              uploadFile = new File([imageBlob], file.name, {
                                type: imageBlob.type || "image/png",
                              });
                            }
                            onSelect(file.src, { ...file, file: uploadFile });
                          }}
                        >
                          {selectedSrc === file.src ? <><IconCheck /> Sélectionné</> : "Sélectionner"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="fm-drawer-footer">
          <button className="fm-footer-close-btn" onClick={onClose}>Fermer</button>
          <button className="fm-footer-add-btn" onClick={onClose} disabled={!selectedSrc}>
            Ajouter le média
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FileManager card
// ═══════════════════════════════════════════════════════════════════════════════
export default function FileManager({
  selectedSrc,
  onSelect,
  variant = "card",
  title = "Photo de profil",
  subtitle = "",
  actionLabel = "Changer",
  openOverride,
  onRequestClose,
}) {
  const [open,     setOpen]     = useState(Boolean(openOverride));
  const [showBtns, setShowBtns] = useState(false);

  useEffect(() => {
    if (typeof openOverride === "boolean") {
      setOpen(openOverride);
    }
  }, [openOverride]);

  const closeModal = () => {
    setOpen(false);
    if (onRequestClose) onRequestClose();
  };

  const handleView = () => {
    if (!selectedSrc) return;
    const w = window.open("", "_blank");
    w.document.write(
      `<!DOCTYPE html><html><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh;">
        <img src="${selectedSrc}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
      </body></html>`
    );
  };

  return (
    <>
      {variant === "hidden" ? null : variant === "profile-strip" ? (
        <div className="fm-profile-strip">
          <div className="fm-profile-strip-left">
            <div className="fm-profile-strip-avatar">
              {selectedSrc ? (
                <img src={selectedSrc} alt="sélectionné" className="fm-profile-strip-img" />
              ) : (
                <div className="fm-profile-strip-placeholder">
                  <IconUploadBox />
                </div>
              )}
            </div>
            <div className="fm-profile-strip-text">
              <div className="fm-profile-strip-title">{title}</div>
              {subtitle ? <div className="fm-profile-strip-subtitle">{subtitle}</div> : null}
            </div>
          </div>
          <button className="fm-profile-strip-btn" onClick={() => setOpen(true)}>
            {actionLabel}
          </button>
        </div>
      ) : (
        <div
          className="fm-card"
          onMouseEnter={() => setShowBtns(true)}
          onMouseLeave={() => setShowBtns(false)}
        >
          <div className="fm-preview-area">
            {selectedSrc
              ? <img src={selectedSrc} alt="sélectionné" className="fm-preview-img" />
              : (
                <div className="fm-empty-state">
                  <IconUploadBox />
                  <span className="fm-empty-text">Aucun fichier disponible</span>
                  <button className="fm-empty-open-btn" onClick={() => setOpen(true)}>
                    Parcourir les fichiers
                  </button>
                </div>
              )
            }

            <div className={`fm-action-overlay${showBtns ? " fm-action-overlay--visible" : ""}`}>
              <button
                className="fm-action-btn fm-action-btn--dark"
                onClick={handleView}
                disabled={!selectedSrc}
              >
                <IconEye /> <span className="fm-btn-label">Aperçu</span>
              </button>
              <button
                className="fm-action-btn fm-action-btn--blue"
                onClick={() => setOpen(true)}
              >
                <IconSwap /> <span className="fm-btn-label">Parcourir</span>
              </button>
              <button
                className="fm-action-btn fm-action-btn--red"
                onClick={() => onSelect && onSelect(null)}
                disabled={!selectedSrc}
              >
                <IconTrash /> <span className="fm-btn-label">Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <FileManagerModal
        open={open}
        onClose={closeModal}
        // onSelect={(src) => { if (onSelect) onSelect(src); }}
    //      onSelect={(src, file) => { 
    //     if (onSelect) onSelect(src, file.file);  // ← file forward karo
    // }}
    onSelect={(src, file) => { 
  if (onSelect) onSelect(src, file);
}}

        selectedSrc={selectedSrc}
      />
    </>
  );
}
