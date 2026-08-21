import { useEffect, useMemo, useRef, useState } from "react";
import "./Document.css";

const INITIAL_INVOICES = [
  { id: 1, month: "Mai",      number: "AD-41882264", workingHours: "0 h",  total: "0,00 €",  paymentDate: "",           status: "onhold",  tab: "active"  },
  { id: 2, month: "Avril",    number: "AD-38921103", workingHours: "12 h", total: "240,00 €", paymentDate: "2025-04-30", status: "paid",    tab: "active"  },
  { id: 3, month: "Mars",     number: "AD-37654821", workingHours: "8 h",  total: "160,00 €", paymentDate: "2025-03-31", status: "paid",    tab: "active"  },
  { id: 4, month: "Février",  number: "AD-35412290", workingHours: "20 h", total: "400,00 €", paymentDate: "",           status: "pending", tab: "active"  },
  { id: 5, month: "Janvier",  number: "AD-33201847", workingHours: "5 h",  total: "100,00 €", paymentDate: "2025-01-28", status: "paid",    tab: "archive" },
  { id: 6, month: "Décembre", number: "AD-31098234", workingHours: "16 h", total: "320,00 €", paymentDate: "2024-12-31", status: "paid",    tab: "archive" },
];

const ITEMS_PER_PAGE = 5;

const MONTH_OPTIONS = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

function StatusBadge({ status }) {
  const map = {
    paid: { bg: "#dcfce7", color: "#166534", label: "Payée" },
    onhold: { bg: "#fef9c3", color: "#92400e", label: "En attente" },
    pending: { bg: "#fee2e2", color: "#991b1b", label: "En cours" },
  };
  const state = map[status] ?? { bg: "#f3f4f6", color: "#374151", label: status };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        background: state.bg,
        color: state.color,
      }}
    >
      {state.label}
    </span>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconChevronLeft() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
}

function IconChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
}

function IconDropdown() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
}

const monthToLabel = (monthValue) => MONTH_OPTIONS.find((option) => option.value === monthValue)?.label ?? "Tous les mois";

export default function Invoices() {
  const [activeTab, setActiveTab] = useState("active");
  const [invoiceMonth, setInvoiceMonth] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [page, setPage] = useState(1);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setDateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredInvoices = useMemo(() => {
    let data = INITIAL_INVOICES.filter((invoice) => invoice.tab === activeTab);

    if (invoiceMonth) {
      data = data.filter((invoice) => invoice.month === monthToLabel(invoiceMonth));
    }

    if (paymentDate) {
      data = data.filter((invoice) => invoice.paymentDate === paymentDate);
    }

    return data;
  }, [activeTab, invoiceMonth, paymentDate]);

  const totalItems = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginated = filteredInvoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const fromItem = totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const toItem = Math.min(page * ITEMS_PER_PAGE, totalItems);

  useEffect(() => {
    setPage(1);
  }, [activeTab, invoiceMonth, paymentDate]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setInvoiceMonth("");
    setPaymentDate("");
    setPage(1);
    setDateMenuOpen(false);
  }

  const selectedDateLabel = invoiceMonth || paymentDate
    ? [invoiceMonth ? monthToLabel(invoiceMonth) : null, paymentDate ? new Date(paymentDate).toLocaleDateString("fr-FR") : null].filter(Boolean).join(" · ")
    : "Date de facture";

  return (
    <div className="inv-page">
      <div className="inv-pill-tabs">
        {["active", "archive"].map((tab) => (
          <button
            key={tab}
            className={`inv-pill-tab${activeTab === tab ? " inv-pill-tab--active" : ""}`}
            onClick={() => handleTabChange(tab)}
            type="button"
          >
            {tab === "active" ? "Actif" : "Archive"}
          </button>
        ))}
      </div>

      <div className="inv-card">
        <div className="inv-date-row">
          <div className="inv-filter-anchor" ref={filterRef}>
            <button
              type="button"
              className="inv-date-wrap inv-filter-trigger"
              onClick={() => setDateMenuOpen((isOpen) => !isOpen)}
              aria-expanded={dateMenuOpen}
              aria-haspopup="dialog"
            >
              <span className="inv-date-icon"><IconCalendar /></span>
              <span className={`inv-date-placeholder${invoiceMonth || paymentDate ? " inv-date-placeholder--active" : ""}`}>
                {selectedDateLabel}
              </span>
              <span className="inv-filter-caret"><IconDropdown /></span>
            </button>

            {dateMenuOpen && (
              <div className="inv-filter-panel" role="dialog" aria-label="Filtrer les factures par date">
                <div className="inv-filter-grid">
                  <label className="inv-filter-field">
                    <span className="inv-filter-label">Mois de facture</span>
                    <select
                      className="inv-filter-input"
                      value={invoiceMonth}
                      onChange={(event) => setInvoiceMonth(event.target.value)}
                    >
                      <option value="">Tous les mois</option>
                      {MONTH_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="inv-filter-field">
                    <span className="inv-filter-label">Date de paiement</span>
                    <input
                      type="date"
                      className="inv-filter-input"
                      value={paymentDate}
                      onChange={(event) => setPaymentDate(event.target.value)}
                    />
                  </label>
                </div>

                <div className="inv-filter-footer">
                  <button
                    type="button"
                    className="inv-filter-secondary"
                    onClick={() => {
                      setInvoiceMonth("");
                      setPaymentDate("");
                    }}
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="button"
                    className="inv-filter-primary"
                    onClick={() => setDateMenuOpen(false)}
                  >
                    Valider
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Mois</th>
                <th>Numéro</th>
                <th>Heures travaillées</th>
                <th>Total</th>
                <th>Date de paiement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="inv-empty">Aucune facture trouvée</td>
                </tr>
              ) : (
                paginated.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="inv-cell-month">{invoice.month}</td>
                    <td className="inv-cell-number">{invoice.number}</td>
                    <td>{invoice.workingHours}</td>
                    <td>{invoice.total}</td>
                    <td>{invoice.paymentDate || <span className="inv-muted">—</span>}</td>
                    <td><StatusBadge status={invoice.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="inv-pagination">
          <button
            className="inv-page-btn"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            type="button"
          >
            <IconChevronLeft />
          </button>
          <span className="inv-page-info">
            {totalItems === 0
              ? "0 élément"
              : `${fromItem} – ${toItem} sur ${totalItems} élément${totalItems > 1 ? "s" : ""}`}
          </span>
          <button
            className="inv-page-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
