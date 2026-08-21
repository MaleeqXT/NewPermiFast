import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonitorStudents } from "../redux/reducers/candidateSlice.jsx";
import "./CandidatesPage.css";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const SEGMENTS = 20;

function initials(name = "") {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "?";
}

function getFullName(candidate) {
  return (
    candidate?.name ||
    [candidate?.first_name, candidate?.last_name].filter(Boolean).join(" ").trim() ||
    candidate?.full_name ||
    candidate?.user?.name ||
    ""
  );
}

function getProgress(candidate) {
  const raw =
    candidate?.progress ??
    candidate?.student_progress ??
    candidate?.progression ??
    candidate?.competence_progress ??
    candidate?.percentage ??
    candidate?.student?.progress ??
    candidate?.student?.student_progress ??
    candidate?.student?.progression ??
    candidate?.student?.competence_progress ??
    candidate?.student?.percentage ??
    0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
}

function normalizeCandidate(candidate) {
  return {
    id: candidate?.id ?? candidate?.student_id ?? candidate?.user_id ?? getFullName(candidate),
    name: getFullName(candidate) || "Candidate",
    progress: getProgress(candidate),
    email: candidate?.email || candidate?.user?.email || "",
    phone: candidate?.phone || candidate?.user?.phone || "",
  };
}

function SegmentBar({ progress }) {
  const filled = Math.round((progress / 100) * SEGMENTS);
  return (
    <div className="cndp__bar" aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, index) => (
        <span key={index} className={`cndp__seg${index < filled ? " cndp__seg--on" : ""}`} />
      ))}
    </div>
  );
}

function CandidateRow({ candidate, onSelect }) {
  const details = [candidate.email, candidate.phone].filter(Boolean).join(" | ");
  console.log(candidate);

  return (
    <button type="button" className="cndp__row" onClick={() => onSelect?.(candidate)}>
      <div className="cndp__avatar">{initials(candidate.name)}</div>

      <div className="cndp__info">
        <span className="cndp__name">{candidate.name}</span>
        <span className="cndp__sub">Progression des competences</span>
        <SegmentBar progress={candidate.progress} />
        {details && <span className="cndp__detail">{details}</span>}
      </div>

      <div className="cndp__right">
        <span className="cndp__arrow">›</span>
      </div>
    </button>
  );
}

export default function CandidatesPage({ onBack, onSelect }) {
  const dispatch = useDispatch();
  const selectedSchool = useSelector((state) => state.schools.selected);
  const monitorItems = useSelector((state) => state.candidates.monitorList);
  const loading = useSelector((state) => state.candidates.monitorLoading);
  const error = useSelector((state) => state.candidates.monitorError);

  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchMonitorStudents({
          search: query.trim(),
          status: 1,
        }),
      );
    }, 250);

    return () => clearTimeout(timer);
  }, [dispatch, query, selectedSchool?.id]);

  const candidates = useMemo(
    () => (monitorItems || []).map(normalizeCandidate),
    [monitorItems],
  );

  const filtered = candidates;

  return (
    <div className="cndp__page">
      <header className="cndp__header">
        <button type="button" className="cndp__back" onClick={onBack} aria-label="Back">
          <IconArrowLeft />
        </button>
        <div className="cndp__heading">
          <h1 className="cndp__title">Mes candidats</h1>
          <p className="cndp__subtitle">
            {selectedSchool?.name ? `School: ${selectedSchool.name}` : "Active school candidates"}
          </p>
        </div>
      </header>

      <div className="cndp__search-wrap">
        <span className="cndp__search-icon">
          <IconSearch />
        </span>
        <input
          className="cndp__search"
          type="text"
          placeholder="Search candidate"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button type="button" className="cndp__clear" onClick={() => setQuery("")}>
            ×
          </button>
        )}
      </div>

      <div className="cndp__meta">
        <p className="cndp__count">
          {loading ? "Loading..." : `${filtered.length} candidate${filtered.length !== 1 ? "s" : ""}`}
        </p>
        {error && <p className="cndp__error">{typeof error === "string" ? error : error?.message || "Unable to load candidates"}</p>}
      </div>

      <ul className="cndp__list">
        {filtered.map((candidate, index) => (
          <li key={candidate.id} className="cndp__item" style={{ "--i": index }}>
            <CandidateRow candidate={candidate} onSelect={onSelect} />
          </li>
        ))}

        {!loading && filtered.length === 0 && (
          <li className="cndp__empty">
            No candidate found{query ? ` for "${query}"` : ""}.
          </li>
        )}
      </ul>
    </div>
  );
}
