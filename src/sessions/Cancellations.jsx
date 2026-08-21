import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import http from "../helpers/http.jsx";
import { useCandidates } from "../Components/candidates/CandidatesContext.jsx";
import "./Cancellations.css";

// ── Avatar helpers ────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#6c8ebf","#d79b00","#82b366","#ae4132","#9673a6","#23445d","#e07a5f","#3d405b","#81b29a","#f2cc8f"];
function getColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }
function getInitials(name) {
  const parts = (name || "").trim().split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

// ── Icons ─────────────────────────────────────────────────────────────────
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconDownload= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconChevL   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconWarning = () => <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591 2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0Z"/><path d="M12 17.01l.01-.011"/></svg>;
const IconCheck   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconInfo    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;

// ── Sort arrows ───────────────────────────────────────────────────────────
function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none"
        stroke={isActive && dir === 1  ? "#111827" : "#d1d5db"}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 6 L5 1 L9 6"/>
      </svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none"
        stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 1 L5 6 L9 1"/>
      </svg>
    </button>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────
const INITIAL_DATA = [
  { id:1,  monitorName:"",                       candidateName:"Edgard Lawrence Rayn Maury",  dateApplied:"2026-04-16", dateReserved:"",           hourly:"a",              message:"Absent",                             status:"refused",   tab:"noproof"   },
  { id:2,  monitorName:"Carl MI",                candidateName:"Nadjibou Houmadi",            dateApplied:"2026-04-14", dateReserved:"2026-04-16", hourly:"11:00 à 12:00",  message:"Examen",                             status:"refused",   tab:"noproof"   },
  { id:3,  monitorName:"Sahrane Tallia TASSADIT",candidateName:"TAIBI AYMAN",                 dateApplied:"2026-04-07", dateReserved:"2026-04-09", hourly:"16:00 à 17:00",  message:".",                                  status:"refused",   tab:"noproof"   },
  { id:4,  monitorName:"FELINE SEAPHNAH",        candidateName:"Rafiatou Oumarou",            dateApplied:"2026-04-02", dateReserved:"2026-04-03", hourly:"15:00 à 16:00",  message:"Absent",                             status:"onhold",    tab:"noproof"   },
  { id:5,  monitorName:"Soumaya EL AMMARI",      candidateName:"FATOUMATA TATA KONE",         dateApplied:"2026-04-01", dateReserved:"2026-04-03", hourly:"15:00 à 16:00",  message:"Garder vos heures jusqu'à l'examen", status:"cancelled", tab:"justified" },
  { id:6,  monitorName:"Sahrane Tallia TASSADIT",candidateName:"Kenza Laib",                  dateApplied:"2026-03-31", dateReserved:"2026-04-02", hourly:"16:00 à 17:00",  message:".",                                  status:"cancelled", tab:"justified" },
  { id:7,  monitorName:"FELINE SEAPHNAH",        candidateName:"MINOJAONA ANYAH RANDEMBA",    dateApplied:"2026-03-30", dateReserved:"2026-03-31", hourly:"16:00 à 17:00",  message:"Absent",                             status:"refused",   tab:"noproof"   },
  { id:8,  monitorName:"",                       candidateName:"Oceane Berry",                dateApplied:"2026-03-23", dateReserved:"",           hourly:"a",              message:"Non disponible",                     status:"refused",   tab:"noproof"   },
  { id:9,  monitorName:"FELINE SEAPHNAH",        candidateName:"Ahmad Jawid Nawabi",          dateApplied:"2026-03-05", dateReserved:"2026-03-07", hourly:"15:00 à 16:00",  message:"Abts",                               status:"refused",   tab:"noproof"   },
  { id:10, monitorName:"Anne Sophie TAMA SAWKIW",candidateName:"Sami Labzouzi",               dateApplied:"2026-03-03", dateReserved:"2026-03-05", hourly:"16:00 à 17:00",  message:"Rendez-vous",                        status:"refused",   tab:"noproof"   },
  { id:11, monitorName:"khadija LAQSIR KHADJOU", candidateName:"Marie Paule Monique Petit",   dateApplied:"2026-03-03", dateReserved:"2026-03-04", hourly:"13:00 à 14:00",  message:"Malade",                             status:"cancelled", tab:"justified" },
  { id:12, monitorName:"FELINE SEAPHNAH",        candidateName:"Fatima Zahra BOUGHNOU",       dateApplied:"2026-02-08", dateReserved:"2026-02-10", hourly:"13:00 à 14:00",  message:"Malade",                             status:"cancelled", tab:"justified" },
  { id:13, monitorName:"Soumaya EL AMMARI",      candidateName:"Kouassi Oulai Blandine",      dateApplied:"2026-02-04", dateReserved:"2026-02-05", hourly:"15:00 à 16:00",  message:"Raisons personnelles",               status:"cancelled", tab:"justified" },
  { id:14, monitorName:"FELINE SEAPHNAH",        candidateName:"Adja Khady Ndiaye Bagne",     dateApplied:"2026-02-01", dateReserved:"2026-02-03", hourly:"17:00 à 18:00",  message:"Ne se sent pas bien",                status:"cancelled", tab:"justified" },
  { id:15, monitorName:"Sahrane Tallia TASSADIT",candidateName:"TAIBI AYMAN",                 dateApplied:"2026-01-31", dateReserved:"2026-02-02", hourly:"12:00 à 13:00",  message:"Obligation professionnelle",         status:"onhold",    tab:"noproof"   },
  { id:16, monitorName:"khadija LAQSIR KHADJOU", candidateName:"Léa Martin",                  dateApplied:"2026-01-30", dateReserved:"2026-01-31", hourly:"15:00 à 16:00",  message:"Je dois aller au Sénégal",           status:"cancelled", tab:"justified" },
  { id:17, monitorName:"Carl MI",                candidateName:"Pierre Bernard",              dateApplied:"2026-01-28", dateReserved:"2026-01-30", hourly:"10:00 à 11:00",  message:"Je ne me sens pas prêt",             status:"onhold",    tab:"justified" },
  { id:18, monitorName:"Anne Sophie TAMA SAWKIW",candidateName:"Sophie Morel",                dateApplied:"2026-01-25", dateReserved:"2026-01-27", hourly:"14:00 à 15:00",  message:"Urgence familiale",                  status:"cancelled", tab:"justified" },
  { id:19, monitorName:"Soumaya EL AMMARI",      candidateName:"Marc Dupont",                 dateApplied:"2026-01-20", dateReserved:"2026-01-22", hourly:"9:00 à 10:00",   message:"Absent",                             status:"refused",   tab:"noproof"   },
  { id:20, monitorName:"FELINE SEAPHNAH",        candidateName:"Amina Diallo",                dateApplied:"2026-01-15", dateReserved:"2026-01-17", hourly:"16:00 à 17:00",  message:"Panne de voiture",                   status:"onhold",    tab:"noproof"   },
];

const PAGE_SIZE = 15;

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const months = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];
  return `${String(d.getDate()).padStart(2,"0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Status config ─────────────────────────────────────────────────────────
const STATUS_MAP = {
  cancelled: { label:"Annulé",     bg:"#22c55e", color:"#fff" },
  onhold:    { label:"En attente", bg:"#f59e0b", color:"#fff" },
  refused:   { label:"Refusé",     bg:"#f97316", color:"#fff" },
};

const STATUS_BADGE_STYLE = {
  display: "inline-block",
  padding: "3px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

// ── Toast ─────────────────────────────────────────────────────────────────
function InlineToast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="cpf-toast">
      <div className="cpf-toast-top">
        <IconInfo /> Succès
        <button className="cpf-toast-close" onClick={onClose}>✕</button>
      </div>
      <div className="cpf-toast-bottom">{message}</div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ status, onClick }) {
  const { label, bg, color } = STATUS_MAP[status] || STATUS_MAP.cancelled;
  return (
    <button
      className="rc-status-badge rc-status-badge--clickable"
      style={{ ...STATUS_BADGE_STYLE, background: bg, color }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ── Status Change Modal ───────────────────────────────────────────────────
function StatusModal({ entry, onSave, onClose }) {
  const isProcessed = entry.status !== "onhold";
  const [sel, setSel] = useState(entry.status);

  const OPTIONS = [
    { value:"cancelled", label:"Annulé",     bg:"#22c55e" },
    { value:"onhold",    label:"En attente", bg:"#f59e0b" },
    { value:"refused",   label:"Refusé",     bg:"#f97316" },
  ];

  return (
    <div className="rc-modal-backdrop" onClick={onClose}>
      <div className="rc-modal" onClick={e => e.stopPropagation()}>
        <div className="rc-modal-header">
          <span className="rc-modal-title">Changement de statut</span>
        </div>
        <div className="rc-modal-body">
          <IconWarning />
          {isProcessed ? (
            <p className="rc-modal-msg">
              La séance a déjà été traitée. Vous ne pouvez pas la modifier.
            </p>
          ) : (
            <>
              <p className="rc-modal-msg" style={{ marginBottom: 14 }}>
                Choisissez un nouveau statut pour cette annulation.
              </p>
              <div className="rc-modal-options">
                {OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`rc-modal-option ${sel === opt.value ? "rc-modal-option--active" : ""}`}
                    style={sel === opt.value ? { background: opt.bg + "18", borderColor: opt.bg } : {}}
                    onClick={() => setSel(opt.value)}
                  >
                    <span className="rc-modal-option-dot" style={{ background: opt.bg }} />
                    <span style={{ flex: 1 }}>{opt.label}</span>
                    {sel === opt.value && (
                      <span style={{ color: opt.bg, display:"flex", alignItems:"center" }}>
                        <IconCheck />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="rc-modal-footer">
          <button className="rc-modal-btn rc-modal-btn--cancel" onClick={onClose}>Fermer</button>
          <button
            className={`rc-modal-btn rc-modal-btn--save ${isProcessed ? "rc-modal-btn--disabled" : ""}`}
            disabled={isProcessed}
            onClick={() => { if (!isProcessed) { onSave(sel); onClose(); } }}
          >
            <IconCheck /> Valider
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile card ───────────────────────────────────────────────────────────
function MobileCard({ row, onStatusClick, onCandidateClick, onMonitorClick }) {
  const { label, bg, color } = STATUS_MAP[row.status] || STATUS_MAP.cancelled;
  return (
    <div className="rc-card">
      {/* Top: avatar + names + status */}
      <div className="rc-card-top">
        <div className="cand-avatar" style={{ background: getColor(row.id + 5), fontSize: 11, width: 36, height: 36, flexShrink: 0 }}>
          {getInitials(row.candidateName)}
        </div>
        <div className="rc-card-names">
          <div className="rc-card-candidate">{row.candidateName}</div>
          <div className="rc-card-monitor">
            {row.monitorName || <span style={{ color:"#d1d5db" }}>Aucun moniteur</span>}
          </div>
        </div>
        <button
          className="rc-status-badge rc-status-badge--clickable"
          style={{ ...STATUS_BADGE_STYLE, background: bg, color, flexShrink: 0 }}
          onClick={() => onStatusClick(row)}
        >
          {label}
        </button>
      </div>

      {/* Meta grid */}
      <div className="rc-card-meta">
        <div className="rc-card-meta-item">
          <span className="rc-card-meta-label">Date de demande</span>
          <span className="rc-card-meta-value">{fmtDate(row.dateApplied) || "—"}</span>
        </div>
        <div className="rc-card-meta-item">
          <span className="rc-card-meta-label">Date réservée</span>
          <span className="rc-card-meta-value">{row.dateReserved ? fmtDate(row.dateReserved) : "—"}</span>
        </div>
        <div className="rc-card-meta-item">
          <span className="rc-card-meta-label">Horaire</span>
          <span className="rc-card-meta-value">{row.hourly}</span>
        </div>
        <div className="rc-card-meta-item">
          <span className="rc-card-meta-label">Documents</span>
          {row.hasDocument ? (
            <a className="rc-card-meta-value rc-blue-link" href={row.documentUrl} target="_blank" rel="noreferrer">Télécharger</a>
          ) : <span className="rc-card-meta-value" style={{ color:"#9ca3af" }}>Aucun document</span>}
        </div>
      </div>

      {/* Message */}
      {row.message && row.message !== "." && (
        <div className="rc-card-message">« {row.message} »</div>
      )}

      {/* Action buttons */}
      <div className="rc-card-actions">
        <button className="cand-file-btn" onClick={() => onCandidateClick(row)}>
          Fiche candidat
        </button>
        <button
          className="cand-file-btn"
          onClick={() => onMonitorClick(row)}
          disabled={!row.monitorName}
          style={!row.monitorName ? { opacity: 0.4, cursor:"not-allowed" } : {}}
        >
          Fiche moniteur
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ReservationCancellations() {
  const navigate = useNavigate();
  const { setSelectedCandidateId } = useCandidates();

  const [data,       setData]       = useState([]);
  const [activeTab,  setActiveTab]  = useState("all");
  const [page,       setPage]       = useState(1);
  const [sort,       setSort]       = useState(null);
  const [modalEntry, setModalEntry] = useState(null);
  const [toast,      setToast]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [total,      setTotal]      = useState(0);
  const [lastPage,   setLastPage]   = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [loadError,  setLoadError]  = useState("");

  const TABS = [
    { key:"all",       label:"Tous"             },
    { key:"noproof",   label:"Sans justificatif" },
    { key:"justified", label:"Justifié"          },
  ];

  const apiStatusToUi = (status) => ({ 1: "onhold", 2: "refused", 3: "cancelled" }[Number(status)] || "onhold");
  const uiStatusToApi = (status) => ({ onhold: 1, refused: 2, cancelled: 3 }[status] || 1);
  const userName = (user) => user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "—";

  const mapCancellation = (cancellation) => {
    const training = cancellation?.training || {};
    const reservation = training?.reservation || {};
    const monitor = reservation?.monitor || {};
    const student = training?.student || {};
    const studentUser = student?.user || {};
    const monitorUser = monitor?.user || {};

    return {
      id: cancellation.id,
      cancellationId: cancellation.id,
      monitorId: monitor.id || null,
      candidateId: student.id || null,
      monitorName: monitor.id ? userName(monitorUser) : "",
      candidateName: userName(studentUser),
      dateApplied: cancellation.created_at,
      dateReserved: reservation.date || "",
      hourly: reservation.start_at && reservation.end_at ? `${reservation.start_at} à ${reservation.end_at}` : "—",
      message: cancellation.comment || "—",
      status: apiStatusToUi(cancellation.status),
      tab: Number(cancellation.is_justified) ? "justified" : "noproof",
      hasDocument: Boolean(cancellation.media?.storage_media?.path || cancellation.media?.path),
      documentUrl: cancellation.media?.storage_media?.path || cancellation.media?.path || "",
      monitor: { id: monitor.id, prenom: monitorUser.first_name || "", nom: monitorUser.last_name || monitorUser.name || "", email: monitorUser.email, phone: monitorUser.phone, photo: monitorUser.media || null },
      candidate: { id: student.id, prenom: studentUser.first_name || "", nom: studentUser.last_name || studentUser.name || "", email: studentUser.email, phone: studentUser.phone, photo: studentUser.media || null },
    };
  };

  useEffect(() => {
    let active = true;
    const loadCancellations = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const params = { page };
        if (activeTab === "noproof") params.is_justified = 0;
        if (activeTab === "justified") params.is_justified = 1;
        const response = await http.get("/admin/cancellations", { params });
        const paginator = response.data?.cancellations ?? response.data;
        if (!active) return;
        setData((paginator?.data || []).map(mapCancellation));
        setTotal(Number(paginator?.total || 0));
        setLastPage(Math.max(1, Number(paginator?.last_page || 1)));
      } catch (error) {
        if (!active) return;
        setData([]);
        setTotal(0);
        setLastPage(1);
        setLoadError(error.response?.data?.message || "Impossible de charger les annulations.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCancellations();
    return () => { active = false; };
  }, [activeTab, page]);

  // ── Filtrage ──
  let filtered = data;

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.candidateName.toLowerCase().includes(q) ||
      r.monitorName.toLowerCase().includes(q)
    );
  }

  if (sort) {
    filtered = [...filtered].sort((a, b) => {
      const av = String(a[sort.key] ?? "").toLowerCase();
      const bv = String(b[sort.key] ?? "").toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  function handleSort(key) {
    setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
    setPage(1);
  }

  const totalPages = search.trim() ? 1 : lastPage;
  const paginated  = search.trim() ? filtered : data;

  async function handleStatusSave(id, newStatus) {
    try {
      await http.put(`/admin/cancellations/${id}`, { status: uiStatusToApi(newStatus) });
      setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setToast("Le statut a été mis à jour avec succès.");
    } catch (error) {
      setToast(error.response?.data?.message || "La mise à jour du statut a échoué.");
    }
  }

  function openCandidateFile(row) {
    if (!row.candidateId) return;
    setSelectedCandidateId(row.candidateId);
    navigate(`/candidate-info/${row.candidateId}`, {
      state: { candidate: { ...row.candidate, name: row.candidateName } },
    });
  }

  function openMonitorFile(row) {
    if (!row.monitorId) return;
    navigate(`/monitors-info/${row.monitorId}`, {
      state: {
        monitorId: row.monitorId,
        monitor: row.monitor,
      },
    });
  }

  // Pagination label
  const pageLabel = total === 0
    ? "0 élément"
    : `${(page - 1) * PAGE_SIZE + 1} – ${Math.min(page * PAGE_SIZE, total)} sur ${total} éléments`;

  return (
    <div className="cand-page rc-page">

      <h1 style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:22, color:"#111827", margin:"0 0 20px" }}>
        Annulations de réservations
      </h1>

      {loadError && <div className="cand-empty" style={{ marginBottom: 16 }}>{loadError}</div>}

      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      {/* ── Barre de recherche + export ── */}
      <div className="cand-toolbar" style={{ marginBottom: 16 }}>
        <div className="cand-search-box">
          <IconSearch />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un candidat ou un moniteur..."
          />
        </div>
        <button className="cand-btn-outline">
          <IconDownload /> Exporter
        </button>
      </div>

      {/* ── Onglets ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:24 }}>
        <div className="cand-tabs-row" style={{ margin: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`cand-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.key); setPage(1); setSort(null); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="cand-table-card rc-table-card">

        {/* ── Desktop table (hidden on mobile via CSS) ── */}
        <div className="rc-table-scroll">
          <table className="cand-table rc-table">
            <colgroup>
              <col className="rc-col-profile" />
              <col className="rc-col-profile" />
              <col className="rc-col-monitor" />
              <col className="rc-col-student" />
              <col className="rc-col-date" />
              <col className="rc-col-date" />
              <col className="rc-col-time" />
              <col className="rc-col-message" />
              <col className="rc-col-status" />
              <col className="rc-col-document" />
            </colgroup>
            <thead>
              <tr>
                <th>Détails du candidat</th>
                <th>Détails du moniteur</th>
                <th>Moniteur   <SortArrows sortKey={sort} colKey="monitorName"   onSort={handleSort} /></th>
                <th>Candidat   <SortArrows sortKey={sort} colKey="candidateName" onSort={handleSort} /></th>
                <th>Date de demande <SortArrows sortKey={sort} colKey="dateApplied"  onSort={handleSort} /></th>
                <th>Date réservée   <SortArrows sortKey={sort} colKey="dateReserved" onSort={handleSort} /></th>
                <th>Horaire  <SortArrows sortKey={sort} colKey="hourly"   onSort={handleSort} /></th>
                <th>Message  <SortArrows sortKey={sort} colKey="message"  onSort={handleSort} /></th>
                <th>Statut   <SortArrows sortKey={sort} colKey="status"   onSort={handleSort} /></th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={10} className="cand-empty">Chargement des annulations…</td></tr>
                : paginated.length === 0
                ? <tr><td colSpan={10} className="cand-empty">Aucune annulation trouvée</td></tr>
                : paginated.map(row => (
                  <tr key={row.id}>
                    <td><button className="cand-file-btn" onClick={() => openCandidateFile(row)}>Voir le dossier</button></td>
                    <td><button className="cand-file-btn" onClick={() => openMonitorFile(row)} disabled={!row.monitorName}>Voir le dossier</button></td>

                    {/* Moniteur */}
                    <td>
                      <div className="cand-candidate-cell">
                        {row.monitorName ? (
                          <>
                            <div className="cand-avatar" style={{ background: getColor(row.id), fontSize:11, width:30, height:30 }}>
                              {getInitials(row.monitorName)}
                            </div>
                            <span className="rc-blue-link">{row.monitorName}</span>
                          </>
                        ) : (
                          <div className="rc-monitor-placeholder">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af" stroke="none">
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Candidat */}
                    <td>
                      <div className="cand-candidate-cell">
                        <div className="cand-avatar" style={{ background: getColor(row.id + 5), fontSize:11, width:30, height:30 }}>
                          {getInitials(row.candidateName)}
                        </div>
                        <span className="rc-blue-link">{row.candidateName}</span>
                      </div>
                    </td>

                    <td className="rc-date">{fmtDate(row.dateApplied)}</td>
                    <td className="rc-date">{row.dateReserved ? fmtDate(row.dateReserved) : <span className="cand-muted">—</span>}</td>
                    <td className="rc-hourly">{row.hourly}</td>
                    <td className="rc-message">{row.message}</td>
                    <td><StatusBadge 
                    status={row.status} onClick={() => setModalEntry(row)} /></td>
                    <td className="rc-doc">
                      {row.hasDocument
                        ? <a className="rc-blue-link" href={row.documentUrl} target="_blank" rel="noreferrer">Télécharger</a>
                        : "Aucun document"}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* ── Mobile card list (hidden on desktop via CSS) ── */}
        <div className="rc-card-list">
          {loading
            ? <div className="cand-empty" style={{ padding:"32px 16px", textAlign:"center" }}>Chargement des annulations…</div>
            : paginated.length === 0
            ? <div className="cand-empty" style={{ padding:"32px 16px", textAlign:"center" }}>Aucune annulation trouvée</div>
            : paginated.map(row => (
              <MobileCard
                key={row.id}
                row={row}
                onStatusClick={setModalEntry}
                onCandidateClick={openCandidateFile}
                onMonitorClick={openMonitorFile}
              />
            ))
          }
        </div>

        {/* ── Pagination ── */}
        <div className="cpf-pagination">
          <button className="cpf-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <IconChevL />
          </button>
          <span className="cpf-page-info">{pageLabel}</span>
          <button className="cpf-page-btn" onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))} disabled={loading || page >= totalPages}>
            <IconChevR />
          </button>
        </div>
      </div>

      {modalEntry && (
        <StatusModal
          entry={modalEntry}
          onSave={newStatus => handleStatusSave(modalEntry.id, newStatus)}
          onClose={() => setModalEntry(null)}
        />
      )}
    </div>
  );
}
