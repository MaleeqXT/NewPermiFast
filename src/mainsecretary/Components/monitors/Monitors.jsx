import { useState, useRef, useEffect } from "react";
import "../candidates/Candidates.css";
import { useNavigate } from "react-router-dom";
import { useMonitors } from "./MonitorsContext.jsx";
import AddMonitor from "./AddMonitor.jsx";
const PAGE_SIZE = 15;

function getInitials(nom, prenom) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase();
}
function getAvatarColor(id, colors) {
  return colors[id % colors.length];
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
    would: "Commune",
    sector: "Secteur de conduite pr?f?r?",
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

function RowMenu({ monitor, onDetails, onConnect, onExport, onArchive, onUnarchive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const isArchived = monitor.status === "archived";
  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="cand-row-menu-dropdown">
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onDetails && onDetails(monitor); }}><IconDetails /> D?tails</button>
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onConnect && onConnect(monitor); }}><IconConnect /> Connecter</button>
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onExport && onExport(monitor); }}><IconChart /> Exporter Excel</button>
          <div className="cand-row-menu-divider" />
          {isArchived
            ? <button className="cand-row-menu-item" onClick={() => { setOpen(false); onUnarchive(monitor.id); }}><IconUnarchive /> D?sarchiver</button>
            : <button className="cand-row-menu-item cand-row-menu-item--danger" onClick={() => { setOpen(false); onArchive(monitor.id); }}><IconArchive /> Archiver</button>
          }
        </div>
      )}
    </div>
  );
}
const STATUS_LABELS = {
  active:   { label: "Actif",     bg: "#dcfce7", color: "#166534", border: "none"             },
  inactive: { label: "Inactif",   bg: "#fee2e2", color: "#991b1b", border: "none"             },
  onhold:   { label: "En attente",bg: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb"},
  archived: { label: "Archivé",   bg: "#fef9c3", color: "#854d0e", border: "none"             },
};

export default function Monitors() {
  const { monitors, archiveMonitor, unarchiveMonitor, AVATAR_COLORS } = useMonitors();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState(null);
  const [page,      setPage]      = useState(1);
  const [isAddingMonitor, setIsAddingMonitor] = useState(false);

  const counts = {
    all:      monitors.length,
    active:   monitors.filter(s => s.status === "active").length,
    onhold:   monitors.filter(s => s.status === "onhold").length,
    inactive: monitors.filter(s => s.status === "inactive").length,
    archive:  monitors.filter(s => s.status === "archived").length,
  };

  let data = [...monitors];
  if (activeTab === "active")   data = data.filter(s => s.status === "active");
  if (activeTab === "onhold")   data = data.filter(s => s.status === "onhold");
  if (activeTab === "inactive") data = data.filter(s => s.status === "inactive");
  if (activeTab === "archive")  data = data.filter(s => s.status === "archived");

  if (search) data = data.filter(s =>
    `${s.prenom} ${s.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    (s.would  || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.sector || "").toLowerCase().includes(search.toLowerCase())
  );

  if (sort) {
    data.sort((a, b) => {
      const av = a[sort.key] ?? "", bv = b[sort.key] ?? "";
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  function handleSort(key) { setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 }); }

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const paginated  = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeTab, search, sort]);

  const TABS = [
    { key:"all",      label:"Tout"       },
    { key:"active",   label:"Actif"      },
    { key:"onhold",   label:"En attente" },
    { key:"inactive", label:"Inactif"    },
    { key:"archive",  label:"Archivé"    },
  ];

  if (isAddingMonitor) {
    return <AddMonitor onBack={() => setIsAddingMonitor(false)} />;
  }

  return (
    <div className="cand-page">
      <h1 className="ord-title" style={{ marginBottom: "20px" }}>Moniteurs</h1>

      <div className="cand-toolbar">
        <div className="cand-search-box" style={{ maxWidth: "100%" }}>
          <IconSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un moniteur…" />
        </div>
        <button className="cand-btn-dark" onClick={() => setIsAddingMonitor(true)}><IconPlus /> Ajouter un moniteur</button>
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        <div className="cand-tabs-row" style={{ margin: 0 }}>
          {TABS.map(tab => (
            <button key={tab.key} className={`cand-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
              {counts[tab.key] > 0 && <span className="cand-tab-count">{counts[tab.key]}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="cand-table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="cand-table">
            <thead>
              <tr>
                <th>Détail</th>
                <th>Moniteur <SortArrows sortKey={sort} colKey="nom" onSort={handleSort} /></th>
                <th>Commune <SortArrows sortKey={sort} colKey="would" onSort={handleSort} /></th>
                <th>Secteur de conduite préféré <SortArrows sortKey={sort} colKey="sector" onSort={handleSort} /></th>
                <th>Statut <SortArrows sortKey={sort} colKey="status" onSort={handleSort} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0
                ? <tr><td colSpan={6} className="cand-empty">Aucun moniteur trouvé</td></tr>
                : paginated.map(s => {
                    const statusMeta = STATUS_LABELS[s.status] ?? { label: s.status, bg: "#f3f4f6", color: "#374151", border: "none" };
                    return (
                      <tr key={s.id}>
                        <td>
                          <button
                            className="cand-file-btn"
                            onClick={() => navigate("/monitors-info", { state: { monitor: s, fromSecretaryDashboard: true } })}
                          >
                            Voir le dossier
                          </button>
                        </td>
                        <td>
                          <div className="cand-candidate-cell">
                            {s.photo
                              ? <img src={s.photo} alt={s.prenom} className="cand-avatar" style={{ objectFit:"cover", borderRadius:"50%", width:32, height:32 }} />
                              : <div className="cand-avatar" style={{ background: getAvatarColor(s.id, AVATAR_COLORS) }}>{getInitials(s.nom, s.prenom)}</div>
                            }
                            <span className="cand-candidate-name" style={{ color:"#2563eb" }}>{s.prenom} {s.nom}</span>
                          </div>
                        </td>
                        <td>{s.would  || <span className="cand-muted">—</span>}</td>
                        <td>{s.sector || <span className="cand-muted">—</span>}</td>
                        <td>
                          <span style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", background: statusMeta.bg, color: statusMeta.color, border: statusMeta.border }}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="cand-actions-cell">
                          <RowMenu
                            monitor={s}
                            onDetails={(row) => navigate("/monitors-info", { state: { monitor: row, fromSecretaryDashboard: true } })}
                            onConnect={(row) => navigate("/monitor-dashboard", {
                              state: {
                                monitor: row,
                                monitor_id: row.monitor?.id ?? null,
                                fromSecretaryDashboard: true,
                                returnTo: "/monitors",
                              },
                            })}
                            onExport={(row) => downloadRowAsExcel(row, "moniteur-" + row.id + ".xls")}
                            onArchive={archiveMonitor}
                            onUnarchive={unarchiveMonitor}
                          />
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="cpf-pagination">
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.max(1, c - 1))} disabled={page === 1}><IconChevL /></button>
        <span className="cpf-page-info">
          {data.length === 0 ? "0 élément" : `${(page - 1) * PAGE_SIZE + 1} – ${Math.min(page * PAGE_SIZE, data.length)} sur ${data.length} éléments`}
        </span>
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}><IconChevR /></button>
      </div>
    </div>
  );
}
