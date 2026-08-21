import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProposedSessionsList.css";
import ProposalDetailDrawer from "./ProposalDetailDrawer.jsx";
import {
  fetchAllProposals,
  selectAllProposals,
  selectAllProposalsLoading,
} from "../redux/reducers/monitorProposalsSlice.jsx";

const IconBack = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const IconClock = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join("");
}

function fmtDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("fr-FR", { weekday: "short" });
  const monthLabel = date.toLocaleDateString("fr-FR", { month: "long" });
  return `${weekday} ${date.getDate()} ${monthLabel} ${date.getFullYear()}`;
}

const PROPOSALS = [
  {
    id: 1,
    date: "2026-05-22",
    status: "Cette proposition est en attente de validation.",
    candidateName: "Keita El Hadji",
    candidateEmail: "ekeita934@gmail.com",
    location: "Toulouse, au McDonald's Les Arènes, sur le trottoir devant la station de métro.",
    time: "09:00 à 10:00",
    offer: "Pass permis automatique F5",
  },
  {
    id: 2,
    date: "2026-05-23",
    status: "Cette proposition est en attente de validation.",
    candidateName: "Keita El Hadji",
    candidateEmail: "ekeita934@gmail.com",
    location: "Toulouse, au McDonald's Les Arènes, sur le trottoir devant la station de métro.",
    time: "08:00 à 09:00",
    offer: "Pass permis Manuelle F10",
  },
  {
    id: 3,
    date: "2026-05-26",
    status: "Cette proposition est en attente de validation.",
    candidateName: "Mohamed Rahmouni",
    candidateEmail: "rahmounimohamed313@gmail.com",
    location: "32 Boulevard Andre Netwiller, Toulouse",
    time: "08:00 à 09:00",
    offer: "Pass permis Manuelle F10",
  },
  {
    id: 4,
    date: "2026-05-26",
    status: "Proposition acceptée.",
    candidateName: "Youzouria Tamime",
    candidateEmail: "youzouria@gmail.com",
    location: "32 Boulevard Andre Netwiller, Toulouse",
    time: "10:00 à 12:00",
    offer: "Pass permis Manuelle F10",
  },
  {
    id: 5,
    date: "2026-05-28",
    status: "Cette proposition est en attente de validation.",
    candidateName: "Sophie Martin",
    candidateEmail: "sophiemartin@gmail.com",
    location: "Toulouse, rue de la République, près de l’entrée de la gare.",
    time: "14:00 à 15:00",
    offer: "Pass permis manuel F5",
  },
  {
    id: 6,
    date: "2026-05-28",
    status: "Proposition refusée.",
    candidateName: "Jean Bernard",
    candidateEmail: "jbernard@gmail.com",
    location: "Toulouse, au McDonald's Les Arènes, sur le trottoir devant la station de métro.",
    time: "16:00 à 17:00",
    offer: "Pass permis automatique F13",
  },
];

const STATUS_CONFIG = {
  "Proposition acceptée.": { bg: "#dcfce7", color: "#166534" },
  "Proposition refusée.": { bg: "#fee2e2", color: "#991b1b" },
};

function getStatusStyle(status) {
  return STATUS_CONFIG[status] || { bg: "#f3f4f6", color: "#6b7280" };
}

function groupByDate(list) {
  const map = {};
  list.forEach((proposal) => {
    if (!map[proposal.date]) {
      map[proposal.date] = [];
    }
    map[proposal.date].push(proposal);
  });
  return Object.entries(map).sort(([left], [right]) => left.localeCompare(right));
}

function ProposalCard({ proposal, onSelect }) {
  const statusStyle = getStatusStyle(proposal.status);
  const ini = initials(proposal.candidate);
  const apiBase = import.meta.env.VITE_API_URL ?? "";
  
  // Get student avatar: media (relative path) → profile_photo_url (fallback)
  let avatarUrl = null;
  if (proposal.candidateObj?.media) {
    const media = proposal.candidateObj.media;
    avatarUrl = media.startsWith("http") 
      ? media 
      : `${apiBase}/storage/${media}`;
  } else if (proposal.candidateObj?.profile_photo_url) {
    avatarUrl = proposal.candidateObj.profile_photo_url;
  }

  const handleClick = () => {
    onSelect?.(proposal);
  };

  return (
    <button type="button" className="psl-proposal-card" onClick={handleClick}>
      <div className="psl-status-pill" style={{ background: statusStyle.bg, color: statusStyle.color }}>
        {proposal.status}
      </div>

      <div className="psl-card-body">
        {avatarUrl ? (
          <img src={avatarUrl} alt={proposal.candidate} className="psl-avatar psl-avatar--img" />
        ) : (
          <div className="psl-avatar">{ini}</div>
        )}

        <div className="psl-card-text">
          <div className="psl-card-desc">
            Vous avez proposé une séance pour le candidat
          </div>
          <div className="psl-card-main">
            <strong>{proposal.candidate}</strong>
            {" "}à <strong>{proposal.mapLocation}</strong>
          </div>
          <div className="psl-card-meta">{proposal.startTime} à {proposal.endTime} - {proposal.offer}</div>
        </div>
      </div>
    </button>
  );
}

export default function ProposedSessionsList({ onBack, onSelectProposal }) {
  const dispatch = useDispatch();
  const proposals = useSelector(selectAllProposals);
  const loading = useSelector(selectAllProposalsLoading);
  const [query, setQuery] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const debounceTimerRef = React.useRef(null);

  // Fetch all proposals on mount
  useEffect(() => {
    dispatch(fetchAllProposals());
  }, [dispatch]);

  // Debounced search - call API when query changes
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      dispatch(fetchAllProposals({ search: query }));
    }, 500); // 500ms debounce

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, dispatch]);

  const grouped = groupByDate(proposals);

  return (
    <div className="psl-page">
      <header className="psl-header">
        <button className="psl-back" onClick={onBack} aria-label="Retour">
          <IconBack />
        </button>
        <h1 className="psl-title">Liste des séances proposées</h1>
      </header>

      <div className="psl-search-wrap">
        <span className="psl-search-icon"><IconSearch /></span>
        <input
          className="psl-search"
          type="text"
          placeholder="Recherche par mot-clé"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button className="psl-clear" onClick={() => setQuery("")}>x</button>
        )}
      </div>

      <p className="psl-count">
        {loading ? "Chargement..." : `${proposals.length} proposition${proposals.length !== 1 ? "s" : ""}`}
      </p>

      <div className="psl-timeline">
        {!loading && grouped.length === 0 && (
          <div className="psl-empty">
            {query ? `Aucune proposition ne correspond à « ${query} »` : "Aucune proposition"}
          </div>
        )}

        {grouped.map(([date, groupedProposals]) => (
          <div key={date} className="psl-date-group">
            <div className="psl-date-row">
              <div className="psl-date-dot" />
              <span className="psl-date-label">{fmtDate(date)}</span>
            </div>

            {groupedProposals.map((proposal, index) => (
              <div key={proposal.id} className="psl-entry">
                <div className="psl-entry-left">
                  <div className="psl-entry-line" />
                  <div className="psl-entry-clock"><IconClock /></div>
                  {index < groupedProposals.length - 1 && <div className="psl-entry-line psl-entry-line--bottom" />}
                </div>

                <div className="psl-entry-card">
                  <ProposalCard proposal={proposal} onSelect={setSelectedProposal} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedProposal && (
        <ProposalDetailDrawer
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
        />
      )}
    </div>
  );
}
