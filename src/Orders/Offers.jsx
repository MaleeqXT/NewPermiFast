import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteOffer, fetchOffers } from "../redux/reducers/offerSlice";
const BASE_URL = import.meta.env.VITE_API_URL;

const IconSearch    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconPlus      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconDots      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconArchive   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
const IconUnarchive = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconTrash     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconChevL     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

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

function getOfferImageUrl(media) {
  const path = media?.storage_media?.path ?? media?.storageMedia?.path ?? media?.path;
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/storage/")) return `${BASE_URL}${path}`;
  if (path.startsWith("storage/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/storage/${path.replace(/^\/+/, "")}`;
}

// ── Delete Modal ───────────────────────────────────────────────────────────
function DeleteModal({ offer, onConfirm, onClose, deleting }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:"16px", width:"380px", maxWidth:"95vw", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderBottom:"1px solid #f3f4f6" }}>
          <span style={{ fontSize:"16px", fontWeight:700, color:"#111827", fontFamily:"Inter,sans-serif" }}>Confirmation</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:"18px" }}>✕</button>
        </div>
        <div style={{ padding:"32px 22px", textAlign:"center" }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
            <rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>
          </svg>
          <p style={{ fontSize:"17px", fontWeight:700, color:"#111827", margin:"0 0 10px", fontFamily:"Inter,sans-serif" }}>
            Êtes-vous sûr ?
          </p>
          <p style={{ fontSize:"14px", color:"#6b7280", margin:0, lineHeight:1.6, fontFamily:"Inter,sans-serif" }}>
            Voulez-vous vraiment <strong style={{ color:"#ef4444" }}>supprimer définitivement</strong> l'offre{" "}
            <strong style={{ color:"#ef4444" }}>{offer?.name}</strong> ?
            <br /><span style={{ fontSize:"12px", color:"#9ca3af" }}>Cette action est irréversible.</span>
          </p>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:"12px", padding:"16px 22px", background:"#f9fafb", borderTop:"1px solid #f3f4f6" }}>
          <button disabled={deleting} onClick={onClose} style={{ padding:"10px 28px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"#fff", color:"#374151", fontSize:"14px", fontWeight:600, cursor: deleting ? "not-allowed" : "pointer", fontFamily:"Inter,sans-serif" }}>Fermer</button>
          <button disabled={deleting} onClick={onConfirm} style={{ padding:"10px 28px", border:"none", borderRadius:"8px", background:"#ef4444", color:"#fff", fontSize:"14px", fontWeight:600, cursor: deleting ? "not-allowed" : "pointer", fontFamily:"Inter,sans-serif" }}>{deleting ? "Suppression..." : "Oui, confirmer"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Row Menu ───────────────────────────────────────────────────────────────
function RowMenu({ offer, onArchive, onUnarchive, onDeleteRequest }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isArchived = offer.tab === "archived";
  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen(o => !o)}><IconDots /></button>
      {open && (
        <div className="cand-row-menu-dropdown">
          {isArchived
            ? <button className="cand-row-menu-item" onClick={() => { setOpen(false); onUnarchive(offer.id); }}><IconUnarchive /> Désarchiver</button>
            : <button className="cand-row-menu-item cand-row-menu-item--danger" onClick={() => { setOpen(false); onArchive(offer.id); }}><IconArchive /> Archiver</button>
          }
          <div className="cand-row-menu-divider" />
          <button className="cand-row-menu-item cand-row-menu-item--danger" onClick={() => { setOpen(false); onDeleteRequest(offer); }}><IconTrash /> Supprimer définitivement</button>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Offers({ selectedSchoolId }) {
    const dispatch = useDispatch();
  const { list: offers, loading, deleting, error, activeCount, archiveCount, allCount, cpfCount, cart_count, currentPage, lastPage, total, perPage } = useSelector(state => state.offers);

  // const [offers,       setOffers]       = useState(INITIAL_OFFERS);
  const [activeTab,    setActiveTab]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sort,         setSort]         = useState(null);
  const [page,         setPage]         = useState(1);
  const [refreshKey,   setRefreshKey]   = useState(0);


  //   useEffect(() => {
  //   dispatch(fetchOffers());
  // }, [dispatch]);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

useEffect(() => {
    const params = {};
    if (activeTab === "active")   params.status = "1";
    if (activeTab === "archived") params.status = "0";
    if (activeTab === "cpf")      params.is_cpf = 1;
    if (activeTab === "pannier")  params.is_cart = 1;
    if (debouncedSearch) params.search = debouncedSearch;
    params.page = page;
    
    const request = dispatch(fetchOffers(params));

    // Abort the previous tab/zone request. A slow old response can therefore
    // never replace the data for the tab the user has just selected.
    return () => request.abort();
}, [dispatch, activeTab, debouncedSearch, page, selectedSchoolId, refreshKey]);


  const TABS = [
    { key:"all",      label:"Toutes",   count: allCount      },
    { key:"active",   label:"Actives",   count: activeCount  },
    { key:"archived", label:"Archivées", count: archiveCount },
    { key:"cpf",      label:"CPF",       count: cpfCount     },
    { key:"pannier",  label:"Panier",    count: cart_count   },
  ];

  // const counts = {
  //   active:   offers.filter(o => o.tab === "active").length,
  //   archived: offers.filter(o => o.tab === "archived").length,
  //   cpf:      offers.filter(o => o.tab === "cpf").length,
  //   pannier:  offers.filter(o => o.tab === "pannier").length,
  // };

  // let data = offers.filter(o => o.tab === activeTab);
  let data = [...offers];
if (search) data = data.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

// let data = [...offers];

// if (activeTab === "active")   data = data.filter(o => o.status === true && o.is_cpf == 0 && o.is_offer_cart == false);
// if (activeTab === "archived") data = data.filter(o => o.deleted_at !== null);
// if (activeTab === "cpf")      data = data.filter(o => o.is_cpf == 1);
// if (activeTab === "pannier")  data = data.filter(o => o.is_offer_cart == true);

  if (search) data = data.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
  if (sort) {
    data.sort((a, b) => {
      const direction = sort.dir;
      let aValue = a[sort.key];
      let bValue = b[sort.key];

      if (["crielPrize", "toulousePrize", "originalPrice"].includes(sort.key)) {
        aValue = parseEuroValue(aValue);
        bValue = parseEuroValue(bValue);
      } else if (sort.key === "tranche") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else {
        aValue = String(aValue ?? "").toLowerCase();
        bValue = String(bValue ?? "").toLowerCase();
      }

      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * direction;
    });
  }
  const totalPages = Math.max(1, lastPage);
  const paginated  = data;

  useEffect(() => { setPage(1); }, [selectedSchoolId]);

  function handleSort(key) {
    setSort((prev) => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
  }

  function handleArchive(id)    { console.log('archive', id); }
function handleUnarchive(id)  { console.log('unarchive', id); }
async function handleDeleteConfirm() {
  if (!deleteTarget || deleting) return;

  try {
    await dispatch(deleteOffer(deleteTarget.id)).unwrap();
    setDeleteTarget(null);
    setRefreshKey((key) => key + 1);
  } catch {
    // The slice stores the API error, which is shown above the table.
  }
}

  // function handleArchive(id)   { setOffers(prev => prev.map(o => o.id === id ? { ...o, tab:"archived" } : o)); }
  // function handleUnarchive(id) { setOffers(prev => prev.map(o => o.id === id ? { ...o, tab:"active"   } : o)); }
  // function handleDeleteConfirm() {
  //   setOffers(prev => prev.filter(o => o.id !== deleteTarget.id));
  //   setDeleteTarget(null);
  // }

  return (
    <div className="cand-page">

      <h1 className="ord-title" style={{ marginBottom:"20px" }}>Offres</h1>

      {/* ── Toolbar ── */}
      <div className="cand-toolbar">
        <div className="cand-search-box" style={{ width:"100%" }}>
          <IconSearch />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher des offres..." />
        </div>
        <Link to="/offersform" style={{ textDecoration:"none" }}>
          <button className="cand-btn-dark"><IconPlus /> Nouvelle offre</button>
        </Link>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        <div className="cand-tabs-row" style={{ margin:0 }}>
          {TABS.map(tab => (
            <button key={tab.key} className={`cand-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => { setActiveTab(tab.key); setPage(1); }}>
              {tab.label}
              {/* {counts[tab.key] > 0 && <span className="cand-tab-count">{counts[tab.key]}</span>} 
              */}
              {tab.count > 0 && <span className="cand-tab-count">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {error && (
        <div className="cand-muted" style={{ color:"#dc2626", marginBottom:12 }}>
          {error.message ?? "Impossible de charger les offres."}
        </div>
      )}
      <div className="cand-table-card">
        <div style={{ overflowX:"auto" }}>
          <table className="cand-table">
            <thead>
              <tr>
                <th>Détail offre</th>
                <th>Offre <SortArrows sortKey={sort} colKey="name" onSort={handleSort} /></th>
                <th>Prize <SortArrows sortKey={sort} colKey="crielPrize" onSort={handleSort} /></th>
                <th>Balance <SortArrows sortKey={sort} colKey="balanceCreil" onSort={handleSort} /></th>
                
                <th>Prix de base <SortArrows sortKey={sort} colKey="toulousePrize" onSort={handleSort} /></th>
                <th>Réduction <SortArrows sortKey={sort} colKey="balanceToulouse" onSort={handleSort} /></th>

                <th>Prix original <SortArrows sortKey={sort} colKey="originalPrice" onSort={handleSort} /></th>
                <th>Remise <SortArrows sortKey={sort} colKey="discount" onSort={handleSort} /></th>
                <th>Tranche <SortArrows sortKey={sort} colKey="tranche" onSort={handleSort} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr><td colSpan="10" className="cand-muted" style={{ textAlign:"center", padding:24 }}>Chargement des offres...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="10" className="cand-muted" style={{ textAlign:"center", padding:24 }}>Aucune offre trouvée.</td></tr>
            ) : paginated.map(offer => (
    <tr key={offer.id}>
        <td>
           <Link to={`/offersinfo/edit/${offer.id}`} state={{ offer }}>
            <button className="cand-file-btn">Voir le dossier</button>
        </Link>
        </td>
        <td>
            <div className="cand-candidate-cell">
              <div style={{ width:34, height:34, borderRadius:8, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                {getOfferImageUrl(offer.media)
                  ? <img 
                      src={getOfferImageUrl(offer.media)}
                      alt={offer.name}
                      style={{ width:34, height:34, borderRadius:8, objectFit:"cover" }}
                    />
                  : "🚗"
                }
              </div>
                <span style={{ color:"#2563eb", fontWeight:500 }}>
                    {offer.name}
                </span>
            </div>
        </td>
        <td>{offer.price_ht ? `${offer.price_ht} €` : <span className="cand-muted">—</span>}</td>
        <td>{offer.balance  ? `${offer.balance} H`  : <span className="cand-muted">—</span>}</td>
        <td>{offer.original_price    ? `${offer.original_price} €`    : <span className="cand-muted">—</span>}</td>
        <td>{offer.discounted_price  ? `${offer.discounted_price} €`  : <span className="cand-muted">—</span>}</td>
        <td>{offer.final_price       ? `${offer.final_price} €`       : <span className="cand-muted">—</span>}</td>
        <td>{offer.second_price      ? `${offer.second_price} €`      : <span className="cand-muted">—</span>}</td>
        <td>{offer.multi_payment || <span className="cand-muted">—</span>}</td>
        <td className="cand-actions-cell">
            <RowMenu offer={offer} onArchive={handleArchive} onUnarchive={handleUnarchive} onDeleteRequest={setDeleteTarget} />
        </td>
    </tr>
))}
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
          {total === 0
            ? "0 élément"
            : `${(currentPage - 1) * perPage + 1} - ${Math.min(currentPage * perPage, total)} sur ${total} élément${total > 1 ? "s" : ""}`}
        </span>
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}>
          <IconChevR />
        </button>
      </div>

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal offer={deleteTarget} onConfirm={handleDeleteConfirm} onClose={() => setDeleteTarget(null)} deleting={deleting} />
      )}

    </div>
  );
}
