

import { useState } from "react";
import MonitorsModal from "../../sessions/MonitorsModal.jsx";
import { useMonitors } from "../monitors/MonitorsContext.jsx";
import "./Propositions.css";

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const IconClock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconMsg = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const IconQuestion = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>;

const PROPOSALS = [
  {
    id: 1,
    date: "Sam 23 Mai 2026",
    timeFrom: "07:00",
    timeTo: "08:00",
    monitor: "Marianne Llinas",
    monitorInitials: "ML",
    candidate: "Keita El hadji",
    candidateInitials: "KH",
    location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro",
    ago: "Il y a 10 heures",
    status: "on-hold",
    validation: "Cette proposition est en attente de validation.",
    comment: "",
    proposalDate: "19 mai 2026",
    dateReservation: "23 mai 2026",
    products: [
      { name: "Pass permis automatique F5", available: false },
      { name: "Forfait accéléré 12 heures...", available: false },
      { name: "Examen boîte automatique", available: false },
      { name: "Pass permis heure d'évaluation BA...", available: false },
      { name: "Forfait 7 heures BA", available: false },
    ],
  },
  {
    id: 2,
    date: "Sam 23 Mai 2026",
    timeFrom: "09:00",
    timeTo: "10:00",
    monitor: "Marianne Llinas",
    monitorInitials: "ML",
    candidate: "Aaliyah Sangare",
    candidateInitials: "AS",
    location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro",
    ago: "Il y a 8 heures",
    status: "denied",
    validation: "Cette proposition a été refusée.",
    comment: "",
    proposalDate: "19 mai 2026",
    dateReservation: "23 mai 2026",
    products: [],
  },
  {
    id: 3,
    date: "Ven 22 Mai 2026",
    timeFrom: "14:00",
    timeTo: "15:00",
    monitor: "Marianne Llinas",
    monitorInitials: "ML",
    candidate: "Aabla Meidani",
    candidateInitials: "AM",
    location: "Agence CREIL, entrée principale",
    ago: "Hier",
    status: "reserve",
    validation: "Cette proposition est réservée.",
    comment: "",
    proposalDate: "18 mai 2026",
    dateReservation: "22 mai 2026",
    products: [
      { name: "Pass permis automatique F5", available: true },
      { name: "Forfait accéléré 12 heures...", available: false },
    ],
  },
];

