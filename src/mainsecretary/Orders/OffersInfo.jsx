import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
/* ─── Inline styles mirroring CandidateForm.css aesthetic ─── */
const S = {
  root: {
    display: "flex", gap: 22, alignItems: "flex-start",
    fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif", fontSize: 14,
    color: "#111827", padding: "28px 32px 48px", boxSizing: "border-box",
    background: "#f5f6f8", minHeight: "100vh", position: "relative",
  },
  left: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 },
  header: { display: "flex", alignItems: "center", gap: 14, marginBottom: 4 },
  backBtn: {
    background: "none", border: "none", cursor: "pointer", color: "#6b7280",
    display: "flex", alignItems: "center", padding: 6, borderRadius: 8,
    transition: "background 0.15s,color 0.15s",
  },
  title: { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.01em" },
  card: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
    padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, color: "#6b7280", fontWeight: 500 },
  input: {
    width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 13px",
    fontSize: 14, fontFamily: "inherit", color: "#111827", background: "#fff",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s,box-shadow 0.15s",
    appearance: "none", WebkitAppearance: "none",
  },
  textarea: { resize: "vertical", minHeight: 80, paddingTop: 10 },
  right: {
    width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12,
    marginTop: 52, position: "sticky", top: 28, alignSelf: "flex-start",
  },
  rightCard: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px",
  },
  rightRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  rightLabel: { fontSize: 13, fontWeight: 500, color: "#374151" },
  colorSwatch: (color) => ({
    width: 48, height: 32, borderRadius: 8, background: color,
    border: "1px solid #e5e7eb", cursor: "pointer", flexShrink: 0,
  }),
  saveBtn: {
    width: "100%", padding: 13, border: "none", borderRadius: 10,
    background: "#333", color: "#fff", fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
  },
  giveUpBtn: {
    width: "100%", padding: 13, border: "1px solid #e5e7eb", borderRadius: 10,
    background: "#fff", color: "#374151", fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  },
  toggle: { position: "relative", width: 44, height: 24, cursor: "pointer", flexShrink: 0 },
  toggleInput: { opacity: 0, width: 0, height: 0, position: "absolute" },
  boxToggle: { display: "flex", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" },
  boxOpt: (sel) => ({
    flex: 1, padding: "5px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer",
    border: "none", fontFamily: "inherit",
    background: sel ? "#111827" : "none",
    color: sel ? "#fff" : "#6b7280",
    transition: "background 0.15s,color 0.15s",
  }),
  photoCard: {
    background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: 12,
    padding: "24px 16px", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", overflow: "hidden", minHeight: 120,
  },
  photoPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" },
};

/* ─── SVG Icons ─── */
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);
const ChevronDown = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
    fill="none" stroke="#c9cdd4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

