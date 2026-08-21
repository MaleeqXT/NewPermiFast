import { useState, useRef, useEffect } from "react";
import "./Zones.css";
import PlaceDrawer from "./PlaceDrawer";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconExport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>);
const IconArrowLeft   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const IconPlus        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconSearch      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconSort        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>;
const IconDots        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconEdit        = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconInfo        = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;
const IconChevronLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevronRight= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

// ── Seed data — one entry per zone so everything is testable ──────────────────
const SEED_PLACES = {
  1: [ // Others
    { id:11, name:"Gare du Nord, quai dépose minute côté rue",              mapUrl:"https://maps.app.goo.gl/abc123",            status:"active",   createdAt:"2025-10-08T09:30:00" },
    { id:12, name:"Place de la République, fontaine centrale",               mapUrl:"",                                           status:"active",   createdAt:"2025-10-08T10:00:00" },
  ],
  2: [ // SAINT DENIS
    { id:21, name:"Saint-Denis, parking Carrefour avenue du Président Wilson",mapUrl:"https://maps.app.goo.gl/def456",            status:"active",   createdAt:"2025-05-18T11:59:00" },
    { id:22, name:"Basilique Saint-Denis, entrée principale",                mapUrl:"",                                           status:"archived", createdAt:"2025-05-18T12:10:00" },
  ],
  3: [ // TOULOUSE
    { id:31, name:"Toulouse, Mc Donald les Arènes, sur le trottoir à la sortie du métro", mapUrl:"https://maps.app.goo.gl/wem4BNmExedHKhjr8", status:"active", createdAt:"2025-05-18T11:58:00" },
    { id:32, name:"Toulouse, Place du Capitole, côté fontaine",              mapUrl:"https://maps.app.goo.gl/ghi789",            status:"active",   createdAt:"2025-05-19T09:00:00" },
    { id:33, name:"Toulouse, Gare Matabiau, parking P1 niveau 0",            mapUrl:"",                                           status:"archived", createdAt:"2025-05-20T14:30:00" },
  ],
  4: [ // CREIL
    { id:41, name:"Creil, Parking Leclerc avenue Kennedy",                   mapUrl:"https://maps.app.goo.gl/jkl012",            status:"active",   createdAt:"2025-05-15T18:24:00" },
    { id:42, name:"Creil, Gare SNCF, côté taxi",                             mapUrl:"https://maps.app.goo.gl/mno345",            status:"active",   createdAt:"2025-05-16T08:00:00" },
  ],
};

const PAGE_SIZE = 5;

