import "./StudentOfferDetail.css";

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const DEFAULT_ORDER = {
  id: "AD25-836TJSQP",
  offer: "Pass permis Manuelle F5",
  description:
    "Besoin de quelques heures en plus en boîte manuelle ? Ou d'un pack complet pour bien maîtriser la conduite ? Ce pack vous conviendra parfaitement.",
  balance: "5h",
  total: "275,00 EUR",
  purchaseDate: "10 Nov 2025",
  paymentMethod: "Stripe",
  paymentType: "Par 3 tranches",
  paymentStatus: "Payé",
};

function DetailRow({ label, value, tone = "default" }) {
  return (
    <div className="sod-row">
      <span className="sod-row-label">{label}</span>
      <span className={`sod-row-value${tone !== "default" ? ` sod-row-value--${tone}` : ""}`}>{value}</span>
    </div>
  );
}

export default function StudentOfferDetail({
  order = DEFAULT_ORDER,
  onBack = () => {},
  onOpenNotifications = () => {},
  notifCount = 0,
}) {
  return (
    <div className="sod-page">
      <div className="sod-hero">
        <div className="sod-hero-head">
          <button className="sod-back-btn" onClick={onBack} aria-label="Retour">
            <IconBack />
          </button>
          <h1 className="sod-title">L&apos;achat de votre offre</h1>
          <button className="sod-bell-btn" onClick={onOpenNotifications} aria-label="Notifications">
            <IconBell />
            <span className="sod-bell-badge">{notifCount}</span>
          </button>
        </div>
      </div>

      <div className="sod-header-card">
        <span className="sod-order-pill">ID: {order.id}</span>
        <h2 className="sod-offer-name">{order.offer}</h2>
        <p className="sod-offer-description">{order.description}</p>
      </div>

      <div className="sod-balance-card">
        <div className="sod-balance-block">
          <span className="sod-balance-label">Solde</span>
          <strong className="sod-balance-value">{order.balance}</strong>
        </div>
        <div className="sod-balance-block sod-balance-block--right">
          <span className="sod-balance-label">Total</span>
          <strong className="sod-balance-value">{order.total}</strong>
        </div>
      </div>

      <div className="sod-details-card">
        <h3 className="sod-section-title">Détails</h3>
        <div className="sod-details-list">
          <DetailRow label="Date d'achat" value={order.purchaseDate} />
          <DetailRow label="Mode de paiement" value={order.paymentMethod} />
          <DetailRow label="Type de paiement" value={order.paymentType} />
          <DetailRow label="Statut du paiement" value={order.paymentStatus} tone="paid" />
        </div>
      </div>

      <button className="sod-download-btn">Télécharger ma facture</button>
    </div>
  );
}
