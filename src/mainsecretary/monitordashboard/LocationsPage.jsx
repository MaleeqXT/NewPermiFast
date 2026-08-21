import { useState } from "react";
import "./LocationsPage.css";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const IconChevD = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const IconSearch = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ZONES = ["Autres", "CREIL", "TOULOUSE", "SAINT-DENIS"];

const ZONE_PLACES = {
  "Autres":      [],
  "CREIL":       ["Allée Ernesto Che Guevara"],
  "TOULOUSE":    [
    "Allée Ernesto Che Guevara",
    "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro",
  ],
  "SAINT-DENIS": ["Allée Ernesto Che Guevara"],
};

function AddPlaceDrawer({ onClose, onSave, alreadyAdded }) {
  const [zone, setZone] = useState("");
  const [zoneOpen, setZoneOpen] = useState(false);
  const [checkedPlaces, setCheckedPlaces] = useState([]);

  const places = zone ? ZONE_PLACES[zone] ?? [] : [];

  function togglePlace(place) {
    setCheckedPlaces(prev =>
      prev.includes(place) ? prev.filter(p => p !== place) : [...prev, place]
    );
  }

  function handleZoneSelect(z) {
    setZone(z);
    setZoneOpen(false);
    setCheckedPlaces([]);
  }

  function handleClearZone() {
    setZone("");
    setCheckedPlaces([]);
  }

  function handleSave() {
    if (checkedPlaces.length === 0) return;
    onSave({ zone, places: checkedPlaces });
    onClose();
  }

  const canSave = checkedPlaces.length > 0;

  return (
    <>
      <div className="mp-overlay" onClick={onClose} />
      <aside className="mp-drawer">
        <div className="mp-drawer-header">
          <button className="mp-drawer-close" onClick={onClose}>Fermer</button>
          <span className="mp-drawer-title">Liste des lieux</span>
          <span style={{ width: 48 }} />
        </div>

        <div className="mp-drawer-body">
          <div className="mp-field-wrap">
            <div className="mp-field-box" onClick={() => setZoneOpen(o => !o)}>
              <div className="mp-field-inner">
                <span className="mp-field-label">Sélectionnez une zone</span>
                {zone && <span className="mp-field-value">{zone}</span>}
              </div>
              <div className="mp-field-actions">
                {zone && (
                  <button className="mp-field-clear" onClick={e => { e.stopPropagation(); handleClearZone(); }}>
                    <IconX />
                  </button>
                )}
                <span className="mp-field-chev" style={{ transform: zoneOpen ? "rotate(180deg)" : "none" }}>
                  <IconChevD />
                </span>
              </div>
            </div>

            {zoneOpen && (
              <div className="mp-zone-dropdown">
                {ZONES.map(z => (
                  <button
                    key={z}
                    className={`mp-zone-option${zone === z ? " mp-zone-option--active" : ""}`}
                    onClick={() => handleZoneSelect(z)}
                  >
                    {z}
                    {zone === z && <IconCheck />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mp-places-label">Lieux</div>

          {places.length === 0 ? (
            <div className="mp-empty-card">
              <IconSearch />
              <div className="mp-empty-title">Aucun lieu de rendez-vous</div>
              <div className="mp-empty-sub">Essayez de sélectionner ou modifier la zone</div>
            </div>
          ) : (
            <div className="mp-places-list">
              {places.map(place => {
                const isChecked = checkedPlaces.includes(place);
                const isAdded   = alreadyAdded?.some(a => a.zone === zone && a.places.includes(place));
                return (
                  <button
                    key={place}
                    className={`mp-place-row${isChecked ? " mp-place-row--checked" : ""}`}
                    onClick={() => !isAdded && togglePlace(place)}
                    disabled={isAdded}
                  >
                    <div className={`mp-place-check-box${isChecked || isAdded ? " mp-place-check-box--on" : ""}`}>
                      {(isChecked || isAdded) && <IconCheck />}
                    </div>
                    <span className="mp-place-name">{place}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mp-drawer-footer">
          <button
            className={`mp-save-btn${canSave ? " mp-save-btn--active" : ""}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            Enregistrer
          </button>
        </div>
      </aside>
    </>
  );
}

export default function MeetingPlacesPage({ onBack }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [addedZones, setAddedZones] = useState([
    { zone: "CREIL",    places: ["CREIL Agency"] },
    { zone: "TOULOUSE", places: [
      "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro",
      "32 Boulevard André Netwiller, 31200 Toulouse",
    ]},
  ]);

  function handleSave({ zone, places }) {
    setAddedZones(prev => {
      const existing = prev.find(z => z.zone === zone);
      if (existing) {
        return prev.map(z =>
          z.zone === zone ? { ...z, places: [...new Set([...z.places, ...places])] } : z
        );
      }
      return [...prev, { zone, places }];
    });
  }

  return (
    <div className="mp-page">
      <header className="mp-header">
        <button className="mp-back-btn" onClick={onBack} aria-label="Retour">
          <IconArrowLeft />
        </button>
        <h1 className="mp-title">Lieux de rendez-vous</h1>
      </header>

      <div className="mp-content">
        <div className="mp-zones-list">
          {addedZones.length === 0 ? (
            <div className="mp-no-zones">Aucun lieu de rendez-vous ajouté.</div>
          ) : (
            addedZones.map(entry => (
              <div key={entry.zone} className="mp-zone-card">
                <div className="mp-zone-card-bar" />
                <div className="mp-zone-card-body">
                  <div className="mp-zone-name">{entry.zone}</div>
                  <ul className="mp-zone-places">
                    {entry.places.map(p => (
                      <li key={p} className="mp-zone-place">{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mp-add-wrap">
          <button className="mp-add-btn" onClick={() => setShowDrawer(true)}>
            + Ajouter un lieu de rendez-vous
          </button>
        </div>
      </div>

      {showDrawer && (
        <AddPlaceDrawer
          onClose={() => setShowDrawer(false)}
          onSave={handleSave}
          alreadyAdded={addedZones}
        />
      )}
    </div>
  );
}
