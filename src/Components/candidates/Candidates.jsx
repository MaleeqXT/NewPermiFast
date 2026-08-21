import { useState, useRef, useEffect } from "react";
import "./Candidates.css";
import { Link, useNavigate } from "react-router-dom";
import { useCandidates } from "./CandidatesContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, updateCandidateStatus } from "../../redux/reducers/candidateSlice.jsx";
const BASE_URL = import.meta.env.VITE_API_URL;

const AVATAR_COLORS = ["#6c8ebf","#d79b00","#82b366","#ae4132","#9673a6","#23445d","#e07a5f","#3d405b","#81b29a","#f2cc8f"];
const PAGE_SIZE = 15;

function getInitials(nom, prenom) { return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase(); }
function getAvatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }
function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  return `${parseInt(day,10)} ${months[parseInt(m,10)-1]} ${y}`;
}

const IconSearch    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconPlus      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconDots      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconDetails   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
const IconConnect   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IconChart     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const IconContract  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>;
const IconArchive   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
const IconUnarchive = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconChevL     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

function downloadRowAsExcel(row, fileName) {
  const labels = {
    prenom: "Pr?nom",
    nom: "Nom",
    balance: "Solde disponible",
    place: "Places",
    date: "Date d'inscription",
    permis: "Permis",
    status: "Statut",
  };
  const body = Object.entries(labels)
    .map(function (_ref) { var key = _ref[0], label = _ref[1]; return "<tr><th>" + label + "</th><td>" + (row && row[key] != null ? row[key] : "") + "</td></tr>"; })
    .join("");
  const html = "<!doctype html><html><head><meta charset=\"utf-8\"></head><body><table>" + body + "</table></body></html>";
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function RowMenu({ student, onDetails, onConnect, onExport, onContract, onArchive, onUnarchive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const isArchived = Number(student.status) === 2 || student.status === "archived";
  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="cand-row-menu-dropdown">
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onDetails && onDetails(student); }}><IconDetails /> D?tails</button>
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onConnect && onConnect(student); }}><IconConnect /> Connecter</button>
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onExport && onExport(student); }}><IconChart /> Exporter Excel</button>
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onContract && onContract(student); }}><IconContract /> Contrat</button>
          <div className="cand-row-menu-divider" />
          {isArchived
            ? <button className="cand-row-menu-item" onClick={() => { setOpen(false); onUnarchive(student.id); }}><IconUnarchive /> D?sarchiver</button>
            : <button className="cand-row-menu-item cand-row-menu-item--danger" onClick={() => { setOpen(false); onArchive(student.id); }}><IconArchive /> Archiver</button>
          }
        </div>
      )}
    </div>
  );
}
export default function Candidates({selectedSchoolId}) {
  // const { candidates, setSelectedCandidateId, archiveCandidate, unarchiveCandidate } = useCandidates();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState(null);
  const [page,      setPage]      = useState(1);


    const dispatch = useDispatch();
  const { list: candidates, loading, error, lastPage, activeCount, archiveCount,inholdCount,allCount,currentPage,newCount,total,setSelectedCandidateId  } = useSelector(state => state.candidates);


  // const counts = {
  //   all:     candidates.length,
  //   active:  candidates.filter(s => s.status === "active").length,
  //   archive: candidates.filter(s => s.status === "archived").length,
  //   new:     candidates.filter(s => s.status === "new").length,
  // };
  const counts = {
  all:     allCount ?? 0,
  active:  activeCount ?? 0,
  archive: archiveCount ?? 0,
  new:     newCount ?? 0,
};


const STATUS_MAP = {
  all:     '',
  active:  1,
  archive: 2,   // apni API ke hisaab se number daalo
  new:     "new",
};

//   const STATUS_MAP = {
//   active: 1,
//   inactive: 2,
//   onhold: 3,

// };

useEffect(() => {
  dispatch(fetchStudents({ page, search, status: STATUS_MAP[activeTab] ?? '' }));
}, [dispatch, page, search, activeTab,selectedSchoolId]);


  let data = [...candidates];
  // if (activeTab === "active")  data = data.filter(s => s.status === "active");
  // if (activeTab === "archive") data = data.filter(s => s.status === "archived");
  // if (activeTab === "new")     data = data.filter(s => s.status === "new");
  if (search) {
    const term = search.toLowerCase();
    data = data.filter((student) => [
      student.first_name,
      student.last_name,
      student.name,
      student.email,
      student.student?.permis,
      student.student?.balance,
    ].some((value) => String(value ?? "").toLowerCase().includes(term)));
  }

  const getSortValue = (student, key) => {
    if (key === "nom") return `${student.first_name ?? ""} ${student.last_name ?? ""}`.toLowerCase();
    if (key === "balance") return Number(student.student?.balance ?? 0);
    if (key === "place") return student.student?.zones?.map((zone) => zone.name).join(" ") ?? "";
    if (key === "date") return new Date(student.created_at ?? 0).getTime();
    return student[key] ?? "";
  };

  if (sort) data.sort((a, b) => {
    const av = getSortValue(a, sort.key);
    const bv = getSortValue(b, sort.key);
    return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
  });

  function handleSort(key) { setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 }); }
  const handleArchive = (id) => dispatch(updateCandidateStatus({ id, status: 2 }));
  const handleUnarchive = (id) => dispatch(updateCandidateStatus({ id, status: 1 }));
  // const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  // const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = lastPage;
