import { useState } from "react";
import "./SelectCandidateDrawer.css";

const IconChevR  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

const CANDIDATES = [
  { id:1,  name:"Aabla Meidani",           progress:0,  hasPhoto:false },
  { id:2,  name:"Aaliyah Sangaré",         progress:0,  hasPhoto:false },
  { id:3,  name:"AARIYANE NAZAR MOHAMMAD", progress:0,  hasPhoto:false },
  { id:4,  name:"Ababile and Ahmed",       progress:0,  hasPhoto:false },
  { id:5,  name:"ABBOU I KNOW",            progress:0,  hasPhoto:true  },
  { id:6,  name:"Abdallah Abderrafii",     progress:0,  hasPhoto:false },
  { id:7,  name:"Abdallah Mahamouda",      progress:0,  hasPhoto:false },
  { id:8,  name:"Abdallah Semail",         progress:0,  hasPhoto:false },
  { id:9,  name:"ABDELHAK EN NAKRI",       progress:0,  hasPhoto:false },
  { id:10, name:"Abderahim Benali",        progress:0,  hasPhoto:false },
  { id:11, name:"Abderrahim Chahboun",     progress:12, hasPhoto:false },
  { id:12, name:"Abderrazzak Mouhoubi",    progress:5,  hasPhoto:false },
  { id:13, name:"Abdessamad Khallouq",     progress:0,  hasPhoto:false },
  { id:14, name:"Abdi Muse",               progress:0,  hasPhoto:false },
  { id:15, name:"Abdoul Aziz Diallo",      progress:0,  hasPhoto:false },
  { id:16, name:"Abdoulaye Camara",        progress:20, hasPhoto:false },
  { id:17, name:"Abdoulaye Diallo",        progress:0,  hasPhoto:false },
  { id:18, name:"Abdoulaye Ndoye",         progress:0,  hasPhoto:false },
];

const TOTAL_SEGMENTS = 10;

function getInitials(name = "") {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function avatarColor(name) {
  const colors = [
    { bg: "#dbeafe", text: "#1d4ed8" },
    { bg: "#dcfce7", text: "#166534" },
    { bg: "#fef9c3", text: "#854d0e" },
    { bg: "#fce7f3", text: "#9d174d" },
    { bg: "#ede9fe", text: "#5b21b6" },
    { bg: "#ffedd5", text: "#9a3412" },
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function MiniProgress({ percent }) {
  const filled = Math.round((percent / 100) * TOTAL_SEGMENTS);
  return (
    <div className="scd-progress-bar">
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
        <div
          key={i}
          className={`scd-progress-seg${i < filled ? " scd-progress-seg--filled" : ""}`}
        />
      ))}
    </div>
  );
}

function CandidateRow({ candidate, onSelect }) {
  const { bg, text } = avatarColor(candidate.name);
  const initials = getInitials(candidate.name);

  return (
    <button className="scd-row" onClick={() => onSelect(candidate)}>
      <div className="scd-avatar" style={{ background: bg, color: text }}>
        {initials}
      </div>

      <div className="scd-info">
        <div className="scd-name">{candidate.name}</div>
        <div className="scd-progress-row">
          <span className="scd-progress-label">Progression des compétences</span>
          <span className="scd-progress-pct">{candidate.progress}%</span>
        </div>
        <MiniProgress percent={candidate.progress} />
      </div>

      <span className="scd-chev"><IconChevR /></span>
    </button>
  );
}

export default function SelectCandidateDrawer({ onClose, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = CANDIDATES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(candidate) {
    if (onSelect) {
      onSelect({
        ...candidate,
        email: candidate.email ?? "",
        phone: candidate.phone ?? "",
        seancePasse: candidate.seancePasse ?? 26,
        seanceAvenir: candidate.seanceAvenir ?? 0,
        balanceUtilise: candidate.balanceUtilise ?? 26,
        balanceReste: candidate.balanceReste ?? 0,
      });
    }
    onClose();
  }

  return (
    <>
      <div className="scd-overlay" onClick={onClose} />

      <aside className="scd-drawer">
        <header className="scd-header">
          <button className="scd-close-btn" onClick={onClose}>Fermer</button>
          <h2 className="scd-title">Sélectionner un candidat</h2>
          <span style={{ width: 52 }} />
        </header>

        <div className="scd-search-wrap">
          <div className="scd-search-box">
            <IconSearch />
            <input
              className="scd-search-input"
              type="text"
              placeholder="Rechercher un candidat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="scd-list">
          {filtered.length === 0 ? (
            <div className="scd-empty">Aucun candidat trouvé</div>
          ) : (
            filtered.map(c => (
              <CandidateRow key={c.id} candidate={c} onSelect={handleSelect} />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
