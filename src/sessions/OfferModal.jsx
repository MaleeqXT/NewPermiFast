import { useMemo, useState } from "react";
import "./CalendarModals.css";

const OFFERS = [
  { id: 1, name: "Passage permis manuel F5",              balance: "0h total" },
  { id: 2, name: "Passage permis, temps bilan BM",        balance: "0h total" },
  { id: 3, name: "Test de boîte manuelle",                balance: "0h total" },
  { id: 4, name: "FORFAIT ACCÉLÉRÉ 12 HEURES",            balance: "2h total" },
  { id: 5, name: "FORFAIT 7 HEURES",                      balance: "0h total" },
  { id: 6, name: "FORFAIT ACCÉLÉRÉ 22 HEURES BA",         balance: "1h total" },
];

const IconX     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSearch= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

function normalizeOffer(offer) {
  if (!offer) return null;
  const walletBalance = offer.wallet_balance ?? offer.total_balance ?? offer.balance ?? offer.remaining ?? offer.remaining_hours ?? 0;
  return {
    ...offer,
    id: offer.id ?? offer.value ?? offer.offer_id ?? offer.offer?.id ?? offer.name ?? offer.label,
    name: offer.name ?? offer.label ?? offer.offer?.name ?? "",
    balance: walletBalance,
  };
}

export default function OfferModal({
  selected,
  items = OFFERS,
  loading = false,
  onSave,
  onClose,
  title = "Choisir l'offre",
}) {
  const [search, setSearch] = useState("");
  const [sel,    setSel]    = useState(selected ?? null);

  const normalizedItems = useMemo(
    () => items.map(normalizeOffer).filter(Boolean),
    [items]
  );

  const filtered = normalizedItems.filter((offer) =>
    offer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal" onClick={e => e.stopPropagation()}>

        <div className="cm-header">
          <span className="cm-title">{title}</span>
          <button className="cm-x" onClick={onClose}><IconX /></button>
        </div>

        <div className="cm-search-row">
          <IconSearch />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Recherche par mot-clé"
          />
        </div>

        <div className="cm-list cm-offer-list">
          {loading ? (
            <div className="cm-empty">Chargement des offres...</div>
          ) : filtered.length === 0 ? (
            <div className="cm-empty">
              {search ? "Aucune offre ne correspond à la recherche." : "Aucune offre disponible pour ce candidat."}
            </div>
          ) : (
            filtered.map((o) => (
              <button
                key={o.id}
                className={`cm-offer-item ${sel?.id === o.id ? "cm-offer-item--active" : ""}`}
                onClick={() => setSel(o)}
              >
                <div className="cm-offer-row">
                  <span className="cm-offer-name">{o.name}</span>
                  {sel?.id === o.id && <span className="cm-offer-check"><IconCheck /></span>}
                </div>
                <div className="cm-offer-sub">Solde (portefeuille) : {o.balance} h</div>
              </button>
            ))
          )}
        </div>

        <div className="cm-footer">
          <button className="cm-btn cm-btn--ghost"   onClick={onClose}>Annuler</button>
          <button className="cm-btn cm-btn--outline" onClick={() => { onSave(null); onClose(); }}>Effacer</button>
          <button className="cm-btn cm-btn--dark"    onClick={() => { onSave(sel); onClose(); }}>Valider</button>
        </div>
      </div>
    </div>
  );
}