const paginated = data;

  useEffect(() => { setPage(1); }, [activeTab, search, sort]);

  const TABS = [
   { key:"all",      label:"Tout"       },
    { key:"active",  label:"Actif"    },
    { key:"archive", label:"Archive"  },
    { key:"new",     label:"Nouveau"  },
  ];

  return (
    <div className="cand-page">
      <h1 className="ord-title" style={{ marginBottom:'20px' }}>Candidats</h1>

      <div className="cand-toolbar">
        <div className="cand-search-box" style={{ maxWidth: '100%' }}>
          <IconSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." />
        </div>
        <Link to="/candidateform" style={{ textDecoration:"none" }}>
          <button className="cand-btn-dark"><IconPlus /> Ajouter un candidat</button>
        </Link>
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        <div className="cand-tabs-row" style={{ margin:0 }}>
          {TABS.map(tab => (
            <button key={tab.key} className={`cand-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
              {counts[tab.key] > 0 && <span className="cand-tab-count">{counts[tab.key]}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="cand-table-card">
         <div className="cand-table-scroll"> 
        <table className="cand-table">
          <thead>
            <tr>
              <th>Détail</th>
              <th>Candidat <SortArrows sortKey={sort} colKey="nom" onSort={handleSort} /></th>
              <th>Solde disponible <SortArrows sortKey={sort} colKey="balance" onSort={handleSort} /></th>
              <th>Places <SortArrows sortKey={sort} colKey="place" onSort={handleSort} /></th>
              <th>Date d'inscription <SortArrows sortKey={sort} colKey="date" onSort={handleSort} /></th>
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
                ? <tr><td colSpan={6} className="cand-empty">Aucun candidat trouvé</td></tr>
              : paginated.map((s, index) => (
                <tr key={s.id ?? s.student?.id ?? `student-${index}`} className={s.status === "archived" ? "cand-row-archived" : ""}>
                  <td>
                   <button
                    className="cand-file-btn"
                    onClick={() => {
                   
                      navigate(`/candidate-info/${s.student?.id}`, {
                        state: { candidate: s },
                      });
                    }}
                  >
                      Voir le dossier
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {s.media ? (
                  <img
                    src={
                      s.media.startsWith("http")
                        ? s.media
                        : `${BASE_URL}/storage/${s.media}`
                    }
                    alt={s.first_name}
                    className="cand-avatar"
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                    }}
                  />
                ) : (
                  <div
                    className="cand-avatar"
                    style={{ background: getAvatarColor(s.id, AVATAR_COLORS) }}
                  >
                    {getInitials(s.nom, s.prenom)}
                  </div>
                )}

                <span
                  className="cand-candidate-name"
                  style={{ color: "#2563eb" }}
                >
                  {s.first_name} {s.last_name}
                </span>
              </div>
              
                  
                          {/* <div className="cand-candidate-cell">
                            {s.media
                              ? <img src={`${BASE_URL}/storage/${s.media}`} alt={s.first_name} className="cand-avatar" style={{ objectFit:"cover", borderRadius:"50%", width:32, height:32 }} />
                              : <div className="cand-avatar" style={{ background: getAvatarColor(s.id, AVATAR_COLORS) }}>{getInitials(s.nom, s.prenom)}</div>
                            }
                            <span className="cand-candidate-name" style={{ color:"#2563eb" }}>{s.first_name} {s.last_name}</span>
                          </div> */}
                  </td>
                  <td>{s.student?.balance}</td>

                  <td>
                  {s.student?.zones?.length > 0
                    ? s.student.zones.map((zone, zoneIndex) => (
                        <span key={zone.id ?? `${s.id}-zone-${zoneIndex}`} className="cand-place-badge">
                          {zone.name}
                          {zone.lieux?.map(lieu => (
                            <span key={lieu.id}> — {lieu.name}</span>
                          ))}
                        </span>
                      ))
                    : <span className="cand-muted">—</span>
                  }
                </td>

                  {/* <td>
                    {s.student?.zones?.length > 0
                      ? s.student.zones.map(zone => (
                          <span key={zone.id} className="cand-place-badge">
                            {zone.name} {zone.lieux?.name}
                          </span>
                        ))
                      : <span className="cand-muted">—</span>
                    }
                  </td> */}


                  {/* <td>
                    {s.student?.zones.map(zone=>(
                         {zone.name && zone.name !== "—" ? <span className="cand-place-badge">{s.place}</span> : <span className="cand-muted">—</span>}
                    
                    ))}
                   
                    </td> */}
                  <td>{formatDate(s.created_at)}</td>
                  <td className="cand-actions-cell">
                    <RowMenu
                      student={s}
                      onDetails={(row) => navigate(`/candidate-info/${row.student?.id}`, { state: { candidate: row } })}
                      onConnect={(row) => navigate("/student-dashboard", {
                        state: {
                          fromCandidateProfile: true,
                          candidate: row,
                          openFilterOnOpen: true,
                          returnTo: "/candidates",
                        },
                      })}
                      onExport={(row) => downloadRowAsExcel(row, `candidat-${row.id}.xls`)}
                      onContract={(row) => window.open(`${BASE_URL}/api/admin/users/students/${row.student?.id}/contract`, "_blank", "noopener,noreferrer")}
                      onArchive={handleArchive}
                      onUnarchive={handleUnarchive}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        </div>
      </div>

      <div className="cpf-pagination">
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.max(1, c - 1))} disabled={page === 1}><IconChevL /></button>
        <span className="cpf-page-info">
        {total === 0
          ? "0 élément"
          : `${(currentPage - 1) * PAGE_SIZE + 1} – ${Math.min(currentPage * PAGE_SIZE, total)} sur ${total} éléments`}
      </span>
        {/* <span className="cpf-page-info">
          {data.length === 0 ? "0 élément" : `${(page - 1) * PAGE_SIZE + 1} – ${Math.min(page * PAGE_SIZE, data.length)} sur ${data.length} éléments`}
        </span> */}
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}><IconChevR /></button>
      </div>
      
    </div>
  );
}
