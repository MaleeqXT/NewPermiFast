import { useState, useRef } from "react";
import "./News.css";

const DRIVING_SCHOOLS = ["PASSPERMISFACILE", "EASY DRIVER'S LICENSE"];

const FILTER_ITEMS = [
  { key: "plusRecent",  label: "Plus récent" },
  { key: "moinsRecent", label: "Moins récent" },
  null,
  { key: "PASSPERMISFACILE",     label: "PASSPERMISFACILE" },
  { key: "EASY DRIVER'S LICENSE", label: "EASY DRIVER'S LICENSE" },
];

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

const today = new Date().toISOString().split("T")[0];

// ── Sort arrows — same logic as all your other components ─────────────────
function SortArrows({ k, sortKey, sortDir, onSort }) {
  return (
    <button className="pf-sort-btn" onClick={() => onSort(k)}>
      <span className={`pf-sort-arrow ${sortKey === k && sortDir === 1 ? "active" : ""}`}>
        <svg width="8" height="8" viewBox="6 11 12 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </span>
      <span className={`pf-sort-arrow ${sortKey === k && sortDir === -1 ? "active" : ""}`}>
        <svg width="8" height="8" viewBox="6 11 12 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}

// ── Image uploader — same logic as PhotoUploader, new css classes ──────────
function NewsImageUploader({ images, setImages }) {
  const fileInputRef = useRef(null);
  const dragIndex    = useRef(null);

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImages(prev => [...prev, ev.target.result]);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemove = (e, i) => {
    e.stopPropagation();
    setImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleDragStart = (e, i) => {
    dragIndex.current = i;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => e.currentTarget.classList.add("news-img-dragging"), 0);
  };

  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (dragIndex.current !== i) e.currentTarget.classList.add("news-img-over");
  };

  const handleDragLeave = (e) => e.currentTarget.classList.remove("news-img-over");

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    e.currentTarget.classList.remove("news-img-over");
    const from = dragIndex.current;
    if (from === null || from === dropIdx) return;
    setImages(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(dropIdx, 0, moved);
      return next;
    });
    dragIndex.current = null;
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("news-img-dragging");
    dragIndex.current = null;
    document.querySelectorAll(".news-img-card").forEach(el => el.classList.remove("news-img-over"));
  };

  return (
    <div className="news-img-area">
      {images.map((src, i) => (
        <div
          key={i}
          className="news-img-card"
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
        >
          <img src={src} alt="" className="news-img-thumb" draggable={false} />
          <button className="news-img-remove" onClick={(e) => handleRemove(e, i)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}

      <div className="news-img-add" onClick={handleClick}>
        <span className="news-img-add-icon">+</span>
        <span className="news-img-add-text">Ajouter une image</span>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
}

// ── Main News component ───────────────────────────────────────────────────
export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [search, setSearch]     = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters]   = useState({
    plusRecent: false, moinsRecent: false,
    "PASSPERMISFACILE": false, "EASY DRIVER'S LICENSE": false,
  });
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState(1);

  // "add" = show add form, "edit" = show edit form, null = show list
  const [view, setView]         = useState(null);
  // Which news item is being edited (the whole object)
  const [editingItem, setEditingItem] = useState(null);

  // Form fields
  const [form, setForm]     = useState({ titre: "", contenu: "", school: "" });
  const [images, setImages] = useState([]);

  // Count active filters for the badge
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // ── Filter + sort ────────────────────────────────────────────────────────
  let data = [...newsList];

  if (search) data = data.filter(n =>
    n.titre.toLowerCase().includes(search.toLowerCase()) ||
    n.school.toLowerCase().includes(search.toLowerCase())
  );

  // Filter by school
  const activeSchools = DRIVING_SCHOOLS.filter(s => filters[s]);
  if (activeSchools.length) data = data.filter(n => activeSchools.includes(n.school));

  if (sortKey) {
    data.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
    });
  } else if (filters.plusRecent) {
    data.sort((a, b) => (a.date < b.date ? 1 : -1));
  } else if (filters.moinsRecent) {
    data.sort((a, b) => (a.date < b.date ? -1 : 1));
  }

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  }

  function toggleFilter(key) {
    // plusRecent and moinsRecent are mutually exclusive
    if (key === "plusRecent")       setFilters(f => ({ ...f, plusRecent: !f.plusRecent, moinsRecent: false }));
    else if (key === "moinsRecent") setFilters(f => ({ ...f, moinsRecent: !f.moinsRecent, plusRecent: false }));
    else                            setFilters(f => ({ ...f, [key]: !f[key] }));
  }

  // ── Open add form ────────────────────────────────────────────────────────
  function openAdd() {
    setForm({ titre: "", contenu: "", school: "" });
    setImages([]);
    setEditingItem(null);
    setView("add");
  }

  // ── Open edit form — pre-fills with existing data ─────────────────────
  function openEdit(item) {
    setForm({ titre: item.titre, contenu: item.contenu || "", school: item.school });
    setImages(item.images || []);
    setEditingItem(item);
    setView("edit");
  }

  // ── Cancel — go back to list ──────────────────────────────────────────
  function handleCancel() {
    setView(null);
    setEditingItem(null);
  }

  // ── Save new item ─────────────────────────────────────────────────────
  function handleAdd() {
    if (!form.titre.trim()) return;
    setNewsList(prev => [
      { id: Date.now(), titre: form.titre.trim(), contenu: form.contenu, school: form.school || "—", date: today, images },
      ...prev,
    ]);
    setView(null);
  }

  // ── Save edits — updates the existing item ───────────────────────────
  // We find the item by id and replace it with the new form values
  function handleUpdate() {
    if (!form.titre.trim()) return;
    setNewsList(prev =>
      prev.map(n =>
        n.id === editingItem.id
          ? { ...n, titre: form.titre.trim(), contenu: form.contenu, school: form.school || "—", images }
          : n
      )
    );
    setView(null);
    setEditingItem(null);
  }

  // ── Delete from edit form ────────────────────────────────────────────
  function handleDeleteFromEdit() {
    setNewsList(prev => prev.filter(n => n.id !== editingItem.id));
    setView(null);
    setEditingItem(null);
  }

  // ════════════════════════════════════════════════════════════════════════
  // FORM VIEW — used for both Add and Edit
  // ════════════════════════════════════════════════════════════════════════
  if (view === "add" || view === "edit") {
    const isEdit = view === "edit";

    return (
      <div className="news-form-page">

        {/* Top row: back arrow (left) + Supprimer button (right, only in edit) */}
        <div className="news-form-topbar">
          <button className="news-back-btn" onClick={handleCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>

          {/* Only show Supprimer in edit mode */}
          {isEdit && (
            <button className="news-btn-delete" onClick={handleDeleteFromEdit}>
              Supprimer
            </button>
          )}
        </div>

        {/* White card */}
        <div className="news-form-card">
          {/* Title: "Ajouter News" or "Actualité [school name]" */}
          <h2 className="news-form-title">
            {isEdit ? `Actualité ${editingItem.school}` : "Ajouter News"}
          </h2>
          <hr className="news-form-divider" />

          <div className="news-field">
            <label className="news-label">Titre</label>
            <input
              className="news-input"
              placeholder="Titre de l'actualité"
              value={form.titre}
              onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            />
          </div>

          <div className="news-field">
            <label className="news-label">Contenu</label>
            <textarea
              className="news-textarea"
              placeholder="Contenu de l'actualité"
              value={form.contenu}
              onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
            />
          </div>

          <div className="news-field">
            <label className="news-label">Auto-école</label>
            <select
              className="news-select"
              value={form.school}
              onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
            >
              <option value="">Sélectionner des auto-écoles</option>
              {DRIVING_SCHOOLS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="news-field">
            <label className="news-label">Images</label>
            <NewsImageUploader images={images} setImages={setImages} />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="news-form-footer">
          <button className="news-btn-cancel" onClick={handleCancel}>Annuler</button>
          {/* Same button, different action depending on add vs edit */}
          <button
            className="news-btn-save"
            onClick={isEdit ? handleUpdate : handleAdd}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="pf-page">

      <div className="pf-toolbar">
        <div className="pf-search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." />
        </div>

        {/* Filtre with dropdown + active count badge */}
        <div className="pf-filter-wrapper">
          <button className="pf-btn" onClick={() => setFilterOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filtre
            {activeFilterCount > 0 && (
              <span className="pf-filter-count">{activeFilterCount}</span>
            )}
          </button>

          {filterOpen && (
            <div className="pf-filter-dropdown">
              {FILTER_ITEMS.map((item, i) =>
                item === null
                  ? <hr key={i} className="pf-filter-divider" />
                  : (
                    <label key={item.key} className="pf-filter-option">
                      <input
                        type="checkbox"
                        checked={filters[item.key]}
                        onChange={() => toggleFilter(item.key)}
                      />
                      {item.label}
                    </label>
                  )
              )}
            </div>
          )}
        </div>

        <button className="pf-btn pf-btn1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
          Exporter
        </button>

        <button className="pf-btn pf-btn-dark pf-btn1" onClick={openAdd}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          Ajouter une actualité Permifast
        </button>
      </div>

      <div className="pf-table-card">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Titre <SortArrows k="titre" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /></th>
              <th>Auto-école <SortArrows k="school" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /></th>
              <th>Créé le <SortArrows k="date" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={4} className="pf-empty">Aucune actualité trouvée</td></tr>
            ) : data.map(n => (
              <tr key={n.id}>
                <td>{n.titre}</td>
                <td>{n.school}</td>
                <td>{formatDate(n.date)}</td>
                <td>
                  {/* 3-dot menu button — clicking opens the edit form */}
                  <button
                    className="news-dots-btn"
                    onClick={() => openEdit(n)}
                    title="Modifier"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}