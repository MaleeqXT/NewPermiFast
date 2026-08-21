import { useState, useRef, useEffect } from "react";
import "./Exam.css";
import ExamDetail from "./ExamDetail";
import Info from "../candidates/Info.jsx";

// ── Icônes ────────────────────────────────────────────────────────────────────
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconFilter  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconSort    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>;
const IconDownload= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconChevD   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const IconChevL   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconComment = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconX       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconDots    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconEdit    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconInfo    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>;

// ── Flèches de tri ────────────────────────────────────────────────────────────
function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1  ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

// ── Données ───────────────────────────────────────────────────────────────────
const MONITORS  = ["Mohamed-Amine Hamdi","MOHAMED MEGNOUCHE","male test","Hasnain Ali","RACHID EL MOUKTAFI","FATEH MOUFFOK","CHINESE YADEL"];
const LOCATIONS = ["Enterré.","Agence CREIL","Toulouse","Paris Nord","Paris Sud"];

const INITIAL_EXAMS = [
  { id:1,  candidate:"Elias Souabri",       phone:"0615657466",        box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"Mohamed-Amine Hamdi",  attemptCount:0 },
  { id:2,  candidate:"Ahmed Mohamed s",     phone:"0767562267",        box:"Auto",   examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"MOHAMED MEGNOUCHE",    attemptCount:0 },
  { id:3,  candidate:"DEBORAH GODELIE",     phone:"0690921063",        box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"Hasnain Ali",           attemptCount:0 },
  { id:4,  candidate:"SAINT AUBIN AURE",    phone:"0652785432",        box:"Auto",   examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"RACHID EL MOUKTAFI",   attemptCount:0 },
  { id:5,  candidate:"FATOUMATA TATA K",    phone:"0622843453",        box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"Mohamed-Amine Hamdi",  attemptCount:0 },
  { id:6,  candidate:"Chedine Sbai",        phone:"0695084219",        box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"FATEH MOUFFOK",        attemptCount:0 },
  { id:7,  candidate:"Nadia Toiouilou",     phone:"0783413530",        box:"Auto",   examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"CHINESE YADEL",         attemptCount:0 },
  { id:8,  candidate:"Sami Labzouzi",       phone:"752930825",         box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"Hasnain Ali",           attemptCount:0 },
  { id:9,  candidate:"Hachemi Abbassa",     phone:"+33 7 81 12 49 82", box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"Mohamed-Amine Hamdi",  attemptCount:0 },
  { id:10, candidate:"MANAL ABDELALI",      phone:"0676748932",        box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"RACHID EL MOUKTAFI",   attemptCount:0 },
  { id:11, candidate:"SOW AISSATA",         phone:"0763594358",        box:"Auto",   examDate:"2026-02-23", startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"FATEH MOUFFOK",        attemptCount:0 },
  { id:12, candidate:"Marie Dupont",        phone:"0612345678",        box:"Manuel", examDate:"2026-03-10", startTime:{ hour:8, minute:0 }, status:"successful", resultPermis:"accepted", comment:"", monitor:"Mohamed-Amine Hamdi", attemptCount:1 },
  { id:13, candidate:"Jean Bernard",        phone:"0698765432",        box:"Auto",   examDate:"2026-03-12", startTime:null, status:"failed",     resultPermis:"refusal",  comment:"", monitor:"CHINESE YADEL",  attemptCount:2 },
  { id:14, candidate:"Sophie Martin",       phone:"0654321098",        box:"Manuel", examDate:"2026-03-15", startTime:null, status:"successful", resultPermis:"accepted", comment:"", monitor:"Hasnain Ali",   attemptCount:1 },
  { id:15, candidate:"Pierre Lefebvre",     phone:"0623456789",        box:"Auto",   examDate:"2026-03-18", startTime:null, status:"failed",     resultPermis:"refusal",  comment:"", monitor:"RACHID EL MOUKTAFI", attemptCount:3 },
  { id:16, candidate:"Amina Benali",        phone:"0745678901",        box:"Manuel", examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"FATEH MOUFFOK",        attemptCount:0 },
  { id:17, candidate:"Karim Zaidi",         phone:"0789012345",        box:"Auto",   examDate:"",           startTime:null, status:"on_hold",    resultPermis:"", comment:"", monitor:"Mohamed-Amine Hamdi",  attemptCount:0 },
];

