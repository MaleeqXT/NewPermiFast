import { useState } from "react";
import "./CalendarModals.css";

const DEFAULT_MONITORS = [
  { id: 1, name: "Jean Dupont", initials: "JD", color: "#e0f2fe", text: "#0369a1" },
  { id: 2, name: "Marie Martin", initials: "MM", color: "#fce7f3", text: "#9d174d" },
  { id: 3, name: "Paul Bernard", initials: "PB", color: "#dcfce7", text: "#166534" },
  { id: 4, name: "Sophie Leclerc", initials: "SL", color: "#fef3c7", text: "#92400e" },
  { id: 5, name: "Ahmed Benali", initials: "AB", color: "#ede9fe", text: "#5b21b6" },
  { id: 6, name: "Claire Fontaine", initials: "CF", color: "#fce7f3", text: "#9d174d" },
];

const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

function normalizeMonitor(monitor) {
  if (!monitor) return null;
  const nestedMonitor = monitor.monitor ?? monitor.user?.monitor ?? null;
  const user = monitor.user ?? monitor;
  const name =
    monitor.name ??
    monitor.label ??
    nestedMonitor?.name ??
    ([user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
      [user.prenom, user.nom].filter(Boolean).join(" ").trim());
  return {
    ...monitor,
    id:
      nestedMonitor?.id ??
      nestedMonitor?.monitor_id ??
      monitor.monitor_id ??
      monitor.id ??
      monitor.value ??
      name,
    monitorId: nestedMonitor?.id ?? nestedMonitor?.monitor_id ?? monitor.monitor_id ?? null,
    name,
    initials: monitor.initials ?? name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    color: monitor.color ?? "#e0f2fe",
    text: monitor.text ?? "#0369a1",
  };
}

export default function MonitorsModal({
  selected = [],
  items,
  onSave,
  onClose,
  monitors = DEFAULT_MONITORS,
  title = "SÃ©lectionner les moniteurs",
  singleSelect = false,
  loading = false,
  searchValue,
  onSearchChange,
}) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(new Set(selected.map((m) => (typeof m === "string" ? m : m?.id)).filter(Boolean)));
  const [visible, setVisible] = useState(8);

  const source = items ?? monitors;
  const normalizedMonitors = source.map(normalizeMonitor).filter(Boolean);

  const activeSearch = searchValue ?? search;
  const filtered = normalizedMonitors.filter((m) =>
    m.name.toLowerCase().includes(activeSearch.toLowerCase())
  );

  function toggle(monitor) {
    if (singleSelect) {
      setSel(new Set([monitor.id]));
      return;
    }

    setSel((prev) => {
      const next = new Set(prev);
      if (next.has(monitor.id)) next.delete(monitor.id);
      else next.add(monitor.id);
      return next;
    });
  }

  function handleValidate() {
    const chosen = normalizedMonitors.filter((m) => sel.has(m.id));
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
            <div className="cm-empty">Chargement des moniteurs...</div>
          ) : filtered.length === 0 ? (
            <div className="cm-empty">Aucun moniteur trouvé.</div>
          ) : (
            filtered.slice(0, visible).map((monitor) => (
              <button
                key={monitor.id}
                className={`cm-list-item ${sel.has(monitor.id) ? "cm-list-item--active" : ""}`}
                onClick={() => toggle(monitor)}
              >
                <span className={`cm-checkbox ${sel.has(monitor.id) ? "cm-checkbox--checked" : ""}`}>
                  {sel.has(monitor.id) && <IconCheck />}
                </span>
                <span className="cm-monitor-avatar" style={{ background: monitor.color, color: monitor.text }}>
                  {monitor.initials}
                </span>
                <span className="cm-list-name">{monitor.name}</span>
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
