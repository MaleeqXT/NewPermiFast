import { useState } from "react";
import "./Students.css";
import info from '../../assets/info.svg'

const today = new Date().toISOString().split("T")[0];

const initialStudents = [
  { id: 1, nom: "fjre", prenom: "rekgner", permis: "Voiture", codeRoute: false, date: today },
];

const PERMIS_OPTIONS = ["Voiture", "Moto", "Conduite accompagnée", "AM"];

const PERMIS_LIST = [
  { key: "Voiture", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car w-6 h-6"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>, sub: "Permis B" },
  { key: "Moto", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike w-6 h-6"><circle cx="18.5" cy="17.5" r="3.5"></circle><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="15" cy="5" r="1"></circle><path d="M12 17.5V14l-3-3 4-3 2 3h2"></path></svg>, sub: "Permis A/A1/A2" },
  { key: "Conduite accompagnée", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, sub: "AAC – Conduite accompagnée" },
  { key: "AM", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield w-6 h-6"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>, sub: "Permis BSR – B1" },
];

const FILTER_ITEMS = [
  { key: "plusRecent", label: "Plus récent" },
  { key: "moinsRecent", label: "Moins récent" },
  null,
  { key: "Voiture", label: "Voiture" },
  { key: "Moto", label: "Moto" },
  { key: "Conduite accompagnée", label: "Conduite accompagnée" },
  { key: "AM", label: "AM" },
  { key: "codeRoute", label: "Code de la route" },
];

function formatDate(d) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    plusRecent: false, moinsRecent: false,
    Voiture: false, Moto: false, "Conduite accompagnée": false, AM: false, codeRoute: false,
  });
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", tel: "", email: "", dob: "", neph: "non", permis: "Voiture" });
  const [error, setError] = useState("");

  let data = [...students];
  if (search) data = data.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase()) ||
    s.permis.toLowerCase().includes(search.toLowerCase())
  );
  const activePermis = PERMIS_OPTIONS.filter(p => filters[p]);
  if (activePermis.length) data = data.filter(s => activePermis.includes(s.permis));
  if (filters.codeRoute) data = data.filter(s => s.codeRoute);
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
    if (key === "plusRecent") setFilters(f => ({ ...f, plusRecent: !f.plusRecent, moinsRecent: false }));
    else if (key === "moinsRecent") setFilters(f => ({ ...f, moinsRecent: !f.moinsRecent, plusRecent: false }));
    else setFilters(f => ({ ...f, [key]: !f[key] }));
  }

  function handleSave() {
    if (!form.nom.trim() || !form.prenom.trim()) {
      setError("Veuillez remplir le nom et le prénom.");
      return;
    }
    setStudents(prev => [
      { id: Date.now(), nom: form.nom.trim(), prenom: form.prenom.trim(), permis: form.permis, codeRoute: false, date: today },
      ...prev,
    ]);
    setShowForm(false);
    setForm({ nom: "", prenom: "", tel: "", email: "", dob: "", neph: "non", permis: "Voiture" });
    setError("");
  }

  const SortArrows = ({ k }) => (
    <button className="pf-sort-btn" onClick={() => handleSort(k)}>
      <span className={`pf-sort-arrow ${sortKey === k && sortDir === 1 ? "active" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="6 11 12 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up w-4 h-4 transition-colors text-gray-300"><path d="m18 15-6-6-6 6"></path></svg></span>
      <span className={`pf-sort-arrow ${sortKey === k && sortDir === -1 ? "active" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="6 11 12 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4 -mt-2 transition-colors text-gray-300"><path d="m6 9 6 6 6-6"></path></svg></span>
    </button>
  );

  if (showForm) return (
    <div className="pf-form-page">
      <button className="pf-back-btn" onClick={() => setShowForm(false)}>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left w-6 h-6"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
         Mes clients
      </button>

      <div className="pf-info-banner">

       <div className="info-image-wrapper"> <img src={info} alt="" /></div>
        <p className="banner-text">
        En ajoutant vos élèves sur PermiFast, vous bénéficierez d'une messagerie dédiée avec chacun d'eux
        et ils recevront un ticket pour le grand jeu-concours PermiFast !
        Plus vous avez d'élèves éligibles, plus vous augmentez vos propres chances de gagner !</p>
      </div>

      <div className="pf-section-card">
        <div className="pf-section-title">Informations personnelles</div>

        <div className="pf-form-row">
          <div className="pf-form-group">
            <label>Nom *</label>
            <input className="pf-input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Nom de l'élève" />
          </div>
          <div className="pf-form-group">
            <label>Prénom *</label>
            <input className="pf-input" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} placeholder="Prénom de l'élève" />
          </div>
        </div>

        <div className="pf-form-row">
          <div className="pf-form-group">
            <label>Numéro de téléphone *</label>
            <div className="pf-phone-row">
              <div className="pf-phone-flag">🇫🇷 +33</div>
              <input className="pf-input" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} />
            </div>
          </div>
          <div className="pf-form-group">
            <label>Email</label>
            <input className="pf-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="janedoe@gmail.com" type="email" />
          </div>
        </div>

        <div className="pf-form-row full">
          <div className="pf-form-group">
            <label>Date de naissance *</label>
            <input className="pf-input" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} type="date" />
          </div>
        </div>

        <div className="pf-form-group" style={{ marginBottom: 14 }}>
          <label>L'élève possède-t-il un numéro NEPH ?</label>
          <div className="pf-radio-group">
            {["oui", "non"].map(v => (
              <label key={v}>
                <input type="radio" name="neph" value={v} checked={form.neph === v} onChange={() => setForm(f => ({ ...f, neph: v }))} />
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="pf-form-group">
          <label>Quel permis votre élève souhaite-t-il passer ?</label>
          <div className="pf-permis-grid">
            {PERMIS_LIST.map(p => (
              <div key={p.key} className={`pf-permis-card ${form.permis === p.key ? "selected" : ""}`} onClick={() => setForm(f => ({ ...f, permis: p.key }))}>
                <span className="pf-permis-icon">{p.icon}</span>
                <div>
                  <div className="pf-permis-name">{p.key}</div>
                  <div className="pf-permis-sub">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="pf-error">{error}</div>}
      </div>

      <div className="pf-form-footer">
        <button className="pf-btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
        <button className="pf-btn-save" onClick={handleSave}>Enregistrer</button>
      </div>
    </div>
  );

  return (
    <div className="pf-page">
      <div className="pf-toolbar">
        <div className="pf-search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher" />
        </div>

        <div className="pf-filter-wrapper">
          <button className="pf-btn" onClick={() => setFilterOpen(o => !o)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter mr-2 text-gray-500"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Filtre</button>
          {filterOpen && (
            <div className="pf-filter-dropdown">
              {FILTER_ITEMS.map((item, i) =>
                item === null
                  ? <hr key={i} className="pf-filter-divider" />
                  : (
                    <label key={item.key} className="pf-filter-option">
                      <input type="checkbox" checked={filters[item.key]} onChange={() => toggleFilter(item.key)} />
                      {item.label}
                    </label>
                  )
              )}
            </div>
          )}
        </div>

        <button className="pf-btn pf-btn1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
             Exporter</button>
        <button className="pf-btn pf-btn-dark pf-btn1" onClick={() => setShowForm(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          
          Basculer des élèves sur PermiFast
        </button>
      </div>

      <div className="pf-table-card">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Détails de l'élève</th>
              <th>Nom <SortArrows k="nom" /></th>
              <th>Prénom <SortArrows k="prenom" /></th>
              <th>Type de permis <SortArrows k="permis" /></th>
              <th>Messages</th>
              <th>Code de la route</th>
              <th>Document</th>
              <th>Créé le <SortArrows k="date" /></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={8} className="pf-empty">Aucun élève trouvé</td></tr>
            ) : data.map(s => (
              <tr key={s.id}>
                <td><button className="pf-dossier-btn">Voir le dossier</button></td>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.permis}</td>
                <td><span className="pf-icon-blue"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square w-5 h-5 text-primary cursor-pointer"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></span></td>
                <td><span className="pf-badge">{s.codeRoute ? "Oui" : "Non"}</span></td>
                <td><span className="pf-icon-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-5 h-5 text-primary cursor-pointer"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                    </span></td>
                <td>{formatDate(s.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}