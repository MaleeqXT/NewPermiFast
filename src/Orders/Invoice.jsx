import { useNavigate } from "react-router-dom";
import logoreal from '../assets/logo-real.webp';
import "./Invoice.css";

const INVOICE = {
  number:          "AD26-17702WKIO",
  dateFacturation: "26-04-16",

  from: {
    company:  "PASSPERMISFACILE",
    address:  "139 boulevard Déddat de Séverac, 31300 TOULOUSE",
    phone:    "09 70 70 16 16",
    email:    "contact@passpermisfacile.fr",
    web:      "www.passpermisfacile.fr",
    legal:    "SAS PASSPERMISFACILE",
    capital:  "2 000 €",
    siren:    "979 143 294",
    rcs:      "COMPIÈGNE B 979 143 294",
    ape:      "85.532",
    tva:      "FR40979143294",
  },

  to: {
    name:    "Lou FRAISSE",
    phone:   "0670062502",
    email:   "loufraisse3@gmail.com",
    address: "40 rue du général Jean Compans Toulouse, 31000",
  },

  items: [
    { description: "Pass permis Manuelle F10", qty: 1, tva: "20%", total: "650,00 €" },
  ],

  summary: [
    { label: "TVA (%)",           value: "20%"                    },
    { label: "Total Facturé",     value: "650,00 €", bold: true   },
    { label: "Heures Crédit",     value: "10 h"                   },
    { label: "Mode de paiement",  value: "Carte bancaire (Stripe)"},
    { label: "Date du paiement",  value: "16-04-2026"             },
  ],

  mediation: `Conformément à l'article L.616-1 du Code de la consommation, en cas de litige avec notre auto-école PASSPERMISFACILE, vous avez la possibilité de recourir gratuitement au médiateur de la consommation auquel nous avons adhéré : Médiateur désigné : ANM Corso. Adresse postale : 2, rue de Colmar 94300 VINCENNES. Email : contact@anm-corso.com. Téléphone : 01 58 64 00 05. Site web : www.anm-corso.com. Le client peut saisir le médiateur après une tentative préalable de résolution amiable directement auprès de l'auto-école.`,

  mentions: `Conditions générales de vente (CGV) : disponibles sur demande et sur notre site web. Délai de rétractation : Le consommateur dispose d'un droit de rétractation de 14 jours s'il a souscrit en ligne (sauf si la prestation a débuté avant la fin de ce délai avec son accord). Clause de réserve de propriété : L'auto-école conserve la propriété des services jusqu'au paiement intégral de la facture. Tribunal compétent : En cas de litige non résolu, le tribunal de TOULOUSE sera compétent.`,
};

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