const STATUS_TABS = ["Tous", "En attente", "Refusé", "Réservé"];
const STATUS_META = {
  "on-hold": { label: "En attente", pill: "pill--hold" },
  denied:    { label: "Refusé",     pill: "pill--denied" },
  reserve:   { label: "Réservé",    pill: "pill--reserve" },
};

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ProposalDrawer({ proposal, onClose, onSave }) {
  const drawerTabs = ["En attente", "Refusé", "Réservé"];
  const [tab, setTab] = useState(STATUS_META[proposal.status]?.label || "En attente");
  const [comment, setComment] = useState(proposal.comment || "");
  const isDirty = comment !== (proposal.comment || "");

  return (
    <>
      <div className="prop-overlay" onClick={onClose} />
      <aside className="prop-drawer">
        <div className="prop-drawer-header">
          <button className="prop-drawer-close" onClick={onClose}>Fermer</button>
          <span className="prop-drawer-title">Détails de la proposition</span>
          <button className="prop-drawer-register">Enregistrer</button>
        </div>

        <div className="prop-drawer-tabs-wrap">
          <div className="prop-drawer-tabs">
            {drawerTabs.map((item) => (
              <button
                key={item}
                className={`prop-drawer-tab${tab === item ? ` prop-drawer-tab--active prop-drawer-tab--${item.toLowerCase().replace(" ", "-")}` : ""}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="prop-drawer-body">
          <div className="prop-info-card">
            {[
              ["Date de la proposition", proposal.proposalDate],
              ["Date de réservation",    proposal.dateReservation],
              ["Horaire",                `${proposal.timeFrom} à ${proposal.timeTo}`],
              ["Lieu",                   proposal.location],
            ].map(([label, value]) => (
              <div key={label} className="prop-info-row">
                <span className="prop-info-label">{label}</span>
                <span className="prop-info-val">{value}</span>
              </div>
            ))}
          </div>

          <div className="prop-people-row">
            <div className="prop-person-card">
              <div className="prop-person-label">Candidat</div>
              <div className="prop-person-chip">
                <div className="prop-avatar prop-avatar--sm">{proposal.candidateInitials}</div>
                <span>{proposal.candidate}</span>
              </div>
            </div>
            <div className="prop-person-card">
              <div className="prop-person-label">Moniteur</div>
              <div className="prop-person-chip">
                <div className="prop-avatar prop-avatar--sm prop-avatar--dark">{proposal.monitorInitials}</div>
                <span>{proposal.monitor}</span>
              </div>
            </div>
          </div>

          {tab === "Réservé" && proposal.products.length > 0 && (
            <div className="prop-products">
              <p className="prop-products-title">Liste des produits</p>
              <div className="prop-products-list">
                {proposal.products.map((product, index) => (
                  <div key={index} className="prop-product-row">
                    <span className="prop-product-icon">Voiture</span>
                    <span className="prop-product-name">{product.name}</span>
                    <span className={`prop-product-avail${product.available ? " prop-product-avail--yes" : ""}`}>
                      {product.available ? "Disponible" : "Indisponible"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="prop-comment-section">
            <p className="prop-comment-title">Commentaire</p>
            {proposal.comment && <p className="prop-comment-old">Précédent : {proposal.comment}</p>}
            <textarea
              className="prop-comment-input"
              placeholder="Ajouter un commentaire..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
        </div>

        <div className="prop-drawer-footer">
          <button
            className={`prop-apply-btn${isDirty ? " prop-apply-btn--active" : ""}`}
            disabled={!isDirty}
            onClick={() => {
              onSave(proposal.id, comment, tab);
              onClose();
            }}
          >
            Appliquer la modification
          </button>
        </div>
      </aside>
    </>
  );
}

export default function ProposalsPage() {
  const { monitors, AVATAR_COLORS } = useMonitors();
  const [proposals, setProposals]       = useState(PROPOSALS);
  const [activeTab, setActiveTab]       = useState("Tous");
  const [searchQ,   setSearchQ]         = useState("");
  const [selected,  setSelected]        = useState(null);
  const [monitorModalOpen, setMonitorModalOpen] = useState(false);
  const [selectedMonitors, setSelectedMonitors] = useState([]);

  const counts = {
    Tous:         proposals.length,
    "En attente": proposals.filter((p) => p.status === "on-hold").length,
    Refusé:       proposals.filter((p) => p.status === "denied").length,
    Réservé:      proposals.filter((p) => p.status === "reserve").length,
  };

  const monitorOptions = monitors.map((monitor) => {
    const fullName = `${monitor.prenom} ${monitor.nom}`.trim();
    return {
      id:       monitor.id,
      name:     fullName,
      initials: getInitials(fullName),
      color:    AVATAR_COLORS[monitor.id % AVATAR_COLORS.length],
      text:     "#111827",
    };
  });

  let filtered = proposals;
  if (activeTab !== "Tous") {
    filtered = filtered.filter((p) => STATUS_META[p.status]?.label === activeTab);
  }
  if (selectedMonitors.length > 0) {
    const selectedNames = new Set(selectedMonitors.map((m) => m.name));
    filtered = filtered.filter((p) => selectedNames.has(p.monitor));
  }
  if (searchQ) {
    const q = searchQ.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.candidate.toLowerCase().includes(q) ||
        p.monitor.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }

  const grouped = filtered.reduce((acc, p) => {
    acc[p.date] = acc[p.date] || [];
    acc[p.date].push(p);
    return acc;
  }, {});

  function handleSave(id, comment, tab) {
    setProposals((current) =>
      current.map((p) => {
        if (p.id !== id) return p;
        const nextStatus =
          tab === "En attente" ? "on-hold" :
          tab === "Refusé"     ? "denied"  : "reserve";
        return { ...p, comment, status: nextStatus };
      })
    );
  }

  return (
    <div className="prop-page">
      <div className="prop-top">
        <h1 className="prop-title">Liste des propositions</h1>
      </div>

      <div className="prop-toolbar">
        <div className="prop-search-box">
          <IconSearch />
          <input
            value={searchQ}
            onChange={(event) => setSearchQ(event.target.value)}
            placeholder="Rechercher..."
          />
        </div>
        <button type="button" className="prop-btn-outline" onClick={() => setMonitorModalOpen(true)}>
          {selectedMonitors.length > 0
            ? `Filtrés (${selectedMonitors.length})`
            : "Filtrer par moniteur"}
        </button>
      </div>

      <div className="prop-tabs-wrap">
        <div className="prop-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              className={`prop-tab${activeTab === tab ? " prop-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className={`prop-tab-count${activeTab === tab ? " prop-tab-count--active" : ""}`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="prop-timeline">
        {Object.keys(grouped).length === 0 && (
          <p className="prop-empty">Aucune proposition dans cette catégorie.</p>
        )}
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="prop-group">
            <div className="prop-group-date">
              <span className="prop-date-dot" />
              <span className="prop-date-label">{date}</span>
            </div>
            <div className="prop-group-entries">
              <span className="prop-time-dot-wrap">
                <span className="prop-time-icon"><IconClock /></span>
                <span className="prop-vert-line" />
              </span>
              <div className="prop-entries-list">
                {items.map((proposal, index) => (
                  <button
                    key={proposal.id}
                    className="prop-entry"
                    onClick={() => setSelected(proposal)}
                    style={{ "--i": index }}
                  >
                    <div className="prop-entry-time">
                      <span className="prop-entry-time-from">{proposal.timeFrom}</span>
                      <span className="prop-entry-time-to">{proposal.timeTo}</span>
                    </div>

                    <div className="prop-entry-people">
                      <div className="prop-entry-person">
                        <div className="prop-avatar prop-avatar--dark">{proposal.monitorInitials}</div>
                        <span className="prop-entry-name">{proposal.monitor}</span>
                      </div>
                      <div className="prop-entry-person">
                        <div className="prop-avatar">{proposal.candidateInitials}</div>
                        <span className="prop-entry-name">{proposal.candidate}</span>
                      </div>
                    </div>

                    <div className="prop-entry-meta">
                      <span className="prop-entry-meta-item"><IconClock /> {proposal.ago}</span>
                      <span className="prop-entry-meta-item">
                        <IconPin />{" "}
                        {proposal.location.length > 28
                          ? `${proposal.location.slice(0, 28)}…`
                          : proposal.location}
                      </span>
                    </div>

                    <div className="prop-entry-right">
                      <span className="prop-entry-meta-item"><IconQuestion /> {proposal.validation}</span>
                      {proposal.comment && (
                        <span className="prop-entry-meta-item"><IconMsg /> {proposal.comment}</span>
                      )}
                      <span className={`prop-status-pill ${STATUS_META[proposal.status]?.pill}`}>
                        {STATUS_META[proposal.status]?.label}
                      </span>
                    </div>

                    {proposal.status === "on-hold" && <div className="prop-stripe-overlay" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ProposalDrawer
          proposal={proposals.find((p) => p.id === selected.id)}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}

      {monitorModalOpen && (
        <MonitorsModal
          title="Filtrer par moniteur"
          monitors={monitorOptions}
          selected={selectedMonitors}
          onSave={setSelectedMonitors}
          onClose={() => setMonitorModalOpen(false)}
        />
      )}
    </div>
  );
}