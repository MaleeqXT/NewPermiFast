import { useNavigate } from "react-router-dom";
import "./BasketsInfo.css"; // reuse same CSS — all bi- classes work here too
import bginfo from '../assets/bg-info.jpg';

// ── Mock data matching screenshot (order #AD26-17702WKIO) ──────────────────
const MOCK_ORDER = {
  id: 1,
  ref: "#AD26-17702WKIO",
  status: "paid",
  amountPaid: "650 €",
  remainingBalance: "10H",
  orderNumber: "AD26-17702WKIO",
  paymentId: "pi_3TMnI1DzZwr8lCPs2ujBlpFb",
  paymentMethod: "Stripe",
  paymentStatus: "paid",
  amount: "650 €",
  balance: "10 H",
  customer: {
    prenom: "Lou",
    nom: "Fraisse",
    accountCreated: "July 17, 2025 2:34 PM",
    email: "loufraisse3@gmail.com",
    phone: "0670062502",
  },
  offer: {
    name: "Manual F10 driving licence pass",
    description:
      "Need a few extra hours with a manual transmission? Or a complete package to master driving? This package will suit you perfectly.",
    remainingBalance: 10,
    tranches: 2,
    basePrice: "650,00 €",
    amountPaidTotal: "650,00 €",
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

// ── Icons ──────────────────────────────────────────────────────────────────
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

export default function OrdersInfo({ onBack }) {
  const navigate = useNavigate();
  const d = MOCK_ORDER;
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };
  const openOfferInfo = () => navigate("/offersinfo", { state: { fromOrderDetail: true } });

  // Status badge config — reused from Orders.jsx pattern
  const STATUS_CONFIG = {
    paid:     { label: "Paid",     bg: "#16a34a", color: "#fff" },
    on_hold:  { label: "On hold",  bg: "#f59e0b", color: "#fff" },
    refunded: { label: "Refunded", bg: "#6b7280", color: "#fff" },
    canceled: { label: "Canceled", bg: "#dc2626", color: "#fff" },
  };
  const sc = STATUS_CONFIG[d.status] || STATUS_CONFIG.paid;
  const psc = STATUS_CONFIG[d.paymentStatus] || STATUS_CONFIG.paid;

  return (
    <div className="bi-page">

      {/* ── Header: back + ref + status badge ── */}
      <div className="bi-header">
        <button className="bi-back-btn" onClick={handleBack}>
          <IconBack />
        </button>
        <h1 className="bi-title">{d.ref}</h1>
        {/* Status badge inline in header — same style as Orders table */}
        <span style={{
          display: "inline-block", padding: "4px 14px", borderRadius: "999px",
          fontSize: "13px", fontWeight: 700,
          background: sc.bg, color: sc.color,
        }}>
          {sc.label}
        </span>
      </div>

      {/* ── Two-column layout — reused from BasketsInfo ── */}
      <div className="bi-layout">

        {/* ══ LEFT ══ */}
        <div className="bi-left">

          {/* Dark image banner — Amount paid + Remaining balance */}
          <div className="bi-stat-banner" style={{ backgroundImage: `url(${bginfo})` }}>
            <div className="bi-stat-item">
              <span className="bi-stat-label">Amount paid</span>
              <span className="bi-stat-value">{d.amountPaid}</span>
            </div>
            <div className="bi-stat-divider" />
            <div className="bi-stat-item">
              <span className="bi-stat-label">Remaining balance</span>
              <span className="bi-stat-value">{d.remainingBalance}</span>
            </div>
          </div>

          {/* Ordered offers */}
          <button type="button" className="bi-section-title" onClick={openOfferInfo} style={{ background:"none", border:0, padding:0, cursor:"pointer", textAlign:"left" }}>
            Offres commandées
          </button>

          <div className="bi-offer-card">
            <div className="bi-offer-img"><IconImage /></div>

            {/* Left: name + description + Repay button */}
            <div className="bi-offer-info">
              <button type="button" className="bi-offer-name" onClick={openOfferInfo} style={{ background:"none", border:0, padding:0, cursor:"pointer", textAlign:"left" }}>{d.offer.name}</button>
              <p className="bi-offer-desc">{d.offer.description}</p>
              {/* Repay button — red, matches screenshot */}
              <button
                style={{
                  marginTop: 12,
                  padding: "7px 20px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  width: "fit-content",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
                onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}
              >
                Repay
              </button>
            </div>

            {/* Right: stats */}
            <div className="bi-offer-stats">
              {[
                { label: "Remaining balance",   value: d.offer.remainingBalance  },
                { label: "Tranches",             value: d.offer.tranches          },
                { label: "Base price",           value: d.offer.basePrice         },
                { label: "Amount paid (total)",  value: d.offer.amountPaidTotal   },
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

          {/* Payments card — more fields than BasketsInfo */}
          <div className="bi-side-card">
            <h3 className="bi-side-title">Payments</h3>

            <div className="bi-side-row">
              <span className="bi-side-label">Order number</span>
              <span className="bi-side-value" style={{ fontWeight: 600 }}>{d.orderNumber}</span>
            </div>

            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Payment ID</span>
              <span className="bi-cart-id">{d.paymentId}</span>
            </div>

            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Payment Method</span>
              <span className="bi-side-value" style={{ fontWeight: 700 }}>{d.paymentMethod}</span>
            </div>

            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Payment Status</span>
              <span style={{
                display: "inline-block", padding: "3px 14px", borderRadius: "999px",
                fontSize: "12px", fontWeight: 700,
                background: psc.bg, color: psc.color,
                width: "fit-content",
              }}>
                {psc.label}
              </span>
            </div>

            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Amount paid</span>
              <span className="bi-side-value">{d.amount}</span>
            </div>

            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Remaining balance</span>
              <span className="bi-side-value">{d.balance}</span>
            </div>
          </div>

          {/* Customer card — image bg, same as BasketsInfo */}
          <div className="bi-side-card">
            <h3 className="bi-side-title">Customer</h3>

            <div className="bi-customer-banner" style={{ backgroundImage: `url(${bginfo})` }}>
              <div className="bi-banner-overlay" />
              <div className="bi-customer-avatar"
                style={{ background: getColor(d.id), position: "relative", zIndex: 1 }}>
                {getInitials(d.customer.prenom, d.customer.nom)}
              </div>
              <span className="bi-customer-name" style={{ position: "relative", zIndex: 1 }}>
                {d.customer.prenom} {d.customer.nom}
              </span>
            </div>

            <div className="bi-side-row" style={{ marginTop: 14 }}>
              <span className="bi-side-label">Account created:</span>
              <span className="bi-side-value">{d.customer.accountCreated}</span>
            </div>
          </div>

          {/* Contact card */}
          <div className="bi-side-card">
            <h3 className="bi-side-title">Contact Informations</h3>
            <div className="bi-side-row">
              <span className="bi-side-label">Email :</span>
              <span className="bi-side-value">{d.customer.email}</span>
            </div>
            <div className="bi-side-row" style={{ marginTop: 12 }}>
              <span className="bi-side-label">Phone :</span>
              <span className="bi-side-value">{d.customer.phone}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
