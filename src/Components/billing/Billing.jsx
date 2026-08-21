import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../helpers/http.jsx";
import MonitorsInfo from "../monitors/MonitorsInfo.jsx";
import "./Billing.css";

const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconDots     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IconInvoice  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;
const IconChevL    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const INVOICES = [
  { id: 1, date: "Mars", name: "SECRETARY",   salary: "3 420,00 €", facturable: "171,00 h", nonFacturable: "171,00 h", hourlyRate: "20,00 €", total1: "3 420,00 €", total2: "3 420,00 €", status: "on_hold" },
  { id: 2, date: "Mars", name: "KALAIDJI",    salary: "3 618,00 €", facturable: "134,00 h", nonFacturable: "134,00 h", hourlyRate: "27,00 €", total1: "3 618,00 €", total2: "3 618,00 €", status: "on_hold" },
  { id: 3, date: "Mars", name: "TAMA SAWKIW", salary: "0,00 €",     facturable: "167,00 h", nonFacturable: "168,00 h", hourlyRate: "0,00 €",  total1: "0,00 €",     total2: "0,00 €",     status: "on_hold" },
  { id: 4, date: "Mars", name: "PASCAL",      salary: "0,00 €",     facturable: "110,00 h", nonFacturable: "110,00 h", hourlyRate: "22,00 €", total1: "0,00 €",     total2: "0,00 €",     status: "paid"    },
];

const STATUS_CONFIG = {
  paid:    { label: "Payée",      bg: "#16a34a", color: "#fff" },
  on_hold: { label: "En attente", bg: "#f59e0b", color: "#fff" },
};

function formatCurrency(value) {
  return `${Number(value ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function mapBilling(billing) {
  const details = billing.details ?? {};
  const user = billing.monitor?.user ?? {};
  const name = user.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "Moniteur";
  const date = billing.from
    ? new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(`${billing.from}T00:00:00`))
    : "—";
  const total = details.total ?? billing.montant ?? 0;
  return {
    id: billing.id,
    monitorId: billing.monitor_id,
    monitor: billing.monitor,
    date,
    name,
    salary: formatCurrency(billing.montant),
    facturable: `${Number(details.num_heures_f ?? 0).toLocaleString("fr-FR")} h`,
    nonFacturable: `${Number(details.num_heures_nf ?? 0).toLocaleString("fr-FR")} h`,
    hourlyRate: formatCurrency(details.prix_heure),
    total1: formatCurrency(total),
    total2: formatCurrency(billing.montant),
    status: billing.status || billing.date_paiement ? "paid" : "on_hold",
  };
}

const YEARS       = [2023, 2024, 2025, 2026];
const MONTHS_LIST = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const PAGE_SIZE   = 15;

function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey;
  const dir      = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir ===  1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

function TotalBadge({ value, tooltip, variant }) {
  const [show, setShow] = useState(false);
  const styles = {
    orange: { background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" },
    green:  { background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" },
  };
  const style = styles[variant] || styles.orange;

  return (
    <span className="bil-badge-wrapper" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {show && <span className="bil-tooltip">{tooltip}</span>}
      <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"6px", fontSize:"12px", fontWeight:700, fontFamily:"Inter, sans-serif", whiteSpace:"nowrap", cursor:"default", ...style }}>
        {value}
      </span>
    </span>
  );
}

function YearMonthPicker({ value, onChange, onClose }) {
  const [selYear,  setSelYear]  = useState(value?.year  ?? 2026);
  const [selMonth, setSelMonth] = useState(value?.month ?? null);

  function handleValidate() {
    if (selYear && selMonth !== null) onChange({ year: selYear, month: selMonth });
    onClose();
  }

  return (
    <div className="bil-picker-dropdown">
      <div className="bil-picker-body">
        <div className="bil-picker-years">
          {YEARS.map((year) => (
            <button key={year} className={`bil-picker-year-btn${selYear === year ? " active" : ""}`} onClick={() => setSelYear(year)}>
              {year}
            </button>
          ))}
        </div>
        <div className="bil-picker-months">
          {MONTHS_LIST.map((month, index) => (
            <button key={month} className={`bil-picker-month-btn${selMonth === index ? " active" : ""}`} onClick={() => setSelMonth(index)}>
              {month}
            </button>
          ))}
        </div>
      </div>
      <div className="bil-picker-footer">
        <button className="bil-picker-close-btn"    onClick={onClose}>Fermer</button>
        <button className="bil-picker-validate-btn" onClick={handleValidate}>Valider</button>
      </div>
    </div>
  );
}

function RowMenu({ invoice }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return (
    <div className="cand-row-menu-wrapper" ref={ref}>
      <button className="cand-row-menu-trigger" onClick={() => setOpen((v) => !v)}>
        <IconDots />
      </button>
      {open && (
        <div className="cand-row-menu-dropdown">
          <button className="cand-row-menu-item" onClick={() => {
            setOpen(false);
            window.open(`http://localhost:8000/download/monitor/invoices/${invoice.id}`, "_blank", "noopener,noreferrer");
          }}>
            <IconInvoice /> Télécharger la facture
          </button>
        </div>
      )}
    </div>
  );
}

