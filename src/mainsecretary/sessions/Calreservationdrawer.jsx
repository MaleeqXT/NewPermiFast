import { useState } from "react";
import { EVENT_COLORS, pad2 } from "./CalConstants.js";
import ZoneModal       from "./ZoneModal.jsx";
import CandidatesModal from "./CandidatesModal.jsx";
import MonitorsModal   from "./MonitorsModal.jsx";
import OfferModal      from "./OfferModal.jsx";

const IconLock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, verticalAlign: "middle" }}>
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function CalReservationDrawer({
  onSave, onClose,
  defaultDate, defaultHour,
  prefillZone, prefillPlace, prefillMonitor, prefillCandidate,
  zones, places, monitors, candidates, offers,
}) {
  const today = defaultDate || new Date().toISOString().split("T")[0];

  const [enabled,   setEnabled]   = useState(true);
  const [date,      setDate]      = useState(today);
  const [startTime, setStartTime] = useState(defaultHour != null ? `${pad2(defaultHour)}:00` : "");
  const [endTime,   setEndTime]   = useState(defaultHour != null ? `${pad2(defaultHour + 1)}:00` : "");

  const [zone,      setZone]      = useState(prefillZone      ?? null);
  const [place,     setPlace]     = useState(prefillPlace     ?? null);
  const [monitor,   setMonitor]   = useState(prefillMonitor   ?? null);
  const [candidate, setCandidate] = useState(prefillCandidate ?? null);
  const [offer,     setOffer]     = useState(null);
  const [color,     setColor]     = useState(EVENT_COLORS[0]);

  const [showZone,  setShowZone]  = useState(false);
  const [showCand,  setShowCand]  = useState(false);
  const [showMon,   setShowMon]   = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [errors,    setErrors]    = useState({});
  const [saveError, setSaveError] = useState("");
  const [isSaving,  setIsSaving]  = useState(false);

  const placeUnlocked     = !!zone;
  const monitorUnlocked   = !!zone && !!place;
  const candidateUnlocked = monitorUnlocked && !!monitor;
  const offerUnlocked     = candidateUnlocked && !!candidate;
  const colorUnlocked     = offerUnlocked && !!offer;

  function clearError(key) { setErrors(p => { const n = {...p}; delete n[key]; return n; }); }

  function validate() {
    const e = {};
    if (!date)      e.date      = "La date est requise";
    if (!startTime) e.startTime = "L'heure de début est requise";
    if (!endTime)   e.endTime   = "L'heure de fin est requise";
    if (!zone)      e.zone      = "La zone est requise";
    if (!place)     e.place     = "Le lieu est requis";
    if (!monitor)   e.monitor   = "Le moniteur est requis";
    if (!candidate) e.candidate = "Le candidat est requis";
    if (!offer)     e.offer     = "L'offre est requise";
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaveError("");
    setIsSaving(true);
    try {
      await onSave({ enabled, date, startTime, endTime, zone, place, monitor, candidate, offer, color });
      onClose();
    } catch (error) {
      const payload = error ?? {};
      const fieldErrors = payload.errors ?? {};
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])));
      setSaveError(payload.message ?? "La réservation n'a pas pu être enregistrée.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="cal-drawer-overlay" onClick={onClose} />
      <div className="cal-drawer">

        {/* En-tête */}
        <div className="cal-drawer-header">
          <button className="cal-drawer-close" onClick={onClose}>Fermer</button>
          <span className="cal-drawer-title">Nouvelle réservation</span>
          <span style={{ width: 50 }} />
        </div>

        <div className="cal-drawer-body">

          {/* Bascule activer */}
          <div className="cal-toggle-row">
            <span className="cal-drawer-label">Activer</span>
            <label className="cal-ios-toggle">
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
              <span className="cal-ios-track" /><span className="cal-ios-thumb" />
            </label>
          </div>

          {/* Date */}
          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">Date de la leçon</label>
            <input
              className="cal-drawer-input"
              type="date"
              value={date}
              onChange={e => { setDate(e.target.value); clearError("date"); }}
              style={{ borderColor: errors.date ? "#dc2626" : "" }}
            />
            {errors.date && <span className="cal-field-error">{errors.date}</span>}
          </div>

          {/* Heure début + fin */}
          <div className="cal-drawer-two-col">
            <div className="cal-drawer-field">
              <label className="cal-drawer-field-label">Heure de début</label>
              <input
                className="cal-drawer-input"
                type="time"
                value={startTime}
                onChange={e => { setStartTime(e.target.value); clearError("startTime"); }}
                style={{ borderColor: errors.startTime ? "#dc2626" : "" }}
              />
              {errors.startTime && <span className="cal-field-error">{errors.startTime}</span>}
            </div>
            <div className="cal-drawer-field">
              <label className="cal-drawer-field-label">Heure de fin</label>
              <input
                className="cal-drawer-input"
                type="time"
                value={endTime}
                onChange={e => { setEndTime(e.target.value); clearError("endTime"); }}
                style={{ borderColor: errors.endTime ? "#dc2626" : "" }}
              />
              {errors.endTime && <span className="cal-field-error">{errors.endTime}</span>}
            </div>
          </div>

          {/* Zone + Lieu */}
          <div className="cal-drawer-two-col">
            <div className="cal-drawer-field">
              <label className="cal-drawer-field-label">Zone</label>
              <button
                className="cal-drawer-select"
                onClick={() => setShowZone(true)}
                style={{ borderColor: errors.zone ? "#dc2626" : "" }}
              >
                {zone ? zone.name : "Sélectionner une zone"}
              </button>
              {errors.zone && <span className="cal-field-error">{errors.zone}</span>}
            </div>
            <div className="cal-drawer-field">
              <label className="cal-drawer-field-label">
                Lieu {!placeUnlocked && <IconLock />}
              </label>
              <button
                className={`cal-drawer-select${!placeUnlocked ? " cal-drawer-select--disabled" : ""}`}
                onClick={() => placeUnlocked && setShowZone(true)}
                style={{ borderColor: errors.place ? "#dc2626" : "" }}
              >
                {place?.name ?? place ?? "Sélectionner un lieu"}
              </button>
              {errors.place && <span className="cal-field-error">{errors.place}</span>}
            </div>
          </div>

          {/* Moniteur */}
          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">
              Moniteur {!monitorUnlocked && <IconLock />}
            </label>
            <button
              className={`cal-drawer-select cal-drawer-select--full${!monitorUnlocked ? " cal-drawer-select--disabled" : ""}`}
              onClick={() => monitorUnlocked && setShowMon(true)}
              style={{ borderColor: errors.monitor ? "#dc2626" : "" }}
            >
              {monitor ? monitor.name : "Sélectionner un moniteur"}
            </button>
            {errors.monitor && <span className="cal-field-error">{errors.monitor}</span>}
          </div>

          {/* Candidat */}
          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">
              Candidat {!candidateUnlocked && <IconLock />}
            </label>
            <button
              className={`cal-drawer-select cal-drawer-select--full${!candidateUnlocked ? " cal-drawer-select--disabled" : ""}`}
              onClick={() => candidateUnlocked && setShowCand(true)}
              style={{ borderColor: errors.candidate ? "#dc2626" : "" }}
            >
              {candidate?.name ?? candidate ?? "Sélectionner un candidat"}
            </button>
            {errors.candidate && <span className="cal-field-error">{errors.candidate}</span>}
          </div>

          {/* Offre */}
          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">
              Offre {!offerUnlocked && <IconLock />}
            </label>
            <button
              className={`cal-drawer-select cal-drawer-select--full${!offerUnlocked ? " cal-drawer-select--disabled" : ""}`}
              onClick={() => offerUnlocked && setShowOffer(true)}
              style={{ borderColor: errors.offer ? "#dc2626" : "" }}
            >
              {offer ? offer.name : "Sélectionner une offre"}
            </button>
            {errors.offer && <span className="cal-field-error">{errors.offer}</span>}
          </div>

          {/* Couleur */}
          <div className="cal-drawer-field" style={{ opacity: colorUnlocked ? 1 : 0.45 }}>
            <label className="cal-drawer-field-label">
              Couleur {!colorUnlocked && <IconLock />}
            </label>
            <div className="cal-color-row">
              {EVENT_COLORS.map(c => (
                <button
                  key={c}
                  className={`cal-color-dot ${color === c ? "cal-color-dot--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => colorUnlocked && setColor(c)}
                  disabled={!colorUnlocked}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Pied */}
        <div className="cal-drawer-footer">
          {saveError && <span className="cal-field-error">{saveError}</span>}
          <button className="cal-btn cal-btn--ghost cal-btn--md" onClick={onClose}>Annuler</button>
          <button className="cal-btn cal-btn--green cal-btn--md" onClick={handleSave} disabled={isSaving}>{isSaving ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </div>

      {showZone  && <ZoneModal       current={{ zone, place }} zones={zones} places={places} onSave={(z,p) => { setZone(z); setPlace(p); clearError("zone"); clearError("place"); }} onClose={() => setShowZone(false)} />}
      {showCand  && <CandidatesModal selected={candidate ? [candidate] : []} candidates={candidates} onSave={n => { setCandidate(n[0] ?? null); clearError("candidate"); }} onClose={() => setShowCand(false)} />}
      {showMon   && <MonitorsModal   selected={monitor ? [monitor] : []} monitors={monitors} onSave={m => { setMonitor(m[0] ?? null); clearError("monitor");   }} onClose={() => setShowMon(false)}  />}
      {showOffer && <OfferModal      selected={offer} offers={offers} onSave={o => { setOffer(o); clearError("offer"); }} onClose={() => setShowOffer(false)} />}
    </>
  );
}
