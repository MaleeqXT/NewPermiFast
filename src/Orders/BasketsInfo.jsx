import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./BasketsInfo.css";
import bginfo from "../assets/bg-info.jpg";
import { fetchBasketById } from "../redux/reducers/basketsSlice";

const AVATAR_COLORS = ["#6c8ebf", "#d79b00", "#82b366", "#ae4132", "#9673a6"];

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
  </svg>
);

const IconImage = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const currency = (value) => `${Number(value ?? 0).toFixed(2).replace(".", ",")} €`;
const hours = (value) => `${Number(value ?? 0)} H`;

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function getOfferImage(media) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const path = typeof media === "string"
    ? media
    : media?.storage_media?.path ?? media?.storageMedia?.path ?? media?.path ?? media?.url;
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/storage/")) return `${baseUrl}${path}`;
  if (path.startsWith("storage/")) return `${baseUrl}/${path}`;
  return `${baseUrl}/storage/${path.replace(/^\/+/, "")}`;
}

function OfferCard({ detail, cartStatus }) {
  const offer = detail.offer ?? {};
  const quantity = Number(detail.quantity ?? 1) || 1;
  const price = Number(detail.price ?? offer.final_price ?? offer.discounted_price ?? offer.original_price ?? 0);
  const balance = Number(detail.balance ?? offer.balance ?? 0);
  const imageUrl = getOfferImage(offer.media);
  const paidAmount = Number(cartStatus) === 2 ? price * quantity : 0;

  return (
    <div className="bi-offer-card">
      <div className="bi-offer-img">
        {imageUrl ? <img src={imageUrl} alt={offer.name ?? "Offre"} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 9 }} /> : <IconImage />}
      </div>
      <div className="bi-offer-info">
        <span className="bi-offer-name">{offer.name ?? "Offre supprimée"}</span>
        <p className="bi-offer-desc">{offer.description || "Aucune description disponible."}</p>
      </div>
      <div className="bi-offer-stats">
        <div className="bi-stat-row"><span className="bi-stat-row-label">Quantité</span><span className="bi-stat-row-value">{quantity}</span></div>
        <div className="bi-stat-row"><span className="bi-stat-row-label">Solde</span><span className="bi-stat-row-value">{hours(balance * quantity)}</span></div>
        <div className="bi-stat-row"><span className="bi-stat-row-label">Tranches</span><span className="bi-stat-row-value">{detail.tranches ?? 1}</span></div>
        <div className="bi-stat-row"><span className="bi-stat-row-label">Prix de base</span><span className="bi-stat-row-value">{currency(price * quantity)}</span></div>
        <div className="bi-stat-row"><span className="bi-stat-row-label">Montant payé</span><span className="bi-stat-row-value">{currency(paidAmount)}</span></div>
      </div>
    </div>
  );
}

export default function BasketsInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBasket: cart, detailLoading, error } = useSelector((state) => state.baskets);

  useEffect(() => {
    if (id) dispatch(fetchBasketById(id));
  }, [dispatch, id]);

  if (!id) return <div className="bi-page">Sélectionnez un panier depuis la liste.</div>;
  if (detailLoading) return <div className="bi-page">Chargement du panier…</div>;
  if (error || !cart) return <div className="bi-page">Impossible de charger ce panier.</div>;

  const student = cart.student ?? {};
  const user = student.user ?? {};
  const details = cart.cart_details ?? cart.cartDetails ?? [];
  const totalAmount = details.reduce((sum, detail) => sum + (Number(detail.price ?? detail.offer?.final_price ?? detail.offer?.discounted_price ?? 0) * (Number(detail.quantity ?? 1) || 1)), 0);
  const totalBalance = details.reduce((sum, detail) => sum + (Number(detail.balance ?? detail.offer?.balance ?? 0) * (Number(detail.quantity ?? 1) || 1)), 0);
  const isPaid = Number(cart.status) === 2;
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Client";
  const statusStyle = { display: "inline-block", padding: "4px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, background: isPaid ? "#dcfce7" : "#dbeafe", color: isPaid ? "#166534" : "#1d4ed8" };

  return (
    <div className="bi-page">
      <div className="bi-header"><button className="bi-back-btn" onClick={() => navigate(-1)}><IconBack /></button><h1 className="bi-title">{fullName}</h1></div>
      <div className="bi-layout">
        <div className="bi-left">
          <div className="bi-stat-banner" style={{ backgroundImage: `url(${bginfo})` }}>
            <div className="bi-stat-item"><span className="bi-stat-label">Montant</span><span className="bi-stat-value">{currency(totalAmount)}</span></div>
            <div className="bi-stat-divider" />
            <div className="bi-stat-item"><span className="bi-stat-label">Solde</span><span className="bi-stat-value">{hours(totalBalance)}</span></div>
          </div>
          <h2 className="bi-section-title">Offres commandées</h2>
          {details.length ? details.map((detail) => <OfferCard key={detail.id} detail={detail} cartStatus={cart.status} />) : <div className="bi-offer-card">Aucune offre dans ce panier.</div>}
        </div>
        <div className="bi-right">
          <div className="bi-side-card"><h3 className="bi-side-title">Paiements</h3><div className="bi-side-row"><span className="bi-side-label">Identifiant du panier</span><span className="bi-cart-id">{cart.id}</span></div><div className="bi-side-row" style={{ marginTop: 14 }}><span className="bi-side-label">Statut du panier</span><span style={statusStyle}>{isPaid ? "Payé" : "En attente"}</span></div></div>
          <div className="bi-side-card"><h3 className="bi-side-title">Client</h3><div className="bi-customer-banner" style={{ backgroundImage: `url(${bginfo})` }}><div className="bi-banner-overlay" /><div className="bi-customer-avatar" style={{ background: AVATAR_COLORS[String(cart.id).length % AVATAR_COLORS.length], position: "relative", zIndex: 1 }}>{getInitials(user.first_name, user.last_name)}</div><span className="bi-customer-name" style={{ position: "relative", zIndex: 1 }}>{fullName}</span></div><div className="bi-side-row" style={{ marginTop: 14 }}><span className="bi-side-label">Compte créé le :</span><span className="bi-side-value">{formatDate(user.created_at)}</span></div></div>
          <div className="bi-side-card"><h3 className="bi-side-title">Coordonnées</h3><div className="bi-side-row"><span className="bi-side-label">E-mail :</span><span className="bi-side-value">{user.email || "—"}</span></div><div className="bi-side-row" style={{ marginTop: 12 }}><span className="bi-side-label">Téléphone :</span><span className="bi-side-value">{user.phone || "—"}</span></div></div>
        </div>
      </div>
    </div>
  );
}
