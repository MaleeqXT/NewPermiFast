import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Online.css";
import FileManager from "../shared/FileManeger";

// ── RichEditor ────────────────────────────────────────────────────────────────
const ChevronDown = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

function RichEditor({ placeholder = "Ajouter du contenu ici..." }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    updateFormats();
  };

  const updateFormats = () => {
    const active = new Set();
    if (document.queryCommandState("bold"))      active.add("bold");
    if (document.queryCommandState("italic"))    active.add("italic");
    if (document.queryCommandState("underline")) active.add("underline");
    setActiveFormats(active);
  };

  const tbBtn = (fmt) => ({
    background: activeFormats.has(fmt) ? "#f3f4f6" : "none",
    border: "none", cursor: "pointer", borderRadius: 6, padding: "4px 7px",
    color: activeFormats.has(fmt) ? "#111827" : "#374151",
    fontWeight: fmt === "bold" ? 700 : 400,
    fontStyle: fmt === "italic" ? "italic" : "normal",
    textDecoration: fmt === "underline" ? "underline" : "none",
    fontSize: 14, display: "flex", alignItems: "center",
  });

  const iconBtn = {
    background: "none", border: "none", cursor: "pointer", borderRadius: 6,
    padding: "4px 7px", color: "#374151", display: "flex", alignItems: "center",
  };

  const [heading, setHeading] = useState("Normal");
  const applyHeading = (h) => {
    setHeading(h);
    exec("formatBlock", h === "Normal" ? "p" : h.toLowerCase());
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "8px 10px",
        borderBottom: "1px solid #e5e7eb", background: "#fafafa", flexWrap: "wrap",
      }}>
        <div style={{ position: "relative", marginRight: 4 }}>
          <select value={heading} onChange={e => applyHeading(e.target.value)}
            style={{
              border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 24px 3px 8px",
              fontSize: 13, background: "#fff", cursor: "pointer", appearance: "none",
              WebkitAppearance: "none", fontFamily: "inherit", color: "#374151",
            }}>
            {["Normal","H1","H2","H3"].map(h => <option key={h}>{h}</option>)}
          </select>
          <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <ChevronDown size={12} />
          </span>
        </div>
        <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px" }} />
        <button style={tbBtn("bold")}      onMouseDown={e => { e.preventDefault(); exec("bold"); }}><b>B</b></button>
        <button style={tbBtn("italic")}    onMouseDown={e => { e.preventDefault(); exec("italic"); }}><i>I</i></button>
        <button style={tbBtn("underline")} onMouseDown={e => { e.preventDefault(); exec("underline"); }}><u>U</u></button>
        <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px" }} />
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); const url = prompt("URL"); if (url) exec("createLink", url); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </button>
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </button>
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M5 20h6"/><path d="M13 4 8 20"/><line x1="17" y1="14" x2="22" y2="19"/><line x1="22" y1="14" x2="17" y2="19"/></svg>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onKeyUp={updateFormats}
        onMouseUp={updateFormats}
        style={{ minHeight: 160, padding: "12px 14px", outline: "none", fontSize: 14, lineHeight: 1.6, color: "#111827", background: "#fff" }}
        data-placeholder={placeholder}
      />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}[contenteditable] ul{padding-left:20px;margin:4px 0}[contenteditable] ol{padding-left:20px;margin:4px 0}[contenteditable] li{margin:2px 0}[contenteditable] a{color:#2563eb}`}</style>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ALL_OFFERS = [
  { id:1,  name:"Driving licence pass, BM assessment time",  price:"38,00 €",   color:"#333"    },
  { id:2,  name:"Driving licence pass, BA assessment time",  price:"45,00 €",   color:"#333"    },
  { id:3,  name:"Manual F5 driving licence pass",            price:"320,00 €",  color:"#f59e0b" },
  { id:4,  name:"Manual F10 driving licence pass",           price:"590,00 €",  color:"#f59e0b" },
  { id:5,  name:"Manual F20 driving licence pass",           price:"1090,00 €", color:"#22c55e" },
  { id:6,  name:"Automatic F5 driving licence pass",         price:"315,00 €",  color:"#3b82f6" },
  { id:7,  name:"Automatic F13 Driving Licence Pass",        price:"790,00 €",  color:"#3b82f6" },
  { id:8,  name:"Automatic F20 Driving Licence Pass",        price:"1180,00 €", color:"#3b82f6" },
  { id:9,  name:"Pass permis Turbo F13 BA",                  price:"1290,00 €", color:"#ef4444" },
  { id:10, name:"Discovery Driving Licence Pass",            price:"120,00 €",  color:"#8b5cf6" },
];

const CODE_OFFERS = [
  { id:101, name:"Driving Licence Code Pass (Intensive)", price:"190,00 €", selected: true },
  { id:102, name:"Driving licence code pass",             price:"29,90 €",  selected: true },
];

const MAX_WELCOME_OFFERS = 3;

