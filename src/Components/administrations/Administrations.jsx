import { useState, useRef, useEffect } from "react";
import "./Administrations.css";
import { Link } from "react-router-dom";
//work kam here..
import { useDispatch, useSelector } from "react-redux";
import {fetchAdmins, changeAdminStatus} from "../../redux/reducers/adminsSlice";

const PAGE_SIZE = 15;

const AVATAR_COLORS = [
  "#6c8ebf","#d79b00","#82b366","#ae4132","#9673a6",
  "#23445d","#e07a5f","#3d405b","#81b29a","#f2cc8f"
];

function getInitials(nom, prenom) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase();
}
function getAvatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}
function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  return `${parseInt(day,10)} ${months[parseInt(m,10)-1]} ${y}`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconSearch    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconDownload  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconPlus      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconDots      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconArchive   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
const IconUnarchive = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconChevL     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

// ── SortArrows ────────────────────────────────────────────────────────────────
function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey;
  const dir = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

// ── RowMenu ───────────────────────────────────────────────────────────────────
function RowMenu({ admin, onArchive, onUnarchive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

 const isArchived = admin.status == 2; 

  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="cand-row-menu-dropdown">
          {isArchived
            ? <button className="cand-row-menu-item" onClick={() => { setOpen(false); onUnarchive(admin.id); }}><IconUnarchive /> Désarchiver</button>
            : <button className="cand-row-menu-item cand-row-menu-item--danger" onClick={() => { setOpen(false); onArchive(admin.id); }}><IconArchive /> Archiver</button>
          }
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Administrators({ admins: propAdmins, setAdmins: propSetAdmins, onSelectAdmin }) {

    const dispatch = useDispatch();
  const { list: admins, loading, error } = useSelector(state => state.admins);

  const [activeTab,  setActiveTab]  = useState("active");
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page,       setPage]       = useState(1);
  const filterRef = useRef(null);

    useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

const counts = {
    all:     admins.length,
    active:  admins.filter(s => s.status == 1).length,
    archive: admins.filter(s => s.status == 2).length,
};

let data = [...admins];
if (activeTab === "active")  data = data.filter(s => s.status == 1);
if (activeTab === "archive") data = data.filter(s => s.status == 2);
if (search) data = data.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    (s.phone || "").toLowerCase().includes(search.toLowerCase())
);


  if (sort) {
    data.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  function handleSort(key) {
    setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
  }
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeTab, search, sort]);

  // function handleArchive(id)   { setAdmins(prev => prev.map(s => s.id === id ? { ...s, status: "archived" } : s)); }
  // function handleUnarchive(id) { setAdmins(prev => prev.map(s => s.id === id ? { ...s, status: "active"   } : s)); }
//   function handleArchive(id)   { console.log('TODO: archive', id); }
// function handleUnarchive(id) { console.log('TODO: unarchive', id); }

function handleArchive(id)   { dispatch(changeAdminStatus(id)); }
function handleUnarchive(id) { dispatch(changeAdminStatus(id)); }


 if (loading) return <div className="cand-page">Chargement...</div>;
  if (error)   return <div className="cand-page">Erreur: {JSON.stringify(error)}</div>;

  const TABS = [
    { key:"active",  label:"Actif"    },
    { key:"archive", label:"Archive"  },
    { key:"all",     label:"Tous"     },
  ];

  return (
    <div className="cand-page">
      <h1 className="ord-title" style={{ marginBottom:'20px' }}>Administrations</h1>

      {/* ── Toolbar ── */}
      <div className="cand-toolbar">
        <div className="cand-search-box">
          <IconSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un administrateur..." />
        </div>
        <Link to="/addadministrator" style={{ textDecoration:"none" }}>
          <button className="adm-btn-create"><IconPlus /> Nouvel administrateur</button>
        </Link>
      </div>

      {/* ── Tabs ── */}
      <div className="cand-tabs-row">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`cand-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {counts[tab.key] > 0 && <span className="cand-tab-count">{counts[tab.key]}</span>}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="cand-table-card">
        <table className="cand-table">
          <thead>
            <tr >
              <th>Détail</th>
              <th>Administrateur <SortArrows sortKey={sort} colKey="nom" onSort={handleSort} /></th>
              <th>Téléphone <SortArrows sortKey={sort} colKey="phone" onSort={handleSort} /></th>
              <th>Statut <SortArrows sortKey={sort} colKey="status" onSort={handleSort} /></th>
              <th>Date d'inscription <SortArrows sortKey={sort} colKey="date" onSort={handleSort} /></th>
              <th></th>
            </tr>
          </thead>
     <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={6} className="cand-empty">Aucun administrateur trouvé</td></tr>
              : paginated.map(s => (
                <tr key={s.id} className={s.status == 2 ? "cand-row-archived" : ""}>

                  <td>
                    <Link to="/administratorinfo" state={{ admin: s }} style={{ textDecoration:"none" }} onClick={() => onSelectAdmin?.(s.id)}>
                      <button className="cand-file-btn">Voir le dossier</button>
                    </Link>
                  </td>

                  <td>
                    <div className="cand-candidate-cell">
                      {s.media
                        ? <img src={s.media} alt={s.first_name} className="cand-avatar" style={{ objectFit:"cover", borderRadius:"50%", width:34, height:34 }} />
                        : <div className="cand-avatar" style={{ background: getAvatarColor(s.id) }}>
                            {getInitials(s.last_name, s.first_name)}
                          </div>
                      }
                      <span className="cand-candidate-name">{s.first_name} {s.last_name}</span>
                    </div>
                  </td>

                  <td>{s.phone || <span className="cand-muted">—</span>}</td>

                  <td>
                    {s.status == 1
                      ? <span className="adm-status-badge adm-status-active">Actif</span>
                      : <span className="adm-status-badge adm-status-archived">Archivé</span>
                    }
                  </td>

                  <td>{formatDate(s.created_at?.split('T')[0])}</td>

                  <td className="cand-actions-cell">
                    <RowMenu admin={s} onArchive={handleArchive} onUnarchive={handleUnarchive} />
                  </td>

                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="cpf-pagination">
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.max(1, c - 1))} disabled={page === 1}>
          <IconChevL />
        </button>
        <span className="cpf-page-info">
          {data.length === 0 ? "0 élément" : `${(page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, data.length)} sur ${data.length} élément${data.length > 1 ? "s" : ""}`}
        </span>
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}>
          <IconChevR />
        </button>
      </div>
    </div>
  );

}
