import { useState, useRef, useEffect } from "react";
import "./Baskets.css";
import { Link } from "react-router-dom";

const PAGE_SIZE = 15;

// ── Data ───────────────────────────────────────────────────────────────────
const INITIAL_BASKETS = [
  { id:1,  prenom:"Amir",      nom:"Nabil",      email:"nabilamirat2@gmail.com",         phone:"0623654886", offers:1, balance:"1 H",  amount:"59,00 €",    date:"16/04/2026 19:48", status:"onhold" },
  { id:2,  prenom:"Youzouria", nom:"Tamime",      email:"youzouriat@gmail.com",           phone:"0767288927", offers:0, balance:"0 H",  amount:"0,00 €",     date:"16/04/2026 15:11", status:"onhold" },
  { id:3,  prenom:"Love",      nom:"Sow",         email:"sowlaamou224@gmail.com",         phone:"0652391266", offers:1, balance:"0 H",  amount:"38,00 €",    date:"16/04/2026 14:47", status:"onhold" },
  { id:4,  prenom:"Salma",     nom:"Doghmi",      email:"doghmisalma@gmail.com",          phone:"0698564036", offers:0, balance:"0 H",  amount:"0,00 €",     date:"16/04/2026 13:21", status:"onhold" },
  { id:5,  prenom:"Lou",       nom:"Fraisse",     email:"loufraisse3@gmail.com",          phone:"0670062502", offers:1, balance:"10 H", amount:"650,00 €",   date:"16/04/2026 12:35", status:"paid"   },
  { id:6,  prenom:"DINALY",    nom:"ANTOINETTE",  email:"antoinette.dina97315@gmail.com", phone:"0642882318", offers:1, balance:"10 H", amount:"530,00 €",   date:"16/04/2026 00:24", status:"onhold" },
  { id:7,  prenom:"Ibtissane", nom:"alfa",        email:"ibtialfa69@gmail.com",           phone:"0616014808", offers:1, balance:"20 H", amount:"960,00 €",   date:"15/04/2026 17:03", status:"onhold" },
  { id:8,  prenom:"Iron",      nom:"LEPEL",       email:"lepeliron@gmail.com",            phone:"0695766770", offers:0, balance:"0 H",  amount:"0,00 €",     date:"15/04/2026 15:35", status:"onhold" },
  { id:9,  prenom:"Omar",      nom:"Dhouioui",    email:"omardh.pro@gmail.com",           phone:"0758744432", offers:0, balance:"0 H",  amount:"0,00 €",     date:"15/04/2026 14:47", status:"onhold" },
  { id:10, prenom:"Rayhana",   nom:"Daoud",       email:"rara2612204@gmail.com",          phone:"0782509667", offers:1, balance:"1 H",  amount:"38,00 €",    date:"15/04/2026 12:18", status:"paid"   },
  { id:11, prenom:"Faula",     nom:"Josue",       email:"josue.faula972@gmail.com",       phone:"",           offers:1, balance:"24 H", amount:"2790,00 €",  date:"15/04/2026 11:48", status:"onhold" },
];

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
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconDots   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconTrash  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconChevL  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey;
  const dir = sortKey?.dir;

  return (
    <button className="cand-sort-btn" type="button" onClick={() => onSort(colKey)} aria-label={`Sort by ${colKey}`}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

function parseEuroValue(value) {
  return Number(String(value || "0").replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}

function parseHoursValue(value) {
  return Number(String(value || "0").replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}

function parseDateTime(value) {
  const [datePart, timePart = "00:00"] = String(value || "").split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day, hours || 0, minutes || 0).getTime();
}

// ── Delete Modal ───────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:"16px", width:"380px", maxWidth:"95vw", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderBottom:"1px solid #f3f4f6" }}>
          <span style={{ fontSize:"16px", fontWeight:700, color:"#111827", fontFamily:"Inter,sans-serif" }}>Confirmation</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:"18px" }}>✕</button>
        </div>

        <div style={{ padding:"32px 22px", textAlign:"center" }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <p style={{ fontSize:"17px", fontWeight:700, color:"#111827", margin:"0 0 10px", fontFamily:"Inter,sans-serif" }}>
            Êtes-vous sûr ?
          </p>
          <p style={{ fontSize:"14px", color:"#6b7280", margin:0, fontFamily:"Inter,sans-serif" }}>
            Voulez-vous vraiment supprimer cette entrée ?
          </p>
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:"12px", padding:"16px 22px", background:"#f9fafb", borderTop:"1px solid #f3f4f6" }}>
          <button onClick={onClose}    style={{ padding:"10px 28px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"#fff",    color:"#374151", fontSize:"14px", fontWeight:600, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Annuler</button>
          <button onClick={onConfirm}  style={{ padding:"10px 28px", border:"none",              borderRadius:"8px", background:"#ef4444", color:"#fff",     fontSize:"14px", fontWeight:600, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>Supprimer</button>
        </div>

      </div>
    </div>
  );
}

// ── Contact cell — copy button appears on hover ────────────────────────────
function ContactCell({ email, phone }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  function copy(text, setCopied) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>

      {/* Email row */}
      <div className="basket-contact-row">
        <span style={{ fontSize:13, color:"#374151" }}>{email}</span>
        {email && (
          <button className="basket-copy-btn" onClick={() => copy(email, setCopiedEmail)}>
            {copiedEmail ? "Copié !" : "Copier"}
          </button>
        )}
      </div>

      {/* Phone row */}
      <div className="basket-contact-row">
        <span style={{ fontSize:13, color:"#f97316", fontWeight:500 }}>{phone}</span>
        {phone && (
          <button className="basket-copy-btn" onClick={() => copy(phone, setCopiedPhone)}>
            {copiedPhone ? "Copié !" : "Copier"}
          </button>
        )}
      </div>

    </div>
  );
}

// ── 3-dot row menu ────────────────────────────────────────────────────────
function RowMenu({ onDeleteRequest }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}>
        <IconDots />
      </button>
      {open && (
        <div className="cand-row-menu-dropdown">
          <button
            className="cand-row-menu-item cand-row-menu-item--danger"
            onClick={() => { setOpen(false); onDeleteRequest(); }}
          >
            <IconTrash /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Baskets() {
  const [baskets,      setBaskets]      = useState(INITIAL_BASKETS);
  const [activeTab,    setActiveTab]    = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState(null);
  const [page,         setPage]         = useState(1);

  const TABS = [
    { key:"all",    label:"Tous"        },
    { key:"onhold", label:"En attente"  },
    { key:"paid",   label:"Payé"        },
  ];

  let data = [...baskets];
  if (activeTab === "onhold") data = data.filter(b => b.status === "onhold");
  if (activeTab === "paid")   data = data.filter(b => b.status === "paid");
  if (search) {
    const query = search.toLowerCase();
    data = data.filter(b =>
      `${b.prenom} ${b.nom}`.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query)
    );
  }
  if (sort) {
    data.sort((a, b) => {
      const direction = sort.dir;
      let aValue = a[sort.key];
      let bValue = b[sort.key];

      if (sort.key === "fullName") {
        aValue = `${a.prenom} ${a.nom}`.toLowerCase();
        bValue = `${b.prenom} ${b.nom}`.toLowerCase();
      } else if (sort.key === "amount") {
        aValue = parseEuroValue(aValue);
        bValue = parseEuroValue(bValue);
      } else if (sort.key === "balance") {
        aValue = parseHoursValue(aValue);
        bValue = parseHoursValue(bValue);
      } else if (sort.key === "date") {
        aValue = parseDateTime(aValue);
        bValue = parseDateTime(bValue);
      } else if (typeof aValue === "string" || typeof bValue === "string") {
        aValue = String(aValue ?? "").toLowerCase();
        bValue = String(bValue ?? "").toLowerCase();
      }

      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * direction;
    });
  }

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const paginated  = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeTab, search, sort]);

  function handleSort(key) {
    setSort((prev) => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
  }

  function handleDeleteConfirm() {
    setBaskets(prev => prev.filter(b => b.id !== deleteTarget));
    setDeleteTarget(null);
  }

  return (
    <div className="cand-page">

      <h1 className="ord-title" style={{ marginBottom:"20px" }}>Paniers</h1>

      {/* ── Tabs + Search ── */}
      <div className="bsk-tabs-search-row">
        <div className="cand-tabs-row" style={{ marginTop:0, marginBottom:0 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`cand-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="cand-search-box bsk-search-box">
          <IconSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher des paniers..." />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="cand-table-card" style={{ marginTop:24 }}>
        <div style={{ overflowX:"auto" }}>
          <table className="cand-table">
            <thead>
              <tr>
                <th>Détail panier</th>
                <th>Nom <SortArrows sortKey={sort} colKey="fullName" onSort={handleSort} /></th>
                <th>Coordonnées</th>
                <th>Offres <SortArrows sortKey={sort} colKey="offers" onSort={handleSort} /></th>
                <th>Solde <SortArrows sortKey={sort} colKey="balance" onSort={handleSort} /></th>
                <th>Montant <SortArrows sortKey={sort} colKey="amount" onSort={handleSort} /></th>
                <th>Date <SortArrows sortKey={sort} colKey="date" onSort={handleSort} /></th>
                <th>Statut <SortArrows sortKey={sort} colKey="status" onSort={handleSort} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0
                ? <tr><td colSpan={9} className="cand-empty">Aucune entrée trouvée</td></tr>
                : paginated.map(b => (
                  <tr key={b.id}>
                    <td>
                      <Link to="/Basketsinfo">
                        <button className="cand-file-btn">Voir le dossier</button>
                      </Link>
                    </td>

                    <td>
                      <div className="cand-candidate-cell">
                        <div className="cand-avatar" style={{ background: getColor(b.id) }}>
                          {getInitials(b.prenom, b.nom)}
                        </div>
                        <span style={{ fontWeight:600, color:"#111827" }}>
                          {b.prenom} {b.nom}
                        </span>
                      </div>
                    </td>

                    <td><ContactCell email={b.email} phone={b.phone} /></td>

                    <td>{b.offers} offre{b.offers !== 1 ? "s" : ""}</td>
                    <td>{b.balance}</td>
                    <td>{b.amount}</td>
                    <td style={{ color:"#6b7280", fontSize:13, whiteSpace:"nowrap" }}>{b.date}</td>

                    <td>
                      <span style={{
                        display:"inline-block", padding:"3px 14px", borderRadius:"999px",
                        fontSize:"12px", fontWeight:700,
                        background: b.status === "paid" ? "#dcfce7" : "#dbeafe",
                        color:      b.status === "paid" ? "#166534" : "#1d4ed8",
                      }}>
                        {b.status === "paid" ? "Payé" : "En attente"}
                      </span>
                    </td>

                    <td className="cand-actions-cell">
                      <RowMenu onDeleteRequest={() => setDeleteTarget(b.id)} />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="cpf-pagination">
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.max(1, c - 1))} disabled={page === 1}>
          <IconChevL />
        </button>
        <span className="cpf-page-info">
          {data.length === 0
            ? "0 élément"
            : `${(page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, data.length)} sur ${data.length} élément${data.length > 1 ? "s" : ""}`}
        </span>
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}>
          <IconChevR />
        </button>
      </div>

      {/* ── Delete modal ── */}
      {deleteTarget !== null && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </div>
  );
}