export default function Billing() {
  const [invoices,        setInvoices]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [loadError,       setLoadError]       = useState("");
  const [search,          setSearch]          = useState("");
  const [sort,            setSort]            = useState(null);
  const [page,            setPage]            = useState(1);
  const [dateFilter,      setDateFilter]      = useState(null);
  const [pickerOpen,      setPickerOpen]      = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    const period = dateFilter ? `${dateFilter.year}-${String(dateFilter.month + 1).padStart(2, "0")}-01` : undefined;
    http.get("/admin/invoices", { params: { per_page: 100, status: "all", period } })
      .then((response) => {
        if (active) setInvoices((response.data?.data ?? []).map(mapBilling));
      })
      .catch((error) => {
        if (active) setLoadError(error.response?.data?.message ?? "Impossible de charger les factures.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [dateFilter]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  let data = invoices.filter((invoice) => !search || [invoice.name, invoice.date].join(" ").toLowerCase().includes(search.toLowerCase()));
  if (sort) {
    data = [...data].sort((a, b) => {
      const av = String(a[sort.key]).toLowerCase();
      const bv = String(b[sort.key]).toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, totalItems);
  const pageData   = data.slice(pageStart, pageEnd);
  const dateLabel  = dateFilter
    ? `${dateFilter.year}-${String(dateFilter.month + 1).padStart(2, "0")}`
    : "(aaaa-mm)";

  if (selectedMonitor) {
    return <MonitorsInfo monitor={selectedMonitor} onBack={() => setSelectedMonitor(null)} />;
  }

  function handleSort(key) {
    setSort((prev) => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
    setPage(1);
  }

  return (
    <div className="cand-page">

      {/* ── En-tête ── */}
      <div className="bil-header">
        <h1 className="ord-title">Facturation</h1>
      </div>

      {/* ── Barre d'outils ── */}
      <div className="bil-toolbar">
        <div className="cand-search-box bil-search">
          <IconSearch />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par mot-clé…"
          />
        </div>

        <div className="ord-datepicker-anchor bil-datepicker-anchor" ref={pickerRef}>
          <button className="bil-date-btn" onClick={() => setPickerOpen((v) => !v)}>
            <span className="bil-date-label">{dateLabel}</span>
            <IconCalendar />
          </button>
          {pickerOpen && (
            <YearMonthPicker
              value={dateFilter}
              onChange={(v) => { setDateFilter(v); setPage(1); }}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      </div>

      {loadError && <div className="cand-empty" style={{ marginBottom: 12 }}>{loadError}</div>}

      {/* ── Tableau ── */}
      <div className="cand-table-card">
        <div className="bil-table-scroll">
          <table className="cand-table">
            <thead>
              <tr>
                <th>Détails du moniteur</th>
                <th>Date             <SortArrows sortKey={sort} colKey="date"          onSort={handleSort} /></th>
                <th>Nom              <SortArrows sortKey={sort} colKey="name"          onSort={handleSort} /></th>
                <th>Salaire          <SortArrows sortKey={sort} colKey="salary"        onSort={handleSort} /></th>
                <th>Facturable       <SortArrows sortKey={sort} colKey="facturable"    onSort={handleSort} /></th>
                <th>Non facturable   <SortArrows sortKey={sort} colKey="nonFacturable" onSort={handleSort} /></th>
                <th>Taux horaire     <SortArrows sortKey={sort} colKey="hourlyRate"    onSort={handleSort} /></th>
                <th>Total</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="cand-empty">Chargement des factures...</td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={10} className="cand-empty">Aucune facture trouvée</td></tr>
              ) : (
                pageData.map((invoice) => {
                  const cfg = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.on_hold;
                  return (
                    <tr key={invoice.id}>
                      <td>
                        <button
                          className="cand-file-btn"
                          onClick={() => setSelectedMonitor(invoice.monitor ?? { id: invoice.monitorId, name: invoice.name })}
                        >
                          Voir le dossier
                        </button>
                      </td>
                      <td style={{ color:"#6b7280", fontSize:13 }}>{invoice.date}</td>
                      <td><span style={{ color:"#2563eb", fontWeight:600, cursor:"pointer" }}>{invoice.name}</span></td>
                      <td>{invoice.salary}</td>
                      <td>{invoice.facturable}</td>
                      <td>{invoice.nonFacturable}</td>
                      <td>{invoice.hourlyRate}</td>
                      <td>
                        <div style={{ display:"flex", gap:6, flexWrap:"nowrap" }}>
                          <TotalBadge value={invoice.total1} tooltip="Non facturable" variant="orange" />
                          <TotalBadge value={invoice.total2} tooltip="Facturable"     variant="green"  />
                        </div>
                      </td>
                      <td>
                        <span className="ord-status-badge" style={{ background:cfg.bg, color:cfg.color }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="cand-actions-cell"><RowMenu invoice={invoice} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="cpf-pagination">
          <button className="cpf-page-btn" onClick={() => setPage((c) => Math.max(1, c - 1))} disabled={safePage <= 1}>
            <IconChevL />
          </button>
          <span className="cpf-page-info">
            {totalItems === 0
              ? "Aucune entrée"
              : `${pageStart + 1} – ${pageEnd} sur ${totalItems} élément${totalItems > 1 ? "s" : ""}`}
          </span>
          <button className="cpf-page-btn" onClick={() => setPage((c) => Math.min(totalPages, c + 1))} disabled={safePage >= totalPages}>
            <IconChevR />
          </button>
        </div>
      </div>
    </div>
  );
}
