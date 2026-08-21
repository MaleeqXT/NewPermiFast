import { useState, useRef, useEffect } from "react";
import "./Zones.css";
import ZoneDrawer  from "./ZoneDrawer";
import ZonePlaces  from "./ZonePlaces";
import PostalCodes from "./PostalCodes.jsx";

const IconSearch       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconExport       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconPlus         = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconDots         = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconTrash        = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconEdit         = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconMapPin       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconHash         = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>;
const IconInfo         = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;
const IconChevronLeft  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="zones-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1  ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

const INITIAL_ZONES = [
  { id:1, name:"Autres",      status:"active", createdAt:"2025-10-08T09:00:00" },
  { id:2, name:"SAINT DENIS", status:"active", createdAt:"2025-05-18T11:59:00" },
  { id:3, name:"TOULOUSE",    status:"active", createdAt:"2025-05-18T11:54:00" },
  { id:4, name:"CREIL",       status:"active", createdAt:"2025-05-15T18:24:00" },
];

const PAGE_SIZE = 5;

function fmtDateTime(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

// ── Toast ─────────────────────────────────────────────────────────────────
function InlineToast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="zones-toast-inline">
      <div className="zones-toast-top">
        <IconInfo /> Succès
        <button className="zones-toast-top-close" onClick={onClose}>✕</button>
      </div>
      <div className="zones-toast-bottom">{message}</div>
    </div>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────
function DeleteModal({ zone, onConfirm, onClose }) {
  return (
    <div className="zones-modal-overlay">
      <div className="zones-modal">
        <div className="zones-modal-header">
          <span className="zones-modal-title">Confirmation</span>
          <button className="zones-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="zones-modal-body">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <p style={{ fontSize:17, fontWeight:700, color:"#111827", margin:"0 0 10px", fontFamily:"Inter,sans-serif" }}>Êtes-vous sûr ?</p>
          <p style={{ fontSize:14, color:"#6b7280", margin:0, fontFamily:"Inter,sans-serif" }}>
            Supprimer la zone <strong>« {zone?.name} »</strong> ? Cette action est irréversible.
          </p>
        </div>
        <div className="zones-modal-footer">
          <button className="zones-modal-btn zones-modal-btn--cancel" onClick={onClose}>Annuler</button>
          <button className="zones-modal-btn zones-modal-btn--delete" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ── Row menu ──────────────────────────────────────────────────────────────
function RowMenu({ zone, onEdit, onDelete, onListPlaces, onListCodePostal }) {
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
          <button className="zones-row-menu-item" onClick={() => { setOpen(false); onListPlaces(zone); }}><IconMapPin /> Liste des lieux</button>
          <button className="zones-row-menu-item" onClick={() => { setOpen(false); onListCodePostal(zone); }}><IconHash /> Codes postaux</button>
          <div className="zones-row-menu-divider" />
          <button className="zones-row-menu-item" onClick={() => { setOpen(false); onEdit(zone); }}><IconEdit /> Modifier</button>
          <button className="zones-row-menu-item zones-row-menu-item--danger" onClick={() => { setOpen(false); onDelete(zone); }}><IconTrash /> Supprimer</button>
        </div>
      )}
    </div>
  );
}

// ── Status toggle (read-only) ─────────────────────────────────────────────
function StatusDisplay({ status }) {
  return (
    <label className="zones-toggle zones-toggle--readonly">
      <input type="checkbox" checked={status === "active"} readOnly onChange={() => {}} />
      <span className="zones-toggle-track" />
      <span className="zones-toggle-thumb" />
    </label>
  );
}

// ── Mobile zone card ──────────────────────────────────────────────────────
function ZoneMobileCard({ zone, onPlaces, onPostal, onEdit, onDelete }) {
  return (
    <div className="zones-card">
      {/* Top: name + toggle + menu */}
      <div className="zones-card-top">
        <button className="zones-card-name" onClick={() => onPlaces(zone)}>
          {zone.name}
        </button>
        <StatusDisplay status={zone.status} />
        <RowMenu
          zone={zone}
          onListPlaces={onPlaces}
          onListCodePostal={onPostal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Meta: creation date */}
      <div className="zones-card-meta">
        <span className="zones-card-meta-label">Créée le</span>
        <span className="zones-card-meta-value">{fmtDateTime(zone.createdAt)}</span>
      </div>

      {/* Quick-action buttons */}
      <div className="zones-card-actions">
        <button className="zones-card-action-btn" onClick={() => onPlaces(zone)}>
          <IconMapPin /> Lieux
        </button>
        <button className="zones-card-action-btn" onClick={() => onPostal(zone)}>
          <IconHash /> Codes postaux
        </button>
        <button className="zones-card-action-btn" onClick={() => onEdit(zone)}>
          <IconEdit /> Modifier
        </button>
        <button className="zones-card-action-btn zones-card-action-btn--danger" onClick={() => onDelete(zone)}>
          <IconTrash /> Supprimer
        </button>
      </div>
    </div>
  );
}

const TABS = [
  { key:"all",      label:"Tout"    },
  { key:"active",   label:"Actif"   },
  { key:"archived", label:"Archivé" },
];

