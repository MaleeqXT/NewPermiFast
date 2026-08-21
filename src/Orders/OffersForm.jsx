import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addOffer } from "../redux/reducers/offerSlice"; // adjust path to your slice
import ActionToast from "../Components/shared/ActionToast";
import FileManager from "../mainsecretary/Components/shared/FileManeger.jsx";
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
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 2 },
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
    background: "#22c55e", color: "#fff", fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
  },
  saveBtnDisabled: {
    width: "100%", padding: 13, border: "none", borderRadius: 10,
    background: "#9ca3af", color: "#fff", fontSize: 15, fontWeight: 700,
    cursor: "not-allowed", fontFamily: "inherit",
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
  banner: { padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500 },
  readOnlyInput: {
    background: "#f3f4f6", cursor: "not-allowed", color: "#6b7280",
  },
  previewBox: {
    background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 12,
    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10,
  },
  previewTitle: { fontSize: 13, fontWeight: 600, color: "#1e3a8a" },
  tranchesGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10,
  },
  trancheCard: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px",
  },
  trancheLabel: { fontSize: 12, color: "#6b7280" },
  trancheAmount: { fontSize: 15, fontWeight: 700, color: "#2563eb", marginTop: 2 },
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

/* ─── Generic select dropdown with X clear ───
   options = [{ value, label }]. value = real backend value (integer enum id),
   label = what the user sees (French).
*/
function SelectField({ label, value, onChange, options, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find(o => String(o.value) === String(value));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && <div style={{ ...S.label, marginBottom: 6 }}>{label}</div>}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        border: `1px solid ${error ? "#dc2626" : "#e5e7eb"}`, borderRadius: 10, padding: "10px 13px",
        background: "#fff", cursor: "pointer", fontSize: 14,
        color: selected ? "#111827" : "#9ca3af",
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ flex: 1 }}>{selected ? selected.label : placeholder}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {selected && (
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
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: "11px 16px", fontSize: 14, cursor: "pointer",
                background: String(value) === String(opt.value) ? "#f0f9ff" : "#fff",
                color: String(value) === String(opt.value) ? "#2563eb" : "#111827",
                fontWeight: String(value) === String(opt.value) ? 600 : 400,
                borderBottom: "1px solid #f9fafb",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = String(value) === String(opt.value) ? "#f0f9ff" : "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background = String(value) === String(opt.value) ? "#f0f9ff" : "#fff"}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <div style={S.errorText}>{error}</div>}
    </div>
  );
}