/* ─── Toggle component ─── */
function Toggle({ checked, onChange }) {
  return (
    <label style={S.toggle}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={S.toggleInput} />
      <span style={{
        position: "absolute", inset: 0,
        background: checked ? "#111827" : "#d1d5db",
        borderRadius: 12, transition: "background 0.2s", cursor: "pointer",
      }}>
        <span style={{
          position: "absolute", width: 18, height: 18,
          left: 3, top: 3, background: "#fff", borderRadius: "50%",
          transition: "transform 0.2s",
          transform: checked ? "translateX(20px)" : "translateX(0)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </span>
    </label>
  );
}

/* ─── Generic select dropdown with X clear ─── */
function SelectField({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && <div style={{ ...S.label, marginBottom: 6 }}>{label}</div>}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 13px",
        background: "#fff", cursor: "pointer", fontSize: 14,
        color: value ? "#111827" : "#9ca3af",
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ flex: 1 }}>{value || placeholder}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {value && (
            <span onClick={e => { e.stopPropagation(); onChange(""); }}
              style={{ color: "#9ca3af", display: "flex", cursor: "pointer" }}>
              <XIcon />
            </span>
          )}
          <span style={{ color: "#9ca3af" }}><ChevronDown /></span>
        </div>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 200, overflow: "hidden",
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "11px 16px", fontSize: 14, cursor: "pointer",
                background: value === opt ? "#f0f9ff" : "#fff",
                color: value === opt ? "#2563eb" : "#111827",
                fontWeight: value === opt ? 600 : 400,
                borderBottom: "1px solid #f9fafb",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = value === opt ? "#f0f9ff" : "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background = value === opt ? "#f0f9ff" : "#fff"}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Rich Text Editor ─── */
function RichEditor({ placeholder = "Add content here..." }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    updateFormats();
  };

  const updateFormats = () => {
    const active = new Set();
    if (document.queryCommandState("bold")) active.add("bold");
    if (document.queryCommandState("italic")) active.add("italic");
    if (document.queryCommandState("underline")) active.add("underline");
    setActiveFormats(active);
  };

  const toolbarBtnStyle = (fmt) => ({
    background: activeFormats.has(fmt) ? "#f3f4f6" : "none",
    border: "none", cursor: "pointer", borderRadius: 6, padding: "4px 7px",
    color: activeFormats.has(fmt) ? "#111827" : "#374151",
    fontWeight: fmt === "bold" ? 700 : 400,
    fontStyle: fmt === "italic" ? "italic" : "normal",
    textDecoration: fmt === "underline" ? "underline" : "none",
    fontSize: 14, display: "flex", alignItems: "center", transition: "background 0.1s",
  });

  const iconBtnStyle = {
    background: "none", border: "none", cursor: "pointer", borderRadius: 6,
    padding: "4px 7px", color: "#374151", display: "flex", alignItems: "center",
    transition: "background 0.1s",
  };

  const headingOptions = ["Normal", "H1", "H2", "H3"];
  const [heading, setHeading] = useState("Normal");
  const applyHeading = (h) => {
    setHeading(h);
    exec("formatBlock", h === "Normal" ? "p" : h.toLowerCase());
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "8px 10px",
        borderBottom: "1px solid #e5e7eb", background: "#fafafa", flexWrap: "wrap",
      }}>
        {/* Heading select */}
        <div style={{ position: "relative", marginRight: 4 }}>
          <select value={heading} onChange={e => applyHeading(e.target.value)}
            style={{
              border: "1px solid #e5e7eb", borderRadius: 6, padding: "3px 24px 3px 8px",
              fontSize: 13, background: "#fff", cursor: "pointer", appearance: "none",
              WebkitAppearance: "none", fontFamily: "inherit", color: "#374151",
            }}>
            {headingOptions.map(h => <option key={h}>{h}</option>)}
          </select>
          <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <ChevronDown size={12} />
          </span>
        </div>

        <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px" }} />

        <button style={toolbarBtnStyle("bold")} onMouseDown={e => { e.preventDefault(); exec("bold"); }}><b>B</b></button>
        <button style={toolbarBtnStyle("italic")} onMouseDown={e => { e.preventDefault(); exec("italic"); }}><i>I</i></button>
        <button style={toolbarBtnStyle("underline")} onMouseDown={e => { e.preventDefault(); exec("underline"); }}><u>U</u></button>

        <div style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 4px" }} />

        {/* Link */}
        <button style={iconBtnStyle} title="Insert link"
          onMouseDown={e => { e.preventDefault(); const url = prompt("Enter URL"); if (url) exec("createLink", url); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        {/* Ordered list */}
        <button style={iconBtnStyle} title="Ordered list"
          onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
          </svg>
        </button>

        {/* Unordered list */}
        <button style={iconBtnStyle} title="Bullet list"
          onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
            <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
          </svg>
        </button>

        {/* Clear formatting */}
        <button style={iconBtnStyle} title="Clear formatting"
          onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h16v3"/><path d="M5 20h6"/><path d="M13 4 8 20"/>
            <line x1="17" y1="14" x2="22" y2="19"/><line x1="22" y1="14" x2="17" y2="19"/>
          </svg>
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onKeyUp={updateFormats}
        onMouseUp={updateFormats}
        style={{
          minHeight: 120, padding: "12px 14px", outline: "none",
          fontSize: 14, lineHeight: 1.6, color: "#111827", background: "#fff",
        }}
        data-placeholder={placeholder}
        onFocus={e => { if (!e.currentTarget.textContent) e.currentTarget.style.color = "#111827"; }}
      />

      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
        [contenteditable] ul { padding-left: 20px; margin: 4px 0; }
        [contenteditable] ol { padding-left: 20px; margin: 4px 0; }
        [contenteditable] li { margin: 2px 0; }
        [contenteditable] a { color: #2563eb; }
      `}</style>
    </div>
  );
}

/* ─── Color Picker swatch ─── */
function ColorPicker({ value, onChange }) {
  const inputRef = useRef(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={S.rightLabel}>Color</span>
      <div style={{ marginLeft: "auto", position: "relative" }}>
        <div
          style={{ ...S.colorSwatch(value), width: 56, height: 32 }}
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function ModifyOffer({ onBack }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/orders/offers");
  };

  const [form, setForm] = useState({
    productName: "Pass permis Manuelle F5",
    productDescription: "Besoin de quelques heures en plus en boîte manuelle ? ou d'un pack complet pour bien maîtriser la conduite ? ce pack vous conviendra parfaitement.",
    type: "",
    typeOfOffer: "",
    learningMethod: "BM",
    cpfOffer: true,
    color: "#9333ea",
    isPannierOffer: true,
    activated: true,
    displayOrder: "",
    priceExclVAT: "320",
    priceInclVAT: "320",
    priceAfterDiscount: "",
    balance: "5",
    balance2: "",
    paymentTranche: "",
    totalPayment: "",
    secondPrize: "",
    agencyName: "",
    boxType: "Manuel",
  });

  const [photo, setPhoto] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  const TYPE_OPTIONS = ["Driving Course Offer", "Road Code Training Offer"];
  const TYPE_OF_OFFER_OPTIONS = ["Type of Offer", "Practical Exam", "Online Exam"];

  return (
    <div style={S.root}>

      {/* ══ LEFT ══ */}
      <div style={S.left}>

        {/* Header */}
        <div style={S.header}>
          <button style={S.backBtn} onClick={handleBack}
            onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#111827"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280"; }}>
            <BackIcon />
          </button>
          <h1 style={S.title}>Modify offer</h1>
        </div>

        {/* Card 1: Offer details */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Offer details</h2>

          <div style={S.field}>
            <label style={S.label}>Product Name</label>
            <input
              style={S.input}
              value={form.productName}
              onChange={e => set("productName", e.target.value)}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Product description</label>
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={form.productDescription}
              onChange={e => set("productDescription", e.target.value)}
              rows={3}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Rich text editor */}
          <RichEditor placeholder="Add detailed content, bullet points, numbered lists…" />

          {/* Type + Type of offer */}
          <div style={S.grid2}>
            <SelectField
              value={form.type}
              onChange={v => set("type", v)}
              options={TYPE_OPTIONS}
              placeholder="Type"
            />
            <SelectField
              value={form.typeOfOffer}
              onChange={v => set("typeOfOffer", v)}
              options={TYPE_OF_OFFER_OPTIONS}
              placeholder="Type of offer"
            />
          </div>

          {/* Learning method */}
          <div style={{ ...S.rightRow }}>
            <span style={S.label}>Learning method</span>
            <div style={{ ...S.boxToggle, marginLeft: "auto" }}>
              {["BM", "NOT"].map(opt => (
                <button
                  key={opt}
                  style={S.boxOpt(form.learningMethod === opt)}
                  onClick={() => set("learningMethod", opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* CPF offer */}
          <div style={S.rightRow}>
            <span style={S.label}>CPF offer</span>
            <Toggle checked={form.cpfOffer} onChange={v => set("cpfOffer", v)} />
          </div>
        </div>

        {/* Card 2: Price (Cry) */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Price (Cry)</h2>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Price excluding VAT</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={form.priceExclVAT}
                  onChange={e => set("priceExclVAT", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Base price (including VAT)</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={form.priceInclVAT}
                  onChange={e => set("priceInclVAT", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>The price after discount</label>
              <input style={S.input} value={form.priceAfterDiscount} placeholder=""
                onChange={e => set("priceAfterDiscount", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Balance</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={form.balance}
                  onChange={e => set("balance", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>H</span>
              </div>
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Balance (2)</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={form.balance2}
                  onChange={e => set("balance2", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>H</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Payment tranche</label>
              <input style={S.input} value={form.paymentTranche}
                onChange={e => set("paymentTranche", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Total Payment</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={form.totalPayment}
                  onChange={e => set("totalPayment", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Second prize</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={form.secondPrize}
                  onChange={e => set("secondPrize", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
          </div>

          {/* Agency name */}
          <div style={S.field}>
            <label style={S.label}>Agency name</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...S.input, paddingRight: 36 }} value={form.agencyName}
                onChange={e => set("agencyName", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
              {form.agencyName && (
                <button onClick={() => set("agencyName", "")} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
                  display: "flex", alignItems: "center",
                }}>
                  <XIcon />
                </button>
              )}
            </div>
          </div>

          {/* Rich text editor for notes */}
          <RichEditor placeholder="Additional notes about the price…" />
        </div>

      </div>

      {/* ══ RIGHT PANEL ══ */}
      <aside style={S.right}>

        {/* Color */}
        <div style={S.rightCard}>
          <ColorPicker value={form.color} onChange={v => set("color", v)} />
        </div>

        {/* This is a Pannier offer */}
        <div style={{ ...S.rightCard, ...S.rightRow }}>
          <span style={S.rightLabel}>This is a Pannier offer</span>
          <Toggle checked={form.isPannierOffer} onChange={v => set("isPannierOffer", v)} />
        </div>

        {/* Activated */}
        <div style={{ ...S.rightCard, ...S.rightRow }}>
          <span style={S.rightLabel}>Activated</span>
          <Toggle checked={form.activated} onChange={v => set("activated", v)} />
        </div>

        {/* Product image */}
        <div style={S.photoCard} onClick={() => fileRef.current.click()}>
          {photo ? (
            <img src={photo} alt="product" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
          ) : (
            <div style={S.photoPlaceholder}>
              <PhotoIcon />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Empty at the moment</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Tap here to add an image.</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />

        {/* Display order */}
        <div style={S.rightCard}>
          <label style={{ ...S.label, marginBottom: 6 }}>Display order</label>
          <input style={S.input} value={form.displayOrder} type="number" min="0"
            onChange={e => set("displayOrder", e.target.value)}
            placeholder="0"
            onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
        </div>

        {/* Modify offer */}
        <button style={S.saveBtn}
          onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
          onMouseLeave={e => e.currentTarget.style.background = "#22c55e"}
          onClick={() => alert("Offer modified!")}>
          Modify offer
        </button>

        {/* Give up */}
        <button style={S.giveUpBtn}
          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          onClick={onBack}>
          Give up
        </button>

      </aside>
    </div>
  );
}
