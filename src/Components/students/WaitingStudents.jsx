import { useState } from "react";
import "./WaitingStudents.css";
import info from '../../assets/info.svg';

const today = new Date().toISOString().split("T")[0];

const PERMIS_OPTIONS = ["Voiture", "Moto", "Conduite accompagnée", "AM"];

const FILTER_ITEMS = [
  { key: "plusRecent", label: "Plus récent" },
  { key: "moinsRecent", label: "Moins récent" },
  null,
  { key: "Voiture", label: "Voiture" },
  { key: "Moto", label: "Moto" },
  { key: "Conduite accompagnée", label: "Conduite accompagnée" },
  { key: "AM", label: "AM" },
  { key: "codeRoute", label: "Code de la route" },
];

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

const initialStudents = [
  {
    id: 1,
    nom: "Mouloudj",
    prenom: "Yelena",
    permis: "Voiture",
    reservationDate: "2026-04-21",
    neph: "non",
    codeRoute: "aucun",
    majeur: "oui",
    statut: "En attente",
  },
];

function NephBadge({ value }) {
  return value === "oui"
    ? <span className="pf-badge pf-badge-green">OUI</span>
    : <span className="pf-badge pf-badge-red">NON</span>;
}

function CodeRouteBadge({ value }) {
  if (value === "oui") return <span className="pf-badge pf-badge-green">OUI</span>;
  if (value === "non") return <span className="pf-badge pf-badge-red">NON</span>;
  return <span className="pf-badge pf-badge-gray">AUCUN</span>;
}

function MajeurBadge({ value }) {
  return value === "oui"
    ? <span className="pf-badge pf-badge-green">OUI</span>
    : <span className="pf-badge pf-badge-red">NON</span>;
}

function StatutBadge({ value }) {
  if (value === "Validé")     return <span className="pf-badge pf-badge-green">{value}</span>;
  if (value === "Refusé")     return <span className="pf-badge pf-badge-red">{value}</span>;
  if (value === "En attente") return <span className="pf-badge pf-badge-yellow">{value}</span>;
  return <span className="pf-badge pf-badge-gray">{value}</span>;
}

export default function StudentsList() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch]       = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters]     = useState({
    plusRecent: false, moinsRecent: false,
    Voiture: false, Moto: false, "Conduite accompagnée": false, AM: false, codeRoute: false,
  });
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  let data = [...students];

  if (search) data = data.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase()) ||
    s.permis.toLowerCase().includes(search.toLowerCase())
  );

  const activePermis = PERMIS_OPTIONS.filter(p => filters[p]);
  if (activePermis.length) data = data.filter(s => activePermis.includes(s.permis));
  if (filters.codeRoute) data = data.filter(s => s.codeRoute === "oui");

  if (sortKey) {
    data.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
    });
  } else if (filters.plusRecent) {
    data.sort((a, b) => (a.reservationDate < b.reservationDate ? 1 : -1));
  } else if (filters.moinsRecent) {
    data.sort((a, b) => (a.reservationDate < b.reservationDate ? -1 : 1));
  }

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  }

  function toggleFilter(key) {
    if (key === "plusRecent")       setFilters(f => ({ ...f, plusRecent: !f.plusRecent, moinsRecent: false }));
    else if (key === "moinsRecent") setFilters(f => ({ ...f, moinsRecent: !f.moinsRecent, plusRecent: false }));
    else                            setFilters(f => ({ ...f, [key]: !f[key] }));
  }

  function handleValidate(id) {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, statut: "Validé" } : s)
    );
  }

  function handleDelete(id) {
    setStudents(prev => prev.filter(s => s.id !== id));
  }

  const SortArrows = ({ k }) => (
    <button className="pf-sort-btn" onClick={() => handleSort(k)}>
      <span className={`pf-sort-arrow ${sortKey === k && sortDir === 1 ? "active" : ""}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="6 11 12 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </span>
      <span className={`pf-sort-arrow ${sortKey === k && sortDir === -1 ? "active" : ""}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="6 11 12 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
  );

  return (
    <div className="pf-page">

      {/* ── Info banner ── */}
      <div className="pf-info-banner">
        <div className="info-image-wrapper">
          <img src={info} alt="" />
        </div>
        <p className="banner-text">
          N'oubliez pas de valider vos élèves dès qu'ils ont commencé leur formation au sein de votre auto-école,
          afin de leur permettre d'obtenir leur ticket pour le grand jeu-concours annuel PermiFast.
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="pf-toolbar">

        <div className="pf-search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher" />
        </div>

        <div className="pf-filter-wrapper">
          <button className="pf-btn" onClick={() => setFilterOpen(o => !o)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filtre
            {activeFilterCount > 0 && (
              <span className="pf-filter-count">{activeFilterCount}</span>
            )}
          </button>

          {filterOpen && (
            <div className="pf-filter-dropdown">
              {FILTER_ITEMS.map((item, i) =>
                item === null
                  ? <hr key={i} className="pf-filter-divider" />
                  : (
                    <label key={item.key} className="pf-filter-option">
                      <input type="checkbox" checked={filters[item.key]} onChange={() => toggleFilter(item.key)} />
                      {item.label}
                    </label>
                  )
              )}
            </div>
          )}
        </div>

        <button className="pf-btn pf-btn1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Exporter
        </button>
      </div>

      {/* ── Table card — pf-table-card unchanged, scroll is on the INNER div ── */}
      <div className="pf-table-card">
        <div className="ws-table-scroll">   {/* ← scroll lives here, inside the card */}
          <table className="pf-table">
            <thead>
              <tr>
                <th>Détails de l'élève</th>
                <th>Nom <SortArrows k="nom" /></th>
                <th>Prénom <SortArrows k="prenom" /></th>
                <th>Type de permis <SortArrows k="permis" /></th>
                <th>Réservation le <SortArrows k="reservationDate" /></th>
                <th>N° NEPH <SortArrows k="neph" /></th>
                <th>Code de la route <SortArrows k="codeRoute" /></th>
                <th>Majeur <SortArrows k="majeur" /></th>
                <th>Statut <SortArrows k="statut" /></th>
                <th>Validation <SortArrows k="statut" /></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={10} className="pf-empty">Aucun élève trouvé</td></tr>
              ) : data.map(s => (
                <tr key={s.id}>
                  <td>
                    <button className="pf-dossier-btn">Contacter</button>
                  </td>
                  <td>{s.nom}</td>
                  <td>{s.prenom}</td>
                  <td>{s.permis}</td>
                  <td>
                    <span className="pf-icon-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </span>
                    {formatDate(s.reservationDate)}
                  </td>
                  <td><NephBadge value={s.neph} /></td>
                  <td><CodeRouteBadge value={s.codeRoute} /></td>
                  <td><MajeurBadge value={s.majeur} /></td>
                  <td><StatutBadge value={s.statut} /></td>
                  <td>
                    <div className="ws-validation-actions">
                      <button
                        className="ws-action-btn ws-action-delete"
                        onClick={() => handleDelete(s.id)}
                        title="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                      <button
                        className="ws-action-btn ws-action-validate"
                        onClick={() => handleValidate(s.id)}
                        title="Valider"
                        disabled={s.statut === "Validé"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                          <path d="M8 12l3 3 5-5" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}