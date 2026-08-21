import { useState } from "react";
import "../studentdashboard/Competences.css";
import SkillDrawer from "./Skill1Drawer";      // ← adjust path if needed

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const COMPETENCES = [
  { id:1, title:"Maîtriser le maniement du véhicule dans un trafic faible ou nul",                               label:"compétence 1", progress:0 },
  { id:2, title:"Appréhender la route et circuler dans des conditions normales",                                   label:"Compétence 2", progress:0 },
  { id:3, title:"Circuler dans des conditions difficiles et partager la route avec les autres usagers",            label:"Compétence 3", progress:0 },
  { id:4, title:"Pratiquer une conduite autonome, sûre et économique",                                            label:"Compétence 4", progress:0 },
];

const TOTAL_SEGMENTS = 14;

function ProgressBar({ percent }) {
  const filled = Math.round((percent / 100) * TOTAL_SEGMENTS);
  return (
    <div className="comp-progress-bar">
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
        <div key={i} className={`comp-progress-seg${i < filled ? " comp-progress-seg--filled" : ""}`} />
      ))}
    </div>
  );
}

// ── Card is now clickable — calls onOpen with the competence id ───────────
function CompetenceCard({ comp, onOpen }) {
  return (
    <div className="comp-card" onClick={() => onOpen(comp.id)} style={{ cursor:"pointer" }}>
      <div className="comp-card-header">
        <div className="comp-card-num">{comp.id}</div>
        <span className="comp-card-title">{comp.title}</span>
      </div>
      <ProgressBar percent={comp.progress} />
      <div className="comp-card-label">{comp.label}</div>
    </div>
  );
}

export default function MonitorCompetence({ onBack }) {
  // null = drawer closed; number = the skill id whose drawer is open
  const [openSkillId, setOpenSkillId] = useState(null);

  return (
    <div className="comp-page">
      <div className="comp-head">
        <div className="comp-head-left">
          <button className="comp-back-btn" onClick={onBack}>
            <IconBack />
          </button>
          <div className="comp-head-text">
            <h1 className="comp-head-title">Marianne Llinas</h1>
            <p className="comp-head-sub">Compétences</p>
          </div>
        </div>
      </div>

      <div className="comp-list">
        {COMPETENCES.map(comp => (
          <CompetenceCard
            key={comp.id}
            comp={comp}
            onOpen={setOpenSkillId}        // clicking calls setOpenSkillId(comp.id)
          />
        ))}
      </div>

      {/* SkillDrawer — only mounts when a card was clicked */}
      {openSkillId !== null && (
        <SkillDrawer
          skillId={openSkillId}
          onClose={() => setOpenSkillId(null)}
        />
      )}
    </div>
  );
}