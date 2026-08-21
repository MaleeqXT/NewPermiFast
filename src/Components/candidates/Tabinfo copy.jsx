import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TabInfo.css";
import RapportDrawer from "./RapportDrawer";
import { fetchCandidateById, selectSelectedCandidate, selectSelectedCandidateLoading, clearSelectedCandidate } from "../../redux/reducers/candidateSlice";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;


// ── Products ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1,  name:"FORFAIT 7 HEURES avec CODE INTENSIF BA",           hours:7  },
  { id:2,  name:"FORFAIT 7 HEURES BA",                              hours:7  },
  { id:3,  name:"FORFAIT ACCÉLÉRÉ 12 HEURES avec CODE INTENSIF BA", hours:12 },
  { id:4,  name:"FORFAIT ACCÉLÉRÉ 12 HEURES BA",                    hours:12 },
  { id:5,  name:"FORFAIT ACCÉLÉRÉ 22 HEURES avec CODE INTENSIF BA", hours:22 },
  { id:6,  name:"Pass permis Heure d'évaluation BM",                hours:1  },
  { id:7,  name:"Pass permis Heure d'évaluation BA",                hours:1  },
  { id:8,  name:"Pass permis Automatique F13",  hours:13, desc:"Besoin de quelques heures en plus en boîte automatique ? Ou d'un pack complet pour bien ..." },
  { id:9,  name:"Examen boite automatique",     hours:1,  desc:"Cette offre nous permettra de réserver une heure d'examen dans le planning de votre moniteur, dès qu..." },
  { id:10, name:"Pass permis Automatique F5",   hours:5,  desc:"Besoin de quelques heures en plus en boîte" },
  { id:11, name:"Automatic F13 Driving Licence Pass", hours:0, desc:"Need a few extra hours with an automatic transmission? Or a complete package to master ..." },
  { id:12, name:"Pass permis Turbo F13 BA", hours:0, desc:"Need an intensive 2-week to 45-day training course? Or a complete package to quickly master driving ..." },
  { id:13, name:"Automatic F5 driving licence pass", hours:0, desc:"Need a few extra hours with an automatic transmission? Or a complete package to master ..." },
  { id:14, name:"Automatic transmission test", hours:0, desc:"This offer will allow us to reserve an exam time slot in your instructor's schedule as soon as you have passe..." },
  { id:15, name:"12-HOUR RAPID PASS with INTENSIVE CODE BA", hours:12, desc:"This package includes registration, administrative fees, intensive theory courses (10 hours in person), driving ..." },
  { id:16, name:"Driving licence pass, BA assessment time", hours:0, desc:"Do you need an hour-long evaluation of a manual or automatic transmission vehicle? This package will suit..." },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const EyeOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Balance Panel ─────────────────────────────────────────────────────────────