// ── Main ──────────────────────────────────────────────────────────────────
export default function Zones() {
  const [zones,        setZones]        = useState(INITIAL_ZONES);
  const [activeTab,    setActiveTab]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState(null);
  const [page,         setPage]         = useState(1);
  const [drawerMode,   setDrawerMode]   = useState(null);
  const [editZone,     setEditZone]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [placesZone,   setPlacesZone]   = useState(null);
  const [postalZone,   setPostalZone]   = useState(null);

  if (postalZone) return <PostalCodes zone={postalZone} onBack={() => setPostalZone(null)} />;
  if (placesZone) return <ZonePlaces  zone={placesZone} onBack={() => setPlacesZone(null)} />;

  const showToast  = msg => setToast(msg);
  const handleSort = key => setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });

  function handleSave(data) {
    if (drawerMode === "add") {
      setZones(prev => [...prev, { ...data, id: Date.now(), createdAt: new Date().toISOString() }]);
      showToast("Zone ajoutée avec succès.");
    } else {
      setZones(prev => prev.map(z => z.id === data.id ? data : z));
      showToast("Zone mise à jour avec succès.");
    }
    setDrawerMode(null); setEditZone(null); setPage(1);
  }

  function handleDeleteConfirm() {
    setZones(prev => prev.filter(z => z.id !== deleteTarget.id));
    showToast(`Zone « ${deleteTarget.name} » supprimée.`);
    setDeleteTarget(null); setPage(1);
  }

  let filtered = zones
    .filter(z => {
      if (activeTab === "active")   return z.status === "active";
      if (activeTab === "archived") return z.status === "archived";
      return true;
    })
    .filter(z => !search || z.name.toLowerCase().includes(search.toLowerCase()));

  if (sort) {
    filtered = [...filtered].sort((a, b) => {
      const av = String(a[sort.key]).toLowerCase();
      const bv = String(b[sort.key]).toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, totalItems);
  const pageData   = filtered.slice(pageStart, pageEnd);
  const counts     = {
    all:      zones.length,
    active:   zones.filter(z => z.status === "active").length,
    archived: zones.filter(z => z.status === "archived").length,
  };

  const pageLabel = totalItems === 0
    ? "0 élément"
    : `${pageStart + 1} – ${pageEnd} sur ${totalItems} éléments`;

  return (
    <div className="zones-page">

      {/* Header */}
      <div className="zones-header">
        <h1 className="zones-title">Zones</h1>
        <button className="zones-btn-new" onClick={() => { setDrawerMode("add"); setEditZone(null); }}>
          <IconPlus /> Ajouter une zone
        </button>
      </div>

      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      {/* Tabs + toolbar */}
      <div className="zones-tabs-row">
        <div className="zones-tabs-pill">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`zones-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className="zones-tab-count">{counts[tab.key]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="zones-tabs-right">
          <div className="zones-search-box">
            <IconSearch />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher…"
            />
          </div>
          {/* <button className="zones-btn-outline"><IconFilter /> Filtrer</button>
          <button className="zones-btn-outline"><IconExport /> Exporter</button> */}
        </div>
      </div>

      {/* Table card */}
      <div className="zones-table-card">

        {/* Desktop table (hidden on mobile via CSS) */}
        <div style={{ overflowX: "auto" }}>
          <table className="zones-table">
            <thead>
              <tr>
                <th>Zone <SortArrows sortKey={sort} colKey="name" onSort={handleSort} /></th>
                <th>Statut</th>
                <th>Date de création <SortArrows sortKey={sort} colKey="createdAt" onSort={handleSort} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0
                ? <tr><td colSpan={4} className="zones-empty">Aucune zone trouvée</td></tr>
                : pageData.map(zone => (
                  <tr key={zone.id}>
                    <td>
                      <button className="zones-name-link" onClick={() => setPlacesZone(zone)}>
                        {zone.name}
                      </button>
                    </td>
                    <td><StatusDisplay status={zone.status} /></td>
                    <td style={{ color:"#6b7280", fontSize:13 }}>{fmtDateTime(zone.createdAt)}</td>
                    <td className="zones-actions-cell">
                      <RowMenu
                        zone={zone}
                        onListPlaces={z  => setPlacesZone(z)}
                        onListCodePostal={z => setPostalZone(z)}
                        onEdit={z => { setEditZone(z); setDrawerMode("modify"); }}
                        onDelete={z => setDeleteTarget(z)}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Mobile card list (hidden on desktop via CSS) */}
        <div className="zones-card-list">
          {pageData.length === 0
            ? <div className="zones-empty">Aucune zone trouvée</div>
            : pageData.map(zone => (
              <ZoneMobileCard
                key={zone.id}
                zone={zone}
                onPlaces={z  => setPlacesZone(z)}
                onPostal={z  => setPostalZone(z)}
                onEdit={z    => { setEditZone(z); setDrawerMode("modify"); }}
                onDelete={z  => setDeleteTarget(z)}
              />
            ))
          }
        </div>

        {/* Pagination */}
        <div className="zones-pagination">
          <button className="zones-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={safePage <= 1}>
            <IconChevronLeft />
          </button>
          <span className="zones-page-info">{pageLabel}</span>
          <button className="zones-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={safePage >= totalPages}>
            <IconChevronRight />
          </button>
        </div>
      </div>

      {drawerMode && (
        <ZoneDrawer
          mode={drawerMode}
          type="zone"
          item={editZone}
          onSave={handleSave}
          onClose={() => { setDrawerMode(null); setEditZone(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          zone={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}