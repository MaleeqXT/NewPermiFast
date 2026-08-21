import { useState, useRef, useEffect } from "react";
import "./Skills.css";

// ── Icons ─────────────────────────────────────────────────────────────────
const IconBack   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconDots   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconEdit   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconExport = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconInfo   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;

// ── Sample sub-skills ─────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  { id:1, position:1, label:"Comprendre les principaux composants et commandes du véhicule",                                         status:"active" },
  { id:2, position:2, label:"Monter, s'installer au siège conducteur et descendre",                                                  status:"active" },
  { id:3, position:3, label:"Tenir, tourner le volant et maintenir la trajectoire",                                                  status:"active" },
  { id:4, position:4, label:"Démarrer et s'arrêter",                                                                                status:"active" },
  { id:5, position:5, label:"Maîtriser l'accélération et le freinage à différentes vitesses",                                       status:"active" },
  { id:6, position:6, label:"Utiliser la boîte de vitesses",                                                                        status:"active" },
  { id:7, position:7, label:"Diriger le véhicule en ligne droite et en courbe en adaptant la vitesse et la trajectoire",            status:"active" },
  { id:8, position:8, label:"Observer autour de soi et avertir",                                                                    status:"active" },
  { id:9, position:9, label:"Effectuer une marche arrière sécurisée et un demi-tour",                                               status:"active" },
];

// ── Toast ─────────────────────────────────────────────────────────────────
function InlineToast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="skills-toast-inline">
      <div className="skills-toast-top">
        <IconInfo /> Succès
        <button className="skills-toast-top-close" onClick={onClose}>✕</button>
      </div>
      <div className="skills-toast-bottom">{message || "L'action a été effectuée avec succès."}</div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onClose }) {
  return (
    <div className="skills-modal-overlay">
      <div className="skills-modal">
        <div className="skills-modal-header">
          <span className="skills-modal-title">Confirmation</span>
          <button className="skills-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="skills-modal-body">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <p style={{ fontSize:17, fontWeight:700, color:"#111827", margin:"0 0 10px", fontFamily:"Inter,sans-serif" }}>Êtes-vous sûr ?</p>
          <p style={{ fontSize:14, color:"#6b7280", margin:0, fontFamily:"Inter,sans-serif" }}>Voulez-vous vraiment supprimer cette entrée ?</p>
        </div>
        <div className="skills-modal-footer">
          <button className="skills-modal-btn skills-modal-btn--cancel" onClick={onClose}>Annuler</button>
          <button className="skills-modal-btn skills-modal-btn--delete" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ── 3-dot Row Menu ────────────────────────────────────────────────────────
function RowMenu({ onModifier, onDeleteRequest }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="skills-row-menu-wrapper" ref={ref}>
      <button className="skills-row-menu-trigger" onClick={() => setOpen(o => !o)}>
        <IconDots />
      </button>
      {open && (
        <div className="skills-row-menu-dropdown">
          <button className="skills-row-menu-item" onClick={() => { setOpen(false); onModifier(); }}>
            <IconEdit /> Modifier
          </button>
          <button className="skills-row-menu-item skills-row-menu-item--danger" onClick={() => { setOpen(false); onDeleteRequest(); }}>
            <IconTrash /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   { cls:"skills-badge--active",   label:"Actif"    },
    inactive: { cls:"skills-badge--inactive", label:"Inactif"  },
    archived: { cls:"skills-badge--archived", label:"Archivé"  },
  };
  const { cls, label } = map[status] ?? map.archived;
  return <span className={`skills-badge ${cls}`}>{label}</span>;
}

// ── Detail Drawer ─────────────────────────────────────────────────────────
function DetailDrawer({ mode, item, nextPosition, onSave, onClose }) {
  const isAdd = mode === "add";
  const [enabled,  setEnabled]  = useState(isAdd ? true : item?.status === "active");
  const [position, setPosition] = useState(isAdd ? String(nextPosition ?? "") : String(item?.position ?? ""));
  const [label,    setLabel]    = useState(isAdd ? "" : item?.label ?? "");

  useEffect(() => {
    if (!isAdd && item) {
      setEnabled(item.status === "active");
      setPosition(String(item.position ?? ""));
      setLabel(item.label ?? "");
    }
  }, [item?.id]); // eslint-disable-line

  const canSave = label.trim() !== "" && position !== "";

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...(item ?? {}),
      status:   enabled ? "active" : "inactive",
      position: Number(position),
      label:    label.trim(),
    });
  }

  const title = isAdd ? "Ajouter une sous-compétence" : "Modifier la sous-compétence";

  return (
    <>
      <div className="skills-drawer-overlay" onClick={onClose} />
      <div className="skills-drawer">
        <div className="skills-drawer-header">
          <button className="skills-drawer-close" onClick={onClose}>Fermer</button>
          <span className="skills-drawer-title">{title}</span>
          <span style={{ width:46 }} />
        </div>
        <div className="skills-drawer-body">

          {/* Bascule activer */}
          <div className="skills-toggle-row">
            <span className="skills-toggle-label">Activer</span>
            <label className="skills-toggle">
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
              <span className="skills-toggle-track" />
              <span className="skills-toggle-thumb" />
            </label>
          </div>

          {/* Aperçu statut */}
          <div style={{ marginTop:-10 }}>
            <span className={`skills-badge ${enabled ? "skills-badge--active" : "skills-badge--inactive"}`} style={{ fontSize:12 }}>
              Statut : {enabled ? "Actif" : "Inactif"}
            </span>
          </div>

          {/* Position */}
          <div className="skills-form-group">
            <label>Position <span>*</span></label>
            <input
              className="skills-input skills-position-input"
              type="number" min="1"
              value={position}
              onChange={e => setPosition(e.target.value)}
              placeholder="1"
            />
          </div>

          {/* Libellé */}
          <div className="skills-form-group">
            <label>Libellé <span>*</span></label>
            <input
              className="skills-input"
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="ex. Utiliser la boîte de vitesses"
            />
          </div>

        </div>
        <div className="skills-drawer-footer">
          <button className="skills-drawer-save-btn" onClick={handleSave} disabled={!canSave}>
            Enregistrer
          </button>
        </div>
      </div>
    </>
  );
}

