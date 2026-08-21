import { useState, useRef, useEffect } from "react";
import bginfo from "../assets/bg-info.jpg";
import "./Orders.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/reducers/ordersSlice";

const PAGE_SIZE = 15;

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;
const IconX        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconChevronL = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevronR = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconChevronD = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const IconDots     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconInvoice  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;

// ── Sort arrows ───────────────────────────────────────────────────────────────
function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLE_ORDERS = [
  { id:1, ref:"#AD26-17702WKIO", createdAt:"2026-04-16T12:36:00", candidate:"Lou Fraisse",    total:650,  status:"paid",     goods:"1 Offre"  },
  { id:2, ref:"#AD26-3066QQMKP", createdAt:"2026-04-15T17:12:00", candidate:"Rayhana Daoud",  total:38,   status:"paid",     goods:"2 Offres" },
  { id:3, ref:"#AD26-3013Q5LXX", createdAt:"2026-04-15T15:22:00", candidate:"Samuel Rougé",   total:350,  status:"paid",     goods:"6 Offres" },
  { id:4, ref:"#AD26-2954OIDUF", createdAt:"2026-04-15T12:42:00", candidate:"Faula Josue",    total:930,  status:"paid",     goods:"1 Offre"  },
  { id:5, ref:"#AD26-2954WQOQK", createdAt:"2026-04-15T12:40:00", candidate:"Faula Josue",    total:930,  status:"paid",     goods:"1 Offre"  },
  { id:6, ref:"#AD26-1234ABCDE", createdAt:"2026-05-03T09:15:00", candidate:"Marc Dupont",    total:120,  status:"on_hold",  goods:"1 Offre"  },
  { id:7, ref:"#AD26-5678FGHIJ", createdAt:"2026-05-05T14:20:00", candidate:"Léa Martin",     total:480,  status:"refunded", goods:"3 Offres" },
  { id:8, ref:"#AD26-9012KLMNO", createdAt:"2026-05-01T11:00:00", candidate:"Pierre Bernard", total:75,   status:"canceled", goods:"1 Offre"  },
];

const STATUS_CONFIG = {
  paid:     { label:"Payé",      bg:"#16a34a", color:"#fff" },
  on_hold:  { label:"En attente", bg:"#f59e0b", color:"#fff" },
  refunded: { label:"Remboursé", bg:"#6b7280", color:"#fff" },
  canceled: { label:"Annulé",    bg:"#dc2626", color:"#fff" },
};

const MONTHS   = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const WEEKDAYS = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

const fmtDate     = d   => d ? `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}` : "—";
const fmtDateTime = iso => { const d = new Date(iso); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };

