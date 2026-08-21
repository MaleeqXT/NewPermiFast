import { useState } from "react";
import "./InvoicesPage.css";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const IconReport = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>
  </svg>
);
const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v13M7 11l5 5 5-5"/><path d="M5 21h14"/>
  </svg>
);

const INVOICES = [
  { month: "Mai", total: "0,00 €", id: "AD-41882264", label: "XX", period: "1er mai 2026 au 31 mai 2026", monthFull: "Mai 2026", facturable: "8h", nonFacturable: "8h", totalDue: "0,00 €", pricePerHour: "0", paymentDate: "—", invoiceEUR: "0,00 €", paymentStatus: "Payé" },
  { month: "Avril", total: "0,00 €", id: "AD-41882264", label: "Séances d’avril", period: "1er avril 2026 au 30 avril 2026", monthFull: "Avril 2026", facturable: "12h", nonFacturable: "4h", totalDue: "0,00 €", pricePerHour: "0", paymentDate: "—", invoiceEUR: "0,00 €", paymentStatus: "Payé" },
  { month: "Mars", total: "320,00 €", id: "AD-38821100", label: "Séances de mars", period: "1er mars 2026 au 31 mars 2026", monthFull: "Mars 2026", facturable: "16h", nonFacturable: "2h", totalDue: "320,00 €", pricePerHour: "20", paymentDate: "5 avril 2026", invoiceEUR: "320,00 €", paymentStatus: "Payé" },
];

const REPORT_DATA = {
  "Facturable": [
    { date: "Mar. 28 avril 2026", initials: "OD", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "10:00 - 11:00", desc: "1 h avec le candidat Omar Dhouioui", note: "" },
    { date: "Mar. 28 avril 2026", initials: "RO", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "09:00 - 10:00", desc: "1 h avec la candidate Rafiatou Oumarou", note: "" },
    { date: "Lun. 27 avril 2026", initials: "KH", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "07:00 - 08:00", desc: "1 h avec le candidat Keita El hadji", note: "tout va bien" },
    { date: "Lun. 27 avril 2026", initials: "FV", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "14:00 - 15:00", desc: "1 h avec le candidat Ferdinand Valgalier", note: "" },
  ],
  "Non Facturable": [
    { date: "Dim. 26 avril 2026", initials: "IA", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "12:00 - 13:00", desc: "1 h avec la candidate Ibtissane alfa", note: "" },
    { date: "Dim. 26 avril 2026", initials: "WE", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "13:00 - 14:00", desc: "1 h avec la candidate Walaa Ezzaouia", note: "" },
  ],
  "Historique": [
    { date: "Ven. 20 mars 2026", initials: "AM", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "08:00 - 09:00", desc: "1 h avec la candidate Aabla Meidani", note: "" },
    { date: "Jeu. 19 mars 2026", initials: "AS", location: "Toulouse, McDonald's Les Arènes, sur le trottoir à la sortie du métro", time: "09:00 - 10:00", desc: "1 h avec la candidate Aaliyah Sangaré", note: "" },
    { date: "Mer. 18 mars 2026", initials: "KH", location: "Agence de Creil, entrée principale", time: "10:00 - 11:00", desc: "1 h avec le candidat Keita El hadji", note: "Tout va bien" },
  ],
};

function ReportDrawer({ onClose }) {
  const TABS = ["Facturable", "Non Facturable", "Historique"];
  const [tab, setTab] = useState("Facturable");
  const entries = REPORT_DATA[tab] || [];
  const grouped = entries.reduce((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});

  return (
    <>
      <div className="inv-overlay" onClick={onClose} />
      <aside className="inv-drawer">
        <div className="inv-drawer-header">
          <button className="inv-drawer-close" onClick={onClose}>Fermer</button>
          <span className="inv-drawer-title">Rapport des heures</span>
          <span style={{ width: 48 }} />
        </div>

        <div className="inv-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`inv-tab${tab === t ? " inv-tab--active" : ""}`}
              onClick={() => setTab(t)}
            >{t}</button>
          ))}
        </div>

        <div className="inv-drawer-body">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="inv-report-group">
              <div className="inv-report-date">
                <span className="inv-report-dot" />
                {date}
              </div>
              <div className="inv-report-items">
                {items.map((item, i) => (
                  <div key={i} className="inv-report-item">
                    <div className="inv-report-item-top">
                      <span className="inv-report-location">{item.location}</span>
                      <span className="inv-report-time">{item.time}</span>
                    </div>
                    <div className="inv-report-row">
                      <div className="inv-report-avatar">{item.initials}</div>
                      <div className="inv-report-desc">
                        <span>{item.desc}</span>
                        {item.note && <span className="inv-report-note">{item.note}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="inv-report-empty">Aucune entrée pour cette période.</p>
          )}
        </div>
      </aside>
    </>
  );
}

