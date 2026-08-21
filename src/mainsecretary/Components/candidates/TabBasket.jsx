import { useState } from "react";
import "./TabBasket.css";

const OFFERS = [
  { id: 1, name: "FORFAIT 6H AVEC CODE INTENSIF BM",        price: 750.00,  unit: "/heure" },
  { id: 2, name: "FORFAIT 6H BM",                           price: 550.00,  unit: "/heure" },
  { id: 3, name: "FORFAIT 7H AVEC CODE INTENSIF BA",        price: 950.00,  unit: "" },
  { id: 4, name: "FORFAIT 7H BA",                           price: 750.00,  unit: "/heure" },
  { id: 5, name: "PASS RAPIDE 12H AVEC CODE INTENSIF BA",   price: 1690.00, unit: "" },
  { id: 6, name: "PASS RAPIDE 12H AVEC CODE BM",            price: 1490.00, unit: "" },
  { id: 7, name: "PACK COMPLET 20H",                        price: 2200.00, unit: "" },
];

function formatPrice(price) {
  return price.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";
}

export default function CandidateBasket({ candidateName = "ELIF ELMACIOGLU" }) {
  const [selected, setSelected] = useState([]);
  const [cart, setCart]         = useState([]);
  const [toast, setToast]       = useState(false);

  const toggleSelect = (offer) => {
    setSelected((prev) =>
      prev.find((o) => o.id === offer.id)
        ? prev.filter((o) => o.id !== offer.id)
        : [...prev, offer]
    );
  };

  const isSelected = (id) => selected.some((o) => o.id === id);

  const handleSave = () => {
    if (selected.length === 0) return;
    setCart((prev) => {
      const newItems = selected.filter((s) => !prev.find((c) => c.id === s.id));
      return [...prev, ...newItems];
    });
    setSelected([]);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((o) => o.id !== id));
  };

  const subtotal = cart.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="cb-wrapper">

      {/* ── GAUCHE : Panier ── */}
      <div className="cb-left">

        {/* Toast */}
        {toast && (
          <div className="cb-toast">
            <span className="cb-toast-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
            </span>
            <span className="cb-toast-text">Succès</span>
            <button className="cb-toast-close" onClick={() => setToast(false)}>×</button>
          </div>
        )}
        {toast && (
          <div className="cb-toast-msg">Les offres ont bien été ajoutées au panier</div>
        )}

        <div className="cb-pannier-label">Panier de {candidateName}</div>

        {cart.length === 0 ? (
          <div className="cb-empty-state">
            <div className="cb-empty-icon">
              <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="38" r="26" fill="#e8f5f0" />
                <circle cx="40" cy="38" r="18" fill="#fff" stroke="#b2dfdb" strokeWidth="1.5"/>
                <line x1="52" y1="52" x2="62" y2="62" stroke="#4caf93" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="62" cy="62" r="4" fill="#4caf93"/>
                <path d="M34 38 L38 42 L46 34" stroke="#ef5350" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="28" cy="22" r="2" fill="#b2dfdb"/>
                <circle cx="54" cy="20" r="1.5" fill="#b2dfdb"/>
                <circle cx="56" cy="48" r="1.5" fill="#b2dfdb"/>
              </svg>
            </div>
            <div className="cb-empty-title">Aucune offre dans le panier</div>
            <div className="cb-empty-sub">Veuillez sélectionner les offres à ajouter à votre panier.</div>
          </div>
        ) : (
          <>
            <div className="cb-cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cb-cart-item">
                  <div className="cb-cart-img">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 6 6m0-6-6 6"/>
                    </svg>
                  </div>
                  <div className="cb-cart-info">
                    <div className="cb-cart-name">{item.name}</div>
                    <div className="cb-cart-price">{formatPrice(item.price)}</div>
                  </div>
                  <button className="cb-remove-btn" onClick={() => removeFromCart(item.id)} title="Supprimer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cb-summary">
              <div className="cb-summary-row">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cb-summary-row">
                <span>Offres :</span>
                <span>{cart.length}</span>
              </div>
              <div className="cb-summary-total">
                <span>Total :</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Séparateur ── */}
      <div className="cb-divider" />

      {/* ── DROITE : liste des offres ── */}
      <div className="cb-right">
        <div className="cb-choose-label">Choisissez les offres à ajouter à votre panier</div>

        <div className="cb-offers-list">
          {OFFERS.map((offer) => {
            const sel    = isSelected(offer.id);
            const inCart = cart.some((c) => c.id === offer.id);
            return (
              <div
                key={offer.id}
                className={`cb-offer-row${sel ? " selected" : ""}${inCart ? " in-cart" : ""}`}
                onClick={() => !inCart && toggleSelect(offer)}
              >
                <div className="cb-offer-img">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 6 6m0-6-6 6"/>
                  </svg>
                </div>
                <div className="cb-offer-info">
                  <div className="cb-offer-name">{offer.name}</div>
                  <div className="cb-offer-price">
                    Prix : {offer.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €{offer.unit}
                  </div>
                </div>
                {(sel || inCart) && (
                  <span className="cb-offer-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          className={`cb-save-btn${selected.length > 0 ? " active" : ""}`}
          onClick={handleSave}
          disabled={selected.length === 0}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}