// ── Date Range Picker ─────────────────────────────────────────────────────────
function DateRangePicker({ startDate, endDate, onChange, onClose, alignLeft }) {
  const today = new Date();
  const [vYear,  setVYear]  = useState(today.getFullYear());
  const [vMonth, setVMonth] = useState(today.getMonth());
  const [sel,    setSel]    = useState(null);

  const left  = { year: vYear, month: vMonth };
  const rNext = new Date(vYear, vMonth + 1, 1);
  const right = { year: rNext.getFullYear(), month: rNext.getMonth() };

  const getDays = (y, m) => {
    const first = new Date(y, m, 1).getDay();
    const off   = first === 0 ? 6 : first - 1;
    const total = new Date(y, m + 1, 0).getDate();
    const days  = Array(off).fill(null);
    for (let d = 1; d <= total; d++) days.push(new Date(y, m, d));
    return days;
  };

  const click = (date) => {
    if (!date) return;
    if (!sel) { setSel(date); onChange(date, null); }
    else { const [s,e] = date < sel ? [date,sel] : [sel,date]; onChange(s,e); setSel(null); }
  };

  const isS  = d => d && startDate && d.toDateString() === startDate.toDateString();
  const isE  = d => d && endDate   && d.toDateString() === endDate.toDateString();
  const isIR = d => d && startDate && endDate && d > startDate && d < endDate;
  const isT  = d => d && d.toDateString() === today.toDateString();

  const prev = () => vMonth===0 ? (setVYear(y=>y-1), setVMonth(11)) : setVMonth(m=>m-1);
  const next = () => vMonth===11? (setVYear(y=>y+1), setVMonth(0))  : setVMonth(m=>m+1);

  const preset = (p) => {
    const n = new Date(); n.setHours(0,0,0,0);
    if      (p==="today")     onChange(n, n);
    else if (p==="7days")     { const s=new Date(n); s.setDate(s.getDate()-6); onChange(s,n); }
    else if (p==="thismonth") onChange(new Date(n.getFullYear(),n.getMonth(),1), new Date(n.getFullYear(),n.getMonth()+1,0));
    else if (p==="lastmonth") onChange(new Date(n.getFullYear(),n.getMonth()-1,1), new Date(n.getFullYear(),n.getMonth(),0));
    setSel(null);
  };

  const renderGrid = ({ year, month }, isLeft) => (
    <div className="ord-picker-cal">
      {isLeft  && <button className="ord-picker-nav ord-picker-nav--left"  onClick={prev}><IconChevronL /></button>}
      {!isLeft && <button className="ord-picker-nav ord-picker-nav--right" onClick={next}><IconChevronR /></button>}
      <div className="ord-picker-month-title">{MONTHS[month]} <span>{year}</span></div>
      <div className="ord-picker-day-headers">
        {WEEKDAYS.map(d => <div key={d} className="ord-picker-day-header">{d}</div>)}
      </div>
      <div className="ord-picker-day-grid">
        {getDays(year, month).map((date, i) => {
          const s=isS(date), e=isE(date), ir=isIR(date), t=isT(date);
          return (
            <button key={i} className="ord-picker-day-btn" onClick={() => click(date)} style={{
              cursor:     date ? "pointer" : "default",
              background: (s||e) ? "#4a9eff" : ir ? "rgba(74,158,255,0.2)" : "transparent",
              color:      (s||e) ? "#fff" : date ? (t?"#4a9eff":"#e5e7eb") : "transparent",
              fontWeight: (s||e||t) ? 700 : 400,
              outline:    (t&&!s&&!e) ? "1.5px solid #4a9eff" : "none",
            }}>{date?.getDate()}</button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`ord-picker-dropdown${alignLeft ? " ord-picker-dropdown--left" : ""}`}>
      <div className="ord-picker-inner">
        <div className="ord-picker-presets">
          {[
            ["today",     "Aujourd'hui"],
            ["7days",     "7 derniers jours"],
            ["thismonth", "Ce mois-ci"],
            ["lastmonth", "Mois dernier"],
          ].map(([k,l]) => (
            <button key={k} className="ord-picker-preset-btn" onClick={() => preset(k)}>{l}</button>
          ))}
        </div>
        <div className="ord-picker-calendars">
          {renderGrid(left,  true)}
          {renderGrid(right, false)}
        </div>
      </div>
      <div className="ord-picker-footer">
        <span className="ord-picker-footer-label">{fmtDate(startDate)} au {fmtDate(endDate)}</span>
        <div className="ord-picker-footer-actions">
          <button className="ord-picker-cancel-btn"  onClick={onClose}>Annuler</button>
          <button className="ord-picker-confirm-btn" onClick={onClose}>Valider</button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, amount, count, countLabel, comparison, periodLabel, isLoss = false }) {
  const danger = count > 0 && (countLabel === "Ventes annulées" || countLabel === "Ventes remboursées");
  const percent = Number(comparison?.perecent ?? 0);
  const difference = Number(comparison?.value ?? 0);
  const hasChange = percent !== 0;
  const isImprovement = isLoss ? percent < 0 : percent > 0;
  const trend = hasChange ? (percent > 0 ? "↓" : "↑") : "–";
  const trendClass = !hasChange ? "ord-stat-pct--neutral" : isImprovement ? "ord-stat-pct--positive" : "ord-stat-pct--negative";
  const signedDifference = `${difference > 0 ? "+" : ""}${difference.toFixed(2).replace(".", ",")} €`;
  return (
    <div className="ord-stat-card" style={{ backgroundImage:`url(${bginfo})` }}>
      <div className="ord-stat-overlay" />
      <div className="ord-stat-body">
        <div className="ord-stat-top">
          <span className="ord-stat-label">{label}</span>
          <span className={`ord-stat-pct ${trendClass}`}>{trend} {Math.abs(percent).toFixed(2).replace(".00", "")}%</span>
        </div>
        <div className="ord-stat-amount">{amount.toFixed(2).replace(".",",")} €</div>
        <div className="ord-stat-sub">{signedDifference} vs. les {periodLabel}</div>
        <div className="ord-stat-footer">
          <span className="ord-stat-footer-label">{countLabel}</span>
          <span className={`ord-stat-footer-count ${danger ? "ord-stat-footer-count--danger" : "ord-stat-footer-count--normal"}`}>{count}</span>
        </div>
      </div>
    </div>
  );
}

// ── Row Menu ──────────────────────────────────────────────────────────────────
function RowMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
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
            className="cand-row-menu-item"
            onClick={() => { setOpen(false); navigate("/invoice"); }}
          >
            <IconInvoice /> Télécharger la facture
          </button>
        </div>
      )}
    </div>
  );
}