// ── Mobile sub-skill card ─────────────────────────────────────────────────
function SubSkillMobileCard({ item, index, onModifier, onDeleteRequest }) {
  return (
    <div className="skills-card">
      <div className="skills-card-top">
        <span className="skills-card-num">{index + 1}</span>
        <span className="skills-card-name">{item.label}</span>
        <RowMenu onModifier={onModifier} onDeleteRequest={onDeleteRequest} />
      </div>
      <div className="skills-card-meta">
        <span className="skills-card-label">Position {item.position}</span>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
}

// ── Main Detail Page ──────────────────────────────────────────────────────
export default function SkillDetail({ skillName = "Maîtrise de la conduite du véhicule en trafic faible ou nul", onBack }) {
  const [items,        setItems]        = useState(INITIAL_ITEMS);
  const [activeTab,    setActiveTab]    = useState("all");
  const [drawerMode,   setDrawerMode]   = useState(null);
  const [editItem,     setEditItem]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [search,       setSearch]       = useState("");

  const TABS = [
    { key:"all",      label:"Tout"    },
    { key:"active",   label:"Actif"   },
    { key:"archived", label:"Archivé" },
  ];

  const counts = {
    all:      items.length,
    active:   items.filter(i => i.status === "active").length,
    archived: items.filter(i => i.status === "archived").length,
  };

  const filtered = items
    .filter(i => activeTab === "all" || i.status === activeTab)
    .filter(i => !search || i.label.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.position - b.position);

  const nextPosition = items.length > 0 ? Math.max(...items.map(i => i.position)) + 1 : 1;

  function showToast() { setToast("L'action a été effectuée avec succès."); }

  function handleSave(data) {
    if (drawerMode === "add")
      setItems(prev => [...prev, { ...data, id: Date.now() }].sort((a,b) => a.position - b.position));
    else
      setItems(prev => prev.map(i => i.id === data.id ? data : i).sort((a,b) => a.position - b.position));
    setDrawerMode(null); setEditItem(null); showToast();
  }

  function handleDeleteConfirm() {
    setItems(prev => prev.filter(i => i.id !== deleteTarget));
    setDeleteTarget(null); showToast();
  }

  return (
    <div className="skills-page">

      {/* Header */}
      <div className="skills-header">
        <div className="skd-header-left">
          <button className="skd-back-btn" onClick={onBack}><IconBack /></button>
          <h1 className="skills-title skd-title">{skillName}</h1>
        </div>
        <button className="skills-btn-new" onClick={() => { setDrawerMode("add"); setEditItem(null); }}>
          <IconPlus /> Nouvelle sous-compétence
        </button>
      </div>

      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      {/* Tabs + toolbar */}
      <div className="skills-tabs-row skd-tabs-row">
        <div className="skills-tabs-pill">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`skills-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className="skills-tab-count">{counts[tab.key]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="skills-tabs-right">
          <div className="skills-search-box">
            <IconSearch />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" />
          </div>
          <button className="skills-btn-outline"><IconFilter /> Filtrer</button>
          <button className="skills-btn-outline"><IconExport /> Exporter</button>
        </div>
      </div>

      {/* Table card */}
      <div className="skills-table-card">

        {/* Desktop table (hidden on mobile via CSS) */}
        <div style={{ overflowX:"auto" }}>
          <table className="skills-table">
            <thead>
              <tr>
                <th className="skd-num-col">#</th>
                <th>Libellé</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={4} className="skills-empty">Aucune entrée trouvée</td></tr>
                : filtered.map((item, i) => (
                  <tr key={item.id}>
                    <td className="skd-num-col skd-num-cell">{i + 1}</td>
                    <td className="skd-label-cell">{item.label}</td>
                    <td><StatusBadge status={item.status} /></td>
                    <td className="skills-actions-cell">
                      <RowMenu
                        onModifier={() => { setEditItem(item); setDrawerMode("modify"); }}
                        onDeleteRequest={() => setDeleteTarget(item.id)}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Mobile card list (hidden on desktop via CSS) */}
        <div className="skills-card-list">
          {filtered.length === 0
            ? <div className="skills-empty">Aucune entrée trouvée</div>
            : filtered.map((item, i) => (
              <SubSkillMobileCard
                key={item.id}
                item={item}
                index={i}
                onModifier={() => { setEditItem(item); setDrawerMode("modify"); }}
                onDeleteRequest={() => setDeleteTarget(item.id)}
              />
            ))
          }
        </div>
      </div>

      {drawerMode && (
        <DetailDrawer
          mode={drawerMode}
          item={editItem}
          nextPosition={nextPosition}
          onSave={handleSave}
          onClose={() => { setDrawerMode(null); setEditItem(null); }}
        />
      )}

      {deleteTarget !== null && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}