const INITIAL_WELCOME = [
  ALL_OFFERS.find(o => o.id === 1),
  ALL_OFFERS.find(o => o.id === 5),
  ALL_OFFERS.find(o => o.id === 7),
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

// ═══════════════════════════════════════════════════════════════════════════════
// Welcome Page
// ═══════════════════════════════════════════════════════════════════════════════
function WelcomePage() {
  const [selected, setSelected] = useState(INITIAL_WELCOME);
  const [dropOpen, setDropOpen] = useState(false);
  const [dirty,    setDirty]    = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const remaining = MAX_WELCOME_OFFERS - selected.length;
  const canAdd    = remaining > 0;

  function addOffer(offer) {
    if (!canAdd) return;
    if (selected.find(o => o.id === offer.id)) return;
    setSelected(prev => [...prev, offer]);
    setDirty(true);
    setDropOpen(false);
  }

  function removeOffer(id) {
    setSelected(prev => prev.filter(o => o.id !== id));
    setDirty(true);
  }

  return (
    <div className="sel-page-body">
      <h2 className="sel-section-title">
        Choisir {MAX_WELCOME_OFFERS} offres à afficher sur la page d'accueil
      </h2>

      <div className="sel-drop-anchor" ref={dropRef}>
        <button
          className="sel-drop-trigger"
          onClick={() => canAdd && setDropOpen(o => !o)}
          style={{ opacity: canAdd ? 1 : 0.6, cursor: canAdd ? "pointer" : "not-allowed" }}
        >
          <span>{remaining} offre{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""}</span>
          <ChevronDown size={14} />
        </button>

        {dropOpen && (
          <div className="sel-drop-list">
            {ALL_OFFERS
              .filter(o => !selected.find(s => s.id === o.id))
              .map(offer => (
                <button key={offer.id} className="sel-drop-item" onClick={() => addOffer(offer)}>
                  {offer.name}
                </button>
              ))
            }
          </div>
        )}
      </div>

      <div className="sel-meta-row">
        <span className="sel-meta-text">
          Le nombre maximum d'offres que vous pouvez ajouter est {MAX_WELCOME_OFFERS}.
        </span>
        <button className="sel-select-link" onClick={() => setDropOpen(o => !o)} disabled={!canAdd}>
          ({remaining}) Sélectionner une offre
        </button>
      </div>

      <div className="sel-offers-list">
        {selected.map(offer => (
          <div key={offer.id} className="sel-offer-row">
            <div className="sel-offer-icon" style={{ background: offer.color + "22", border: `1.5px solid ${offer.color}44` }}>
              <span style={{ color: offer.color, fontSize: 11, fontWeight: 700 }}>
                {offer.name.slice(0,2).toUpperCase()}
              </span>
            </div>
            <span className="sel-offer-name">{offer.name}</span>
            <button className="sel-offer-del" onClick={() => removeOffer(offer.id)}>
              <IconTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="sel-footer">
        <button className="sel-btn-ghost" onClick={() => { setSelected(INITIAL_WELCOME); setDirty(false); }}>
          Réinitialiser
        </button>
        <button
          className={`sel-btn-save ${dirty ? "sel-btn-save--active" : ""}`}
          disabled={!dirty}
          onClick={() => setDirty(false)}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Code Page
// ═══════════════════════════════════════════════════════════════════════════════
function CodePage() {
  const [codes,   setCodes]   = useState(CODE_OFFERS);
  const [enabled, setEnabled] = useState(true);
  const [dirty,   setDirty]   = useState(false);
  const [photo,   setPhoto]   = useState(null);

  function toggleCode(id) {
    setCodes(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
    setDirty(true);
  }

  return (
    <div className="sel-page-body sel-code-body">

      {/* ── Left: form ── */}
      <div className="sel-code-left">
        <input className="sel-input" placeholder="Titre de l'offre de code" onChange={() => setDirty(true)} />
        <input className="sel-input" placeholder="Sous-titre"               onChange={() => setDirty(true)} />
        <RichEditor placeholder="Description..." />

        <div className="sel-code-choose-label">Choisir le code souhaité</div>
        <div className="sel-code-list">
          {codes.map(code => (
            <button
              key={code.id}
              className={`sel-code-item ${code.selected ? "sel-code-item--selected" : ""}`}
              onClick={() => toggleCode(code.id)}
            >
              <div className="sel-code-bar" />
              <div className="sel-code-info">
                <span className="sel-code-name">{code.name}</span>
                <span className="sel-code-price">Prix : {code.price}</span>
              </div>
              {code.selected && <span className="sel-code-check"><IconCheck /></span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: enable toggle + FileManager ── */}
      <div className="sel-code-right">

        <div className="sel-enable-row">
          <div className={`sel-enable-dot ${enabled ? "sel-enable-dot--on" : ""}`} />
          <div>
            <div className="sel-enable-label">Activer</div>
            <div className="sel-enable-sub">Activer l'offre sur la page code</div>
          </div>
          <label className="sel-toggle" style={{ marginLeft: "auto" }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => { setEnabled(e.target.checked); setDirty(true); }}
              style={{ display: "none" }}
            />
            <span className="sel-toggle-track" style={{ background: enabled ? "#333333" : "#e5e7eb" }}>
              <span className="sel-toggle-thumb" style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }} />
            </span>
          </label>
        </div>

        <FileManager
          selectedSrc={photo}
          onSelect={(src) => { setPhoto(src); setDirty(true); }}
        />

      </div>

      {/* Footer */}
      <div className="sel-footer sel-footer--code">
        <button className="sel-btn-ghost" onClick={() => setDirty(false)}>Réinitialiser</button>
        <button
          className={`sel-btn-save ${dirty ? "sel-btn-save--active" : ""}`}
          disabled={!dirty}
          onClick={() => setDirty(false)}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { key: "welcome", label: "Accueil" },
  { key: "code",    label: "Code"    },
];

export default function SiteEnLigne() {
  const [activeTab, setActiveTab] = useState("welcome");

  return (
    <div className="sel-root">

      <h1 className="sel-page-heading" style={{ marginBottom: '15px' }}>Pages</h1>

      <div className="cand-tabs-row sel-tabs-override">
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

      {activeTab === "welcome" && <WelcomePage />}
      {activeTab === "code"    && <CodePage />}

    </div>
  );
}