// ── Payment Dropdown ──────────────────────────────────────────────────────────
function PaymentDropdown({ value, onChange }) {
  const [open,     setOpen]     = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const options = ["Stripe", "PayPal"];

  return (
    <div className="ord-datepicker-anchor" ref={ref}>
      <button className="ord-date-btn" onClick={() => setOpen(o => !o)}>
        {value ?? "Paiement"}
        <IconChevronD />
        {value && (
          <button className="ord-date-btn-clear" onClick={e => { e.stopPropagation(); onChange(null); }}>
            <IconX />
          </button>
        )}
      </button>
      {open && (
        <div className="ord-payment-dropdown">
          {options.map(opt => (
            <button
              key={opt}
              className={`ord-payment-option ${value === opt ? "ord-payment-option--active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key:"all",      label:"Tous"        },
  { key:"on_hold",  label:"En attente"  },
  { key:"paid",     label:"Payé"        },
  { key:"refunded", label:"Remboursé"   },
  { key:"canceled", label:"Annulé"      },
  { key:"auto",     label:"Auto"        },
  { key:"bm",       label:"BM"          },
];

const NO_FILTER_TABS = new Set(["all", "auto", "bm"]);

// ── Main ──────────────────────────────────────────────────────────────────────
const SALE_STATUS = { 1: "on_hold", 2: "paid", 3: "refunded", 4: "canceled", 5: "refunded" };
const toApiDate = (date, endOfDay = false) => {
  if (!date) return undefined;
  const copy = new Date(date);
  if (endOfDay) copy.setHours(23, 59, 59, 999);
  const pad = (value) => String(value).padStart(2, "0");
  return `${copy.getFullYear()}-${pad(copy.getMonth() + 1)}-${pad(copy.getDate())} ${pad(copy.getHours())}:${pad(copy.getMinutes())}:${pad(copy.getSeconds())}`;
};

function normaliseSale(sale) {
  const user = sale.student?.user ?? {};
  // Laravel serializes the relation as `cart_details`; retain the camelCase
  // fallback so all valid sale payloads render their offer count.
  const details = sale.cart?.cart_details ?? sale.cart?.cartDetails ?? [];
  const offerCount = details.length;
  return {
    ...sale,
    ref: sale.reference ?? sale.payment_id ?? "—",
    createdAt: sale.created_at,
    candidate: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.name || "—",
    total: Number(sale.amount ?? 0),
    status: SALE_STATUS[sale.payment_status] ?? String(sale.payment_status ?? "").toLowerCase(),
    goods: `${offerCount} Offre${offerCount > 1 ? "s" : ""}`,
    isAuto: details.some((detail) => Number(detail.offer?.is_auto) === 1),
  };
}

export default function Orders({ selectedSchoolId }) {
  const dispatch = useDispatch();
  const { list: sales, stats, statsComparison, counts: apiCounts, currentPage, lastPage, total, loading, error } = useSelector((state) => state.orders);
  const today = new Date(); today.setHours(0,0,0,0);
  const mStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const mEnd   = new Date(today.getFullYear(), today.getMonth()+1, 0);

  const [cardS, setCardS] = useState(mStart);
  const [cardE, setCardE] = useState(mEnd);
  const [cardOpen, setCardOpen] = useState(false);
  const cardRef = useRef(null);

  const [tabS, setTabS] = useState(null);
  const [tabE, setTabE] = useState(null);
  const [tabOpen, setTabOpen] = useState(false);
  const tabRef = useRef(null);

  const [activeTab,  setActiveTab]  = useState("all");
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState(null);
  const [page,       setPage]       = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    const status = { on_hold: 1, paid: 2, refunded: 3, canceled: 4 }[activeTab];
    dispatch(fetchOrders({
      page, search: search || undefined, status, method: paymentMethod || undefined,
      start: toApiDate(tabS), end: toApiDate(tabE, true), zone_id: selectedSchoolId || undefined,
      stats_start: toApiDate(cardS), stats_end: toApiDate(cardE, true),
    }));
  }, [dispatch, page, search, activeTab, paymentMethod, tabS, tabE, cardS, cardE, selectedSchoolId]);

  useEffect(() => {
    const h = e => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setCardOpen(false);
      if (tabRef.current  && !tabRef.current.contains(e.target))  setTabOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSort = key => setSort(p => p?.key===key ? {key, dir:p.dir*-1} : {key, dir:1});

  const paidTotal = Number(stats.paid_revenue ?? 0);
  const pendingTotal = Number(stats.pending_revenue ?? 0);
  const cancelledTotal = Number(stats.canceled_revenue ?? 0);
  const refundedTotal = Number(stats.refunded_revenue ?? 0);
  const paidSales = Number(stats.paid_sales ?? 0);
  const pendingSales = Number(stats.pending_sales ?? 0);
  const cancelledSales = Number(stats.canceled_sales ?? 0);
  const refundedSales = Number(stats.refunded_sales ?? 0);

  let tableData = sales.map(normaliseSale);
  if (activeTab === "auto") tableData = tableData.filter((order) => order.isAuto);
  if (activeTab === "bm") tableData = tableData.filter((order) => !order.isAuto);
  if (sort) tableData.sort((a,b) => { const av=a[sort.key],bv=b[sort.key]; return (av<bv?-1:av>bv?1:0)*sort.dir; });
  const totalPages = lastPage ?? 1;
  const paginated = tableData;

  useEffect(() => { setPage(1); }, [activeTab, search, sort, tabS, tabE]);

  const counts = {
    all:      apiCounts.countAll ?? total,
    on_hold:  apiCounts.onHold_Count ?? 0,
    paid:     apiCounts.paid_Count ?? 0,
    refunded: apiCounts.refunded_count ?? 0,
    canceled: apiCounts.canceled_count ?? 0,
    auto:     apiCounts.countAll ?? total,
    bm:       apiCounts.countAll ?? total,
  };

  const cardLabel = cardS && cardE
    ? `${fmtDate(cardS)} au ${fmtDate(cardE)}`
    : "Filtrer les cartes par date";
  const cardPeriodDays = cardS && cardE ? Math.max(0, Math.round((cardE - cardS) / 86400000)) : 30;
  const comparisonPeriod = cardPeriodDays > 60
    ? `${(cardPeriodDays / 30).toFixed(1)} derniers mois`
    : `${cardPeriodDays} derniers jours`;

  return (
    <div className="cand-page">

      {/* ── Header ── */}
      <div className="ord-header">
        <h1 className="ord-title">Commandes</h1>
        <div className="ord-datepicker-anchor" ref={cardRef}>
          <button className="ord-date-btn" onClick={() => setCardOpen(o=>!o)}>
            <IconCalendar /> {cardLabel}
            {(cardS||cardE) && (
              <button className="ord-date-btn-clear" onClick={e=>{e.stopPropagation();setCardS(null);setCardE(null);}}>
                <IconX />
              </button>
            )}
          </button>
          {cardOpen && (
            <DateRangePicker
              startDate={cardS} endDate={cardE}
              onChange={(s,e)=>{setCardS(s);setCardE(e);}}
              onClose={()=>setCardOpen(false)}
              alignLeft={false}
            />
          )}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="ord-stats-row">
        <StatCard label="Revenus encaissés"   amount={paidTotal}      count={paidSales}      countLabel="Ventes payées"      comparison={statsComparison.paid_revenue}     periodLabel={comparisonPeriod} />
        <StatCard label="Revenus en attente"  amount={pendingTotal}   count={pendingSales}   countLabel="Ventes en attente"  comparison={statsComparison.pending_revenue}  periodLabel={comparisonPeriod} />
        <StatCard label="Revenus annulés"     amount={cancelledTotal} count={cancelledSales} countLabel="Ventes annulées"    comparison={statsComparison.canceled_revenue} periodLabel={comparisonPeriod} isLoss />
        <StatCard label="Revenus remboursés"  amount={refundedTotal}  count={refundedSales}  countLabel="Ventes remboursées" comparison={statsComparison.refunded_revenue} periodLabel={comparisonPeriod} isLoss />
      </div>

      {/* ── Tabs + Search ── */}
      <div className="ord-tabs-search-row">
        <div className="cand-tabs-row">
          {TABS.map(tab => (
            <button key={tab.key} className={`cand-tab ${activeTab===tab.key?"active":""}`} onClick={()=>setActiveTab(tab.key)}>
              {tab.label}
              {counts[tab.key] > 0 && <span className="cand-tab-count">{counts[tab.key]}</span>}
            </button>
          ))}
        </div>
        <div className="cand-search-box ord-search-box">
          <IconSearch />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher des commandes..." />
        </div>
      </div>

      {/* ── Under-tabs filters ── */}
      <div className="ord-under-tabs-row">
        <div className="ord-datepicker-anchor" ref={tabRef}>
          <button className="ord-date-btn" onClick={() => setTabOpen(o=>!o)}>
            <IconCalendar />
            {tabS && tabE ? `${fmtDate(tabS)} au ${fmtDate(tabE)}` : "Filtrer par date"}
            {(tabS||tabE) && (
              <button className="ord-date-btn-clear" onClick={e=>{e.stopPropagation();setTabS(null);setTabE(null);}}>
                <IconX />
              </button>
            )}
          </button>
          {tabOpen && (
            <DateRangePicker
              startDate={tabS} endDate={tabE}
              onChange={(s,e)=>{setTabS(s);setTabE(e);}}
              onClose={()=>setTabOpen(false)}
              alignLeft={true}
            />
          )}
        </div>
        <PaymentDropdown value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      {/* ── Table ── */}
      <div className="cand-table-card">
        <table className="cand-table">
          <thead>
            <tr>
              <th>Détail commande</th>
              <th>Détail candidat</th>
              <th>Réf. <SortArrows sortKey={sort} colKey="ref" onSort={handleSort} /></th>
              <th>Date de création <SortArrows sortKey={sort} colKey="createdAt" onSort={handleSort} /></th>
              <th>Candidat <SortArrows sortKey={sort} colKey="candidate" onSort={handleSort} /></th>
              <th>Total <SortArrows sortKey={sort} colKey="total" onSort={handleSort} /></th>
              <th>Statut</th>
              <th>Offres</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={9} className="cand-empty">Chargement des commandes…</td></tr>
              : error
                ? <tr><td colSpan={9} className="cand-empty">Impossible de charger les commandes.</td></tr>
              : paginated.length === 0
              ? <tr><td colSpan={9} className="cand-empty">Aucune commande trouvée</td></tr>
              : paginated.map(o => {
                  const sc = STATUS_CONFIG[o.status] || STATUS_CONFIG.paid;
                  const initials = o.candidate.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
                  return (
                    <tr key={o.id}>
                      <td>
                        <Link to={`/orders/info/${o.id}`} state={{ sale: o }} style={{ textDecoration:"none" }}>
                          <button className="cand-file-btn">Voir le dossier</button>
                        </Link>
                      </td>
                      <td>
                        <Link to={`/candidate-info/${o.student?.id}`} state={{ candidate: o.student?.user }} style={{ textDecoration:"none" }}>
                          <button className="cand-file-btn cand-file-btn--alt">Voir le dossier</button>
                        </Link>
                      </td>
                      <td><button className="ord-ref-link">{o.ref}</button></td>
                      <td>{fmtDateTime(o.createdAt)}</td>
                      <td>
                        <div className="cand-candidate-cell">
                          <div className="cand-avatar" style={{background:"#6c8ebf",fontSize:11}}>{initials}</div>
                          <span className="cand-candidate-name">{o.candidate}</span>
                        </div>
                      </td>
                      <td style={{fontWeight:600}}>{o.total.toFixed(2).replace(".",",")} €</td>
                      <td>
                        <span className="ord-status-badge" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                      </td>
                      <td>
                        <span className="cand-place-badge" style={{background:"#6b7280"}}>{o.goods}</span>
                      </td>
                      <td className="cand-actions-cell"><RowMenu /></td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="cpf-pagination">
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.max(1, c - 1))} disabled={page === 1}>
          <IconChevronL />
        </button>
        <span className="cpf-page-info">
          {tableData.length === 0
            ? "0 élément"
            : `${(page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, tableData.length)} sur ${tableData.length} élément${tableData.length > 1 ? "s" : ""}`}
        </span>
        <button className="cpf-page-btn" onClick={() => setPage(c => Math.min(totalPages, c + 1))} disabled={page >= totalPages}>
          <IconChevronR />
        </button>
      </div>

    </div>
  );
}