/* ─── Rich Text Editor ───
   Now reports its HTML content back to the parent via onChange,
   so it can be stored in form.caracteristiques / agencyPricing.caracteristiques.
*/
function RichEditor({ placeholder = "Ajouter du contenu ici...", onChange }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleInput();
  };

  const updateFormats = () => {
    const active = new Set();
    if (document.queryCommandState("bold")) active.add("bold");
    if (document.queryCommandState("italic")) active.add("italic");
    if (document.queryCommandState("underline")) active.add("underline");
    setActiveFormats(active);
  };

  const handleInput = () => {
    updateFormats();
    if (onChange) onChange(editorRef.current?.innerHTML ?? "");
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
        <button style={iconBtnStyle} title="Insérer un lien"
          onMouseDown={e => { e.preventDefault(); const url = prompt("Entrer l'URL"); if (url) exec("createLink", url); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        {/* Ordered list */}
        <button style={iconBtnStyle} title="Liste numérotée"
          onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
          </svg>
        </button>

        {/* Unordered list */}
        <button style={iconBtnStyle} title="Liste à puces"
          onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
            <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
          </svg>
        </button>

        {/* Clear formatting */}
        <button style={iconBtnStyle} title="Effacer le formatage"
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
        onInput={handleInput}
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
      <span style={S.rightLabel}>Couleur</span>
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

/* ─── Enum option lists (MUST match backend enums exactly) ───
   'type'       -> OffreTypeStatusEnum   (Code=1, Conduite=2)
   'type_offre' -> OffreTypeEnum         (Forfait=1, Examen=2, Code en ligne=3)
*/
const TYPE_OPTIONS = [                              // -> form.type
  { value: 1, label: "Offre Formation Code de la Route" }, // Code
  { value: 2, label: "Offre Course de Conduite" },         // Conduite
];
const TYPE_OF_OFFER_OPTIONS = [                     // -> form.type_offre
  { value: 1, label: "Forfait" },
  { value: 2, label: "Examen pratique" },
  { value: 3, label: "Code en ligne" },
];

/* ─── Main Component ─── */
export default function ModifyOffer({ onBack }) {
  const dispatch = useDispatch();

  // ── Selected school comes from Redux, read-only, drives agencyPricing.agency ──
  const { selected: selectedSchoolFromRedux } = useSelector((state) => state.schools);

  const [form, setForm] = useState({
    // ↓↓↓ top-level backend fields ↓↓↓
    name: "",                 // was: productName
    description: "", // was: productDescription
    caracteristiques: "",  // main RichEditor content
    type: "",              // integer enum (OffreTypeStatusEnum)
    type_offre: "",        // integer enum (OffreTypeEnum)
    color: "#9333ea",
    is_auto: false,        // required boolean (new toggle, not in original UI)
    is_cpf: true,          // was: cpfOffer
    is_evaluation: false,  // was incorrectly bound to cpfOffer, now its own field
    is_offer_cart: true,   // was: isPannierOffer
    status: true,          // was: activated
  

    // ↓↓↓ UI-only, kept exactly as before, not sent to backend ↓↓↓
    learningMethod: "BM",
    displayOrder: "",
  });

  // ── agency_pricing is now a single object, sent as agency_pricing[0] ──
  const [agencyPricing, setAgencyPricing] = useState({
    agency: selectedSchoolFromRedux?.name || "", // read-only, synced from Redux
    price_ht: "",
    caracteristiques: "",   // notes RichEditor content
    original_price: "",
    discounted_price: "",
    balance: "",
    balance_2: "",
    multi_payment: "",
    final_price: "",
    second_price: "",
  });

  // Keep agencyPricing.agency in sync whenever the selected school changes in Redux
  useEffect(() => {
    setAgencyPricing(ap => ({ ...ap, agency: selectedSchoolFromRedux?.name || "" }));
  }, [selectedSchoolFromRedux]);

  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // real File object -> sent as 'media'
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
  };

  const setAP = (k, v) => {
    setAgencyPricing(ap => ({ ...ap, [k]: v }));
  };

  // ── Divide Prix HT into equal installments based on "Tranche de paiement" (multi_payment) ──
  // Last installment absorbs any rounding remainder so the total always matches exactly.
const tranchePreview = useMemo(() => {
    const total = parseFloat(agencyPricing.final_price); // ← price_ht ki jagah final_price
    const count = parseInt(agencyPricing.multi_payment, 10);
    if (!total || total <= 0 || !count || count < 1) return null;

    const base = Math.floor((total / count) * 100) / 100;
    const amounts = Array.from({ length: count }, () => base);
    const sumSoFar = base * (count - 1);
    amounts[count - 1] = Math.round((total - sumSoFar) * 100) / 100;
    return amounts;
}, [agencyPricing.final_price, agencyPricing.multi_payment]); 

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Le nom est requis.";
    else if (form.name.length > 255) errs.name = "Le nom doit contenir au maximum 255 caractères.";

    if (!form.description.trim()) errs.description = "La description est requise.";
    else if (form.description.trim().length < 3) errs.description = "La description doit contenir au moins 3 caractères.";

    if (!form.type) errs.type = "Le type est requis.";
    if (!form.type_offre) errs.type_offre = "Le type d'offre est requis.";
    if (!form.color) errs.color = "La couleur est requise.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("caracteristiques", form.caracteristiques ?? "");
    formData.append("color", form.color);
    formData.append("is_auto", form.is_auto ? 1 : 0);
    formData.append("is_cpf", form.is_cpf ? 1 : 0);
    formData.append("is_evaluation", form.is_evaluation ? 1 : 0);
    formData.append("is_offer_cart", form.is_offer_cart ? 1 : 0);
    formData.append("status", form.status ? 1 : 0);
    formData.append("type", form.type);
    formData.append("type_offre", form.type_offre);

    formData.append("final_price",agencyPricing.final_price);
    
  
    if (photoFile) formData.append("media", photoFile);

    // agency_pricing sent as a single-item array: agency_pricing[0][...]
    Object.entries(agencyPricing).forEach(([key, val]) => {
      formData.append(`agency_pricing[0][${key}]`, val ?? "");
    });

    setSubmitting(true);
    setSuccessMsg("");
    try {
      await dispatch(addOffer({ formData })).unwrap();
      setSuccessMsg("Offre ajoutée avec succès.");
    } catch (err) {
      // Laravel 422 shape: { message, errors: { field: [msg, ...] } }
      if (err?.errors) {
        const mapped = {};
        Object.keys(err.errors).forEach(key => {
          mapped[key] = err.errors[key][0];
        });
        setErrors(mapped);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={S.root}>

      {/* ══ LEFT ══ */}
      <div style={S.left}>

        {/* Header */}
        <div style={S.header}>
          <Link to='/orders/offers'><button style={S.backBtn} onClick={onBack}
            onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#111827"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280"; }}>
            <BackIcon />
          </button>
          </Link>
          <h1 style={S.title}>Nouvelle offre</h1>
        </div>

        {successMsg && (
          <div style={{ ...S.banner, background: "#dcfce7", color: "#15803d" }}>{successMsg}</div>
        )}

        {/* Card 1: Offer details */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Detail offre</h2>

          <div style={S.field}>
            <label style={S.label}>Nom du produit</label>
            <input
              style={{ ...S.input, borderColor: errors.name ? "#dc2626" : "#e5e7eb" }}
              value={form.name}
              onChange={e => set("name", e.target.value)}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = errors.name ? "#dc2626" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
            {errors.name && <div style={S.errorText}>{errors.name}</div>}
          </div>

          <div style={S.field}>
            <label style={S.label}>Description du produit</label>
            <textarea
              style={{ ...S.input, ...S.textarea, borderColor: errors.description ? "#dc2626" : "#e5e7eb" }}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = errors.description ? "#dc2626" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
            {errors.description && <div style={S.errorText}>{errors.description}</div>}
          </div>

          {/* Rich text editor -> form.caracteristiques */}
          <RichEditor
            placeholder="Ajouter du contenu détaillé, des points, des listes numérotées…"
            onChange={html => set("caracteristiques", html)}
          />

          {/* Type + Type of offer */}
          <div style={S.grid2}>
            <SelectField
              value={form.type}
              onChange={v => set("type", v)}
              options={TYPE_OPTIONS}
              placeholder="Type"
              error={errors.type}
            />
            <SelectField
              value={form.type_offre}
              onChange={v => set("type_offre", v)}
              options={TYPE_OF_OFFER_OPTIONS}
              placeholder="Type of offer"
              error={errors.type_offre}
            />
          </div>

          {/* Learning method (UI-only) */}
          <div style={{ ...S.rightRow }}>
            <span style={S.label}>Mode d'apprentissage</span>
            <div style={{ ...S.boxToggle, marginLeft: "auto" }}>
              {["BM", "BA"].map(opt => (
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

          {/* Automatique -> is_auto */}
          <div style={S.rightRow}>
            <span style={S.label}>Automatique</span>
            <Toggle checked={form.is_auto} onChange={v => set("is_auto", v)} />
          </div>

          {/* CPF offer -> is_cpf */}
          <div style={S.rightRow}>
            <span style={S.label}>Offre Cpf</span>
            <Toggle checked={form.is_cpf} onChange={v => set("is_cpf", v)} />
          </div>

          {/* Heure de l'évaluation -> is_evaluation (now its own field, not tied to cpf) */}
          <div style={S.rightRow}>
            <span style={S.label}>Heure de l'évaluation</span>
            <Toggle checked={form.is_evaluation} onChange={v => set("is_evaluation", v)} />
          </div>
        </div>

        {/* Card 2: Price -> agency_pricing[0] */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Prix</h2>

          {/* Agency name — read-only, driven by Redux selected school */}
          <div style={S.field}>
            <label style={S.label}>Nom de l'agence</label>
            <input
              style={{ ...S.input, ...S.readOnlyInput }}
              value={agencyPricing.agency}
              readOnly
              disabled
              placeholder="Aucune école sélectionnée"
            />
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Prix HT</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={agencyPricing.price_ht}
                  onChange={e => setAP("price_ht", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Prix de base (TTC)</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={agencyPricing.original_price}
                  onChange={e => setAP("original_price", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Le prix après réduction</label>
              <input style={S.input} value={agencyPricing.discounted_price} placeholder=""
                onChange={e => setAP("discounted_price", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Balance</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={agencyPricing.balance}
                  onChange={e => setAP("balance", e.target.value)} type="number"
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
                <input style={{ ...S.input, paddingRight: 32 }} value={agencyPricing.balance_2}
                  onChange={e => setAP("balance_2", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>H</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Tranche de paiement</label>
              <input style={S.input} value={agencyPricing.multi_payment}
                onChange={e => setAP("multi_payment", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Paiement Total</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={agencyPricing.final_price}
                  onChange={e => setAP("final_price", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Deuxième prix</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...S.input, paddingRight: 32 }} value={agencyPricing.second_price}
                  onChange={e => setAP("second_price", e.target.value)} type="number"
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>€</span>
              </div>
            </div>
          </div>

          {/* Rich text editor for notes -> agencyPricing.caracteristiques */}
          <RichEditor
            placeholder="Notes supplémentaires sur l'offre…"
            onChange={html => setAP("caracteristiques", html)}
          />

          {/* Aperçu des paiements par tranche: Prix HT ÷ Tranche de paiement */}
          {tranchePreview && (
            <div style={S.previewBox}>
              <div style={S.previewTitle}>
                Aperçu des paiements par tranche{agencyPricing.agency ? ` (${agencyPricing.agency})` : ""}
              </div>
              <div style={S.tranchesGrid}>
                {tranchePreview.map((amount, i) => (
                  <div key={i} style={S.trancheCard}>
                    <div style={S.trancheLabel}>Tranche {i + 1}</div>
                    <div style={S.trancheAmount}>{amount.toFixed(2)}€</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ══ RIGHT PANEL ══ */}
      <aside style={S.right}>

        {/* Color */}
        <div style={S.rightCard}>
          <ColorPicker value={form.color} onChange={v => set("color", v)} />
          {errors.color && <div style={S.errorText}>{errors.color}</div>}
        </div>

        {/* This is a Pannier offer -> is_offer_cart */}
        <div style={{ ...S.rightCard, ...S.rightRow }}>
          <span style={S.rightLabel}>C'est offre de Pannier</span>
          <Toggle checked={form.is_offer_cart} onChange={v => set("is_offer_cart", v)} />
        </div>

        {/* Activated -> status */}
        <div style={{ ...S.rightCard, ...S.rightRow }}>
          <span style={S.rightLabel}>Activé</span>
          <Toggle checked={form.status} onChange={v => set("status", v)} />
        </div>

        {/* Product image -> same File Manager used by MonitorForm */}
        <FileManager
          selectedSrc={photo}
          onSelect={async (src, selectedFile) => {
            setPhoto(src ?? null);
            if (!src) {
              setPhotoFile(null);
              return;
            }

            // Local FileManager uploads carry the browser File. Stock images
            // are bundled URLs, so turn them into a File before submitting.
            if (selectedFile?.file) {
              setPhotoFile(selectedFile.file);
              return;
            }

            try {
              const imageResponse = await fetch(src);
              const imageBlob = await imageResponse.blob();
              setPhotoFile(new File([imageBlob], "offer-image.jpg", { type: imageBlob.type || "image/jpeg" }));
            } catch {
              setPhotoFile(null);
            }
          }}
        />

        {/* Display order (UI-only) */}
        <div style={S.rightCard}>
          <label style={{ ...S.label, marginBottom: 6 }}> Ordre d'affichage</label>
          <input style={S.input} value={form.displayOrder} type="number" min="0"
            onChange={e => set("displayOrder", e.target.value)}
            placeholder="0"
            onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
        </div>

        {/* Add offer -> submits to backend */}
        <button
          style={submitting ? S.saveBtnDisabled : S.saveBtn}
          disabled={submitting}
          onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#16a34a"; }}
          onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#22c55e"; }}
          onClick={handleSubmit}
        >
          {submitting ? "Ajout en cours..." : "Add offer"}
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
