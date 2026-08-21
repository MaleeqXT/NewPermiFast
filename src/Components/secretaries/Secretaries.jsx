import { useState, useRef, useEffect } from "react";
import "./Secretaries.css";
import { Link } from "react-router-dom";
import ZoneModal from "../../sessions/ZoneModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchSecretaries } from "../../redux/reducers/adminSecretarySlice.jsx";
const BASE_URL = import.meta.env.VITE_API_URL;

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
  const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  return `${parseInt(day,10)} ${months[parseInt(m,10)-1]} ${y}`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconPlus     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconDots     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconArchive  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
const IconUnarchive= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconChevL    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

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

// ── RowMenu — Archive only ────────────────────────────────────────────────────
function RowMenu({ secretary, onArchive, onUnarchive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isArchived = secretary.status === "archived";

  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="cand-row-menu-dropdown">
          {isArchived
            ? <button className="cand-row-menu-item" onClick={() => { setOpen(false); onUnarchive(secretary.id); }}><IconUnarchive /> Désarchiver</button>
            : <button className="cand-row-menu-item cand-row-menu-item--danger" onClick={() => { setOpen(false); onArchive(secretary.id); }}><IconArchive /> Archiver</button>
          }
        </div>
      )}
    </div>
  );
}

// ── Default sample data ───────────────────────────────────────────────────────
// const initialSecretaries = [
//   { id:1, nom:"PassPermis 1999", prenom:"Pass",  email:"passpermis@gmail.com",   date:"2026-02-20", status:"active",  location:"TOULOUSE" },
//   { id:2, nom:"Dupont",     prenom:"Marie", email:"marie.dupont@gmail.com", date:"2026-03-10", status:"active",  location:"CREIL"    },
// ];

