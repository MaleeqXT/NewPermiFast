import { useState, useRef, useEffect } from "react";
import "./CpfForm.css";

// ── Icons ─────────────────────────────────────────────────────────────────
const IconX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCheck    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(123, 156, 239)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSearchSm = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconChevUD   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>;

const OFFERS = [
  "FORFAIT 7 HEURES",
  "FORFAIT RAPIDE 12 HEURES",
  "FORFAIT RAPIDE 15 HEURES",
  "FORFAIT RAPIDE 22 HEURES",
  "FORFAIT RAPIDE 27 HEURES",
  "FORFAIT RAPIDE 32 HEURES",
  "FORFAIT RAPIDE 37 HEURES",
  "FORFAIT 6 HEURES",
  "FORFAIT ACCÉLÉRÉ 12 HEURES",
];

// ── Offer Dropdown ────────────────────────────────────────────────────────
function OfferDropdown({ value, onChange }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = OFFERS.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="cpf-offer-wrapper" ref={ref}>
      <button className="cpf-offer-trigger" onClick={() => setOpen(o => !o)} type="button">
        <span className={value ? "cpf-offer-value" : "cpf-offer-placeholder"}>
          {value || "Offre"}
        </span>
        <IconChevUD />
      </button>
      {open && (
        <div className="cpf-offer-dropdown">
          <div className="cpf-offer-search">
            <IconSearchSm />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une offre…"
            />
          </div>
          <div className="cpf-offer-list">
            {filtered.map(o => (
              <button
                key={o}
                className={`cpf-offer-option ${value === o ? "cpf-offer-option--active" : ""}`}
                onClick={() => { onChange(o); setOpen(false); setSearch(""); }}
                type="button"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Single Reservation Block ──────────────────────────────────────────────
function ReservationBlock({ index, data, onChange, onDelete, canDelete }) {
  function set(field, val) { onChange({ ...data, [field]: val }); }
  return (
    <div className="cpf-reservation">
      <div className="cpf-reservation-header">
        <span className="cpf-reservation-title">Réservation {index + 1}</span>
        {canDelete && (
          <button className="cpf-res-del-btn" type="button" onClick={onDelete}>
            Supprimer
          </button>
        )}
      </div>

      <div className="cpf-res-field">
        <label className="cpf-res-label">Date</label>
        <input type="date" className="cpf-res-input" value={data.date || ""} onChange={e => set("date", e.target.value)} />
      </div>

      <div className="cpf-res-field">
        <label className="cpf-res-label">Durée (heures)</label>
        <input
          type="number" min="1" className="cpf-res-input"
          value={data.duration || ""}
          onChange={e => set("duration", e.target.value)}
        />
      </div>

      <div className="cpf-res-field">
        <label className="cpf-res-label">Heure de début</label>
        <input type="time" className="cpf-res-input" value={data.startTime || ""} onChange={e => set("startTime", e.target.value)} />
      </div>

      <div className="cpf-res-field">
        <label className="cpf-res-label">Heure de fin</label>
        <input type="time" className="cpf-res-input" value={data.endTime || ""} onChange={e => set("endTime", e.target.value)} />
      </div>
    </div>
  );
}

// ── CpfDrawer ─────────────────────────────────────────────────────────────
export default function CpfDrawer({ row, onSave, onClose }) {
  const [cpfNumber,    setCpfNumber]    = useState(row?.cpfNumber || "");
  const [boxType,      setBoxType]      = useState(row?.boxType   || "");
  const [offer,        setOffer]        = useState(row?.offer     || "");
  const [reservations, setReservations] = useState(
    row?.reservationList?.length
      ? row.reservationList
      : [{ id: Date.now(), date: "", duration: "", startTime: "", endTime: "" }]
  );

  function newBlank() { return { id: Date.now(), date: "", duration: "", startTime: "", endTime: "" }; }
  function addReservation()          { setReservations(prev => [...prev, newBlank()]); }
  function deleteReservation(id)     { setReservations(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev); }
  function deleteAll()               { setReservations([newBlank()]); }
  function updateReservation(id, data) { setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r)); }

  function handleSave() {
    onSave({ cpfNumber, boxType, offer, reservationList: reservations });
  }

  return (
    <>
      <div className="cpf-drawer-overlay" onClick={onClose} />
      <div className="cpf-drawer">

        {/* En-tête */}
        <div className="cpf-drawer-header">
          <span className="cpf-drawer-title">Modification CPF</span>
          <button className="cpf-drawer-x" onClick={onClose}><IconX /></button>
        </div>

        {/* Corps défilable */}
        <div className="cpf-drawer-body">

          {/* Numéro CPF */}
          <div className="cpf-float-field">
            <input
              className="cpf-float-input"
              id="cpf-num-input"
              type="text"
              placeholder=" "
              value={cpfNumber}
              onChange={e => setCpfNumber(e.target.value)}
            />
            <label className="cpf-float-label" htmlFor="cpf-num-input">Numéro de dossier CPF</label>
          </div>

          {/* Type de boîte */}
          <div className="cpf-section-title">Type de boîte</div>
          <div className="cpf-boxtype-list">
            {[
              { key: "Manuel",     label: "Manuelle"    },
              { key: "Automatic",  label: "Automatique" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`cpf-boxtype-btn ${boxType === key ? "cpf-boxtype-btn--active" : ""}`}
                onClick={() => setBoxType(prev => prev === key ? "" : key)}
              >
                {boxType === key && <span className="cpf-boxtype-bar" />}
                <span className="cpf-boxtype-name">{label}</span>
                {boxType === key && <IconCheck />}
              </button>
            ))}
          </div>

          {/* Offre */}
          <OfferDropdown value={offer} onChange={setOffer} />

          {/* Réservations */}
          {reservations.map((res, i) => (
            <ReservationBlock
              key={res.id}
              index={i}
              data={res}
              onChange={data => updateReservation(res.id, data)}
              onDelete={() => deleteReservation(res.id)}
              canDelete={reservations.length > 1}
            />
          ))}

          {/* Ajouter + Tout supprimer */}
          <div className="cpf-res-actions-row">
            <button className="cpf-res-add-btn"       type="button" onClick={addReservation}>Ajouter</button>
            <button className="cpf-res-deleteall-btn" type="button" onClick={deleteAll}>Tout supprimer</button>
          </div>

        </div>

        {/* Pied de page */}
        <div className="cpf-drawer-footer">
          <button className="cpf-footer-btn cpf-footer-btn--cancel" onClick={onClose}>Fermer</button>
          <button className="cpf-footer-btn cpf-footer-btn--save"   onClick={handleSave}>Enregistrer</button>
        </div>

      </div>
    </>
  );
}