import { useState, useEffect } from "react";
import "./Zones.css";

export default function PlaceDrawer({ mode, item, onSave, onClose }) {
  const isAdd = mode === "add";

  const [enabled, setEnabled] = useState(true);
  const [name,    setName]    = useState("");
  const [mapUrl,  setMapUrl]  = useState("");

  // Sync fields when item changes (edit mode)
  useEffect(() => {
    if (!isAdd && item) {
      setEnabled(item.status === "active");
      setName(item.name ?? "");
      setMapUrl(item.mapUrl ?? "");
    } else {
      setEnabled(true);
      setName("");
      setMapUrl("");
    }
  }, [mode, item?.id]); // eslint-disable-line

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

  return (
    <>
      {/* Overlay — clicking it closes the drawer */}
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

          {/* Activer toggle */}
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

          {/* Nom de lieu */}
          <div className="zones-form-group">
            <label>Nom de lieu <span style={{ color:"#ef4444" }}>*</span></label>
            <input
              className="zones-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nom de lieu"
            />
          </div>

          {/* Map URL */}
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