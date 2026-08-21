import { useEffect, useState } from "react";
import "./MessageClients.css";
import http from "../../helpers/http.jsx";

const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IconChevL   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const PAGE_SIZE = 15;

function toMessage(contact) {
  const createdAt = contact.created_at ? new Date(contact.created_at) : null;
  return {
    id: contact.id,
    client: [contact.prenom, contact.nom].filter(Boolean).join(" ") || "—",
    email: contact.email || "—",
    phone: contact.phone || "—",
    subject: contact.subject || "—",
    message: contact.message || "",
    date: createdAt && !Number.isNaN(createdAt.getTime())
      ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(createdAt)
      : "—",
    unread: !Boolean(contact.is_read),
    isMonday: createdAt?.getDay() === 1,
  };
}

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

export default function MessageClients() {
  const [activeTab, setActiveTab] = useState("unread");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadMessages() {
      try {
        const { data } = await http.get("/admin/contacts");
        if (active) setMessages((data?.data ?? []).map(toMessage));
      } catch (error) {
        if (active) setLoadError(error?.response?.data?.message || "Impossible de charger les messages clients.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMessages();
    return () => { active = false; };
  }, []);

  const counts = {
    all: messages.length,
    unread: messages.filter((m) => m.unread).length,
    monday: messages.filter((m) => m.isMonday).length,
  };

  const TABS = [
    { key: "all",    label: "Tous",    count: counts.all },
    { key: "unread", label: "Non lus", count: counts.unread },
    { key: "monday", label: "Lundi",   count: counts.monday },
  ];

  let data = messages.filter((m) => {
    if (activeTab === "unread") return m.unread;
    if (activeTab === "monday") return m.isMonday;
    return true;
  });

  if (search) {
    const q = search.toLowerCase();
    data = data.filter(
      (m) =>
        m.client.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }

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

  function handleTabClick(key) {
    setActiveTab(key);
    setPage(1);
  }

  function handleSort(key) {
    setSort((prev) => prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 });
    setPage(1);
  }

  return (
    <div className="cand-page">

      {/* ── En-tête ── */}
      <h1 className="msg-title">Messages clients</h1>

      {/* ── Card ── */}
      <div className="cand-table-card">

        {/* ── Tabs + search ── */}
        <div className="msg-card-toolbar">
          <div className="cand-tabs-row msg-tabs-row">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`cand-tab${activeTab === tab.key ? " active" : ""}`}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
                <span className="cand-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="cand-search-box msg-search-inline">
            <IconSearch />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher un client, un sujet…"
            />
          </div>
        </div>

        {/* ── Tableau ── */}
        <div className="cand-table-scroll">
          {loadError && <p className="cand-empty">{loadError}</p>}
          <table className="cand-table">
            <thead>
              <tr>
                <th>Client                 <SortArrows sortKey={sort} colKey="client"  onSort={handleSort} /></th>
                <th>Email et téléphone     <SortArrows sortKey={sort} colKey="email" onSort={handleSort} /></th>
                <th>Sujet                  <SortArrows sortKey={sort} colKey="subject" onSort={handleSort} /></th>
                <th>Message</th>
                <th>Date                   <SortArrows sortKey={sort} colKey="date"    onSort={handleSort} /></th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={5} className="cand-empty">{loading ? "Chargement des messages…" : "Aucun message trouvé"}</td></tr>
              ) : (
                pageData.map((m) => (
                  <tr key={m.id} className={m.unread ? "msg-row-unread" : ""}>
                    <td>{m.client}</td>
                    <td>
                      <div className="msg-email-cell">
                        <span className="msg-email-line">{m.email}</span>
                        <span className="msg-phone-line">{m.phone}</span>
                      </div>
                    </td>
                    <td className="msg-subject-cell">{m.subject}</td>
                    <td className="msg-message-cell" title={m.message}>{m.message}</td>
                    <td className="msg-date-cell">{m.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="msg-pagination">
          <button className="msg-page-btn" onClick={() => setPage((c) => Math.max(1, c - 1))} disabled={safePage <= 1}>
            <IconChevL />
          </button>
          <span className="msg-page-info">
            {totalItems === 0
              ? "Aucune entrée"
              : `${pageStart + 1}-${pageEnd} sur ${totalItems} élément${totalItems > 1 ? "s" : ""}`}
          </span>
          <button className="msg-page-btn" onClick={() => setPage((c) => Math.min(totalPages, c + 1))} disabled={safePage >= totalPages}>
            <IconChevR />
          </button>
        </div>
      </div>
    </div>
  );
}