function BalancePanel({ onClose, onSave }) {
  const [search,   setSearch]   = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error,    setError]    = useState("");
  const [operation, setOperation] = useState("Addition (+)");
  const dropRef = useRef(null);

  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="ti-panel-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ti-panel">
        <div className="ti-panel-header">
          <button className="ti-panel-back" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Retour
          </button>
          <span className="ti-panel-title">Solde du candidat</span>
        </div>

        <div className="ti-panel-body">
          <div className="ti-product-selector" ref={dropRef}>
            <div
              className={`ti-select-btn${selected ? " ti-select-btn--selected" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => setDropOpen(o => !o)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDropOpen(o => !o);
                }
              }}
            >
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, textAlign:"left" }}>
                {selected ? selected.name : "Sélectionner un produit"}
              </span>
              {selected
                ? <button className="ti-select-clear" onClick={e => { e.stopPropagation(); setSelected(null); }}>✕</button>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              }
            </div>
            {error && <div className="ti-dropdown-empty" style={{ color: "#dc2626", textAlign: "left", padding: "8px 2px 0" }}>{error}</div>}

            {dropOpen && (
              <div className="ti-dropdown">
                <div className="ti-dropdown-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input className="ti-dropdown-search-input" placeholder="Recherche avec mot-clé" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                </div>
                <div className="ti-dropdown-list">
                  {filtered.map(p => (
                    <button key={p.id} className={`ti-dropdown-item${selected?.id === p.id ? " ti-dropdown-item--active" : ""}`}
                      onClick={() => { setSelected(p); setDropOpen(false); setSearch(""); setError(""); }}>
                      {p.name}
                    </button>
                  ))}
                  {filtered.length === 0 && <div className="ti-dropdown-empty">Aucun résultat</div>}
                </div>
              </div>
            )}
          </div>

          {selected && (
            <div className="ti-product-detail">
              <div className="ti-product-detail-name">{selected.name}</div>
              <div className="ti-product-detail-sub">Solde unique : <strong>{selected.hours}h</strong></div>
            </div>
          )}

          <div className="ti-solde-row">
            <div className="ti-solde-box">
              <span className="ti-solde-label">Solde</span>
              <div className="ti-solde-val">
                <span>{selected ? selected.hours : 0}</span>
                <span className="ti-solde-unit">h</span>
              </div>
            </div>
            <div className="ti-operation-box">
              <span className="ti-solde-label">Opération</span>
              <div className="ti-operation-row">
                <select className="ti-input" value={operation} onChange={e => setOperation(e.target.value)}>
                  <option value="Addition (+)">Addition (+)</option>
                  <option value="Soustraction (-)">Soustraction (-)</option>
                </select>
                <button className="ti-operation-clear">✕</button>
              </div>
            </div>
          </div>

          <div className="ti-balance-list-card">
            <div className="ti-balance-list-title">Liste des soldes</div>
            {PRODUCTS.filter(p => p.desc).map(p => (
              <div key={p.id} className="ti-balance-list-item ti-balance-list-item--disabled">
                <div className="ti-balance-list-img">📋</div>
                <div className="ti-balance-list-info">
                  <div className="ti-balance-list-name">
                    <span>{p.name}</span>
                    <span className="ti-balance-list-hours">0 H total</span>
                  </div>
                  <div className="ti-balance-list-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ti-panel-footer">
          <button
            className={`ti-save-btn${selected ? " ti-save-btn--active" : ""}`}
            onClick={() => {
              if (!selected) {
                setError("This offer is required.");
                return;
              }
              setError("");
              onSave(selected);
              onClose();
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main TabInfo ──────────────────────────────────────────────────────────────
export default function TabInfo({
  disableFetch = false ,
    showRapport = true,
  onConnect = null,
  autoConnect = false,
  showBalanceSection = true,
  showPasswordSection = true,
  beforeActions = null,
  onOpenNameModal,
  onSave,
  onCancel,
}) {
   const { id } = useParams();
     const dispatch = useDispatch();

       const user = useSelector(selectSelectedCandidate);
  const loading = useSelector(selectSelectedCandidateLoading);

    const [form, setForm] = useState({
    email: "", phone: "", sexe: "Homme",
    date_naissance: "", postal: "", adresse: "",
  });

  const [committed, setCommitted] = useState({
    first_name: "", last_name: "",
  });


  const location = useLocation();
  const navigate = useNavigate();
    const [neph,       setNeph]       = useState("");
  const [codeDate,   setCodeDate]   = useState("");
  const [balance,    setBalance]    = useState(0);
  const [estimation, setEstimation] = useState(0);
  const [showPanel,  setShowPanel]  = useState(false);
  const [showRapportDrawer, setShowRapportDrawer] = useState(false);
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);

  useEffect(() => {
    if (autoConnect) handleConnect();
  }, [autoConnect]);

   // ── Fetch on mount
  useEffect(() => {
    if (disableFetch) return;
    if (id) dispatch(fetchCandidateById(id));
    return () => dispatch(clearSelectedCandidate());
  }, [id]);

    useEffect(() => {
       console.log("user from redux:", user);
       
    if (user) {
      setForm({
        email:          user.email                         ?? "",
        phone:          user.phone                         ?? "",
        sexe:           user.sexe                          ?? "Homme",
        date_naissance: user.date_naissance?.split(" ")[0] ?? "",
        postal:         user.postal                        ?? "",
        adresse:        user.adresse                       ?? "",
      });
      setCommitted({
        first_name: user.first_name ?? "",
        last_name:  user.last_name  ?? "",
      });
      // Student data
      setNeph(user.student?.neph       ?? "");
      setCodeDate(user.student?.date_code ?? "");
      setBalance(user.student?.balance    ?? 0);
      setEstimation(user.student?.estimation ?? 0);
    }
  }, [user]);


  function handleBalanceSave(product) {
    if (!product) return;
    setBalance(prev => prev + product.hours);
    setEstimation(prev => prev + product.hours);
  }


    function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }


  function handleConnect() {
    if (onConnect) {
      onConnect();
    } else {
      navigate("/student-dashboard", {
        state: {
          fromSecretaryDashboard: Boolean(location.state?.fromSecretaryDashboard),
          openFilterOnOpen: true,
          returnTo: location.pathname,
        },
      });
    }
  }

  return (
    <>
      {/* ══ 1. Informations personnelles ══ */}
      <section className="cp-section">
        <h2 className="cp-section-title">Informations personnelles </h2>

        <div className="cp-name-row">
          <div className="cp-name-col">
            <span className="cp-field-label">Nom</span>
            <strong className="cp-field-val">{committed.first_name}</strong>
          </div>
          <div className="cp-name-col">
            <span className="cp-field-label">Prénom</span>
            <strong className="cp-field-val">{committed.last_name}</strong>
          </div>
          <button className="cp-edit-icon" title="Modifier le nom" onClick={onOpenNameModal}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        <div className="cp-divider" />

        <div className="cp-field-block">
          <label className="cp-label">E-mail *</label>
          <input className="cp-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Téléphone *</label>
          <input className="cp-input" value={form.phone} onChange={e => set("phone", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Genre</label>
          <select className="cp-input" value={form.sexe} onChange={e => set("sexe", e.target.value)}>
            <option value="Femme">Femme</option>
            <option value="Homme">Homme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Date de naissance</label>
          <input className="cp-input" type="date" value={form.date_naissance} onChange={e => set("date_naissance", e.target.value)} />
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Code postal *</label>
          <input className="cp-input"  value={form.postal} onChange={e => set("postal", e.target.value)} />
          {/* <select className="cp-input" value={form.postal} onChange={e => set("postal", e.target.value)}>
            <option value="60100 - Creil">60100 - Creil</option>
            <option value="31300 - Toulouse">31300 - Toulouse</option>
          </select> */}
        </div>
        <div className="cp-field-block">
          <label className="cp-label">Adresse *</label>
          <textarea className="cp-input cp-textarea" rows={3} value={form.adresse} onChange={e => set("adresse", e.target.value)} />
        </div>
      </section>

      {showBalanceSection && (
        <section className="cp-section" style={{ marginTop: 20 }}>
          <h2 className="cp-section-title">Solde</h2>

          <div className="ti-balance-inputs">
            <div className="ti-input-group">
              <label className="ti-input-label">NEPH <span className="ti-req">*</span></label>
              <input className="ti-input" value={neph} onChange={e => setNeph(e.target.value)} />
            </div>
            <div className="ti-input-group">
              <label className="ti-input-label">Date du code</label>
              <input className="ti-input" type="date" value={codeDate} onChange={e => setCodeDate(e.target.value)} />
            </div>
          </div>

          <div className="ti-balance-stats">
            <div className="ti-stat">
              <span className="ti-stat-label">Solde<br />disponible</span>
              <span className="ti-stat-val">{balance}</span>
            </div>
            <button className="ti-modifier-btn" onClick={() => setShowPanel(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4"  y1="21" x2="4"  y2="14"/><line x1="4"  y1="10" x2="4"  y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8"  x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1"  y1="14" x2="7"  y2="14"/>
                <line x1="9"  y1="8"  x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Modifier
            </button>
            <div className="ti-stat">
              <span className="ti-stat-label">Estimation</span>
              <span className="ti-stat-val">{estimation}</span>
            </div>
          </div>
        </section>
      )}

      {showPasswordSection && (
        <section className="cp-section" style={{ marginTop: 20 }}>
          <h2 className="cp-section-title">Modifier votre mot de passe</h2>

          <div className="ti-input-group" style={{ marginBottom: 14 }}>
            <label className="ti-input-label">Mot de passe <span className="ti-req">*</span></label>
            <div className="ti-pw-wrap">
              <input
                className="ti-input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
              <button className="ti-pw-toggle" type="button" onClick={() => setShowPass(o => !o)}>
                {showPass ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
          </div>

          <div className="ti-input-group">
            <label className="ti-input-label">Confirmation du mot de passe <span className="ti-req">*</span></label>
            <div className="ti-pw-wrap">
              <input
                className="ti-input"
                type={showConf ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirmation du mot de passe"
              />
              <button className="ti-pw-toggle" type="button" onClick={() => setShowConf(o => !o)}>
                {showConf ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══ Boutons d'action ══ */}
      {beforeActions}

      <div className="ti-action-row">
        {showRapport && (
          <button className="ti-action-btn ti-action-btn--rapport" onClick={() => setShowRapportDrawer(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
            </svg>
            Rapport des heures
          </button>
        )}

        <button className="ti-action-btn ti-action-btn--connect" onClick={handleConnect}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Connecter
        </button>
      </div>

      {/* ══ Barre d'enregistrement ══ */}
      <div className="cp-save-bar">
        <button className="cp-btn-cancel" onClick={onCancel}>Annuler</button>
        <button className="cp-btn-save" onClick={onSave}>Enregistrer</button>
      </div>

      {/* ══ Panneaux superposés ══ */}
      {showPanel && (
        <BalancePanel onClose={() => setShowPanel(false)} onSave={handleBalanceSave} />
      )}
      {showRapportDrawer && (
        <RapportDrawer onClose={() => setShowRapportDrawer(false)} />
      )}
    </>
  );
}
