import { useState, useRef, useEffect } from "react";
import "./Zones.css";
import "./PostalCodes.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconArrowLeft   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const IconSearch      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconSort        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>;
const IconEdit        = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconInfo        = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;
const IconChevronLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconExport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);
const IconChevronRight= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

// ── Seed data ─────────────────────────────────────────────────────────────────
const INITIAL_CODES = [
  { id: 1, code: "93200", status: "active" },
  { id: 2, code: "31000", status: "active" },
  { id: 3, code: "60100", status: "inactive" },
];

const PAGE_SIZE = 5;

// ── Toast ─────────────────────────────────────────────────────────────────────
function InlineToast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
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
          <p style={{ fontSize:17, fontWeight:700, color:"#111827", margin:"0 0 10px", fontFamily:"Inter,sans-serif" }}>
            Êtes-vous sûr ?
          </p>
          <p style={{ fontSize:14, color:"#6b7280", margin:0, fontFamily:"Inter,sans-serif" }}>
            Voulez-vous vraiment supprimer cette entrée ? Cette action est irréversible.
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

// ── Status toggle ─────────────────────────────────────────────────────────────
function StatusToggle({ value, onChange }) {
  return (
    <div className="pc-status-toggle">
      <button
        className={`pc-status-btn ${value === "active" ? "pc-status-btn--on" : ""}`}
        onClick={() => onChange("active")}
      >
        Actif
      </button>
      <button
        className={`pc-status-btn ${value === "inactive" ? "pc-status-btn--on" : ""}`}
        onClick={() => onChange("inactive")}
      >
        Inactif
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PostalCodes({ zone, onBack }) {
  const [codes,        setCodes]        = useState(INITIAL_CODES);
  const [activeTab,    setActiveTab]    = useState("active");
  const [page,         setPage]         = useState(1);
  const [toast,        setToast]        = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search,       setSearch]       = useState("");

  const [newCode,   setNewCode]   = useState("");
  const [newStatus, setNewStatus] = useState("active");

  const [editingId,  setEditingId]  = useState(null);
  const [editCode,   setEditCode]   = useState("");
  const [editStatus, setEditStatus] = useState("active");

  const filtered = codes.filter(c => {
    if (activeTab === "active")  return c.status === "active";
    if (activeTab === "archive") return c.status === "inactive";
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, totalItems);
  const pageData   = filtered.slice(pageStart, pageEnd);

  const counts = {
    active:  codes.filter(c => c.status === "active").length,
    archive: codes.filter(c => c.status === "inactive").length,
    all:     codes.length,
  };

  function handleAdd() {
    const trimmed = newCode.trim();
    if (!trimmed) return;
    setCodes(prev => [...prev, { id: Date.now(), code: trimmed, status: newStatus }]);
    setNewCode("");
    setNewStatus("active");
    setToast("Code postal ajouté avec succès.");
    setPage(1);
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditCode(entry.code);
    setEditStatus(entry.status);
  }

  function saveEdit(id) {
    const trimmed = editCode.trim();
    if (!trimmed) return;
    setCodes(prev => prev.map(c => c.id === id ? { ...c, code: trimmed, status: editStatus } : c));
    setEditingId(null);
    setToast("Code postal mis à jour avec succès.");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function handleDeleteConfirm() {
    setCodes(prev => prev.filter(c => c.id !== deleteTarget.id));
    setToast("Code postal supprimé.");
    setDeleteTarget(null);
    setPage(1);
  }

  const TABS = [
    { key: "active",  label: "Actif"    },
    { key: "archive", label: "Archive"  },
    { key: "all",     label: "Tous"     },
  ];

  return (
    <div className="zones-page">

      {/* ── Header ── */}
      <div className="zones-header">
        <div className="zones-header-left">
          {onBack && (
            <button className="zones-back-btn" onClick={onBack}><IconArrowLeft /></button>
          )}
          <h1 className="zones-title">Code postal{zone ? ` : ${zone.name}` : ""}</h1>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      {/* ── Tabs + icon buttons ── */}
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
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher..." />
          </div>
          <button className="zones-btn-outline"><IconFilter /> Filtrer</button>
          <button className="zones-btn-outline"><IconExport /> Exporter</button>
        </div>
      </div>

      {/* ── Add new postal code row ── */}
      <div className="pc-add-row">
        <input
          className="pc-add-input"
          type="text"
          placeholder="Ajouter un code postal *"
          value={newCode}
          onChange={e => setNewCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <StatusToggle value={newStatus} onChange={setNewStatus} />
        <button
          className="pc-save-btn"
          onClick={handleAdd}
          disabled={!newCode.trim()}
        >
          Enregistrer
        </button>
      </div>

      {/* ── Table ── */}
      <div className="zones-table-card">
        <table className="zones-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Statut</th>
              <th style={{ textAlign:"right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0
              ? <tr><td colSpan={3} className="zones-empty">Aucun code postal trouvé</td></tr>
              : pageData.map(entry => {
                  const isEditing = editingId === entry.id;
                  return (
                    <tr key={entry.id}>

                      <td>
                        {isEditing
                          ? <input
                              className="pc-edit-input"
                              value={editCode}
                              onChange={e => setEditCode(e.target.value)}
                              autoFocus
                            />
                          : <span style={{ fontWeight:500 }}>{entry.code}</span>
                        }
                      </td>

                      <td>
                        {isEditing
                          ? <StatusToggle value={editStatus} onChange={setEditStatus} />
                          : <StatusToggle value={entry.status} onChange={() => {}} />
                        }
                      </td>

                      <td className="pc-actions-cell">
                        {isEditing ? (
                          <div className="pc-edit-actions">
                            <button className="pc-cancel-btn" onClick={cancelEdit}>Annuler</button>
                            <button className="pc-confirm-btn" onClick={() => saveEdit(entry.id)}>Enregistrer</button>
                          </div>
                        ) : (
                          <div className="pc-icon-actions">
                            <button className="pc-icon-btn" onClick={() => startEdit(entry)} title="Modifier">
                              <IconEdit />
                            </button>
                            <button className="pc-icon-btn" onClick={() => setDeleteTarget(entry)} title="Supprimer">
                              <IconTrash />
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })
            }
          </tbody>
        </table>

        {/* Pagination */}
        <div className="zones-pagination">
          <button className="zones-page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage <= 1}>
            <IconChevronLeft />
          </button>
          <span className="zones-page-info">
            {totalItems === 0 ? "0 élément" : `${pageStart+1} - ${pageEnd} sur ${totalItems} élément${totalItems > 1 ? "s" : ""}`}
          </span>
          <button className="zones-page-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage >= totalPages}>
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </div>
  );
}