// ── Main Component ────────────────────────────────────────────────────────────
export default function Secretary({ secretaries: propSecretaries, setSecretaries: propSetSecretaries, onSelectSecretary,selectedSchoolId }) {

      const dispatch = useDispatch();
  const { list: secretaries, loading, error, lastPage, activeCount, archiveCount } = useSelector(state => state.secretaries);


  // const [localSecretaries, setLocalSecretaries] = useState(initialSecretaries);
  // const secretaries    = propSecretaries    ?? localSecretaries;
  // const setSecretaries = propSetSecretaries ?? setLocalSecretaries;

  const [activeTab,     setActiveTab]     = useState("active");
  const [search,        setSearch]        = useState("");
  const [sort,          setSort]          = useState(null);
  const [page,          setPage]          = useState(1);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [selectedZone,  setSelectedZone]  = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  //fetching
  
    useEffect(() => {
    dispatch(fetchSecretaries({ page, search, status: activeTab === 'active' ? 1 : 2 }));
  }, [dispatch,page, search, activeTab,selectedSchoolId]);


  

  const counts = {
        active:  activeCount,
    archive: archiveCount,
    //     active:  secretaries.filter(s => s.status == 1).length,
    // archive: secretaries.filter(s => s.status == 2).length,
  };

  let data = [...secretaries];
if (activeTab === "active")  data = data.filter(s => s.status == 1);
if (activeTab === "archive") data = data.filter(s => s.status == 2);
  if (selectedZone)  data = data.filter(s => (s.location || "").toUpperCase().includes(selectedZone.name));
  if (selectedPlace) data = data.filter(s => (s.location || "").includes(selectedPlace));
  if (search) data = data.filter(s =>
       `${s.user?.first_name} ${s.user?.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.email.toLowerCase().includes(search.toLowerCase())
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
  function handleArchive(id)   { setSecretaries(prev => prev.map(s => s.id === id ? { ...s, status: "archived" } : s)); }
  function handleUnarchive(id) { setSecretaries(prev => prev.map(s => s.id === id ? { ...s, status: "active"   } : s)); }

  // const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  // const paginated  = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Pagination bhi backend se:
const totalPages = lastPage;
const paginated  = secretaries;

  useEffect(() => { setPage(1); }, [activeTab, search, sort, selectedZone, selectedPlace]);

  //    if (loading) return <div className="cand-page">Chargement...</div>;
  // if (error)   return <div className="cand-page">Erreur: {JSON.stringify(error)}</div>;

  
  const TABS = [
    { key: "active",  label: "Actif"   },
    { key: "archive", label: "Archive" },
  ];

  return (
    <div className="cand-page">
      <h1 className="ord-title" style={{ marginBottom: "20px" }}>Secrétaires</h1>

      {/* ── Barre d'outils ── */}
      <div className="cand-toolbar">
        <div className="cand-search-box">
          <IconSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une secrétaire…" />
        </div>
        <button className="cand-btn-outline" onClick={() => setZoneModalOpen(true)}>
          {selectedZone ? `${selectedZone.name}${selectedPlace ? ` / ${selectedPlace}` : ""}` : "Search"}
        </button>

        <Link to="/secretaryform" style={{ textDecoration: "none" }}>
          <button className="sec-btn-create"><IconPlus /> Créer une secrétaire</button>
        </Link>
      </div>

      {/* ── Onglets ── */}
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

      {/* ── Tableau ── */}
      <div className="cand-table-card">

        <table className="cand-table">
  
          <thead>
            <tr>
              <th>Détail</th>
              <th>Nom <SortArrows sortKey={sort} colKey="nom" onSort={handleSort} /></th>
              <th>E-mail <SortArrows sortKey={sort} colKey="email" onSort={handleSort} /></th>
              <th>Créé le <SortArrows sortKey={sort} colKey="date" onSort={handleSort} /></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {loading && (
    <tr>
      <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
        <div style={{
          width: 36, height: 36,
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto"
        }} />
      </td>
    </tr>
  )}

  {!loading && error && (
    <tr>
      <td colSpan={5} style={{ textAlign: "center", color: "red", padding: "20px" }}>
        {JSON.stringify(error)}
      </td>
    </tr>
  )}

            {!loading && paginated.length === 0
              ? <tr><td colSpan={5} className="cand-empty">Aucune secrétaire trouvée</td></tr>
              : paginated.map(s => (
                <tr key={s.id} className={s.status === "archived" ? "cand-row-archived" : ""}>

                  <td>
                    <Link to={`/secretaryinfo/${s.id}`}
                    state={{ secretary: s }} style={{ textDecoration: "none" }} onClick={() => onSelectSecretary?.(s.id)}>
                      <button className="cand-file-btn">Voir le dossier</button>
                    </Link>
                  </td>

                  <td>
                    <div className="cand-candidate-cell">
                      {s.user.media
                        ? <img src={`${BASE_URL}/storage/${s.user?.media}`} alt="" className="cand-avatar" style={{ objectFit:"cover", borderRadius:"50%", width:34, height:34 }} />
                        : <div className="cand-avatar" style={{ background: getAvatarColor(s.user.id) }}>
                            {getInitials(s.nom, s.prenom)}
                          </div>
                      }
                      <span className="cand-candidate-name">{s.user.first_name} {s.user.last_name}</span>
                    </div>
                  </td>

                  <td>{s.user.email}</td>
                 <td>{formatDate(s.created_at)}</td> 

                  <td className="cand-actions-cell">
                    <RowMenu secretary={s} onArchive={handleArchive} onUnarchive={handleUnarchive} />
                  </td>

                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="cpf-pagination">
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.max(1, c - 1))} disabled={page === 1}>
          <IconChevL />
        </button>
        <span className="cpf-page-info">
          {data.length === 0
            ? "0 élément"
            : `${(page - 1) * PAGE_SIZE + 1} – ${Math.min(page * PAGE_SIZE, data.length)} sur ${data.length} élément${data.length > 1 ? "s" : ""}`}
        </span>
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}>
          <IconChevR />
        </button>
      </div>

      {zoneModalOpen && (
        <ZoneModal
          current={{ zone: selectedZone, place: selectedPlace }}
          onSave={(zone, place) => { setSelectedZone(zone); setSelectedPlace(place); }}
          onClose={() => setZoneModalOpen(false)}
        />
      )}
    </div>
  );
}
