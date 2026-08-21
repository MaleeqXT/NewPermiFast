import { useMemo, useState } from "react";
import "./CalendarModals.css";

const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCheck = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

function getPlaceLabel(place) {
  if (!place) return "";
  if (typeof place === "string") return place;
  return place.name || place.label || place.title || "";
}

function getPlaceKey(place) {
  if (!place) return "";
  if (typeof place === "string") return place;
  return String(place.id ?? place.value ?? getPlaceLabel(place));
}

export default function ZoneModal({
  current,
  zone,
  places = [],
  loading = false,
  onSave,
  onClose,
}) {
  const initialZone = current?.zone ?? zone ?? null;
  const initialPlace = current?.place ?? null;
  const [selectedPlace, setSelectedPlace] = useState(initialPlace);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const zoneLabel = useMemo(() => {
    if (!initialZone) return "Zone sélectionnée";
    return initialZone.name ?? initialZone.label ?? "Zone sélectionnée";
  }, [initialZone]);

  const selectedPlaceKey = selectedPlace ? getPlaceKey(selectedPlace) : null;

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal cm-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <span className="cm-title">Sélectionner le lieu</span>
          <button className="cm-x" onClick={onClose}><IconX /></button>
        </div>

        <div className="cm-zone-body" style={{ minHeight: 220 }}>
          <div className="cm-zone-col" style={{ flex: 0.95 }}>
            <div className="cm-col-label">Zone active</div>
            <div className="cm-empty" style={{ paddingTop: 8 }}>
              <strong style={{ color: "#111827" }}>{zoneLabel}</strong>
              <div style={{ marginTop: 6, lineHeight: 1.5 }}>
                Le lieu affiché ici sera utilisé pour la réservation.
              </div>
            </div>
          </div>

          <div className="cm-zone-divider" />

          <div className="cm-zone-col" style={{ flex: 1.05 }}>
            <div className="cm-col-label">Lieu</div>
            <div className="cm-zone-list">
              {loading ? (
                <div className="cm-empty">Chargement des lieux...</div>
              ) : places.length === 0 ? (
                <div className="cm-empty">Aucun lieu disponible.</div>
              ) : (
                places.map((place) => {
                  const label = getPlaceLabel(place);
                  const active = selectedPlaceKey === getPlaceKey(place);

                  return (
                    <button
                      key={String(place.id ?? label)}
                      className={`cm-zone-item ${active ? "cm-zone-item--active" : ""}`}
                      onClick={() => setSelectedPlace(place)}
                    >
                      {active && <span className="cm-zone-bar" />}
                      <span className="cm-zone-name">{label}</span>
                      {active && <span className="cm-zone-check"><IconCheck /></span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="cm-footer">
          <button className="cm-btn cm-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="cm-btn cm-btn--outline"
            onClick={() => {
              onSave(initialZone, null);
              onClose();
            }}
          >
            Effacer
          </button>
          <button
            className="cm-btn cm-btn--dark"
            onClick={async () => {
              setIsSubmitting(true);
              setSubmitError("");
              try {
                await onSave?.(initialZone, selectedPlace);
                onClose?.();
              } catch (error) {
                setSubmitError(error?.message || "Impossible d'enregistrer la disponibilité.");
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting || loading || !selectedPlace}
          >
            {isSubmitting ? "Enregistrement..." : "Valider"}
          </button>
        </div>
        {submitError && <div className="cm-empty" style={{ color: "#b91c1c", padding: "0 20px 16px" }}>{submitError}</div>}
      </div>
    </div>
  );
}
