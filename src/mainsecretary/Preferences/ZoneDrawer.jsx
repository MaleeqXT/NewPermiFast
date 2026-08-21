import { useState, useEffect } from "react";
import "./Zones.css";

/**
 * ZoneDrawer — unified drawer for Zones and Places
 *
 * Props:
 *   mode      – "add" | "modify"
 *   type      – "zone" | "place"
 *   item      – existing item (modify only)
 *   onSave    – (data) => void
 *   onClose   – () => void
 */
export default function ZoneDrawer({ mode, type, item, onSave, onClose }) {
  const isAdd   = mode === "add";
  const isPlace = type === "place";

  const [enabled, setEnabled] = useState(isAdd ? true : item?.status === "active");
  const [name,    setName]    = useState(isAdd ? "" : item?.name ?? "");
  const [mapUrl,  setMapUrl]  = useState(isAdd ? "" : item?.mapUrl ?? "");

  useEffect(() => {
    if (!isAdd && item) {
      setEnabled(item.status === "active");
      setName(item.name ?? "");
      setMapUrl(item.mapUrl ?? "");
    }
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canSave = name.trim() !== "";

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...(item ?? {}),
      name:   name.trim(),
      mapUrl: mapUrl.trim(),
      status: enabled ? "active" : "inactive",
    });
  }

  const title     = isAdd ? "Ajouter une zone" : "Modifier Zone";
  const saveLabel = isAdd ? "Enregistrer Nouveau" : "Enregistrer";
  const namePlaceholder = isPlace ? "Nom de lieu" : "Nom de la Zone";
  const nameLabel       = isPlace ? "Nom de lieu" : "Nom de la Zone";

  return (
    <>
      <div className="zones-drawer-overlay" onClick={onClose} />
      <div className="zones-drawer">

        {/* Header */}
        <div className="zones-drawer-header">
          <button className="zones-drawer-close" onClick={onClose}>Fermer</button>
          <span className="zones-drawer-title">{title}</span>
          <span style={{ width: 52 }} />
        </div>

        {/* Body */}
        <div className="zones-drawer-body">

          {/* Active toggle */}
          <div className="zones-toggle-row">
            <span className="zones-toggle-label">Activer</span>
            <label className="zones-toggle">
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
              />
              <span className="zones-toggle-track" />
              <span className="zones-toggle-thumb" />
            </label>
          </div>

          {/* Name field */}
          <div className="zones-form-group">
            <label>{nameLabel} <span>*</span></label>
            <input
              className="zones-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={namePlaceholder}
            />
          </div>

          {/* Map URL field (places only) */}
          {isPlace && (
            <div className="zones-form-group">
              <label>Map URL</label>
              <input
                className="zones-input"
                type="text"
                value={mapUrl}
                onChange={e => setMapUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="zones-drawer-footer">
          <button className="zones-drawer-cancel-btn" onClick={onClose}>
            Fermer
          </button>
          <button
            className={`zones-drawer-save-btn ${isAdd ? "zones-drawer-save-btn--add" : "zones-drawer-save-btn--edit"}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            {saveLabel}
          </button>
        </div>

      </div>
    </>
  );
}