import { useMemo, useState } from "react";
import "./CalendarModals.css";

const CANDIDATES = [
  { name: "SOW AISSATA", color: "#e0f2fe", text: "#0369a1" },
  { name: "ELIF ELMACIOGLU", color: "#fce7f3", text: "#9d174d" },
  { name: "Jennyfer's Couch Grass", color: "#dcfce7", text: "#166534" },
  { name: "KAMARA HEAVENIE", color: "#fef3c7", text: "#92400e" },
  { name: "VIRLAN MARIA-MANUELA", color: "#ede9fe", text: "#5b21b6" },
  { name: "NGOMA MASSALA THYFENE", color: "#fee2e2", text: "#b91c1c" },
  { name: "JNAHI HAZAR", color: "#dbeafe", text: "#1d4ed8" },
  { name: "CANTIMA KERENE", color: "#fae8ff", text: "#a21caf" },
  { name: "DUPONT Marc", color: "#cffafe", text: "#0f766e" },
  { name: "MARTIN Lea", color: "#fef3c7", text: "#92400e" },
  { name: "BERNARD Pierre", color: "#e0e7ff", text: "#4338ca" },
  { name: "MOREL Sophie", color: "#dcfce7", text: "#166534" },
];

const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

function getInitials(name) {
  return name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function normalizeCandidate(item) {
  if (!item) return null;
  const nestedStudent = item.student ?? item.user?.student ?? null;
  const user = item.user ?? item;
  const name =
    item.name ??
    item.label ??
    item.full_name ??
    nestedStudent?.name ??
    (([user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
      [user.prenom, user.nom].filter(Boolean).join(" ").trim() ||
      item.nom) ?? "");
  return {
    ...item,
    id:
      nestedStudent?.id ??
      nestedStudent?.student_id ??
      item.student_id ??
      item.id ??
      item.value ??
      name,
    studentId: nestedStudent?.id ?? nestedStudent?.student_id ?? item.student_id ?? null,
    name,
    color: item.color ?? "#e0f2fe",
    text: item.text ?? "#0369a1",
  };
}

export default function CandidatesModal({
  selected = [],
  items = CANDIDATES,
  onSave,
  onClose,
  title = "Filtrer par un ou plusieurs candidats",
  singleSelect = false,
  loading = false,
  searchValue,
  onSearchChange,
}) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(
    new Set(selected.map((item) => (typeof item === "string" ? item : item?.id ?? item?.name)).filter(Boolean))
  );
  const [visible, setVisible] = useState(8);

  const normalizedItems = useMemo(
    () => items.map(normalizeCandidate).filter(Boolean),
    [items]
  );

  const activeSearch = searchValue ?? search;
  const filtered = normalizedItems.filter((c) =>
    c.name.toLowerCase().includes(activeSearch.toLowerCase())
  );

  function toggle(candidate) {
    if (singleSelect) {
      setSel(new Set([candidate.id]));
      return;
    }

    setSel((prev) => {
      const next = new Set(prev);
      if (next.has(candidate.id)) next.delete(candidate.id);
      else next.add(candidate.id);
      return next;
    });
  }

  function handleValidate() {
    const chosen = normalizedItems.filter((c) => sel.has(c.id));
    onSave(singleSelect ? (chosen[0] ?? null) : chosen);
    onClose();
  }

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <span className="cm-title">{title}</span>
          <button className="cm-x" onClick={onClose}><IconX /></button>
        </div>

        <div className="cm-search-row">
          <IconSearch />
          <input
            autoFocus
            value={activeSearch}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
              else setSearch(e.target.value);
            }}
            placeholder="Recherche par mot-clé"
          />
        </div>

        <div className="cm-list">
          {loading ? (
            <div className="cm-empty">Chargement des candidats...</div>
          ) : filtered.length === 0 ? (
            <div className="cm-empty">Aucun candidat trouvé.</div>
          ) : (
            filtered.slice(0, visible).map((candidate) => (
              <button
                type="button"
                key={candidate.id}
                className={`cm-list-item ${sel.has(candidate.id) ? "cm-list-item--active" : ""}`}
                onClick={() => toggle(candidate)}
              >
                <span className={`cm-checkbox ${sel.has(candidate.id) ? "cm-checkbox--checked" : ""}`}>
                  {sel.has(candidate.id) && <IconCheck />}
                </span>
                <span className="cm-monitor-avatar" style={{ background: candidate.color, color: candidate.text }}>
                  {getInitials(candidate.name)}
                </span>
                <span className="cm-list-name">{candidate.name}</span>
              </button>
            ))
          )}
        </div>

        {visible < filtered.length && (
          <div className="cm-see-more-wrap">
            <button className="cm-see-more" onClick={() => setVisible((v) => v + 8)}>
              Voir plus
            </button>
          </div>
        )}

        <div className="cm-footer">
          <button className="cm-btn cm-btn--ghost" onClick={onClose}>Annuler</button>
          <button className="cm-btn cm-btn--outline" onClick={() => { onSave(singleSelect ? null : []); onClose(); }}>Effacer</button>
          <button className="cm-btn cm-btn--dark" onClick={handleValidate}>Valider</button>
        </div>
      </div>
    </div>
  );
}
