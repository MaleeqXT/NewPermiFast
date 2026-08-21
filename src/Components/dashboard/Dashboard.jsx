import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import http from "../../helpers/http.jsx";
import './Dashboard.css';

// ── Carte statistique ─────────────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div className="stat-card" style={{ padding: '50px 24px' }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, src }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="dash-avatar">
      {src
        ? <img src={src} alt={name} className="dash-avatar-img" />
        : <span className="dash-avatar-initials">{initials}</span>
      }
    </div>
  );
}

// ── Dernières réservations ────────────────────────────────────────────────────
function ReservationsTab({ groups }) {
  const navigate = useNavigate();
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Les dernières réservations</h2>
      {groups.length === 0 && <p className="cand-muted">Aucune réservation pour cette agence.</p>}
      {groups.map(group => (
        <div key={group.date} className="dash-res-group">
          <div className="dash-res-date">{group.date}</div>
          {group.items.map(item => (
            <div key={item.id} className="dash-res-row">
              {/* Avatar */}
              <div className="dash-res-avatar-wrap">
                {item.avatarSrc
                  ? <div className="dash-avatar dash-avatar--emoji">{item.avatarSrc}</div>
                  : <Avatar name={item.avatarName} />
                }
              </div>

              {/* Heure + Lieu */}
              <div className="dash-res-col dash-res-col--time">
                <span className="dash-res-time">{item.time}</span>
                <span className="dash-res-loc">{item.location}</span>
              </div>

              {/* Candidat + Moniteur */}
              <div className="dash-res-col">
                <span className="dash-res-candidate">
                  {item.label && <span className="dash-res-label">{item.label} </span>}
                  <strong>{item.candidateName}</strong>
                  {!item.label && <span className="dash-res-label"> ' réservation</span>}
                </span>
                <span className="dash-res-monitor">
                  Par <strong>{item.monitorName}</strong>
                </span>
              </div>

              {/* Lien + Offre */}
              <div className="dash-res-col dash-res-col--right">
                <a href="#" className="dash-res-link" onClick={(e) => { e.preventDefault(); navigate('/sessions'); }}>Voir toutes les réservations</a>
                <span className="dash-res-offer">Offre : {item.offer}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Dernières commandes ───────────────────────────────────────────────────────
function OrdersTab({ orders }) {
  const navigate = useNavigate();
  const IconDots = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
  const IconDetails = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;

  function RowMenu({ onPreview }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', h);
      return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
      <div className="cand-row-menu-wrapper" ref={ref}>
        <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}>
          <IconDots />
        </button>
        {open && (
          <div className="cand-row-menu-dropdown">
            <button className="cand-row-menu-item" onClick={() => { setOpen(false); onPreview?.(); }}>
              <IconDetails /> Aperçu
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="dash-section">
      <div className="dash-orders-header">
        <h2 className="dash-section-title">Les dernières commandes</h2>
        <a href="#" className="dash-see-all">Voir tout</a>
      </div>
      <div className="dash-orders-grid">
        {orders.length === 0 && <p className="cand-muted">Aucune commande payée pour cette agence.</p>}
        {orders.map(order => (
              <div key={order.id} className="dash-order-card">
            <div className="dash-order-top">
              <Avatar name={order.name} />
              <span className="dash-order-name">{order.name}</span>
              <RowMenu onPreview={() => navigate("/Basketsinfo")} />
            </div>
            <div className="dash-order-divider" />
            <div className="dash-order-row">
              <span className="dash-order-label">Date de commande</span>
              <span className="dash-order-val">{order.date}</span>
            </div>
            <div className="dash-order-row">
              <span className="dash-order-label">Montant</span>
              <strong className="dash-order-amount">{order.amount}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tableau de bord principal ─────────────────────────────────────────────────
export default function Dashboard({ tab, schools, selectedSchoolId, onSelectSchool, onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reservations");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const { data } = await http.get("/admin/dashboard", {
          params: selectedSchoolId ? { zone_id: selectedSchoolId } : undefined,
        });
        if (active) setDashboardData(data);
      } catch (requestError) {
        if (active) setError(requestError?.response?.data?.message || "Impossible de charger le tableau de bord.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboard();
    return () => { active = false; };
  }, [selectedSchoolId]);

  const stats = dashboardData?.totalPerMonth || {};
  const reservations = Object.entries(dashboardData?.lastReservations || {}).map(([date, items]) => ({
    date: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)),
    items: (items || []).map((item) => {
      const student = item.training?.student?.user;
      const monitor = item.monitor?.user;
      const start = String(item.start_at || "").slice(0, 5);
      const end = String(item.end_at || "").slice(0, 5);
      return {
        id: item.id,
        avatarName: student?.name || "Élève",
        time: `${new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${item.date}T00:00:00`))} – ${start}${end ? ` à ${end}` : ""}`,
        location: item.lieu?.name || item.lieu?.address || item.lieu?.zone?.name || "Lieu non renseigné",
        candidateName: student?.name || "Élève",
        monitorName: monitor?.name || "Moniteur non renseigné",
        offer: item.training?.offer?.name || "—",
      };
    }),
  }));
  const orders = (dashboardData?.lastCommandes || []).map((order) => ({
    id: order.id,
    name: order.student?.user?.name || "Élève",
    date: order.created_at ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.created_at)) : "—",
    amount: `${Number(order.amount || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
  }));

  const handleSelectSchool = (id) => {
    onSelectSchool(id);
    navigate("/dashboard/current");
  };

  return (
    <div>
      {/* ── En-tête ── */}
      <div className="dashboard-header" style={{fontWeight: 700, fontSize: '48px', lineHeight: '54px'}}>
        Tableau de bord
      </div>

      {/* ── Cartes statistiques ── */}
      <div className="stat-cards-grid stat-cards-grid--four">
        <StatCard label="Candidats"    value={loading ? "…" : stats.students ?? 0} />
        <StatCard label="Réservations" value={loading ? "…" : stats.reservations ?? 0} />
        <StatCard label="Commandes"    value={loading ? "…" : `${Number(stats.commmandes || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`} />
        <StatCard label="Soldes"       value={loading ? "…" : `${Number(stats.balances || 0).toLocaleString("fr-FR")} h`} />
      </div>

      {/* ── Bascule entre onglets ── */}
      <div className="tab-toggle dash-inner-toggle">
        {[
          { key: "reservations", label: "Réservations" },
          { key: "orders",       label: "Commandes"    },
        ].map(t => (
          <button
            key={t.key}
            className={`tab-btn${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Contenu de l'onglet ── */}
      {error && <p className="cand-muted" style={{ color: "#b91c1c" }}>{error}</p>}
      {activeTab === "reservations" ? <ReservationsTab groups={reservations} /> : <OrdersTab orders={orders} />}
    </div>
  );
}
