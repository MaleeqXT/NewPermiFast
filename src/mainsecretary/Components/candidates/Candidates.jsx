import { useState, useRef, useEffect } from "react";
import "./Candidates.css";
import { useNavigate } from "react-router-dom";
import { useCandidates } from "./CandidatesContext.jsx";
import CandidateForm from "./CandidateForm.jsx";
import Info from "./Info.jsx";

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
  const isArchived = student.status === "archived";
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
export default function Candidates() {
  const { candidates, setSelectedCandidateId, archiveCandidate, unarchiveCandidate } = useCandidates();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState(null);
  const [page,      setPage]      = useState(1);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

  const counts = {
    all:     candidates.length,
    active:  candidates.filter(s => s.status === "active").length,
    archive: candidates.filter(s => s.status === "archived").length,
    new:     candidates.filter(s => s.status === "new").length,
  };

  let data = [...candidates];
  if (activeTab === "active")  data = data.filter(s => s.status === "active");
  if (activeTab === "archive") data = data.filter(s => s.status === "archived");
  if (activeTab === "new")     data = data.filter(s => s.status === "new");
  if (search) data = data.filter(s =>
    `${s.prenom} ${s.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    s.permis.toLowerCase().includes(search.toLowerCase())
  );
  if (sort) data.sort((a, b) => {
    const av = a[sort.key], bv = b[sort.key];
    return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
  });

  function handleSort(key) { setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 }); }
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeTab, search, sort]);

  const TABS = [
    { key:"all",     label:"Tous"     },
    { key:"active",  label:"Actif"    },
    { key:"archive", label:"Archive"  },
    { key:"new",     label:"Nouveau"  },
  ];

  if (isAddingCandidate) {
    return <CandidateForm onBack={() => setIsAddingCandidate(false)} />;
  }

  return (
    <div className="cand-page">
      <h1 className="ord-title" style={{ marginBottom:'20px' }}>Candidats</h1>

      <div className="cand-toolbar">
        <div className="cand-search-box" style={{ maxWidth: '100%' }}>
          <IconSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." />
        </div>
        <button className="cand-btn-dark" onClick={() => setIsAddingCandidate(true)}><IconPlus /> Ajouter un candidat</button>
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
            {paginated.length === 0
              ? <tr><td colSpan={6} className="cand-empty">Aucun candidat trouvé</td></tr>
              : paginated.map(s => (
                <tr key={s.id} className={s.status === "archived" ? "cand-row-archived" : ""}>
                      <td>
                        <button
                          className="cand-file-btn"
                          onClick={() => {
                            setSelectedCandidateId(s.id);
                            navigate("/info", { state: { candidate: s, fromSecretaryDashboard: true } });
                          }}
                        >
                          Voir le dossier
                    </button>
                  </td>
                  <td>
                    <div className="cand-candidate-cell">
                      {s.photo
                        ? <img src={s.photo} alt={s.prenom} className="cand-avatar" style={{ objectFit:"cover", borderRadius:"50%", width:32, height:32 }} />
                        : <div className="cand-avatar" style={{ background: getAvatarColor(s.id) }}>{getInitials(s.nom, s.prenom)}</div>
                      }
                      <span className="cand-candidate-name">{s.prenom} {s.nom}</span>
                    </div>
                  </td>
                  <td>{s.balance}</td>
                  <td>{s.place && s.place !== "—" ? <span className="cand-place-badge">{s.place}</span> : <span className="cand-muted">—</span>}</td>
                  <td>{formatDate(s.date)}</td>
                  <td className="cand-actions-cell">
                    <RowMenu
                      student={s}
                      onDetails={(row) => { setSelectedCandidateId(row.id); navigate("/info", { state: { candidate: row, fromSecretaryDashboard: true } }); }}
                      onConnect={(row) => {
                        setSelectedCandidateId(row.id);
                        navigate("/student-dashboard", {
                          state: {
                            candidate: row,
                            fromSecretaryDashboard: true,
                            openFilterOnOpen: true,
                            returnTo: "/candidates",
                          },
                        });
                      }}
                      onExport={(row) => downloadRowAsExcel(row, "candidat-" + row.id + ".xls")}
                      onContract={() => window.open("https://staging2.passpermisfacile.fr/admin/users/students/9eeb7af7-031f-467c-a863-dd2eea04abd1/contract", "_blank", "noopener,noreferrer")}
                      onArchive={archiveCandidate}
                      onUnarchive={unarchiveCandidate}
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