const PAGE_SIZE = 15;

const STATUS_CONFIG = {
  on_hold:    { label:"En attente", bg:"#f3f4f6", color:"#374151" },
  successful: { label:"Réussi",     bg:"#dcfce7", color:"#16a34a" },
  failed:     { label:"Échoué",     bg:"#fee2e2", color:"#dc2626" },
};

const STATUS_BADGE_STYLE = {
  display: "inline-block",
  padding: "3px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}
function fmtTime(t) {
  if (!t) return "";
  return `${String(t.hour).padStart(2,"0")}:${String(t.minute).padStart(2,"0")}`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="ex-toast">
      <div className="ex-toast-top">
        <IconInfo /> Succès
        <button className="ex-toast-close" onClick={onClose}>✕</button>
      </div>
      <div className="ex-toast-bottom">{message}</div>
    </div>
  );
}

// ── Menu déroulant de filtre ──────────────────────────────────────────────────
function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="ex-filter-anchor" ref={ref}>
      <button className="ex-filter-btn" onClick={() => setOpen(o => !o)}>
        <span style={{ color: value ? "#111827" : "#9ca3af" }}>{value || label}</span>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {value && (
            <button className="ex-filter-clear" onClick={e => { e.stopPropagation(); onChange(""); }}>
              <IconX />
            </button>
          )}
          <IconChevD />
        </div>
      </button>
      {open && (
        <div className="ex-filter-dropdown">
          <button className={`ex-filter-option ${!value ? "ex-filter-option--active" : ""}`} onClick={() => { onChange(""); setOpen(false); }}>Tous</button>
          {options.map(opt => (
            <button key={opt} className={`ex-filter-option ${value === opt ? "ex-filter-option--active" : ""}`} onClick={() => { onChange(opt); setOpen(false); }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Popup de commentaire ──────────────────────────────────────────────────────
function CommentPopup({ exam, onSave, onClose }) {
  const [text, setText] = useState(exam.comment || "");
  return (
    <div className="ex-comment-overlay" onClick={onClose}>
      <div className="ex-comment-popup" onClick={e => e.stopPropagation()}>
        <div className="ex-comment-header">
          <span className="ex-comment-title">Commentaire</span>
          <button className="ex-comment-x" onClick={onClose}><IconX /></button>
        </div>
        <div className="ex-comment-body">
          <div className="ex-comment-candidate">{exam.candidate}</div>
          <textarea
            className="ex-comment-textarea"
            placeholder="Ajouter un commentaire..."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
        </div>
        <div className="ex-comment-footer">
          <button className="cand-btn-outline" onClick={onClose}>Annuler</button>
          <button className="cand-btn-dark" onClick={() => { onSave(text); onClose(); }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ── Menu contextuel (3 points) ────────────────────────────────────────────────
function RowMenu({ onEdit }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="cand-row-menu-dropdown">
          <button className="cand-row-menu-item" onClick={() => { setOpen(false); onEdit(); }}>
            <IconEdit /> Modifier
          </button>
        </div>
      )}
    </div>
  );
}

// ── Onglets ───────────────────────────────────────────────────────────────────
const TABS = [
  { key:"all",        label:"Toutes" },
  { key:"successful", label:"Réussies" },
  { key:"failed",     label:"Échouées" },
  { key:"on_hold",    label:"En attente" },
];

// ── Composant principal ───────────────────────────────────────────────────────
export default function ExaminationList() {
  const [exams,          setExams]          = useState(INITIAL_EXAMS);
  const [activeTab,      setActiveTab]      = useState("all");
  const [monitorFilter,  setMonitorFilter]  = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sort,           setSort]           = useState(null);
  const [page,           setPage]           = useState(1);
  const [commentTarget,  setCommentTarget]  = useState(null);
  const [editTarget,     setEditTarget]     = useState(null);
  const [toast,          setToast]          = useState(null);
  const [search,         setSearch]         = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const openCandidateDetail = (exam) => {
    const [prenom = "", ...nomParts] = exam.candidate.split(" ");
    setSelectedCandidate({
      id: exam.id,
      prenom,
      nom: nomParts.join(" ") || exam.candidate,
      tel: exam.phone,
      permis: exam.box === "Auto" ? "Voiture automatique" : "Voiture manuelle",
      status: "active",
      balance: "0h",
      date: exam.examDate || "",
    });
  };

  if (selectedCandidate) {
    return <Info candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />;
  }

  // ── Navigation vers ExamDetail ────────────────────────────────────────────
  if (editTarget) {
    return (
      <ExamDetail
        exam={editTarget}
        onBack={() => setEditTarget(null)}
        onSave={(updated) => {
          setExams(prev => prev.map(e => {
            if (e.id !== updated.id) return e;
            const wasOnHold = e.status === "on_hold";
            const nowActive = updated.status !== "on_hold";
            const attempts  = (wasOnHold && nowActive) ? e.attemptCount + 1 : e.attemptCount;
            return { ...updated, attemptCount: attempts };
          }));
          setEditTarget(null);
          setToast("L'examen a été mis à jour avec succès.");
        }}
      />
    );
  }

  const handleSort = key => { setSort(p => p?.key === key ? { key, dir: p.dir * -1 } : { key, dir: 1 }); setPage(1); };

  let filtered = exams
    .filter(e => activeTab === "all" || e.status === activeTab)
    .filter(e => !monitorFilter  || e.monitor === monitorFilter)
    .filter(e => !search || e.candidate.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search));

  if (sort) {
    filtered = [...filtered].sort((a, b) => {
      const av = String(a[sort.key] ?? "").toLowerCase();
      const bv = String(b[sort.key] ?? "").toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, totalItems);
  const pageData   = filtered.slice(pageStart, pageEnd);

  const counts = {
    all:        exams.length,
    successful: exams.filter(e => e.status === "successful").length,
    failed:     exams.filter(e => e.status === "failed").length,
    on_hold:    exams.filter(e => e.status === "on_hold").length,
  };

  function saveComment(id, text) {
    setExams(prev => prev.map(e => e.id === id ? { ...e, comment: text } : e));
    setToast("Le commentaire a été enregistré avec succès.");
  }

  return (
    <div className="cand-page">

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Titre */}
      <h1 className="ord-title" style={{ marginBottom: 20 }}>Liste des examens</h1>

      {/* ── Barre d'outils : recherche + export ── */}
      <div className="cand-toolbar" style={{ marginBottom: 16 }}>
        <div className="cand-search-box">
          <IconSearch />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un candidat..."
          />
        </div>
        {/* <button className="cand-btn-outline"><IconDownload /> Exporter</button> */}
      </div>

      {/* ── Rangée d'onglets ── */}
      <div className="ex-tabs-row">
        <div className="cand-tabs-row" style={{ margin: '20px 0px' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`cand-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
            >
              {tab.label}
              {counts[tab.key] > 0 && <span className="cand-tab-count">{counts[tab.key]}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filtres Moniteur + Lieu ── */}
      <div className="ex-filters-row">
        <FilterDropdown label="Moniteur" options={MONITORS} value={monitorFilter} onChange={v => { setMonitorFilter(v); setPage(1); }} />
        <FilterDropdown label="Lieu"     options={LOCATIONS} value={locationFilter} onChange={v => { setLocationFilter(v); setPage(1); }} />
      </div>

      {/* ── Tableau ── */}
      <div className="cand-table-card">
        <div className="ex-table-scroll">
          <table className="cand-table">
            <thead>
              <tr>
                <th>Détails du candidat</th>
                <th>Candidat <SortArrows sortKey={sort} colKey="candidate" onSort={handleSort} /></th>
                <th>Téléphone <SortArrows sortKey={sort} colKey="phone" onSort={handleSort} /></th>
                <th>Boîte <SortArrows sortKey={sort} colKey="box" onSort={handleSort} /></th>
                <th>Date d'examen <SortArrows sortKey={sort} colKey="examDate" onSort={handleSort} /></th>
                <th>Dernière info</th>
                <th>Statut <SortArrows sortKey={sort} colKey="status" onSort={handleSort} /></th>
                <th>Résultat</th>
                <th>Commentaire</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0
                ? <tr><td colSpan={10} className="cand-empty">Aucun examen trouvé</td></tr>
                : pageData.map(exam => {
                    const sc = STATUS_CONFIG[exam.status] || STATUS_CONFIG.on_hold;
                    const timeLabel = exam.startTime ? fmtTime(exam.startTime) : "";
                    const dateLabel = exam.examDate ? `${fmtDate(exam.examDate)}${timeLabel ? " "+timeLabel : ""}` : "";
                    return (
                      <tr key={exam.id}>

                        {/* Bouton dossier */}
                        <td>
                          <button className="cand-file-btn" onClick={() => openCandidateDetail(exam)}>
                            Voir le dossier
                          </button>
                        </td>

                        {/* Nom du candidat */}
                        <td>
                          <span className="ex-candidate-link" onClick={() => setEditTarget(exam)}>
                            {exam.candidate}
                          </span>
                        </td>

                        <td className="ex-cell-muted">{exam.phone}</td>

                        {/* Badge boîte */}
                        <td>
                          <span className={`ex-box-badge ${exam.box === "Auto" ? "ex-box-badge--auto" : "ex-box-badge--manuel"}`}>
                            {exam.box}
                          </span>
                        </td>

                        {/* Date + heure d'examen */}
                        <td className="ex-cell-muted ex-cell-nowrap">{dateLabel}</td>

                        <td className="ex-cell-muted">{exam.latestNews || ""}</td>

                        {/* Badge statut */}
                        <td>
                          <span className="ex-status-badge" style={{
                            ...STATUS_BADGE_STYLE,
                            background: sc.bg,
                            color: sc.color,
                          }}>
                            {sc.label}
                          </span>
                        </td>

                        {/* Résultat — nombre de tentatives */}
                        <td className="ex-cell-result">
                          {exam.attemptCount > 0 ? exam.attemptCount : ""}
                        </td>

                        {/* Icône commentaire */}
                        <td className="ex-cell-center">
                          <button
                            className="ex-comment-btn"
                            onClick={() => setCommentTarget(exam)}
                            title={exam.comment || "Ajouter un commentaire"}
                            style={{ color: exam.comment ? "#2563eb" : "#9ca3af" }}
                          >
                            <IconComment />
                          </button>
                        </td>

                        {/* Menu 3 points */}
                        <td className="cand-actions-cell">
                          <RowMenu onEdit={() => setEditTarget(exam)} />
                        </td>

                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="cpf-pagination">
          <button className="cpf-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={safePage <= 1}><IconChevL /></button>
          <span className="cpf-page-info">
            {totalItems === 0
              ? "Aucune entrée"
              : `${pageStart+1} – ${pageEnd} sur ${totalItems} élément${totalItems > 1 ? "s" : ""}`}
          </span>
          <button className="cpf-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={safePage >= totalPages}><IconChevR /></button>
        </div>
      </div>

      {/* Popup de commentaire */}
      {commentTarget && (
        <CommentPopup
          exam={commentTarget}
          onSave={text => saveComment(commentTarget.id, text)}
          onClose={() => setCommentTarget(null)}
        />
      )}

    </div>
  );
}