function InvoiceDetail({ invoice, onBack }) {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="inv-page">
      <header className="inv-header">
        <button className="inv-back-btn inv-back-btn--with-label" onClick={onBack} aria-label="Retour">
          <IconArrowLeft />
        </button>
        <div className="inv-header-info">
          <span className="inv-header-id">{invoice.id}</span>
          <span className="inv-header-period">{invoice.period}</span>
        </div>
        <button className="inv-report-btn" onClick={() => setShowReport(true)} title="Rapport des heures">
          <IconReport />
        </button>
      </header>

      <main className="inv-main">
        <p className="inv-month-title">Mois : {invoice.monthFull}</p>

        <div className="inv-company-card">
          <div className="inv-company-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <div className="inv-company-info">
            <span className="inv-company-name">SAS PASSPERMISFACILE, No SIREN : 979 143 294</span>
            <span className="inv-company-addr">139 boulevard Déodat de Séverac, 31300 TOULOUSE</span>
          </div>
        </div>

        <div className="inv-summary-card">
          <div className="inv-summary-col">
            <span className="inv-summary-label">Facturable</span>
            <span className="inv-summary-value">{invoice.facturable}</span>
          </div>
          <div className="inv-summary-divider" />
          <div className="inv-summary-col">
            <span className="inv-summary-label">Non facturable</span>
            <span className="inv-summary-value">{invoice.nonFacturable}</span>
          </div>
          <div className="inv-summary-divider" />
          <div className="inv-summary-col inv-summary-col--right">
            <span className="inv-summary-label">Total dû</span>
            <span className="inv-summary-value">{invoice.totalDue}</span>
          </div>
        </div>

        <div className="inv-details-section">
          <p className="inv-details-title">Détails</p>
          <div className="inv-detail-list">
            {[
              ["Prix par heure", invoice.pricePerHour],
              ["Date de paiement", invoice.paymentDate],
              ["Facture (EUR)", invoice.invoiceEUR],
              ["Statut de paiement", invoice.paymentStatus],
            ].map(([label, val]) => (
              <div key={label} className="inv-detail-row">
                <span className="inv-detail-label">{label}</span>
                <span className="inv-detail-value">
                  {label === "Statut de paiement"
                    ? <span className={`inv-status-badge inv-status-badge--${String(val).toLowerCase()}`}>{val}</span>
                    : val}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="inv-terms">
          <p className="inv-terms-title">Conditions générales</p>
          <p className="inv-terms-body">Le paiement est exigible dans les 30 jours suivant la date de facture.</p>
        </div>

        <button className="inv-download-btn">
          <IconDownload /> Télécharger ma facture
        </button>
      </main>

      {showReport && <ReportDrawer onClose={() => setShowReport(false)} />}
    </div>
  );
}

export default function InvoicesPage({ onBack }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <InvoiceDetail invoice={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="inv-page">
      <header className="inv-header">
        <button className="inv-back-btn inv-back-btn--with-label" onClick={onBack} aria-label="Retour">
          <IconArrowLeft />
        </button>
        <div className="inv-header-info">
          <span className="inv-header-id">Factures</span>
          <span className="inv-header-period">Liste des factures</span>
        </div>
      </header>

      <main className="inv-main">
        {INVOICES.map((inv, i) => (
          <button key={i} className="inv-month-card" onClick={() => setSelected(inv)}>
            <div className="inv-month-card-header">
              <span className="inv-month-card-month">{inv.month}</span>
              <span className="inv-month-card-total">{inv.total}</span>
            </div>
            <div className="inv-month-card-body">
              <div className="inv-month-card-id">{inv.id}</div>
              <div className="inv-month-card-label">{inv.label}</div>
              <div className="inv-month-card-rows">
                <div className="inv-month-card-row">
                  <span>Heures travaillées :</span>
                  <span className="inv-month-card-row-val">{inv.facturable}</span>
                </div>
                <div className="inv-month-card-row">
                  <span>Frais de formation :</span>
                  <span className="inv-month-card-row-val">{inv.total}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}
