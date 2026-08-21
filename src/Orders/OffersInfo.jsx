import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfferById,updateOffer } from "../redux/reducers/offerSlice";
const BASE_URL = import.meta.env.VITE_API_URL;
import ActionToast from "../Components/shared/ActionToast";
import FileManager from "../mainsecretary/Components/shared/FileManeger.jsx";

/* ─── Styles ─── */
const S = {
  root: { display:"flex", gap:22, alignItems:"flex-start", fontFamily:"'Inter','DM Sans','Segoe UI',sans-serif", fontSize:14, color:"#111827", padding:"28px 32px 48px", boxSizing:"border-box", background:"#f5f6f8", minHeight:"100vh" },
  left: { flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:16 },
  header: { display:"flex", alignItems:"center", gap:14, marginBottom:4 },
  backBtn: { background:"none", border:"none", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", padding:6, borderRadius:8, transition:"background 0.15s,color 0.15s" },
  title: { fontSize:24, fontWeight:700, color:"#111827", margin:0, letterSpacing:"-0.01em" },
  card: { background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:"22px 24px", display:"flex", flexDirection:"column", gap:14 },
  cardTitle: { fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 4px" },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  field: { display:"flex", flexDirection:"column", gap:6 },
  label: { fontSize:13, color:"#6b7280", fontWeight:500 },
  input: { width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 13px", fontSize:14, fontFamily:"inherit", color:"#111827", background:"#fff", outline:"none", boxSizing:"border-box", transition:"border-color 0.15s,box-shadow 0.15s", appearance:"none", WebkitAppearance:"none" },
  textarea: { resize:"vertical", minHeight:80, paddingTop:10 },
  right: { width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:12, marginTop:52, position:"sticky", top:28, alignSelf:"flex-start" },
  rightCard: { background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"12px 14px" },
  rightRow: { display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 },
  rightLabel: { fontSize:13, fontWeight:500, color:"#374151" },
  colorSwatch: (color) => ({ width:48, height:32, borderRadius:8, background:color, border:"1px solid #e5e7eb", cursor:"pointer", flexShrink:0 }),
  saveBtn: { width:"100%", padding:13, border:"none", borderRadius:10, background:"#22c55e", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"background 0.15s" },
  giveUpBtn: { width:"100%", padding:13, border:"1px solid #e5e7eb", borderRadius:10, background:"#fff", color:"#374151", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" },
  toggle: { position:"relative", width:44, height:24, cursor:"pointer", flexShrink:0 },
  toggleInput: { opacity:0, width:0, height:0, position:"absolute" },
  boxToggle: { display:"flex", border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" },
  boxOpt: (sel) => ({ flex:1, padding:"5px 12px", fontSize:12, fontWeight:500, cursor:"pointer", border:"none", fontFamily:"inherit", background:sel ? "#111827" : "none", color:sel ? "#fff" : "#6b7280", transition:"background 0.15s,color 0.15s" }),
  photoCard: { background:"#f9fafb", border:"1px dashed #d1d5db", borderRadius:12, padding:"24px 16px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", minHeight:120 },
  photoPlaceholder: { display:"flex", flexDirection:"column", alignItems:"center", gap:6, textAlign:"center" },
  readOnlyInput: { background:"#f3f4f6", cursor:"not-allowed", color:"#6b7280" },
  previewBox: { background:"#eff6ff", border:"1px solid #dbeafe", borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 },
  previewTitle: { fontSize:13, fontWeight:600, color:"#1e3a8a" },
  tranchesGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:10 },
  trancheCard: { background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 12px" },
  trancheLabel: { fontSize:12, color:"#6b7280" },
  trancheAmount: { fontSize:15, fontWeight:700, color:"#2563eb", marginTop:2 },
  loader: { display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontSize:16, color:"#6b7280" },
};

/* ─── Icons ─── */
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ChevronDown = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9cdd4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;

/* ─── Toggle ─── */
function Toggle({ checked, onChange }) {
  return (
    <label style={S.toggle}>
      <input type="checkbox" checked={checked ?? false} onChange={e => onChange(e.target.checked)} style={S.toggleInput} />
      <span style={{ position:"absolute", inset:0, background:checked ? "#111827" : "#d1d5db", borderRadius:12, transition:"background 0.2s", cursor:"pointer" }}>
        <span style={{ position:"absolute", width:18, height:18, left:3, top:3, background:"#fff", borderRadius:"50%", transition:"transform 0.2s", transform:checked ? "translateX(20px)" : "translateX(0)", boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }} />
      </span>
    </label>
  );
}

/* ─── SelectField ─── */
function SelectField({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => String(o.value) === String(value));
  return (
    <div ref={ref} style={{ position:"relative" }}>
      {label && <div style={{ ...S.label, marginBottom:6 }}>{label}</div>}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 13px", background:"#fff", cursor:"pointer", fontSize:14, color: selected ? "#111827" : "#9ca3af" }} onClick={() => setOpen(o => !o)}>
        <span style={{ flex:1 }}>{selected ? selected.label : placeholder}</span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {selected && <span onClick={e => { e.stopPropagation(); onChange(""); }} style={{ color:"#9ca3af", display:"flex", cursor:"pointer" }}><XIcon /></span>}
          <span style={{ color:"#9ca3af" }}><ChevronDown /></span>
        </div>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.1)", zIndex:200, overflow:"hidden" }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{ padding:"11px 16px", fontSize:14, cursor:"pointer", background: String(value) === String(opt.value) ? "#f0f9ff" : "#fff", color: String(value) === String(opt.value) ? "#2563eb" : "#111827", fontWeight: String(value) === String(opt.value) ? 600 : 400, borderBottom:"1px solid #f9fafb" }}
              onMouseEnter={e => e.currentTarget.style.background = String(value) === String(opt.value) ? "#f0f9ff" : "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background = String(value) === String(opt.value) ? "#f0f9ff" : "#fff"}
            >{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── RichEditor — initialValue se content set hota hai ─── */
function RichEditor({ placeholder = "Add content here...", initialValue = "", onChange }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());

  // Sirf pehli baar initialValue inject karo
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleInput();
  };
  const updateFormats = () => {
    const active = new Set();
    if (document.queryCommandState("bold"))      active.add("bold");
    if (document.queryCommandState("italic"))    active.add("italic");
    if (document.queryCommandState("underline")) active.add("underline");
    setActiveFormats(active);
  };
  const handleInput = () => {
    updateFormats();
    if (onChange) onChange(editorRef.current?.innerHTML ?? "");
  };
  const toolbarBtn = (fmt) => ({ background: activeFormats.has(fmt) ? "#f3f4f6" : "none", border:"none", cursor:"pointer", borderRadius:6, padding:"4px 7px", color: activeFormats.has(fmt) ? "#111827" : "#374151", fontWeight: fmt === "bold" ? 700 : 400, fontStyle: fmt === "italic" ? "italic" : "normal", textDecoration: fmt === "underline" ? "underline" : "none", fontSize:14, display:"flex", alignItems:"center" });
  const iconBtn = { background:"none", border:"none", cursor:"pointer", borderRadius:6, padding:"4px 7px", color:"#374151", display:"flex", alignItems:"center" };
  const headings = ["Normal","H1","H2","H3"];
  const [heading, setHeading] = useState("Normal");

  return (
    <div style={{ border:"1px solid #e5e7eb", borderRadius:10, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:2, padding:"8px 10px", borderBottom:"1px solid #e5e7eb", background:"#fafafa", flexWrap:"wrap" }}>
        <div style={{ position:"relative", marginRight:4 }}>
          <select value={heading} onChange={e => { setHeading(e.target.value); exec("formatBlock", e.target.value === "Normal" ? "p" : e.target.value.toLowerCase()); }} style={{ border:"1px solid #e5e7eb", borderRadius:6, padding:"3px 24px 3px 8px", fontSize:13, background:"#fff", cursor:"pointer", appearance:"none", WebkitAppearance:"none", fontFamily:"inherit", color:"#374151" }}>
            {headings.map(h => <option key={h}>{h}</option>)}
          </select>
          <span style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><ChevronDown size={12} /></span>
        </div>
        <div style={{ width:1, height:20, background:"#e5e7eb", margin:"0 4px" }} />
        <button style={toolbarBtn("bold")}      onMouseDown={e => { e.preventDefault(); exec("bold"); }}><b>B</b></button>
        <button style={toolbarBtn("italic")}    onMouseDown={e => { e.preventDefault(); exec("italic"); }}><i>I</i></button>
        <button style={toolbarBtn("underline")} onMouseDown={e => { e.preventDefault(); exec("underline"); }}><u>U</u></button>
        <div style={{ width:1, height:20, background:"#e5e7eb", margin:"0 4px" }} />
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </button>
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </button>
        <button style={iconBtn} onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M5 20h6"/><path d="M13 4 8 20"/><line x1="17" y1="14" x2="22" y2="19"/><line x1="22" y1="14" x2="17" y2="19"/></svg>
        </button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onKeyUp={updateFormats} onMouseUp={updateFormats} onInput={handleInput}
        style={{ minHeight:120, padding:"12px 14px", outline:"none", fontSize:14, lineHeight:1.6, color:"#111827", background:"#fff" }}
        data-placeholder={placeholder}
      />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}[contenteditable] ul{padding-left:20px;margin:4px 0}[contenteditable] ol{padding-left:20px;margin:4px 0}[contenteditable] li{margin:2px 0}`}</style>
    </div>
  );
}

/* ─── ColorPicker ─── */
function ColorPicker({ value, onChange }) {
  const inputRef = useRef(null);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <span style={S.rightLabel}>Couleur</span>
      <div style={{ marginLeft:"auto", position:"relative" }}>
        <div style={{ ...S.colorSwatch(value || "#9333ea"), width:56, height:32 }} onClick={() => inputRef.current?.click()} />
        <input ref={inputRef} type="color" value={value || "#9333ea"} onChange={e => onChange(e.target.value)} style={{ position:"absolute", opacity:0, width:0, height:0 }} />
      </div>
    </div>
  );
}

/* ─── Enum options ─── */
const TYPE_OPTIONS = [
  { value: 1, label: "Offre Formation Code de la Route" },
  { value: 2, label: "Offre Course de Conduite" },
];
const TYPE_OFFRE_OPTIONS = [
  { value: 1, label: "Forfait" },
  { value: 2, label: "Examen pratique" },
  { value: 3, label: "Code en ligne" },
];

function unwrapOfferPayload(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

function toBool(value) {
  return value === true || value === 1 || value === "1";
}

function getMediaPreview(media) {
  if (!media) return null;

  const path = typeof media === "string"
    ? media
    : media?.storage_media?.path
      ?? media?.storageMedia?.path
      ?? media?.storage_media?.url
      ?? media?.storageMedia?.url
      ?? media?.path
      ?? media?.url
      ?? null;

  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;

  // Older records store paths such as "/storage/media/...", whereas newly
  // uploaded records store "media/...". Support both shapes.
  if (path.startsWith("/storage/")) return BASE_URL ? `${BASE_URL}${path}` : path;
  if (path.startsWith("storage/")) return BASE_URL ? `${BASE_URL}/${path}` : path;

  return BASE_URL ? `${BASE_URL}/storage/${path.replace(/^\/+/, "")}` : path;
}

function getOfferPhoto(offer) {
  if (!offer) return null;
  return offer.media_url ?? getMediaPreview(offer.media);
}

function buildTranchePreview(finalPrice, multiPayment) {
  const total = parseFloat(finalPrice);
  const count = parseInt(multiPayment, 10);
  if (!total || total <= 0 || !count || count < 1) return null;

  const base = Math.floor((total / count) * 100) / 100;
  const amounts = Array.from({ length: count }, () => base);
  const sumSoFar = base * (count - 1);
  amounts[count - 1] = Math.round((total - sumSoFar) * 100) / 100;
  return amounts;
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function EditOffer({ onBack }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const { currentOffer } = useSelector(state => state.offers);

  // ── form state — null jab tak data na aaye ──
  const [form, setForm]               = useState(null);
  const [agencyPricing, setAgencyPricing] = useState({});
  const [photo, setPhoto]             = useState(null);
  const [photoFile, setPhotoFile]     = useState(null);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '...' }
const { loading } = useSelector(state => state.offers);


  // ── fetch by id ──
  useEffect(() => {
    if (id) dispatch(fetchOfferById(id));
  }, [id, dispatch]);

  // ── jab data aaye form fill karo ──
useEffect(() => {
    // Prefer the offer clicked by the user. `currentOffer` may contain an
    // older Redux selection when this page is opened without an :id route.
    const sourceOffer = location.state?.offer ?? unwrapOfferPayload(currentOffer) ?? null;
    if (!sourceOffer) return;

    let ap = {};
    if (sourceOffer.agency_pricing) {
        try {
            const parsed = typeof sourceOffer.agency_pricing === "string"
                ? JSON.parse(sourceOffer.agency_pricing)
                : sourceOffer.agency_pricing;
            ap = Array.isArray(parsed) ? (parsed[0] ?? {}) : parsed;
        } catch { ap = {}; }
    }

    setForm({
        name:             sourceOffer.name             ?? "",
        description:      sourceOffer.description      ?? "",
        caracteristiques: sourceOffer.caracteristiques ?? "",
        type:             sourceOffer.type             ?? "",
        type_offre:       sourceOffer.type_offre       ?? "",
        color:            sourceOffer.color            ?? "#9333ea",
        is_auto:          toBool(sourceOffer.is_auto),
        is_cpf:           toBool(sourceOffer.is_cpf),
        is_evaluation:    toBool(sourceOffer.is_evaluation),
        is_offer_cart:    toBool(sourceOffer.is_offer_cart),
        status:           toBool(sourceOffer.status),
        displayOrder:     sourceOffer.order            ?? "",
        learningMethod:   toBool(sourceOffer.is_auto) ? "BA" : "BM",
        // final_price:      sourceOffer.final_price,
          final_price: ap.final_price ?? sourceOffer.final_price ?? "", 

    });

    setAgencyPricing({
        agency:           ap.agency           ?? sourceOffer.agency_name ?? "",
        price_ht:         ap.price_ht         ?? sourceOffer.price_ht ?? "",
        caracteristiques: ap.caracteristiques ?? sourceOffer.caracteristiques ?? "",
        original_price:   ap.original_price   ?? sourceOffer.original_price ?? "",
        discounted_price: ap.discounted_price ?? sourceOffer.discounted_price ?? "",
        balance:          ap.balance          ?? sourceOffer.balance ?? "",
        balance_2:        ap.balance_2        ?? sourceOffer.balance_2 ?? "",
        multi_payment:    ap.multi_payment    ?? sourceOffer.multi_payment ?? "",
        final_price:      ap.final_price      ?? sourceOffer.final_price ?? "",
        second_price:     ap.second_price     ?? sourceOffer.second_price ?? "",
    });

    setPhoto(getOfferPhoto(sourceOffer));
    setPhotoFile(null);

}, [currentOffer, location.state]);
  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setAP = (k, v) => setAgencyPricing(ap => ({ ...ap, [k]: v }));
  const tranchePreview = useMemo(
    () => buildTranchePreview(agencyPricing.final_price, agencyPricing.multi_payment),
    [agencyPricing.final_price, agencyPricing.multi_payment]
  );

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const handleBack = () => { if (onBack) { onBack(); return; } navigate("/orders/offers"); };

  async function handleSubmit() {
    const formData = new FormData();

    // ── Top level fields ──
    formData.append("name",             form.name);
    formData.append("description",      form.description);
    formData.append("caracteristiques", form.caracteristiques ?? "");
    formData.append("color",            form.color);
    formData.append("is_auto",          form.is_auto      ? 1 : 0);
    formData.append("is_cpf",           form.is_cpf       ? 1 : 0);
    formData.append("is_evaluation",    form.is_evaluation ? 1 : 0);
    formData.append("is_offer_cart",    form.is_offer_cart ? 1 : 0);
    formData.append("status",           form.status       ? 1 : 0);
    formData.append("type",             form.type);
    formData.append("type_offre",       form.type_offre);
    formData.append("order",            form.displayOrder ?? "");
  
formData.append("final_price", agencyPricing.final_price ?? "");
   
    // ── Agency pricing ──
    Object.entries(agencyPricing).forEach(([key, val]) => {
        formData.append(`agency_pricing[0][${key}]`, val ?? "");
    });

    // ── Photo agar naya select kiya ──
    if (photoFile) formData.append("media", photoFile, photoFile.name);

    try {
        const response = await dispatch(updateOffer({ id, formData })).unwrap();
        const updatedOffer = unwrapOfferPayload(response);
        const savedPhoto = getOfferPhoto(updatedOffer);
        if (savedPhoto) setPhoto(savedPhoto);
        setPhotoFile(null);
        setToast({ type: "success", message: "Offre modifiée avec succès !" });
    } catch (err) {
        const msg = err?.message ?? "Une erreur est survenue.";
        setToast({ type: "error", message: msg });
    }
}


  // ── Loading guard — form null ho toh spinner dikhao ──
  if (!form) {
    return <div style={S.loader}>Chargement de l'offre...</div>;
  }
  

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
          <h1 style={S.title}>Modifier l'offre</h1>
          
        </div>
                  {toast && (
    <ActionToast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(null)}
    />
    )}

        {/* ── Card 1: Détail offre ── */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Détail offre</h2>

          {/* Nom */}
          <div style={S.field}>
            <label style={S.label}>Nom du produit</label>
            <input style={S.input} value={form.name}
              onChange={e => set("name", e.target.value)}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
          </div>

          {/* Description */}
          <div style={S.field}>
            <label style={S.label}>Description du produit</label>
            <textarea style={{ ...S.input, ...S.textarea }} value={form.description}
              onChange={e => set("description", e.target.value)} rows={3}
              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
          </div>

          {/* Caractéristiques — RichEditor with existing HTML */}
          <div style={S.field}>
            <label style={S.label}>Caractéristiques</label>
            <RichEditor
              placeholder="Ajouter du contenu détaillé…"
              initialValue={form.caracteristiques}
              onChange={html => set("caracteristiques", html)}
            />
          </div>

          {/* Type + Type offre */}
          <div style={S.grid2}>
            <SelectField value={form.type} onChange={v => set("type", v)} options={TYPE_OPTIONS} placeholder="Type" />
            <SelectField value={form.type_offre} onChange={v => set("type_offre", v)} options={TYPE_OFFRE_OPTIONS} placeholder="Type d'offre" />
          </div>

          {/* Mode d'apprentissage */}
          <div style={S.rightRow}>
            <span style={S.label}>Mode d'apprentissage</span>
            <div style={{ ...S.boxToggle, marginLeft:"auto" }}>
              {["BM", "BA"].map(opt => (
                <button key={opt} style={S.boxOpt(form.learningMethod === opt)} onClick={() => set("learningMethod", opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={S.rightRow}>
            <span style={S.label}>Automatique</span>
            <Toggle checked={form.is_auto} onChange={v => set("is_auto", v)} />
          </div>
          <div style={S.rightRow}>
            <span style={S.label}>Offre CPF</span>
            <Toggle checked={form.is_cpf} onChange={v => set("is_cpf", v)} />
          </div>
          <div style={S.rightRow}>
            <span style={S.label}>Heure d'évaluation</span>
            <Toggle checked={form.is_evaluation} onChange={v => set("is_evaluation", v)} />
          </div>
        </div>

        {/* ── Card 2: Prix (agency_pricing) ── */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Prix</h2>

          {/* Agency — read-only */}
          <div style={S.field}>
            <label style={S.label}>Nom de l'agence</label>
            <input style={{ ...S.input, ...S.readOnlyInput }} value={agencyPricing.agency} readOnly disabled />
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Prix HT</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...S.input, paddingRight:32 }} value={agencyPricing.price_ht} type="number"
                  onChange={e => setAP("price_ht", e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13 }}>€</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Prix de base (TTC)</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...S.input, paddingRight:32 }} value={agencyPricing.original_price} type="number"
                  onChange={e => setAP("original_price", e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13 }}>€</span>
              </div>
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Prix après réduction</label>
              <input style={S.input} value={agencyPricing.discounted_price ?? ""}
                onChange={e => setAP("discounted_price", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Balance</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...S.input, paddingRight:32 }} value={agencyPricing.balance} type="number"
                  onChange={e => setAP("balance", e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13, fontWeight:600 }}>H</span>
              </div>
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Balance (2)</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...S.input, paddingRight:32 }} value={agencyPricing.balance_2 ?? ""} type="number"
                  onChange={e => setAP("balance_2", e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13, fontWeight:600 }}>H</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Tranche de paiement</label>
              <input style={S.input} value={agencyPricing.multi_payment ?? ""}
                onChange={e => setAP("multi_payment", e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.label}>Paiement total</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...S.input, paddingRight:32 }} value={agencyPricing.final_price ?? ""} type="number"
                  onChange={e => setAP("final_price", e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13 }}>€</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Deuxième prix</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...S.input, paddingRight:32 }} value={agencyPricing.second_price ?? ""} type="number"
                  onChange={e => setAP("second_price", e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13 }}>€</span>
              </div>
            </div>
          </div>

          {tranchePreview && (
            <div style={S.previewBox}>
              <div style={S.previewTitle}>
                Aperçu des paiements par tranche{agencyPricing.agency ? ` (${agencyPricing.agency})` : ""}
              </div>
              <div style={S.tranchesGrid}>
                {tranchePreview.map((amount, i) => (
                  <div key={i} style={S.trancheCard}>
                    <div style={S.trancheLabel}>Tranche {i + 1}</div>
                    <div style={S.trancheAmount}>{amount.toFixed(2)} €</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes RichEditor */}
          <div style={S.field}>
            <label style={S.label}>Notes supplémentaires</label>
            <RichEditor
              placeholder="Notes supplémentaires sur l'offre…"
              initialValue={agencyPricing.caracteristiques}
              onChange={html => setAP("caracteristiques", html)}
            />
          </div>
        </div>

      </div>

      {/* ══ RIGHT PANEL ══ */}
      <aside style={S.right}>

        {/* Couleur */}
        <div style={S.rightCard}>
          <ColorPicker value={form.color} onChange={v => set("color", v)} />
        </div>


        {/* Offre panier */}
        <div style={{ ...S.rightCard, ...S.rightRow }}>
          <span style={S.rightLabel}>C'est offre de Pannier</span>
          <Toggle checked={form.is_offer_cart} onChange={v => set("is_offer_cart", v)} />
        </div>

        {/* Activé */}
        <div style={{ ...S.rightCard, ...S.rightRow }}>
          <span style={S.rightLabel}>Activé</span>
          <Toggle checked={form.status} onChange={v => set("status", v)} />
        </div>

        {/* Photo */}
        <FileManager
          selectedSrc={photo}
          onSelect={async (src, selectedFile) => {
            setPhoto(src ?? null);
            if (!src) {
              setPhotoFile(null);
              return;
            }

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

        {/* Ordre d'affichage */}
        <div style={S.rightCard}>
          <label style={{ ...S.label, marginBottom:6 }}>Ordre d'affichage</label>
          <input style={S.input} value={form.displayOrder} type="number" min="0"
            onChange={e => set("displayOrder", e.target.value)} placeholder="0"
            onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
        </div>

        {/* Modifier */}
        <button style={loading ? { ...S.saveBtn, background: "#9ca3af", cursor: "not-allowed" } : S.saveBtn}
    disabled={loading}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#16a34a"; }}
    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#22c55e"; }}
          onClick={handleSubmit}>
            {loading ? "Modification..." : "Modifier l'offre"}
        </button>

        {/* Abandonner */}
        <button style={S.giveUpBtn}
          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          onClick={handleBack}>
          Abandonner
        </button>

      </aside>
    </div>
  );
}
