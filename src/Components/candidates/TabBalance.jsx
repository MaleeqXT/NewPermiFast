import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tabbalance.css";

// ── Options de zones disponibles ──────────────────────────────────────────
const ZONE_OPTIONS = ["Others", "SAINT DENIS", "TOULOUSE", "CREIL", "PARIS", "LYON"];

// ── Données du tableau des offres ─────────────────────────────────────────
const OFFERS = [
  { id: 1, icon: "🟢", name: "Pass permis Manuel F20", tranche: 3, balance: "0 h" },
  { id: 2, icon: "🟢", name: "Pass permis Manuel F5",  tranche: 1, balance: "0 h" },
  { id: 3, icon: "⬛", name: "Test de boîte manuelle", tranche: 1, balance: "0 h" },
];

const PAGE_SIZE = 3;

export default function TabBalance({ form }) {
  const navigate = useNavigate();
  const candidateName = form
    ? `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim()
    : "ELIF ELMACIOGLU";

  // ── État des zones ────────────────────────────────────────────────────
  const [selectedZones, setSelectedZones] = useState(["CREIL"]);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const dropRef = useRef(null);

  // Disponibles = toutes les options non encore sélectionnées
  const available = ZONE_OPTIONS.filter(z => !selectedZones.includes(z));

  // Fermer le menu déroulant au clic extérieur
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function addZone(zone) {
    setSelectedZones(prev => [...prev, zone]);
    setDropdownOpen(false);
  }
  function removeZone(zone) {
    setSelectedZones(prev => prev.filter(z => z !== zone));
  }
  function handleNewArea() {
    setDropdownOpen(true);
  }
  function openOfferInfo(offer) {
    navigate("/offersinfo", { state: { offer } });
  }

  // ── Pagination du tableau des offres ──────────────────────────────────
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(OFFERS.length / PAGE_SIZE);
  const pageOffers = OFFERS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="tb-layout">

      {/* ── GAUCHE : tableau des offres ── */}
      <div className="tb-left">
        <div className="tb-table-card">
          <div className="tb-table-scroll">
            <table className="tb-table">
              <thead>
                <tr>
                  <th>Offre</th>
                  <th>Tranche</th>
                  <th>Solde</th>
                </tr>
              </thead>
              <tbody>
                {pageOffers.map(offer => (
                  <tr
                    key={offer.id}
                    className="tb-offer-row"
                    role="button"
                    tabIndex={0}
                    onClick={() => openOfferInfo(offer)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openOfferInfo(offer);
                      }
                    }}
                  >
                    <td>
                      <div className="tb-offer-cell">
                        <div className="tb-offer-icon">{offer.icon}</div>
                        <span className="tb-offer-name">{offer.name}</span>
                      </div>
                    </td>
                    <td className="tb-tranche">{offer.tranche}</td>
                    <td className="tb-balance">{offer.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="tb-pagination">
            <button
              className="tb-page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <span className="tb-page-info">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, OFFERS.length)} sur {OFFERS.length} élément{OFFERS.length > 1 ? "s" : ""}
            </span>
            <button
              className="tb-page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── DROITE : panneau des zones ── */}
      <div className="tb-right">
        <div className="tb-zones-card">

          {/* Déclencheur du menu déroulant des zones */}
          <div className="tb-zones-dropdown-wrapper" ref={dropRef}>
            <button
              className="tb-zones-trigger"
              onClick={() => setDropdownOpen(o => !o)}
            >
              <span>Zones</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            {/* Liste déroulante */}
            {dropdownOpen && (
              <div className="tb-zones-dropdown">
                {available.length === 0 ? (
                  <div className="tb-zones-empty-opt">Toutes les zones ont été ajoutées</div>
                ) : (
                  available.map(zone => (
                    <button
                      key={zone}
                      className="tb-zones-option"
                      onClick={() => addZone(zone)}
                    >
                      {zone}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sous-titre "Les zones disponibles pour X" */}
          <p className="tb-zones-subtitle">
            Les zones disponibles pour <strong>{candidateName}</strong>
          </p>

          {/* Liste des zones sélectionnées */}
          <div className="tb-zones-list">
            {selectedZones.length === 0 ? (
              <p className="tb-zones-none">Aucune zone sélectionnée</p>
            ) : (
              selectedZones.map(zone => (
                <div key={zone} className="tb-zone-row">
                  <span className="tb-zone-name">{zone}</span>
                  <button
                    className="tb-zone-delete"
                    onClick={() => removeZone(zone)}
                    title={`Supprimer ${zone}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bouton Nouvelle zone */}
          <button className="tb-new-area-btn" onClick={handleNewArea}>
            Nouvelle zone
          </button>

        </div>
      </div>

    </div>
  );
}
