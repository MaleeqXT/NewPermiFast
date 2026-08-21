import { useState } from "react";
import "./CandidatesPage.css";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ALL_CANDIDATES = [
  { id: 1,  name: "Aabla Meidani",           progress: 0  },
  { id: 2,  name: "Aaliyah Sangaré",         progress: 0  },
  { id: 3,  name: "AARIYANE NAZAR MOHAMMAD", progress: 0  },
  { id: 4,  name: "Ababile and Ahmed",       progress: 0  },
  { id: 5,  name: "ABBOU I KNOW",            progress: 0  },
  { id: 6,  name: "Abdallah Abderrafii",     progress: 0  },
  { id: 7,  name: "Abdallah Mahamouda",      progress: 0  },
  { id: 8,  name: "Abdallah Semail",         progress: 0  },
  { id: 9,  name: "Abdelaziz Oueld",         progress: 12 },
  { id: 10, name: "Abdelkader Mansouri",     progress: 34 },
  { id: 11, name: "Abderrahim Tounsi",       progress: 67 },
  { id: 12, name: "Abderrahmane Fares",      progress: 88 },
];

const SEGMENTS = 20;

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function SegmentBar({ progress }) {
  const filled = Math.round((progress / 100) * SEGMENTS);
  return (
    <div className="cndp__bar">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span key={i} className={`cndp__seg${i < filled ? " cndp__seg--on" : ""}`} />
      ))}
    </div>
  );
}

export default function CandidatesPage({ onBack, onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = ALL_CANDIDATES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cndp__page">
      <header className="cndp__header">
        <button className="cndp__back" onClick={onBack} aria-label="Retour">
          <IconArrowLeft />
        </button>
        <h1 className="cndp__title">Candidats</h1>
      </header>

      <div className="cndp__search-wrap">
        <span className="cndp__search-icon">⌕</span>
        <input
          className="cndp__search"
          type="text"
          placeholder="Recherche par mot-clé"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="cndp__clear" onClick={() => setQuery("")}>×</button>
        )}
      </div>

      <p className="cndp__count">
        {filtered.length} candidat{filtered.length !== 1 ? "s" : ""}
      </p>

      <ul className="cndp__list">
        {filtered.map((c, i) => (
          <li key={c.id} className="cndp__item" style={{ "--i": i }}>
            <button className="cndp__row" onClick={() => onSelect?.(c)}>
              <div className="cndp__avatar">{initials(c.name)}</div>
              <div className="cndp__info">
                <span className="cndp__name">{c.name}</span>
                <span className="cndp__sub">Progression des compétences</span>
                <SegmentBar progress={c.progress} />
              </div>
              <div className="cndp__right">
                <span className="cndp__pct">{c.progress}%</span>
                <span className="cndp__arrow">›</span>
              </div>
            </button>
          </li>
        ))}

        {filtered.length === 0 && (
          <li className="cndp__empty">Aucun candidat ne correspond à « {query} »</li>
        )}
      </ul>
    </div>
  );
}
