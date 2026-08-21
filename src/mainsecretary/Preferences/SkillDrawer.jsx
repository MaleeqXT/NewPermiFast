import { useState, useEffect } from "react";
import "./Skills.css";

export default function SkillDrawer({ mode, skill, nextPosition, onSave, onClose }) {
  const isAdd = mode === "add";

  const [enabled,  setEnabled]  = useState(isAdd ? true : skill?.status === "active");
  const [position, setPosition] = useState(isAdd ? String(nextPosition ?? "") : String(skill?.position ?? ""));
  const [name,     setName]     = useState(isAdd ? "" : skill?.name ?? "");
  const [label,    setLabel]    = useState(isAdd ? "" : skill?.label ?? "");

  useEffect(() => {
    if (!isAdd && skill) {
      setEnabled(skill.status === "active");
      setPosition(String(skill.position ?? ""));
      setName(skill.name ?? "");
      setLabel(skill.label ?? "");
    }
  }, [skill?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canSave = name.trim() !== "" && label.trim() !== "" && position !== "";

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...(skill ?? {}),
      status:   enabled ? "active" : "inactive",
      position: Number(position),
      name:     name.trim(),
      label:    label.trim(),
    });
  }

  const title = isAdd
    ? "Ajouter un groupe"
    : `Modifier le groupe : ${skill?.name ?? ""}`;

  return (
    <>
      <div className="skills-drawer-overlay" onClick={onClose} />
      <div className="skills-drawer">

        {/* En-tête */}
        <div className="skills-drawer-header">
          <button className="skills-drawer-close" onClick={onClose}>Fermer</button>
          <span className="skills-drawer-title">{title}</span>
          <span style={{ width: 46 }} />
        </div>

        {/* Corps */}
        <div className="skills-drawer-body">

          {/* Bascule activer / désactiver */}
          <div className="skills-toggle-row">
            <span className="skills-toggle-label">Activer</span>
            <label className="skills-toggle">
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
              />
              <span className="skills-toggle-track" />
              <span className="skills-toggle-thumb" />
            </label>
          </div>

          {/* Aperçu du statut */}
          <div style={{ marginTop: -10 }}>
            <span
              className={`skills-badge ${enabled ? "skills-badge--active" : "skills-badge--inactive"}`}
              style={{ fontSize: 12 }}
            >
              Statut : {enabled ? "Actif" : "Inactif"}
            </span>
          </div>

          {/* Position */}
          <div className="skills-form-group">
            <label>Position <span>*</span></label>
            <input
              className="skills-input skills-position-input"
              type="number"
              min="1"
              value={position}
              onChange={e => setPosition(e.target.value)}
              placeholder="1"
            />
          </div>

          {/* Nom */}
          <div className="skills-form-group">
            <label>Nom <span>*</span></label>
            <input
              className="skills-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nom de la compétence"
            />
          </div>

          {/* Libellé */}
          <div className="skills-form-group">
            <label>Libellé <span>*</span></label>
            <input
              className="skills-input"
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="ex. Compétence 1"
            />
          </div>

        </div>

        {/* Pied de page */}
        <div className="skills-drawer-footer">
          <button
            className="skills-drawer-save-btn"
            onClick={handleSave}
            disabled={!canSave}
          >
            Enregistrer
          </button>
        </div>

      </div>
    </>
  );
}