export default function InvoiceView() {
  const navigate = useNavigate();
  const d = INVOICE;

  const handlePrint = () => {
    // open invoice in a new isolated window so dashboard doesn't print
    const printWindow = window.open("", "_blank", "width=900,height=700");
    const content = document.getElementById("pf-invoice-printable").innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try { return Array.from(sheet.cssRules).map(r => r.cssText).join("\n"); }
        catch { return ""; }
      }).join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Facture ${d.number}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', Arial, sans-serif; background: #fff; color: #111827; }
            ${styles}
            .pf-invoice-page {
              max-width: 100%;
              margin: 0;
              padding: 32px 40px;
              border: none;
              border-radius: 0;
              box-shadow: none;
              font-size: 12px;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
  };

  return (
    <>
      {/* ── Toolbar — never prints ── */}
      <div className="pf-invoice-toolbar">
        <button className="pf-invoice-back-btn" onClick={() => navigate(-1)}>
          <IconBack /> Back
        </button>
        <button className="pf-invoice-download-btn" onClick={handlePrint}>
          <IconDownload /> Download PDF
        </button>
      </div>

      {/* ── Printable invoice ── */}
      <div className="pf-invoice-page" id="pf-invoice-printable">

        {/* ── Header: title + logo side by side ── */}
        <div className="pf-invoice-header-row">
          <div>
            <div className="pf-invoice-header-tag">Facture - Auto-école {d.from.company}</div>
          </div>
          <img src={logoreal} alt="PermiFast" className="pf-invoice-logo" />
        </div>

        {/* ── Company info block ── */}
        <div className="pf-invoice-block">
          <div className="pf-invoice-row"><span className="pf-invoice-label">Nom de l'auto-école :</span><span>{d.from.company}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Adresse :</span><span>{d.from.address}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Téléphone :</span><span>{d.from.phone}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">E-mail :</span><a href={`mailto:${d.from.email}`} className="pf-invoice-link">{d.from.email}</a></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Site web :</span><a href={`https://${d.from.web}`} target="_blank" rel="noreferrer" className="pf-invoice-link">{d.from.web}</a></div>
          <div className="pf-invoice-row-plain">{d.from.legal}</div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Capital social :</span><span>{d.from.capital}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">SIREN :</span><span>{d.from.siren}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">RCS :</span><span>{d.from.rcs}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Code APE :</span><span>{d.from.ape}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">TVA intra-communautaire :</span><span>{d.from.tva}</span></div>
        </div>

        {/* ── Invoice number + date ── */}
        <div className="pf-invoice-block">
          <div className="pf-invoice-row">
            <span className="pf-invoice-label pf-invoice-label--blue">FACTURE N° :</span>
            <span className="pf-invoice-label--blue">{d.number}</span>
          </div>
          <div className="pf-invoice-row">
            <span className="pf-invoice-label">Date de facturation :</span>
            <span>{d.dateFacturation}</span>
          </div>
        </div>

        {/* ── Client section ── */}
        <div className="pf-invoice-section-heading">Client</div>
        <div className="pf-invoice-block">
          <div className="pf-invoice-row"><span className="pf-invoice-label">Nom &amp; Prénom :</span><span>{d.to.name}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Téléphone :</span><span>{d.to.phone}</span></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">E-mail :</span><a href={`mailto:${d.to.email}`} className="pf-invoice-link">{d.to.email}</a></div>
          <div className="pf-invoice-row"><span className="pf-invoice-label">Adresse :</span><span>{d.to.address}</span></div>
        </div>

        {/* ── Items table heading ── */}
        <div className="pf-invoice-section-heading">Détail des prestations/Forfait :</div>

        {/* ── Items table ── */}
        <table className="pf-invoice-table">
          <thead>
            <tr>
              <th className="pf-invoice-th pf-invoice-th-desc">Description</th>
              <th className="pf-invoice-th pf-invoice-th-center">Quantity</th>
              <th className="pf-invoice-th pf-invoice-th-center">TVA (%)</th>
              <th className="pf-invoice-th pf-invoice-th-right">Total TTC (€)</th>
            </tr>
          </thead>
          <tbody>
            {d.items.map((item, i) => (
              <tr key={i} className="pf-invoice-tr">
                <td className="pf-invoice-td pf-invoice-td-desc">{item.description}</td>
                <td className="pf-invoice-td pf-invoice-td-center">{item.qty}</td>
                <td className="pf-invoice-td pf-invoice-td-center">{item.tva}</td>
                <td className="pf-invoice-td pf-invoice-td-right">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Summary table (TVA, Total Facturé, Heures Crédit, etc.) ── */}
        <table className="pf-invoice-summary-table">
          <tbody>
            {d.summary.map((row, i) => (
              <tr key={i} className="pf-invoice-summary-tr">
                <td className={`pf-invoice-summary-label ${row.bold ? "pf-invoice-bold" : ""}`}>{row.label}</td>
                <td className={`pf-invoice-summary-value ${row.bold ? "pf-invoice-bold" : ""}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Mediation ── */}
        <div className="pf-invoice-section-heading pf-invoice-section-heading--blue">Médiation de la consommation</div>
        <p className="pf-invoice-legal-text">{d.mediation}</p>

        {/* ── Mentions légales ── */}
        <div className="pf-invoice-section-heading pf-invoice-section-heading--blue" style={{ marginTop: 16 }}>Mentions obligatoires supplémentaires</div>
        <p className="pf-invoice-legal-text">{d.mentions}</p>

        {/* ── Footer ── */}
        <div className="pf-invoice-footer">
          Auto-école <span className="pf-invoice-footer-link">{d.from.company}</span> – Merci pour votre confiance !
        </div>

      </div>
    </>
  );
}
