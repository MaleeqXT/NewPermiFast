import "./StudentOrder.css";

const ORDERS = [
  {
    id: "AD26-836VDKKU",
    offer: "Pass permis, durée d'évaluation BM",
    date: "03 Mars 2026 17:30",
    logo: "EXAMEN",
    duration: "1h",
    price: "38,00 EUR",
    status: "En attente",
    statusTone: "pending",
  },
  {
    id: "AD25-836TJSQP",
    offer: "Pass permis boîte manuelle F5",
    date: "10 Nov 2025 09:55",
    logo: "MANUELLE",
    duration: "5h",
    price: "275,00 EUR",
    status: "Payé",
    statusTone: "paid",
  },
];

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

const IconChevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

function OrderCard({ order }) {
  return (
    <article className="so-card">
      <div className="so-card-top">
        <span className="so-order-id">#{order.id}</span>
        <button className="so-arrow-btn" type="button" aria-label={`Ouvrir ${order.id}`} onClick={order.onOpen}>
          <IconChevron />
        </button>
      </div>

      <div className="so-card-main">
        <div className="so-logo-box">
          <span>{order.logo}</span>
        </div>
        <div className="so-order-copy">
          <h3 className="so-order-title">{order.offer}</h3>
          <p className="so-order-date">{order.date}</p>
        </div>
      </div>

      <div className="so-order-strip">
        <div className="so-order-cell">{order.duration}</div>
        <div className="so-order-cell">{order.price}</div>
        <div className={`so-order-cell so-order-cell--status so-order-cell--${order.statusTone}`}>{order.status}</div>
      </div>
    </article>
  );
}

export default function StudentOrder({
  onBack = () => {},
  onOpenNotifications = () => {},
  notifCount = 0,
  onOpenOrderDetail = () => {},
}) {
  return (
    <div className="so-page">
      <div className="so-hero">
        <div className="so-hero-head">
          <button className="so-back-btn" onClick={onBack} aria-label="Retour">
            <IconBack />
          </button>
          <div className="so-title-wrap">
            <h1 className="so-title">Mes commandes</h1>
            <p className="so-subtitle">Retrouvez tous vos achats en un coup d'œil.</p>
          </div>
          <button className="so-bell-btn" onClick={onOpenNotifications} aria-label="Notifications">
            <IconBell />
            <span className="so-bell-badge">{notifCount}</span>
          </button>
        </div>
      </div>

      <div className="so-list">
        {ORDERS.map((order) => (
          <OrderCard key={order.id} order={{ ...order, onOpen: () => onOpenOrderDetail(order) }} />
        ))}
      </div>
    </div>
  );
}
