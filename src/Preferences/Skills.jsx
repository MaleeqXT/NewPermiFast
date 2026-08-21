import { useState, useRef, useEffect } from "react";
import "./Skills.css";
import SkillDrawer from "./SkillDrawer";
import SkillDetail from "./SkillDetail";
import {
  fetchCompetence, addCompetence, updateCompetence, deleteCompetence,
  selectCompetenceList, selectCompetenceLoading,
  selectCompetenceAllCount, selectCompetenceActiveCount, selectCompetenceArchiveCount,
} from "../redux/reducers/competencesSlice";
// import {
//   fetchCompetence,
//   selectSelectedCompetence,
//   addCompetence,
//   selectSelectedCompetenceLoading

// } from "../redux/reducers/competencesSlice";
import { useDispatch, useSelector } from "react-redux";



const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconExport = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconDots  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconEdit  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconInfo  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;

function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="skills-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1  ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}



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

// ── Delete modal ──────────────────────────────────────────────────────────
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
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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

// ── Row menu ──────────────────────────────────────────────────────────────
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
      <button className="skills-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
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

// ── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   { cls:"skills-badge--active",   label:"Actif"    },
    inactive: { cls:"skills-badge--inactive", label:"Inactif"  },

  };
  const { cls, label } = map[status] ?? map.archived;
  return <span className={`skills-badge ${cls}`}>{label}</span>;
}