function fmtDateTime(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function InlineToast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="zones-toast-inline">
      <div className="zones-toast-top">
        <IconInfo /> Successful
        <button className="zones-toast-top-close" onClick={onClose}>✕</button>
      </div>
      <div className="zones-toast-bottom">{message}</div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onClose }) {
  return (
    <div className="zones-modal-overlay">
      <div className="zones-modal">
        <div className="zones-modal-header">
          <span className="zones-modal-title">Confirmation</span>
          <button className="zones-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="zones-modal-body">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <p style={{ fontSize:17, fontWeight:700, color:"#111827", margin:"0 0 10px", fontFamily:"Inter,sans-serif" }}>Are you sure?</p>
          <p style={{ fontSize:14, color:"#6b7280", margin:0, fontFamily:"Inter,sans-serif" }}>Are you sure you want to delete this entry? This cannot be undone.</p>
        </div>
        <div className="zones-modal-footer">
          <button className="zones-modal-btn zones-modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="zones-modal-btn zones-modal-btn--delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Row 3-dot menu ────────────────────────────────────────────────────────────
function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="zones-row-menu-wrapper" ref={ref}>
      <button className="zones-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="zones-row-menu-dropdown">
          <button className="zones-row-menu-item" onClick={() => { setOpen(false); onEdit(); }}>
            <IconEdit /> Edit
          </button>
          <div className="zones-row-menu-divider" />
          <button className="zones-row-menu-item zones-row-menu-item--danger" onClick={() => { setOpen(false); onDelete(); }}>
            <IconTrash /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Read-only toggle (table display only) ─────────────────────────────────────
function StatusDisplay({ status }) {
  return (
    <label className="zones-toggle zones-toggle--readonly">
      <input type="checkbox" checked={status === "active"} readOnly onChange={() => {}} />
      <span className="zones-toggle-track" />
      <span className="zones-toggle-thumb" />
    </label>
  );
}

const TABS = [
  { key:"all",      label:"Tout"    },
  { key:"active",   label:"Actif"   },
  { key:"archived", label:"Archivé" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ZonePlaces({ zone, onBack }) {
  const [places,       setPlaces]       = useState(() => SEED_PLACES[zone?.id] ?? []);
  const [activeTab,    setActiveTab]    = useState("all");
  const [page,         setPage]         = useState(1);
  const [drawerMode,   setDrawerMode]   = useState(null);  // "add" | "modify" | null
  const [editPlace,    setEditPlace]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [search,       setSearch]       = useState("");

  // ── Save from PlaceDrawer ─────────────────────────────────────────────────
  function handleSave(data) {
    if (drawerMode === "add") {
      setPlaces(prev => [...prev, { ...data, id: Date.now(), createdAt: new Date().toISOString() }]);
      setToast("Place added successfully.");
    } else {
      setPlaces(prev => prev.map(p => p.id === data.id ? data : p));
      setToast("Place updated successfully.");
    }
    setDrawerMode(null);
    setEditPlace(null);
    setPage(1);
  }

  // ── Delete confirmed ──────────────────────────────────────────────────────
  function handleDeleteConfirm() {
    setPlaces(prev => prev.filter(p => p.id !== deleteTarget.id));
    setToast("Place deleted successfully.");
    setDeleteTarget(null);
    setPage(1);
  }

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = places.filter(p => {
    if (activeTab === "active")   return p.status === "active";
    if (activeTab === "archived") return p.status !== "active";
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, totalItems);

  const counts = {
    all:      places.length,
    active:   places.filter(p => p.status === "active").length,
    archived: places.filter(p => p.status !== "active").length,
  };

  return (
    <div className="zones-page">

      {/* Header */}
      <div className="zones-header">
        <div className="zones-header-left">
          <button className="zones-back-btn" onClick={onBack}><IconArrowLeft /></button>
          <h1 className="zones-title">Zones: {zone?.name}</h1>
        </div>
        <button
          className="zones-btn-new"
          onClick={() => { setEditPlace(null); setDrawerMode("add"); }}
        >
          <IconPlus /> Ajouter un Lieu
        </button>
      </div>

      {/* Toast */}
      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      {/* Tabs + icon buttons */}
      <div className="zones-tabs-row">
        <div className="zones-tabs-pill">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`zones-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
            >
              {tab.label}
              {counts[tab.key] > 0 && <span className="zones-tab-count">{counts[tab.key]}</span>}
            </button>
          ))}
        </div>
         <div className="zones-tabs-right">
          <div className="zones-search-box">
            <IconSearch />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." />
          </div>
          <button className="zones-btn-outline"><IconFilter /> Filter</button>
          <button className="zones-btn-outline"><IconExport /> Export</button>
        </div>
      </div>

      {/* Table */}
      <div className="zones-table-card">
        <table className="zones-table">
          <thead>
            <tr>
              <th>Lieu</th>
              <th>Map</th>
              <th>Status</th>
              <th>Date de création</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0
              ? <tr><td colSpan={5} className="zones-empty">Aucun lieu trouvé</td></tr>
              : pageData.map(place => (
                <tr key={place.id}>
                  <td><span className="zones-name-text">{place.name}</span></td>
                  <td>
                    {place.mapUrl
                      ? <a href={place.mapUrl} target="_blank" rel="noopener noreferrer" className="zones-map-link">Voir la carte</a>
                      : <span style={{ color:"#9ca3af", fontSize:13 }}>—</span>
                    }
                  </td>
                  <td><StatusDisplay status={place.status} /></td>
                  <td style={{ color:"#6b7280", fontSize:13 }}>{fmtDateTime(place.createdAt)}</td>
                  <td className="zones-actions-cell">
                    <RowMenu
                      onEdit={() => { setEditPlace(place); setDrawerMode("modify"); }}
                      onDelete={() => setDeleteTarget(place)}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {/* Pagination */}
        <div className="zones-pagination">
          <button className="zones-page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage <= 1}>
            <IconChevronLeft />
          </button>
          <span className="zones-page-info">
            {totalItems === 0 ? "0 éléments" : `${pageStart+1} - ${pageEnd} sur ${totalItems} éléments`}
          </span>
          <button className="zones-page-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage >= totalPages}>
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* PlaceDrawer — Add or Edit */}
      {drawerMode !== null && (
        <PlaceDrawer
          mode={drawerMode}
          item={editPlace}
          onSave={handleSave}
          onClose={() => { setDrawerMode(null); setEditPlace(null); }}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget !== null && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </div>
  );
}