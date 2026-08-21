import { useCallback, useMemo, useState,useEffect  } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ActiveAgency.css";
import DrivingSchoolForm from "./DrivingSchoolForm";
import QRCode from "./QRCode";

// importing from redux
import { fetchSchools, setSelectedSchool,selectSchool } from "../../redux/reducers/schoolReducer";



// const formatAddress = (address) => address.split(",").map((part) => part.trim());

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return <span className="aa-info-icon" aria-label="Information">i</span>;
}

function ExternalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14 20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SortArrows({ sortKey, colKey, onSort }) {
  const isActive = sortKey?.key === colKey;
  const dir = sortKey?.dir;
  return (
    <button type="button" className="cand-sort-btn" onClick={() => onSort(colKey)} aria-label={`Sort by ${colKey}`}>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === 1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6 L5 1 L9 6"/></svg>
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" stroke={isActive && dir === -1 ? "#111827" : "#d1d5db"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L5 6 L9 1"/></svg>
    </button>
  );
}

function ConeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.3 6.2a4.55 4.55 0 0 0 5.4 0"></path>
      <path d="M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3"></path>
      <path d="M13.9 3.5a1.93 1.93 0 0 0-3.8-.1l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3 5 3s5-1.3 5-3c0-.2 0-.4-.1-.5Z"></path>
      <path d="m7.5 12.2-4.7 2.7c-.5.3-.8.7-.8 1.1s.3.8.8 1.1l7.6 4.5c.9.5 2.1.5 3 0l7.6-4.5c.7-.3 1-.7 1-1.1s-.3-.8-.8-1.1l-4.7-2.8"></path>
    </svg>
  );
}

function StatCard({ label, value, children }) {
  return (
    <article className="aa-stat-card">
      <InfoIcon />
      <p className="aa-stat-label">{label}</p>
      <strong className="aa-stat-value">{value}</strong>
      {children}
    </article>
  );
}

function StatusPill({ status, isActiveRow }) {
  return (
    <span className={`aa-status-pill ${isActiveRow ? "aa-status-pill-on-blue" : ""}`}>
      <span className="aa-status-dot" />
      {status}
    </span>
  );
}

// function SubscriptionPill({ subscription }) {
//   const isAbandoned = subscription.toLowerCase().includes("abandon");
//   return (
//     <span className={`aa-subscription-pill ${isAbandoned ? "aa-subscription-pill-abandoned" : ""}`}>
//       {subscription}
//     </span>
//   );
// }

function SubscriptionPill({ subscription }) {
  const isAbandoned = (subscription ?? "").toLowerCase().includes("abandon");
  return (
    <span className={`aa-subscription-pill ${isAbandoned ? "aa-subscription-pill-abandoned" : ""}`}>
      {subscription ?? "Club 300"}
    </span>
  );
}