// ── Mobile skill card ─────────────────────────────────────────────────────
function SkillMobileCard({ skill, index, onDetail, onModifier, onDeleteRequest }) {
  return (
    <div className="skills-card">
      <div className="skills-card-top">
        <span className="skills-card-num">{index + 1}</span>
        <span className="skills-card-name">{skill.name}</span>
        <RowMenu onModifier={onModifier} onDeleteRequest={onDeleteRequest} />
      </div>
      <div className="skills-card-meta">
        <span className="skills-card-label">{skill.label}</span>
        <StatusBadge status={skill.status} />
      </div>
      <div className="skills-card-actions">
        <button className="skills-file-btn" onClick={onDetail}>Voir la fiche</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function CandidateSkills() {
  // const [skills,       setSkills]       = useState(INITIAL_SKILLS);
  const [activeTab,    setActiveTab]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [drawerMode,   setDrawerMode]   = useState(null);
  const [editSkill,    setEditSkill]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [sort,         setSort]         = useState(null);
  const [detailSkill,  setDetailSkill]  = useState(null);

    const dispatch = useDispatch();

const skills  = useSelector(selectCompetenceList);
const loading = useSelector(selectCompetenceLoading);
const allCount     = useSelector(selectCompetenceAllCount);
const activeCount  = useSelector(selectCompetenceActiveCount);
const archiveCount = useSelector(selectCompetenceArchiveCount);


//   useEffect(() => {
//   dispatch(fetchCompetence({ page: 1, search: "", status: "" }));
  
// }, [dispatch]);
useEffect(() => {
  const timer = setTimeout(() => {
    dispatch(fetchCompetence({ 
      page: 1, 
      search: search, 
      status: activeTab === "all" ? "" : activeTab 
    }));
  }, 400); 

  return () => clearTimeout(timer);
}, [dispatch, activeTab, search]);


 if (detailSkill) return <SkillDetail skillId={detailSkill.id} skillName={detailSkill.name} onBack={() => setDetailSkill(null)} />;

  const counts = {
  all:      allCount,
  active:   activeCount,
  inactive: archiveCount,           // backend deta nahi abhi
 
  };

  const TABS = [
    { key:"all",      label:"Tout"    },
    { key:"active",   label:"Actif"   },
    { key:"inactive", label:"Inactif" },
 
  ];

  const handleSort = key =>
    setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });

  let filtered = [...skills];

  if (sort) {
    filtered = [...filtered].sort((a, b) => {
      const av = sort.key === "position" ? Number(a[sort.key]) : String(a[sort.key]).toLowerCase();
      const bv = sort.key === "position" ? Number(b[sort.key]) : String(b[sort.key]).toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  const nextPosition = skills.length > 0 ? Math.max(...skills.map(s => s.position)) + 1 : 1;

  function showToast() { setToast("L'action a été effectuée avec succès."); }
  


async function handleSave(data) {
  if (drawerMode === "add") {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("label", data.label);
    formData.append("position", data.position);
    formData.append("status", data.status);

    const result = await dispatch(addCompetence(formData));
       if (addCompetence.fulfilled.match(result)) {
      dispatch(fetchCompetence({ page: 1, search, status: activeTab === "all" ? "" : activeTab }));
      showToast();
    }

  } else {
    // PUT request — plain object bhejo, FormData ki zaroorat nahi
    const result = await dispatch(updateCompetence({
      id: data.id,
      formData: {
        name: data.name,
        label: data.label,
        position: data.position,
        status: data.status,
      }
    }));

   if (updateCompetence.fulfilled.match(result)) {
      dispatch(fetchCompetence({ page: 1, search, status: activeTab === "all" ? "" : activeTab }));
      showToast();
    }
  }

  setDrawerMode(null);
  setEditSkill(null);
}

  async function handleDeleteConfirm() {
  const result = await dispatch(deleteCompetence(deleteTarget));
  if (deleteCompetence.fulfilled.match(result)) showToast();
  setDeleteTarget(null);
}

  return (
    <div className="skills-page">

      {/* Header */}
      <div className="skills-header">
        <h1 className="skills-title">Compétences des candidats</h1>
        <button className="skills-btn-new" onClick={() => { setDrawerMode("add"); setEditSkill(null); }}>
          <IconPlus /> Nouvelle compétence
        </button>
      </div>

      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      {/* Tabs + search toolbar */}
      <div className="skills-tabs-row">
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
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
            />
          </div>
          {/* <button className="skills-btn-outline"><IconFilter /> Filtrer</button>
          <button className="skills-btn-outline"><IconExport /> Exporter</button> */}
        </div>
      </div>

      {/* Table card */}
      <div className="skills-table-card">

        {/* Desktop table (hidden on mobile via CSS) */}
        <div style={{ overflowX: "auto" }}>
          <table className="skills-table">
            <thead>
              <tr>
                <th className="skd-num-col">#</th>
                <th>Détail</th>
                <th>Nom     <SortArrows sortKey={sort} colKey="name"   onSort={handleSort} /></th>
                <th>Libellé <SortArrows sortKey={sort} colKey="label"  onSort={handleSort} /></th>
                <th>Statut  <SortArrows sortKey={sort} colKey="status" onSort={handleSort} /></th>
                <th></th>
              </tr>
            </thead>
<tbody>
  {loading ? (
    <tr>
      <td colSpan={6}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #111827",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        </div>

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </td>
    </tr>
  ) : filtered.length === 0 ? (
    <tr>
      <td colSpan={6} className="skills-empty">
        Aucune compétence trouvée
      </td>
    </tr>
  ) : (
    filtered.map((s, i) => (
      <tr key={s.id}>
        <td className="skd-num-col skd-num-cell">{i + 1}</td>
        <td>
          <button
            className="skills-file-btn"
            onClick={() => setDetailSkill(s)}
          >
            Voir la dossier
          </button>
        </td>
        <td>
          <span className="skills-name-link">{s.name}</span>
        </td>
        <td style={{ color: "#374151" }}>{s.label}</td>
        <td>
          <StatusBadge status={s.status} />
        </td>
        <td className="skills-actions-cell">
          <RowMenu
            onModifier={() => {
              setEditSkill(s);
              setDrawerMode("modify");
            }}
            onDeleteRequest={() => setDeleteTarget(s.id)}
          />
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>

        {/* Mobile card list (hidden on desktop via CSS) */}
        <div className="skills-card-list">
          {filtered.length === 0
            ? <div className="skills-empty">Aucune compétence trouvée</div>
            : filtered.map((s, i) => (
              <SkillMobileCard
                key={s.id}
                skill={s}
                index={i}
                onDetail={() => setDetailSkill(s)}
                onModifier={() => { setEditSkill(s); setDrawerMode("modify"); }}
                onDeleteRequest={() => setDeleteTarget(s.id)}
              />
            ))
          }
        </div>
      </div>

      {drawerMode && (
        <SkillDrawer
          mode={drawerMode}
          skill={editSkill}
          nextPosition={nextPosition}
          onSave={handleSave}
          onClose={() => { setDrawerMode(null); setEditSkill(null); }}
        />
      )}
      {deleteTarget !== null && (
        <DeleteModal onConfirm={handleDeleteConfirm} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}