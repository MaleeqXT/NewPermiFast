import { useState } from "react";
import "./SkillDrawer.css";

const SKILL_DATA = {
  1: {
    id: 1,
    title: "Maîtriser le maniement du véhicule en circulation légère ou nulle",
    label: "compétence 1",
    items: [
      "Comprendre les principaux organes et commandes du véhicule",
      "Entrer, s’installer au poste de conduite et en sortir",
      "Tenir, tourner le volant et maintenir la trajectoire",
      "Démarrer et s’arrêter",
      "Doser l’accélération et le freinage à diverses allures",
      "Utiliser la boîte de vitesses",
      "Diriger la voiture en avant en ligne droite et en courbe en adaptant allure et trajectoire",
      "Regarder autour de soi et avertir",
      "Effectuer une marche arrière et un demi-tour en sécurité",
    ],
  },
  2: {
    id: 2,
    title: "Appréhender la route et circuler dans des conditions normales",
    label: "compétence 2",
    items: [
      "Connaître les principaux organes et commandes du véhicule",
      "Entrer, s'installer au poste de conduite et en sortir",
      "Tenir, tourner le volant et maintenir la trajectoire",
      "Démarrer et s'arrêter",
      "Doser l'accélération et le freinage à diverses allures",
      "Utiliser la boîte de vitesses",
      "Diriger la voiture en avant en ligne droite et en courbe en adaptant allure et trajectoire",
      "Regarder autour de soi et avertir",
      "Effectuer une marche arrière et un demi-tour en sécurité",
    ],
  },
  3: {
    id: 3,
    title: "Circuler dans des conditions difficiles et partager la route avec les autres usagers",
    label: "compétence 3",
    items: [
      "Évaluer et maintenir les distances de sécurité",
      "Croiser, dépasser, être dépassé(e)",
      "Passer des virages et conduire en déclivité",
      "Connaître les caractéristiques des autres usagers et savoir se comporter à leur égard avec respect et courtoisie",
      "S'insérer, circuler et sortir d'une voie rapide",
      "Conduire dans une file de véhicules et dans une circulation dense",
      "Connaître les règles relatives à la circulation inter-files des motos, savoir en tenir compte",
      "Conduire quand l'adhérence et la visibilité sont réduites",
      "Conduire à l'abord et dans la traversée d'ouvrages routiers, tunnels, ponts...",
    ],
  },
  4: {
    id: 4,
    title: "Pratiquer une conduite autonome, sûre et économique",
    label: "compétence 4",
    items: [
      "Suivre un itinéraire de manière autonome",
      "Préparer et effectuer un voyage longue distance en autonomie",
      "Connaître les principaux facteurs de risque au volant et les recommandations à appliquer",
      "Connaître les comportements à adopter en cas d'accident: protéger, alerter, secourir",
      "Faire l'expérience des aides à la conduite du véhicule (régulateur, limiteur de vitesse, ABS, aides à la navigation...)",
      "Avoir des notions sur l'entretien, le dépannage et les situations d'urgence",
      "Pratiquer l'écoconduite",
    ],
  },
};

const RATINGS = [
  { value: 1, label: "En cours" },
  { value: 2, label: "À renforcer" },
  { value: 3, label: "Maîtrisé" },
];

const IconStar = ({ filled }) => (
  <svg width="28" height="28" viewBox="0 0 24 24"
    fill={filled ? "#f59e0b" : "none"}
    stroke="#f59e0b"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconComment = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

function StarRow({ rating, onChange }) {
  return (
    <div className="sk-star-row">
      {RATINGS.map(r => (
        <button
          key={r.value}
          className={`sk-star-btn ${rating === r.value ? "sk-star-btn--active" : ""}`}
          onClick={() => onChange(rating === r.value ? 0 : r.value)}
          type="button"
          title={r.label}
        >
          <IconStar filled={rating >= r.value} />
          <span className="sk-star-label">{r.label}</span>
        </button>
      ))}
    </div>
  );
}

function SuccessModal({ onClose }) {
  return (
    <div className="sk-modal-backdrop" onClick={onClose}>
      <div className="sk-modal" onClick={e => e.stopPropagation()}>
        <div className="sk-modal-icon"><IconCheck /></div>
        <div className="sk-modal-title">Enregistré avec succès !</div>
        <div className="sk-modal-body">
          Les évaluations de compétence ont été enregistrées.
        </div>
        <button className="sk-modal-btn" onClick={onClose}>Terminer</button>
      </div>
    </div>
  );
}

export default function SkillDrawer({ skillId, onClose }) {
  const skill = SKILL_DATA[skillId];
  const [ratings, setRatings] = useState(() => Array(skill?.items.length ?? 0).fill(0));
  const [comments, setComments] = useState(() => Array(skill?.items.length ?? 0).fill(""));
  const [showSuccess, setShowSuccess] = useState(false);

  if (!skill) return null;

  function setRating(i, val) {
    setRatings(prev => { const n=[...prev]; n[i]=val; return n; });
  }
  function setComment(i, val) {
    setComments(prev => { const n=[...prev]; n[i]=val; return n; });
  }

  function handleSave() {
    setShowSuccess(true);
  }

  return (
    <>
      <div className="sk-backdrop" onClick={onClose} />

      <aside className="sk-drawer">
        <div className="sk-header">
          <button className="sk-header-close" onClick={onClose}>Fermer</button>
          <span className="sk-header-title">{skill.label}</span>
          <span style={{ width: 52 }} />
        </div>

        <div className="sk-summary-card">
          <div className="sk-summary-top">
            <div className="sk-summary-num">{skill.id}</div>
            <span className="sk-summary-title">{skill.title}</span>
          </div>
          <div className="sk-summary-bar">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="sk-summary-seg" />
            ))}
          </div>
          <span className="sk-summary-label">{skill.label}</span>
        </div>

        <div className="sk-body">
          {skill.items.map((item, i) => (
            <div key={i} className="sk-item">
              <div className="sk-item-top">
                <span className="sk-item-text">{item}</span>
                <StarRow rating={ratings[i]} onChange={val => setRating(i, val)} />
              </div>
              <div className="sk-comment-row">
                <span className="sk-comment-label">Commentaire :</span>
                <input
                  className="sk-comment-input"
                  value={comments[i]}
                  onChange={e => setComment(i, e.target.value)}
                  placeholder="Ajouter un commentaire…"
                />
                <IconComment />
              </div>
            </div>
          ))}
        </div>

        <div className="sk-footer">
          <button className="sk-footer-cancel" onClick={onClose}>Annuler</button>
          <button className="sk-footer-save" onClick={handleSave}>Enregistrer</button>
        </div>
      </aside>

      {showSuccess && (
        <SuccessModal onClose={() => { setShowSuccess(false); onClose(); }} />
      )}
    </>
  );
}
