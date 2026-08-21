import { useState } from "react";
import "./CalendarModals.css";

const ZONES = [
  { id: 1, name: "Autres"     },
  { id: 2, name: "SAINT DENIS"},
  { id: 3, name: "TOULOUSE"   },
  { id: 4, name: "CREIL"      },
];

const PLACES_BY_ZONE = {
  1: ["Place de la République", "Rue des Lilas"],
  2: ["Allée Ernesto Che Guevara"],
  3: [
    "32 Boulevard André Netwiller, 31200 Toulouse",
    "Toulouse, McDonald's Les Arènes, on the sidewalk at the metro exit",
  ],
  4: ["CREIL Agency"],
};

const IconX     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCheck = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function ZoneModal({ current, onSave, onClose, zones = ZONES, places: suppliedPlaces }) {
  const [selZone,  setSelZone]  = useState(current?.zone  ?? null);
  const [selPlace, setSelPlace] = useState(current?.place ?? null);
  const places = suppliedPlaces ?? (selZone ? (PLACES_BY_ZONE[selZone.id] || []) : []);

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal cm-modal--wide" onClick={e => e.stopPropagation()}>

        <div className="cm-header">
          <span className="cm-title">Sélectionner la zone et le lieu</span>
          <button className="cm-x" onClick={onClose}><IconX /></button>
        </div>

        <div className="cm-zone-body">
          {/* Colonne Zone */}
          <div className="cm-zone-col">
            <div className="cm-col-label">Zone</div>
            <div className="cm-zone-list">
              {zones.map(z => (
                <button
                  key={z.id}
                  className={`cm-zone-item ${selZone?.id === z.id ? "cm-zone-item--active" : ""}`}
                  onClick={() => { setSelZone(z); setSelPlace(null); }}
                >
                  {selZone?.id === z.id && <span className="cm-zone-bar" />}
                  <span className="cm-zone-name">{z.name}</span>
                  {selZone?.id === z.id && <span className="cm-zone-check"><IconCheck /></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="cm-zone-divider" />

          {/* Colonne Lieu */}
          <div className="cm-zone-col">
            <div className="cm-col-label">Lieu</div>
            <div className="cm-zone-list">
              {places.length === 0
                ? <div className="cm-empty">Sélectionnez une zone d'abord</div>
                : places.map((place) => {
                  const p = typeof place === "string" ? place : place.name;
                  return (
                  <button
                    key={place.id ?? p}
                    className={`cm-zone-item ${(selPlace?.id ?? selPlace) === (place.id ?? p) ? "cm-zone-item--active" : ""}`}
                    onClick={() => setSelPlace(place)}
                  >
                    {(selPlace?.id ?? selPlace) === (place.id ?? p) && <span className="cm-zone-bar" />}
                    <span className="cm-zone-name">{p}</span>
                    {(selPlace?.id ?? selPlace) === (place.id ?? p) && <span className="cm-zone-check"><IconCheck /></span>}
                  </button>
                  );
                })
              }
            </div>
          </div>
        </div>

        <div className="cm-footer">
          <button className="cm-btn cm-btn--ghost"   onClick={onClose}>Annuler</button>
          <button className="cm-btn cm-btn--outline" onClick={() => { onSave(null, null); onClose(); }}>Effacer</button>
          <button className="cm-btn cm-btn--dark"    onClick={() => { onSave(selZone, selPlace); onClose(); }}>Valider</button>
        </div>
      </div>
    </div>
  );
}
