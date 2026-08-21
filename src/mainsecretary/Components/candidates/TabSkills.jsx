import { useState } from "react";
import "./TabSkills.css";

// ── Les 4 compétences avec leurs sous-compétences ─────────────────────────
const SKILLS = [
  {
    id: 1,
    label: "Maîtriser la manipulation du véhicule avec peu ou pas de trafic",
    tag: "Compétence 1",
    subSkills: [
      "Comprendre les principaux composants et commandes du véhicule",
      "Monter, s'installer au volant et descendre du véhicule",
      "Tenir et tourner le volant en maintenant la trajectoire",
      "Démarrer et s'arrêter",
      "Contrôler l'accélération et le freinage à différentes vitesses",
      "Embrayer, changer et passer les vitesses",
      "Effectuer un demi-tour et une manœuvre en marche arrière",
      "Garer le véhicule (marche avant et marche arrière)",
    ],
  },
  {
    id: 2,
    label: "Comprendre la route et conduire dans des conditions normales",
    tag: "Compétence 2",
    subSkills: [
      "Rechercher les panneaux et indices utiles, et en tenir compte.",
      "Positionner le véhicule sur la chaussée et choisir la voie de circulation",
      "Adapter son allure à la situation",
      "Tourner à droite et à gauche en agglomération",
      "Détecter, identifier et franchir les intersections selon les règles de priorité",
      "Aborder les ronds-points et les giratoires",
      "S'arrêter et se garer en épi, en créneau et en bataille.",
      "Utiliser les dispositifs d'éclairage et de signalisation",
    ],
  },
  {
    id: 3,
    label: "Conduire dans des conditions difficiles et partager la route avec les autres usagers",
    tag: "Compétence 3",
    subSkills: [
      "Évaluer et maintenir des distances de sécurité",
      "Se croiser, dépasser et être dépassé",
      "Négocier les virages et conduire en côte",
      "Connaître les caractéristiques des autres usagers et savoir se comporter envers eux avec respect et courtoisie",
      "Entrer sur une autoroute, y circuler et en sortir",
      "Conduire en file de véhicules et dans des embouteillages",
      "Connaître les règles relatives à la conduite en sas pour les motos et savoir en tenir compte",
      "Conduire lorsque l'adhérence et la visibilité sont réduites",
      "Conduire à l'approche et lors du franchissement d'ouvrages d'art, tunnels, ponts...",
    ],
  },
  {
    id: 4,
    label: "Pratiquer une conduite autonome, sûre et économique",
    tag: "Compétence 4",
    subSkills: [
      "Suivre un itinéraire de manière autonome",
      "Préparer et effectuer un voyage longue distance en autonomie",
      "Connaître les principaux facteurs de risque au volant et les recommandations à appliquer",
      "Connaître les actions appropriées en cas d'accident : protéger, alerter, secourir",
      "Expérimenter les aides à la conduite du véhicule (régulateur de vitesse, limiteur, ABS, aides à la navigation...)",
      "Avoir des connaissances de base en entretien, dépannage et situations d'urgence",
      "Pratiquer l'éco-conduite",
    ],
  },
];

// Étoile SVG — pleine ou vide
function Star({ filled, onClick }) {
  return (
    <svg
      onClick={onClick}
      width="28" height="28"
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#c9cdd4"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: "pointer", transition: "fill 0.15s, stroke 0.15s" }}
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
    </svg>
  );
}

// ── Niveaux d'évaluation ──────────────────────────────────────────────────
const LEVELS = ["En cours", "À améliorer", "Maîtrisé"];

export default function TabSkills() {
  const [activeSkill, setActiveSkill] = useState(1);

  // ratings[skillId][subSkillIndex][levelIndex] = bool
  const [ratings, setRatings] = useState(() => {
    const init = {};
    SKILLS.forEach(sk => {
      init[sk.id] = {};
      sk.subSkills.forEach((_, si) => {
        init[sk.id][si] = { 0: false, 1: false, 2: false };
      });
    });
    init[1][1] = { 0: true, 1: true, 2: true };
    init[1][3] = { 0: true, 1: true, 2: true };
    init[2][5] = { 0: true, 1: true, 2: false };
    return init;
  });

  function toggleStar(skillId, subIdx, levelIdx) {
    setRatings(prev => ({
      ...prev,
      [skillId]: {
        ...prev[skillId],
        [subIdx]: {
          ...prev[skillId][subIdx],
          [levelIdx]: !prev[skillId][subIdx][levelIdx],
        },
      },
    }));
  }

  function calcProgress(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return 0;
    const total = skill.subSkills.length * 3;
    let filled = 0;
    skill.subSkills.forEach((_, si) => {
      [0, 1, 2].forEach(li => {
        if (ratings[skillId]?.[si]?.[li]) filled++;
      });
    });
    return total === 0 ? 0 : Math.round((filled / total) * 100);
  }

  const skill = SKILLS.find(s => s.id === activeSkill);
  const progress = calcProgress(activeSkill);
  const segCount = skill?.subSkills.length ?? 8;
  const filledSegs = Math.round((progress / 100) * segCount);

  return (
    <div className="ts-layout">

      {/* ── GAUCHE : barre latérale des compétences ── */}
      <div className="ts-sidebar">
        {SKILLS.map((sk, idx) => (
          <div key={sk.id} className="ts-sidebar-item-wrapper">
            {idx > 0 && <div className="ts-connector" />}
            <div
              className={`ts-skill-item ${activeSkill === sk.id ? "active" : ""}`}
              onClick={() => setActiveSkill(sk.id)}
            >
              <div className={`ts-skill-num ${activeSkill === sk.id ? "active" : ""}`}>
                {sk.id}
              </div>
              <div className="ts-skill-text">
                <span className="ts-skill-label">{sk.label}</span>
                <span className="ts-skill-tag">{sk.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── DROITE : panneau de détail ── */}
      <div className="ts-detail">

        {/* En-tête de progression */}
        <div className="ts-progress-header">
          <div className="ts-progress-top">
            <div className="ts-progress-title-row">
              <span className="ts-progress-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </span>
              <span className="ts-progress-title">
                Progression en {skill?.label.toLowerCase()}
              </span>
            </div>
            <span className="ts-progress-pct">{progress} %</span>
          </div>

          {/* Barre de progression segmentée */}
          <div className="ts-progress-bar">
            {Array.from({ length: segCount }).map((_, i) => (
              <div
                key={i}
                className={`ts-progress-seg ${i < filledSegs ? "filled" : ""}`}
              />
            ))}
          </div>

          <span className="ts-progress-status">Évaluation des compétences en cours</span>
        </div>

        {/* Liste des sous-compétences */}
        <div className="ts-subskills-card">
          {skill?.subSkills.map((sub, si) => (
            <div key={si} className="ts-subskill-row">
              <span className="ts-subskill-name">{sub}</span>
              <div className="ts-stars-group">
                {LEVELS.map((level, li) => (
                  <div key={li} className="ts-star-col">
                    <Star
                      filled={ratings[activeSkill]?.[si]?.[li] ?? false}
                      onClick={() => toggleStar(activeSkill, si, li)}
                    />
                    <span className="ts-star-label">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}