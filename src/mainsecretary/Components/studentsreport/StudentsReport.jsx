import { useState } from "react";
import "./StudentsReport.css";

/* ── Flèches de tri ──────────────────────────────────────────────────────── */
function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey, dir = sortKey?.dir;
  return (
    <button className="cand-sort-btn" onClick={() => onSort(colKey)}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1  ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

/* ── Icônes ──────────────────────────────────────────────────────────────── */
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconChevL    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

/* ── Données ─────────────────────────────────────────────────────────────── */
const INITIAL_STUDENTS = [
  {
    id:1, name:"SOW AISSATA", email:"codhasow@gmail.com", phone:"0763594358",
    would:"CREIL", status:"active", createdOn:"2025-05-15",
    payments:[
      { ref:"#a08113cc-b38c-43b6-9c31-54a6268f0544", amount:"295,00 €" },
      { ref:"#a0c362a6-5dfb-4cea-a950-72c0b60b8b20", amount:"295,00 €" },
      { ref:"#a0d1639e-915c-42b1-81b2-819137f134a3", amount:"295,00 €" },
      { ref:"#a12f1bcf-4925-4c85-89b7-59704eabc8d2", amount:"315,00 €" },
      { ref:"#a152911a-c558-401a-b008-d2370ee924b9", amount:"69,00 €"  },
    ],
    totalHT:"1 269,00 €", vat:"253,80 €", totalTTC:"1 522,80 €",
  },
  {
    id:2, name:"ELIF ELMACIOGLU", email:"elmaciogluelif@gmail.com", phone:"0616057238",
    would:"Creil", status:"active", createdOn:"2025-05-15",
    payments:[], totalHT:"0,00 €", vat:"0,00 €", totalTTC:"0,00 €",
  },
  {
    id:3, name:"Jennyfer's Couch Grass", email:"chiendent.jennyfer@gmail.com", phone:"0745119804",
    would:"Creil", status:"active", createdOn:"2025-05-15",
    payments:[{ ref:"#a05291c3-7980-4d4e-a1cc-93f3527eb37b", amount:"275,00 €" }],
    totalHT:"275,00 €", vat:"55,00 €", totalTTC:"330,00 €",
  },
  {
    id:4, name:"KAMARA HEAVENIE", email:"heaveniek@gmail.com", phone:"0652222441",
    would:"Creil", status:"active", createdOn:"2025-05-15",
    payments:[
      { ref:"#9fd3050e-4bf5-4f2c-8f84-bff7f721ae12", amount:"275,00 €" },
      { ref:"#a01a88a6-56fd-4995-918c-32b1414fda0e", amount:"275,00 €" },
      { ref:"#a12ce9c4-ebd2-408f-b27e-c384aee68430", amount:"150,00 €" },
    ],
    totalHT:"700,00 €", vat:"140,00 €", totalTTC:"840,00 €",
  },
  {
    id:5, name:"VIRLAN MARIA-MANUELA", email:"manuela.manu.mb93@gmail.com", phone:"0605851505",
    would:"Creil", status:"active", createdOn:"2025-05-15",
    payments:[
      { ref:"#a090ffd9-2a40-4bf6-bab3-61be9927f14c", amount:"275,00 €" },
      { ref:"#a0b17665-f194-48c6-b1c9-eb8e964ca508", amount:"275,00 €" },
      { ref:"#a0d900be-7a40-412c-b8d6-36e937077bb9", amount:"275,00 €" },
      { ref:"#a0e2b3c1-9d12-4f5a-b2e7-48c93d1a2f44", amount:"38,00 €"  },
    ],
    totalHT:"863,00 €", vat:"172,60 €", totalTTC:"1 035,60 €",
  },
  {
    id:6, name:"MASSALA THYFENE NGOMA", email:"ngoma.massala@gmail.com", phone:"0712345678",
    would:"Creil", status:"active", createdOn:"2025-05-15",
    payments:[{ ref:"#b01234ab-1234-5678-abcd-1234567890ab", amount:"275,00 €" }],
    totalHT:"275,00 €", vat:"55,00 €", totalTTC:"330,00 €",
  },
  {
    id:7, name:"DUPONT MARC", email:"marc.dupont@gmail.com", phone:"0698765432",
    would:"Toulouse", status:"active", createdOn:"2025-04-10",
    payments:[
      { ref:"#c01234ab-1234-5678-abcd-000000000001", amount:"590,00 €" },
      { ref:"#c01234ab-1234-5678-abcd-000000000002", amount:"200,00 €" },
    ],
    totalHT:"790,00 €", vat:"158,00 €", totalTTC:"948,00 €",
  },
  {
    id:8, name:"MARTIN LEA", email:"lea.martin@gmail.com", phone:"0611223344",
    would:"Toulouse", status:"active", createdOn:"2025-03-22",
    payments:[], totalHT:"0,00 €", vat:"0,00 €", totalTTC:"0,00 €",
  },
  {
    id:9, name:"BERNARD SOPHIE", email:"sophie.bernard@gmail.com", phone:"0755443322",
    would:"Paris", status:"active", createdOn:"2025-03-15",
    payments:[{ ref:"#d01234ab-0000-0000-0000-000000000001", amount:"320,00 €" }],
    totalHT:"320,00 €", vat:"64,00 €", totalTTC:"384,00 €",
  },
  {
    id:10, name:"LEBLANC PIERRE", email:"pierre.leblanc@gmail.com", phone:"0677889900",
    would:"Lyon", status:"active", createdOn:"2025-02-28",
    payments:[
      { ref:"#e01234ab-1111-2222-3333-444444444444", amount:"275,00 €" },
      { ref:"#e01234ab-5555-6666-7777-888888888888", amount:"275,00 €" },
    ],
    totalHT:"550,00 €", vat:"110,00 €", totalTTC:"660,00 €",
  },
  {
    id:11, name:"GARCIA ISABELLE", email:"isabelle.garcia@gmail.com", phone:"0633221100",
    would:"Marseille", status:"active", createdOn:"2025-02-14",
    payments:[], totalHT:"0,00 €", vat:"0,00 €", totalTTC:"0,00 €",
  },
  {
    id:12, name:"THOMAS KEVIN", email:"kevin.thomas@gmail.com", phone:"0644556677",
    would:"Creil", status:"active", createdOn:"2025-01-30",
    payments:[{ ref:"#f01234ab-aaaa-bbbb-cccc-dddddddddddd", amount:"315,00 €" }],
    totalHT:"315,00 €", vat:"63,00 €", totalTTC:"378,00 €",
  },
  {
    id:13, name:"ROBERT CAMILLE", email:"camille.robert@gmail.com", phone:"0621334455",
    would:"Toulouse", status:"active", createdOn:"2025-01-20",
    payments:[{ ref:"#g01234ab-1234-5678-abcd-111111111111", amount:"590,00 €" }],
    totalHT:"590,00 €", vat:"118,00 €", totalTTC:"708,00 €",
  },
  {
    id:14, name:"PETIT JULIEN", email:"julien.petit@gmail.com", phone:"0688997766",
    would:"Paris", status:"active", createdOn:"2025-01-10",
    payments:[], totalHT:"0,00 €", vat:"0,00 €", totalTTC:"0,00 €",
  },
  {
    id:15, name:"SIMON AURELIE", email:"aurelie.simon@gmail.com", phone:"0612233445",
    would:"Lyon", status:"active", createdOn:"2024-12-25",
    payments:[{ ref:"#h01234ab-9999-8888-7777-666666666666", amount:"275,00 €" }],
    totalHT:"275,00 €", vat:"55,00 €", totalTTC:"330,00 €",
  },
  {
    id:16, name:"MOREL BAPTISTE", email:"baptiste.morel@gmail.com", phone:"0699001122",
    would:"Creil", status:"active", createdOn:"2024-12-15",
    payments:[], totalHT:"0,00 €", vat:"0,00 €", totalTTC:"0,00 €",
  },
];

const PAGE_SIZE = 15;
const ACTIVE_STUDENTS_REPORT_URL = "https://staging2.passpermisfacile.fr/admin/reports/active-students/9eeb7b24-04fc-459b-8b07-d1ed1fb5ff5e/pdf";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default function StudentReport() {
  const [search,    setSearch]    = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate,   setEndDate]   = useState("");
  const [filtered,  setFiltered]  = useState(false);
  const [sort,      setSort]      = useState(null);
  const [page,      setPage]      = useState(1);

  const [appliedSearch,    setAppliedSearch]    = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate,   setAppliedEndDate]   = useState("");

  function handleFilter() {
    setAppliedSearch(search);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setFiltered(true);
    setPage(1);
  }

  function handleReset() {
    setSearch(""); setStartDate(""); setEndDate("");
    setAppliedSearch(""); setAppliedStartDate(""); setAppliedEndDate("");
    setFiltered(false); setPage(1);
  }

  function handleSort(key) {
    setSort(prev => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
    setPage(1);
  }

  let data = [...INITIAL_STUDENTS];
  if (appliedSearch) {
    const q = appliedSearch.toLowerCase();
    data = data.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }
  if (appliedStartDate) data = data.filter(s => s.createdOn >= appliedStartDate);
  if (appliedEndDate)   data = data.filter(s => s.createdOn <= appliedEndDate);
  if (sort) {
    data = [...data].sort((a, b) => {
      const av = String(a[sort.key] ?? "").toLowerCase();
      const bv = String(b[sort.key] ?? "").toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, totalItems);
  const pageData   = data.slice(pageStart, pageEnd);

  function handleExportExcel() {
    const headers = ["Nom", "E-mail", "Téléphone", "Commune", "Statut", "Paiements", "Total HT", "TVA (20 %)", "Total TTC"];
    const rows = data.map((student) => [
      student.name,
      student.email,
      student.phone,
      student.would,
      student.status === "active" ? "Actif" : student.status,
      student.payments.map((payment) => `${payment.ref} : ${payment.amount}`).join(" | ") || "—",
      student.totalHT,
      student.vat,
      student.totalTTC,
    ]);
    const table = `
      <table>
        <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    `;
    const blob = new Blob([`\ufeff${table}`], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rapport-eleves-actifs.xls";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function openReportPdf() {
    window.open(ACTIVE_STUDENTS_REPORT_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="cand-page sr-page">

      {/* ── En-tête ── */}
      <div className="sr-heading">
        <h1 className="sr-title">Rapport des élèves</h1>
        <p className="sr-subtitle">Nombre total d'élèves en base : {INITIAL_STUDENTS.length}</p>
      </div>

      {/* ── Barre d'outils ── */}
      <div className="cand-toolbar sr-toolbar">
        <div className="cand-search-box sr-search">
          <IconSearch />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom, e-mail…"
            onKeyDown={e => { if (e.key === "Enter") handleFilter(); }}
          />
        </div>
        <button className="sr-export-btn" onClick={handleExportExcel}>
          <IconDownload /> Exporter en Excel
        </button>
      </div>

      {/* ── Filtres par date ── */}
      <div className="sr-filter-row">
        <div className="sr-date-group">
          <label className="sr-date-label">Date de début</label>
          <input
            type="date"
            className="sr-date-input"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div className="sr-date-group">
          <label className="sr-date-label">Date de fin</label>
          <input
            type="date"
            className="sr-date-input"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <button className="sr-filter-btn" onClick={handleFilter}>Filtrer</button>
        <button className="sr-reset-btn"  onClick={handleReset}>Réinitialiser</button>
      </div>

      {/* ── Tableau ── */}
      <div className="cand-table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="cand-table sr-table">
            <thead>
              <tr>
                <th>Nom           <SortArrows sortKey={sort} colKey="name"     onSort={handleSort} /></th>
                <th>E-mail        <SortArrows sortKey={sort} colKey="email"    onSort={handleSort} /></th>
                <th>Téléphone     <SortArrows sortKey={sort} colKey="phone"    onSort={handleSort} /></th>
                <th>Commune       <SortArrows sortKey={sort} colKey="would"    onSort={handleSort} /></th>
                <th>Statut        <SortArrows sortKey={sort} colKey="status"   onSort={handleSort} /></th>
                <th>Rapport</th>
                <th>Paiements</th>
                <th>Total HT      <SortArrows sortKey={sort} colKey="totalHT"  onSort={handleSort} /></th>
                <th>TVA (20 %)    <SortArrows sortKey={sort} colKey="vat"      onSort={handleSort} /></th>
                <th>Total TTC     <SortArrows sortKey={sort} colKey="totalTTC" onSort={handleSort} /></th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0
                ? <tr><td colSpan={10} className="cand-empty">Aucun élève trouvé</td></tr>
                : pageData.map(s => (
                  <tr key={s.id}>
                    <td className="sr-name">{s.name}</td>
                    <td className="sr-email">{s.email}</td>
                    <td>{s.phone}</td>
                    <td>{s.would}</td>
                    <td>
                      <span className="sr-status-active">
                        {s.status === "active" ? "Actif" : s.status}
                      </span>
                    </td>
                    <td>
                      <button className="sr-see-btn" onClick={openReportPdf}>Voir</button>
                    </td>
                    <td className="sr-payments-cell">
                      {s.payments.length === 0
                        ? <span className="cand-muted">—</span>
                        : s.payments.map((p, i) => (
                          <div key={i} className="sr-payment-line">
                            <span className="sr-payment-ref">{p.ref}</span>
                            <span className="sr-payment-amt"> : {p.amount}</span>
                          </div>
                        ))
                      }
                    </td>
                    <td className="sr-total-ht">{s.totalHT}</td>
                    <td className="sr-vat">{s.vat}</td>
                    <td className="sr-total-ttc">{s.totalTTC}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="cpf-pagination">
          <button
            className="cpf-page-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
          >
            <IconChevL />
          </button>
          <span className="cpf-page-info">
            {totalItems === 0
              ? "Aucun résultat"
              : `${pageStart + 1} – ${pageEnd} sur ${totalItems} entrées`}
          </span>
          <button
            className="cpf-page-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
          >
            <IconChevR />
          </button>
        </div>
      </div>
    </div>
  );
}
