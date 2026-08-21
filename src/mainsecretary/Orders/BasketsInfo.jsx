import { useNavigate } from "react-router-dom";
import "./BasketsInfo.css";
import bginfo from '../assets/bg-info.jpg';

const MOCK_DETAIL = {
  id: 7,
  prenom: "Ibtissane",
  nom: "alfa",
  amount: "0 €",
  balance: "20H",
  cartId: "a18ce6f5-1c7c-40ab-b72e-047d1850c7b2",
  basketStatus: "onhold",
  accountCreated: "27 Mars 2026 16:31",
  email: "ibtialfa69@gmail.com",
  phone: "0616014808",
  offer: {
    name: "Passage permis Manuel F20",
    description:
      "Besoin de quelques heures supplémentaires de conduite en boîte manuelle ? Ou d'un forfait complet pour maîtriser la conduite ? Ce pack est fait pour vous. Pour les facilités de paiement, veuillez contacter le bureau au 09.70.70.16.16",
    balance: 0,
    tranches: 3,
    basePrice: "0,00 €",
    amountPaid: "0,00 €",
  },
};

const AVATAR_COLORS = [
  "#6c8ebf","#d79b00","#82b366","#ae4132","#9673a6",
  "#23445d","#e07a5f","#3d405b","#81b29a","#f2cc8f",
];
function getInitials(prenom, nom) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase();
}
function getColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

const IconImage = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

export default function BasketsInfo() {
  const navigate = useNavigate();
  const d = MOCK_DETAIL;

  const statusLabel = d.basketStatus === "paid" ? "Payé" : "En attente";
  const statusStyle = {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    background: d.basketStatus === "paid" ? "#dcfce7" : "#dbeafe",
    color:      d.basketStatus === "paid" ? "#166534" : "#1d4ed8",
  };

  return (
    <div className="bi-page">
      <div className="bi-header">
        <button className="bi-back-btn" onClick={() => navigate(-1)}>
          <IconBack />
        </button>
        <h1 className="bi-title">{d.prenom} {d.nom}</h1>
      </div>

      <div className="bi-layout">

        {/* ══ LEFT ══ */}
        <div className="bi-left">

          <div className="bi-stat-banner" style={{ backgroundImage: `url(${bginfo})` }}>
            <div className="bi-stat-item">
              <span className="bi-stat-label">Montant</span>
              <span className="bi-stat-value">{d.amount}</span>
            </div>
            <div className="bi-stat-divider" />
            <div className="bi-stat-item">
              <span className="bi-stat-label">Solde</span>
              <span className="bi-stat-value">{d.balance}</span>
            </div>
          </div>

          <h2 className="bi-section-title">Offres commandées</h2>

          <div className="bi-offer-card">
            <div className="bi-offer-img"><IconImage /></div>
            <div className="bi-offer-info">
              <span className="bi-offer-name">{d.offer.name}</span>
              <p className="bi-offer-desc">{d.offer.description}</p>
            </div>
            <div className="bi-offer-stats">
              {[
                { label: "Solde",         value: d.offer.balance    },
                { label: "Tranches",      value: d.offer.tranches   },
                { label: "Prix de base",  value: d.offer.basePrice  },
                { label: "Montant payé",  value: d.offer.amountPaid },
              ].map(row => (
                <div key={row.label} className="bi-stat-row">
                  <span className="bi-stat-row-label">{row.label}</span>
                  <span className="bi-stat-row-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="bi-right">

          <div className="bi-side-card">
            <h3 className="bi-side-title">Paiements</h3>
            <div className="bi-side-row">
              <span className="bi-side-label">Identifiant du panier</span>
              <span className="bi-cart-id">{d.cartId}</span>
            </div>
            <div className="bi-side-row" style={{ marginTop: 14 }}>
              <span className="bi-side-label">Statut du panier</span>
              <span style={statusStyle}>{statusLabel}</span>
            </div>
          </div>

          <div className="bi-side-card">
            <h3 className="bi-side-title">Client</h3>
            <div className="bi-customer-banner" style={{ backgroundImage: `url(${bginfo})` }}>
              <div className="bi-banner-overlay" />
              <div className="bi-customer-avatar" style={{ background: getColor(d.id), position: "relative", zIndex: 1 }}>
                {getInitials(d.prenom, d.nom)}
              </div>
              <span className="bi-customer-name" style={{ position: "relative", zIndex: 1 }}>
                {d.prenom} {d.nom}
              </span>
            </div>
            <div className="bi-side-row" style={{ marginTop: 14 }}>
              <span className="bi-side-label">Compte créé le :</span>
              <span className="bi-side-value">{d.accountCreated}</span>
            </div>
          </div>

          <div className="bi-side-card">
            <h3 className="bi-side-title">Coordonnées</h3>
            <div className="bi-side-row">
              <span className="bi-side-label">E-mail :</span>
              <span className="bi-side-value">{d.email}</span>
            </div>
            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Téléphone :</span>
              <span className="bi-side-value">{d.phone}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}