function SchoolsTable({ schools, selectedSchoolId, onActivateSchool, sort, onSort }) {
  return (
    <div className="aa-table-shell">
      <table className="aa-schools-table">
        <thead>
          <tr>
            <th>Nom de l'auto-ecole <SortArrows sortKey={sort} colKey="name" onSort={onSort} /></th>
            {/* <th>Adresse <SortArrows sortKey={sort} colKey="address" onSort={onSort} /></th> */}
            <th>Telephone <SortArrows sortKey={sort} colKey="phone" onSort={onSort} /></th>
            <th>Abonnement <SortArrows sortKey={sort} colKey="subscription" onSort={onSort} /></th>
            <th>Eleves en attente <SortArrows sortKey={sort} colKey="waitingStudents" onSort={onSort} /></th>
            <th>Messages non lus <SortArrows sortKey={sort} colKey="unreadMessages" onSort={onSort} /></th>
            <th>Statut <SortArrows sortKey={sort} colKey="status" onSort={onSort} /></th>
            <th>Selection</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => {
            const isActiveRow = selectedSchoolId === school.id;
            return (
              <tr key={school.id} className={isActiveRow ? "aa-school-row-active" : ""}>
                <td className="aa-school-name">{school.name}</td>
                {/* <td>
                  {formatAddress(school.address).map((line) => (
                    <span className="aa-address-line" key={line}>{line}</span>
                  ))}
                </td> */}
                <td>{school.phone}</td>
                <td><SubscriptionPill subscription={school.subscription} /></td>
                <td><span className="aa-number-pill aa-number-pill-waiting">{school.waitingStudents}</span></td>
                <td><span className="aa-number-pill aa-number-pill-muted">{school.unreadMessages}</span></td>
                <td><StatusPill status={school.status} isActiveRow={isActiveRow} /></td>
                <td className="aa-selection-cell">
                  <button
                    type="button"
                    className={`aa-radio-button ${isActiveRow ? "aa-radio-button-selected" : ""}`}
                    onClick={() => onActivateSchool(school.id)}
                    aria-label={`Activer ${school.name}`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GeneralTab({ stats,schools, selectedSchoolId, searchQuery, onSearchChange, onActivateSchool, sort, onSort }) {
  return (
    <>
      {/* <section className="aa-general-cards" aria-label="Statistiques generales">
        {GENERAL_STATS.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section> */}
            <section className="aa-general-cards">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="aa-schools-section">
        <div className="aa-section-header">
          <div className="aa-title-group">
            <ConeIcon />
            <h2>Mes auto-ecoles</h2>
          </div>
          <label className="aa-search" aria-label="Rechercher une auto-ecole">
            <SearchIcon />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher..."
              type="search"
            />
          </label>
        </div>
        <SchoolsTable
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onActivateSchool={onActivateSchool}
          sort={sort}
          onSort={onSort}
        />
      </section>
    </>
  );
}

function CurrentStatusTab({ selectedSchool, schools, selectedSchoolId, searchQuery, onSearchChange, onActivateSchool, sort, onSort }) {
  return (
    <>
      <section className="aa-current-grid" aria-label="Statut actuel">
        <article className="aa-stat-card">
          <InfoIcon />
          <p className="aa-stat-label">Eleves inscrits</p>
          <strong className="aa-stat-value">{selectedSchool?.waitingStudents ?? 0}</strong>
          <button className="aa-dark-button" type="button">Voir mes eleves</button>
        </article>

        <article className="aa-stat-card">
          <InfoIcon />
          <p className="aa-stat-label">Demandes de reservation</p>
          <strong className="aa-stat-value">5</strong>
          <p className="aa-card-note">Veuillez valider les eleves une fois convertis</p>
          <button className="aa-dark-button" type="button">Voir mes demandes d'eleves</button>
        </article>

        <article className="aa-stat-card aa-qr-card">
          <InfoIcon />
          <p className="aa-stat-label aa-qr-label">QR code de l'ecole</p>
                    <img 
            src={`http://localhost:8000/storage/${selectedSchool?.qrcode}`}
            alt="QR Code"
            width={140}
            height={140}
            className="aa-qr-code"
          />

          {/* <QRCode
            className="aa-qr-code"
            seed={`permifast-${selectedSchool?.id ?? "default"}-${selectedSchool?.name ?? ""}`}
            size={140}
          /> */}
          <button className="aa-dark-button aa-button-inline" type="button">
            Voir ma vitrine PermiFast
            <ExternalIcon />
          </button>
        </article>
      </section>

      <section className="aa-schools-section">
        <div className="aa-section-header">
          <div className="aa-title-group">
            <ConeIcon />
            <h2>Mes auto-ecoles</h2>
          </div>
          <label className="aa-search" aria-label="Rechercher une auto-ecole">
            <SearchIcon />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher..."
              type="search"
            />
          </label>
        </div>
        <SchoolsTable
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onActivateSchool={onActivateSchool}
          sort={sort}
          onSort={onSort}
        />
      </section>
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────
// onSchoolSelect(schoolId) — lifted to App / SecretaryDashboardPage so the
// sidebar (and any other consumer) knows a school has been chosen.
const ActiveAgency = ({ onSchoolSelect }) => {

  //yahn code
   const dispatch = useDispatch();
  const { list: schools, loading, error,selected  } = useSelector((state) => state.schools);


  const [activeTab, setActiveTab]           = useState("general");
  // const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState(selected?.id ?? null);
  const [searchQuery, setSearchQuery]       = useState("");
  const [sort, setSort]                     = useState(null);
  const [showAddSchool, setShowAddSchool]   = useState(false);
  // const [schools, setSchools]               = useState(SCHOOLS);

  useEffect(() => {
    if (selected?.id) {
        setSelectedSchoolId(selected.id);
        setActiveTab("current");
        onSchoolSelect?.(selected.id);
    }
}, [selected]);

  //refresh py fetch
    useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const handleSort = useCallback((key) => {
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir * -1 } : { key, dir: 1 }));
  }, []);

  const handleAddSchool = useCallback((newSchool) => {
    // setSchools((prev) => [newSchool, ...prev]);
    setShowAddSchool(false);
  }, []);

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId),
    [schools, selectedSchoolId]
  );

  const filteredSchools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = !query
      ? schools
      : schools.filter((s) =>
          [s.name, s.address, s.phone, s.subscription, s.status]
            .join(" ")
            .toLowerCase()
            .includes(query)
        );

    if (sort) {
      result = [...result].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * sort.dir;
        const as = String(av ?? "").toLowerCase();
        const bs = String(bv ?? "").toLowerCase();
        return (as < bs ? -1 : as > bs ? 1 : 0) * sort.dir;
      });
    }
    return result;
  }, [schools, searchQuery, sort]);

  // When the radio button is clicked we:
  // 1. Update local state (for the "Stat actuelle" tab)
  // 2. Notify the parent so the sidebar can unlock
  const handleActivateSchool = useCallback(async (schoolId) => {
    setSelectedSchoolId(schoolId);
    setActiveTab("current");
    
      //  dispatch(setSelectedSchool(schools.find(s => s.id === schoolId))); //function call
       await dispatch(selectSchool(schoolId));
       
    onSchoolSelect?.(schoolId);   // propagate upward — safe even if prop is omitted
  },  [onSchoolSelect, dispatch, schools]);

  const handleCurrentTabClick = useCallback(() => {
    if (!selectedSchoolId) return;
    setActiveTab("current");
  }, [selectedSchoolId]);

  if (showAddSchool) {
    return (
      <DrivingSchoolForm
        onBack={() => setShowAddSchool(false)}
        onSubmit={handleAddSchool}
      />
    );
  }
   const generalStats = [
    { label: "Mes auto-ecoles", value: schools.length },
    { label: "Eleves inscrits", value: 0 },       // baad mein API se aayega
    { label: "Demandes de reservation", value: 0 }, // baad mein API se aayega
  ];

    if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {typeof error === "string" ? error : error?.message ?? "Impossible de charger les auto-écoles."}</div>;


  return (
    <div className="active-agency-page">
      <header className="aa-page-header">
        <div>
          <h1>Bienvenue Admin Raza</h1>
        </div>
        <div>
          <button className="add-school-button" type="button" onClick={() => setShowAddSchool(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            <span>Ajouter une auto-école</span>
          </button>
        </div>
      </header>

      <div className="aa-tabs-row">
        <div className="aa-tabs" role="tablist" aria-label="Vue agence active">
          <button
            className={`aa-tab ${activeTab === "general" ? "aa-tab-active" : ""}`}
            onClick={() => setActiveTab("general")}
            type="button"
            role="tab"
            aria-selected={activeTab === "general"}
          >
            Stat generales
          </button>
          <button
            className={`aa-tab ${activeTab === "current" ? "aa-tab-active" : ""}`}
            onClick={handleCurrentTabClick}
            type="button"
            role="tab"
            aria-selected={activeTab === "current"}
            disabled={!selectedSchoolId}
          >
            Stat actuelle
          </button>
        </div>
      </div>

      {activeTab === "general" ? (
        <GeneralTab
        stats={generalStats}  // yeh add karo
          schools={filteredSchools}
          selectedSchoolId={selectedSchoolId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onActivateSchool={handleActivateSchool}
          sort={sort}
          onSort={handleSort}
        />
      ) : (
        <CurrentStatusTab
          selectedSchool={selectedSchool}
          schools={filteredSchools}
          selectedSchoolId={selectedSchoolId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onActivateSchool={handleActivateSchool}
          sort={sort}
          onSort={handleSort}
        />
      )}
    </div>
  );
};

export default ActiveAgency;
