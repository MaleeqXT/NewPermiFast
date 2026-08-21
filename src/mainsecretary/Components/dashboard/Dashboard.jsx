import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
const RESERVATION_GROUPS = [
  {
    date: "13 mai 2026",
    items: [
      {
        id: 1,
        avatarName: "Léa Loubradou Mendes",
        time: "13 mai 2026 – 13h00 à 14h00",
        location: "À Toulouse, au McDonald's Les Arènes, sur le trottoir à la sortie du métro",
        candidateName: "Léa Loubradou Mendes",
        monitorName: "Samira Geoffroy",
        offer: "Permis de conduire manuel F10 Pass",
      },
      {
        id: 2,
        avatarName: "CJ",
        time: "13 mai 2026 – 09h00 à 17h00",
        location: "À Creil, Agence de Creil",
        candidateName: "Holiday Holiday",
        label: "Réservation",
        monitorName: "Soumaya EL AMMARI",
        offer: "FORFAIT BM RAPIDE 42H",
      },
      {
        id: 3,
        avatarName: "KAMARA HEAVENIE",
        avatarSrc: "🦊",
        time: "13 mai 2026 – 08h00 à 09h00",
        location: "À Toulouse, au McDonald's Les Arènes, sur le trottoir à la sortie du métro",
        candidateName: "KAMARA HEAVENIE",
        label: "Réservation de",
        monitorName: "Mohamed Megnouche",
        offer: "FORFAIT BM 6H",
      },
    ],
  },
];

function ReservationsTab({ onNavigate }) {
  const navigate = useNavigate();
  const goToSessions = () => {
    if (onNavigate) {
      onNavigate("/sessions");
      return;
    }
    navigate("/sessions");
  };

  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Les dernières réservations</h2>
      {RESERVATION_GROUPS.map(group => (
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
                <a href="#" className="dash-res-link" onClick={(e) => { e.preventDefault(); goToSessions(); }}>Voir toutes les réservations</a>
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
const ORDERS = [
  { id: 1, name: "Lou Fraisse",   date: "16/04/2026 12:36", amount: "650,00 €" },
  { id: 2, name: "Rayhana Daoud", date: "15/04/2026 17:12", amount: "38,00 €"  },
  { id: 3, name: "Samuel Rougé",  date: "15/04/2026 15:22", amount: "350,00 €" },
];

function OrdersTab({ onNavigate }) {
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
            <button className="cand-row-menu-item" onClick={() => { setOpen(false); if (typeof onPreview === 'function') onPreview(); }}>
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
        {ORDERS.map(order => (
              <div key={order.id} className="dash-order-card">
            <div className="dash-order-top">
              <Avatar name={order.name} />
              <span className="dash-order-name">{order.name}</span>
              <RowMenu onPreview={() => onNavigate?.("/Basketsinfo")} />
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

  const handleSelectSchool = (id) => {
    onSelectSchool(id);
    if (onNavigate) {
      onNavigate("/dashboard/current");
      return;
    }
    navigate("/dashboard/current");
  };

  return (
    <div>
      {/* ── En-tête ── */}
      <div className="dashboard-header">
        Bienvenue AZdmin Raza
      </div>

      {/* ── Cartes statistiques ── */}
      <div className="stat-cards-grid stat-cards-grid--four">
        <StatCard label="Candidats"    value={61}         />
        <StatCard label="Réservations" value={698}        />
        <StatCard label="Commandes"    value="36 840,97"  />
        <StatCard label="Soldes"       value={3380}       />
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
      {activeTab === "reservations" ? <ReservationsTab onNavigate={onNavigate} /> : <OrdersTab onNavigate={onNavigate} />}
    </div>
  );
}
