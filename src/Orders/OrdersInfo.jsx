import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./BasketsInfo.css";
import bginfo from "../assets/bg-info.jpg";
import { fetchOrderById } from "../redux/reducers/ordersSlice";

const STATUS = {
  1: { label: "En attente", bg: "#f59e0b", color: "#fff" },
  2: { label: "Payé", bg: "#16a34a", color: "#fff" },
  3: { label: "Remboursé", bg: "#6b7280", color: "#fff" },
  4: { label: "Annulé", bg: "#dc2626", color: "#fff" },
};
const IconBack = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>;
const IconImage = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const euro = (value) => `${Number(value ?? 0).toFixed(2).replace(".", ",")} €`;
const h = (value) => `${Number(value ?? 0)} H`;

function mediaUrl(media) {
  const base = import.meta.env.VITE_API_URL;
  const path = typeof media === "string" ? media : media?.storage_media?.path ?? media?.storageMedia?.path ?? media?.path;
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return path.startsWith("/storage/") ? `${base}${path}` : `${base}/storage/${path.replace(/^storage\//, "")}`;
}

function Offer({ detail, status }) {
  const offer = detail.offer ?? {};
  const quantity = Number(detail.quantity ?? 1) || 1;
  const price = Number(detail.price ?? offer.final_price ?? offer.discounted_price ?? offer.original_price ?? 0);
  const balance = Number(detail.balance ?? offer.balance ?? 0);
  const image = mediaUrl(offer.media);
  return <div className="bi-offer-card">
    <div className="bi-offer-img">{image ? <img src={image} alt={offer.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:9 }} /> : <IconImage />}</div>
    <div className="bi-offer-info"><span className="bi-offer-name">{offer.name ?? "Offre supprimée"}</span><p className="bi-offer-desc">{offer.description || "Aucune description disponible."}</p></div>
    <div className="bi-offer-stats">
      <div className="bi-stat-row"><span className="bi-stat-row-label">Quantité</span><span className="bi-stat-row-value">{quantity}</span></div>
      <div className="bi-stat-row"><span className="bi-stat-row-label">Solde</span><span className="bi-stat-row-value">{h(balance * quantity)}</span></div>
      <div className="bi-stat-row"><span className="bi-stat-row-label">Tranches</span><span className="bi-stat-row-value">{detail.tranches ?? 1}</span></div>
      <div className="bi-stat-row"><span className="bi-stat-row-label">Prix de base</span><span className="bi-stat-row-value">{euro(price * quantity)}</span></div>
      <div className="bi-stat-row"><span className="bi-stat-row-label">Montant payé</span><span className="bi-stat-row-value">{euro(Number(status) === 2 ? price * quantity : 0)}</span></div>
    </div>
  </div>;
}

export default function OrdersInfo({ onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: sale, detailLoading, error } = useSelector((state) => state.orders);
  useEffect(() => { if (id) dispatch(fetchOrderById(id)); }, [dispatch, id]);
  if (!id) return <div className="bi-page">Sélectionnez une commande depuis la liste.</div>;
  if (detailLoading) return <div className="bi-page">Chargement de la commande…</div>;
  if (error || !sale) return <div className="bi-page">Impossible de charger cette commande.</div>;

  const user = sale.student?.user ?? {};
  const details = sale.cart?.cart_details ?? sale.cart?.cartDetails ?? [];
  const totalBalance = details.reduce((total, detail) => total + Number(detail.balance ?? detail.offer?.balance ?? 0) * (Number(detail.quantity ?? 1) || 1), 0);
  const status = STATUS[sale.payment_status] ?? STATUS[1];
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Client";
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
  const back = () => onBack ? onBack() : navigate(-1);

  return <div className="bi-page">
    <div className="bi-header"><button className="bi-back-btn" onClick={back}><IconBack /></button><h1 className="bi-title">{sale.reference || sale.payment_id || "Commande"}</h1><span style={{ display:"inline-block", padding:"4px 14px", borderRadius:999, fontSize:13, fontWeight:700, background:status.bg, color:status.color }}>{status.label}</span></div>
    <div className="bi-layout"><div className="bi-left">
      <div className="bi-stat-banner" style={{ backgroundImage:`url(${bginfo})` }}><div className="bi-stat-item"><span className="bi-stat-label">Montant payé</span><span className="bi-stat-value">{euro(sale.amount)}</span></div><div className="bi-stat-divider"/><div className="bi-stat-item"><span className="bi-stat-label">Solde restant</span><span className="bi-stat-value">{h(totalBalance)}</span></div></div>
      <h2 className="bi-section-title">Offres commandées</h2>
      {details.length ? details.map((detail) => <Offer key={detail.id} detail={detail} status={sale.payment_status} />) : <div className="bi-offer-card">Aucune offre associée à cette commande.</div>}
    </div><div className="bi-right">
      <div className="bi-side-card"><h3 className="bi-side-title">Paiement</h3><div className="bi-side-row"><span className="bi-side-label">Numéro de commande</span><span className="bi-side-value">{sale.reference || "—"}</span></div><div className="bi-side-row" style={{ marginTop:12 }}><span className="bi-side-label">Payment ID</span><span className="bi-cart-id">{sale.payment_id || "—"}</span></div><div className="bi-side-row" style={{ marginTop:12 }}><span className="bi-side-label">Méthode</span><span className="bi-side-value">{sale.payment_method || "—"}</span></div><div className="bi-side-row" style={{ marginTop:12 }}><span className="bi-side-label">Statut</span><span style={{ padding:"3px 14px", borderRadius:999, fontSize:12, fontWeight:700, background:status.bg, color:status.color }}>{status.label}</span></div></div>
      <div className="bi-side-card"><h3 className="bi-side-title">Client</h3><div className="bi-customer-banner" style={{ backgroundImage:`url(${bginfo})` }}><div className="bi-banner-overlay"/><div className="bi-customer-avatar" style={{ background:"#6c8ebf", position:"relative", zIndex:1 }}>{initials}</div><span className="bi-customer-name" style={{ position:"relative", zIndex:1 }}>{fullName}</span></div></div>
      <div className="bi-side-card"><h3 className="bi-side-title">Coordonnées</h3><div className="bi-side-row"><span className="bi-side-label">E-mail</span><span className="bi-side-value">{user.email || "—"}</span></div><div className="bi-side-row" style={{ marginTop:12 }}><span className="bi-side-label">Téléphone</span><span className="bi-side-value">{user.phone || "—"}</span></div></div>
    </div></div>
  </div>;
}
