import { useEffect, useState, useRef } from "react";

// Returns true when viewport is ≤1020px
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 1020);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1020px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}
import "./Sidebar.css";
import logo from '../../assets/logo.webp';
import logo1 from '../../assets/logo-black.svg';

// ─── Icons ────────────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
);
const SessionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" x2="21" y1="6" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const ExamsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
);
const BillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"></path><path d="M4 14h9"></path><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path></svg>
);
const FormCPFIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const ActiveStudentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="m9 15 2 2 4-4"></path></svg>
);
const ActiveAgencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path><path d="M15 13h1"></path><path d="M15 17h1"></path></svg>
);
const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const SecretariesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const MonitorsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
);
const CandidatesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
);
const SkillsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const LocationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const SiteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const SubItemArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>
);

// ─── Nav structure ─────────────────────────────────────────────────────────
const NAV_STRUCTURE = [
  { type: "item",   path: "/active-agency",   label: "Tableau de bord agence active", icon: <ActiveAgencyIcon />, alwaysEnabled: true },
  { type: "item",   path: "/dashboard",       label: "Tableau de bord",        icon: <DashboardIcon />,     alwaysEnabled: false },

  {
    type: "parent", path: "/sessions",         label: "Sessions",               icon: <SessionsIcon />,      alwaysEnabled: false,
    children: [
      { path: "/sessions/cancellations", label: "Annulations" },
      { path: "/sessions/propositions",  label: "Propositions"  },
    ],
  },

  {
    type: "parent", path: "/orders",           label: "Commandes",              icon: <OrdersIcon />,        alwaysEnabled: false,
    children: [
      { path: "/orders/baskets", label: "Paniers" },
      { path: "/orders/offers",  label: "Offres"  },
    ],
  },

  { type: "item",   path: "/exams",            label: "Examens",                icon: <ExamsIcon />,         alwaysEnabled: false },
  { type: "item",   path: "/billing",          label: "Facturation",            icon: <BillingIcon />,       alwaysEnabled: false },
  { type: "item",   path: "/form-cpf",         label: "Form CPF",               icon: <FormCPFIcon />,       alwaysEnabled: false },
  { type: "item",   path: "/active-students",  label: "Rapport des élèves actifs", icon: <ActiveStudentsIcon />, alwaysEnabled: false },

  { type: "heading", label: "Utilisateurs" },
  { type: "item",   path: "/administrations",  label: "Administrations",        icon: <AdminIcon />,         alwaysEnabled: true },
  { type: "item",   path: "/secretaries",      label: "Secrétaires",            icon: <SecretariesIcon />,   alwaysEnabled: true },
  { type: "item",   path: "/monitors",         label: "Moniteurs",              icon: <MonitorsIcon />,      alwaysEnabled: false },
  { type: "item",   path: "/candidates",       label: "Candidats",              icon: <CandidatesIcon />,    alwaysEnabled: false },

  { type: "heading", label: "Preferences" },
  { type: "item",   path: "/skills",           label: "Compétences",            icon: <SkillsIcon />,        alwaysEnabled: true },
  { type: "item",   path: "/locations",        label: "Localisations",          icon: <LocationsIcon />,     alwaysEnabled: true },

  { type: "heading", label: "Liens personnalisés" },
  { type: "item",   path: "/site-en-ligne",    label: "Site en ligne",          icon: <SiteIcon />,          alwaysEnabled: true },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function Sidebar({ activePath, onNavigate, schoolSelected, isOpen, onClose, hiddenPaths = [] }) {
  const [collapsed, setCollapsed]     = useState(false);
  const [openParents, setOpenParents] = useState({});
  const isMobile = useIsMobile();
  const effectiveCollapsed = isMobile ? false : collapsed;
  const hiddenPathSet = new Set(hiddenPaths);
  const visibleEntries = NAV_STRUCTURE
    .filter((entry) => entry.type === "heading" || !hiddenPathSet.has(entry.path))
    .filter((entry, index, entries) => {
      if (entry.type !== "heading") return true;

      for (let cursor = index + 1; cursor < entries.length; cursor += 1) {
        if (entries[cursor].type === "heading") return false;
        return true;
      }

      return false;
    });

  // Auto-open parent when its child is the active path
  useEffect(() => {
    const activeParent = visibleEntries.find(
      (entry) =>
        entry.type === "parent" &&
        (activePath === entry.path || entry.children.some((child) => child.path === activePath))
    );

    if (!activeParent) return;

    setOpenParents((prev) =>
      prev[activeParent.path] ? prev : { ...prev, [activeParent.path]: true }
    );
  }, [activePath, visibleEntries]);

  const toggleParent = (path) => {
    setOpenParents((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const toggleLeft = effectiveCollapsed ? 62 : 246;

  return (
    <>
      {/* ── Mobile overlay — rendered BEFORE aside so sidebar paints on top ── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: 15,
            cursor: 'pointer',
          }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${effectiveCollapsed ? "collapsed" : "expanded"} ${isOpen ? "mobile-open" : ""}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          {effectiveCollapsed
            ? <img src={logo1} alt="" className="logo-img" />
            : <img src={logo}  alt="" className="logo-img" />
          }
        </div>

        {/* Nav — scrollable */}
        <div className="sidebar-nav">
          {visibleEntries.map((entry, i) => {

            // ── Section heading ───────────────────────────────────────────
            if (entry.type === "heading") {
              return effectiveCollapsed ? null : (
                <div key={`heading-${i}`} className="nav-section-heading">
                  {entry.label}
                </div>
              );
            }

            // ── Parent item (with dropdown) ───────────────────────────────
            if (entry.type === "parent") {
              const isEnabled  = entry.alwaysEnabled || schoolSelected;
              const isParentOpen = !!openParents[entry.path];
              const isActive   = activePath === entry.path
                || entry.children.some((c) => activePath === c.path);

              return (
                <div key={entry.path} className="nav-parent-group">
                  {/* Parent row */}
                  <div
                    className={`nav-item ${isActive ? "active" : ""} ${!isEnabled ? "disabled" : ""}`}
                    onClick={() => {
                      if (!isEnabled) return;
                      if (!effectiveCollapsed) toggleParent(entry.path);
                      onNavigate(entry.path);
                    }}
                    title={
                      effectiveCollapsed
                        ? entry.label
                        : (!isEnabled ? "Sélectionnez d'abord une auto-école" : "")
                    }
                  >
                    <span className="nav-icon">{entry.icon}</span>
                    {!effectiveCollapsed && (
                      <>
                        <span className="nav-label">{entry.label}</span>
                        {isEnabled && (
                          <span className={`nav-chevron ${isParentOpen ? "open" : ""}`}>
                            <ChevronDownIcon />
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Children — only shown when expanded, enabled, and open */}
                  {!effectiveCollapsed && isEnabled && isParentOpen && (
                    <div className="nav-children">
                      {entry.children.map((child) => {
                        const childActive = activePath === child.path;
                        return (
                          <div
                            key={child.path}
                            className={`nav-child-item ${childActive ? "active" : ""}`}
                            onClick={() => onNavigate(child.path)}
                          >
                            <span className="nav-child-arrow"><SubItemArrowIcon /></span>
                            <span className="nav-child-label">{child.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // ── Regular item ──────────────────────────────────────────────
            const isEnabled = entry.alwaysEnabled || schoolSelected;
            const isActive  = activePath === entry.path;

            return (
              <div
                key={entry.path}
                className={`nav-item ${isActive ? "active" : ""} ${!isEnabled ? "disabled" : ""}`}
                onClick={() => { if (isEnabled) onNavigate(entry.path); }}
                title={effectiveCollapsed ? entry.label : (!isEnabled ? "Sélectionnez d'abord une auto-école" : "")}
              >
                <span className="nav-icon">{entry.icon}</span>
                {!effectiveCollapsed && <span className="nav-label">{entry.label}</span>}
                {entry.badge && !effectiveCollapsed && <span className="nav-badge">{entry.badge}</span>}
              </div>
            );
          })}

          {/* "Ajouter un lien" button */}
          {!effectiveCollapsed && (
            <button className="nav-add-link-btn" onClick={() => {}}>
              <PlusIcon /> Ajouter un lien
            </button>
          )}
        </div>

      </aside>

      {/* Desktop collapse toggle — hidden on mobile via CSS */}
      <button
        className={`sidebar-toggle ${collapsed ? "collapsed" : "expanded"}`}
        style={{ left: toggleLeft }}
        onClick={() => setCollapsed((c) => !c)}
        title="Afficher ou réduire la barre latérale"
      >
        {collapsed ? "›" : "‹"}
      </button>
    </>
  );
}