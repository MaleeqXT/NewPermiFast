import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../App.css";
import logo from "../../../assets/logo.webp";
import Sidebar from "../shared/Sidebar.jsx";
import Dashboard from "../dashboard/Dashboard.jsx";
import { CandidatesProvider } from "../candidates/CandidatesContext.jsx";
import { MonitorsProvider } from "../monitors/MonitorsContext.jsx";
import Sessions from "../../sessions/Sessions.jsx";
import Cancellations from "../../sessions/Cancellations.jsx";
import Propositions from "../propositions/Propositions.jsx";
import Secretaries from "./Secretaries.jsx";
import SecretaryForm from "./SecretaryForm.jsx";
import SecretaryInfo from "./SecretaryInfo.jsx";
import SecretaryInfo1 from "./SecretaryInfo1.jsx";
import Orders from "../../Orders/Orders.jsx";
import OrdersInfo from "../../Orders/OrdersInfo.jsx";
import Baskets from "../../Orders/Baskets.jsx";
import BasketsInfo from "../../Orders/BasketsInfo.jsx";
import Offers from "../../Orders/Offers.jsx";
import OffersInfo from "../../Orders/OffersInfo.jsx";
import OffersForm from "../../Orders/OffersForm.jsx";
import Invoice from "../../Orders/Invoice.jsx";
import Exam from "../exams/Exam.jsx";
import Billing from "../billing/Billing.jsx";
import CpfForm from "../cpf form/CpfForm.jsx";
import StudentsReport from "../studentsreport/StudentsReport.jsx";
import ActiveAgency from "../../../Components/activeagency/ActiveAgency.jsx";
import Monitors from "../monitors/Monitors.jsx";
import AddMonitor from "../monitors/AddMonitor.jsx";
import Candidates from "../candidates/Candidates.jsx";
import CandidateForm from "../candidates/CandidateForm.jsx";
import Info from "../candidates/Info.jsx";
import MonitorsInfo from "../monitors/MonitorsInfo.jsx";
import Administrations from "../administrations/Administrations.jsx";
import AdministratorInfo from "../administrations/AdministratorInfo.jsx";
import AdministratorInfo1 from "../administrations/AdministratorInfo1.jsx";
import AddAdministrator from "../administrations/AddAdministrator.jsx";
import Skills from "../../Preferences/Skills.jsx";
import Zones from "../../Preferences/Zones.jsx";
import Online from "../Online/Online.jsx";

const DASHBOARD_PATH = "/active-agency";

const HIDDEN_PATHS = ["/administrations", "/secretaries"];
const SECRETARY_DASHBOARD_SESSION_KEY = "permiFastSecretaryDashboardActive";

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const PAGE_TITLES = {
  "/dashboard": "Tableau de bord",
  "/dashboard/general": "Tableau de bord",
  "/dashboard/current": "Tableau de bord",
  "/sessions": "Sessions",
  "/sessions/cancellations": "Annulations",
  "/sessions/propositions": "Propositions",
  "/orders": "Commandes",
  "/orders/baskets": "Paniers",
  "/orders/offers": "Offres",
  "/exams": "Examens",
  "/billing": "Facturation",
  "/form-cpf": "Form CPF",
  "/active-students": "Rapport des ?l?ves actifs",
  "/active-agency": "Tableau de bord agence active",
  "/secretaries": "Secr?taires",
  "/secretaryform": "Nouvelle secr?taire",
  "/secretaryinfo": "Fiche secr?taire",
  "/secretaryinfo1": "Fiche secr?taire",
  "/administrations": "Administrations",
  "/administratorinfo": "D?D?tail administrateur",
  "/administratorinfo1": "D?D?tail administrateur",
  "/addadministrator": "Nouvel administrateur",
  "/monitors": "Moniteurs",
  "/candidates": "Candidats",
  "/skills": "Comp?tences",
  "/locations": "Localisations",
  "/site-en-ligne": "Site en ligne",
};

export default function SecretaryDashboardPage({ initialPath = DASHBOARD_PATH }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(initialPath);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // ── School selection state (mirrors App.jsx behaviour) ──────────────────
  const [schoolSelected, setSchoolSelected] = useState(false);

  const handleSchoolSelect = useCallback((id) => {
    setSchoolSelected(true);
  }, []);

  useEffect(() => {
    setActivePath(initialPath);
  }, [initialPath]);

  useEffect(() => {
    if (location.pathname !== activePath) {
      setActivePath(location.pathname);
    }
  }, [location.pathname, activePath]);

  const pageTitle = PAGE_TITLES[activePath] ?? PAGE_TITLES[DASHBOARD_PATH];

  const handleNavigate = useCallback((path) => {
    setActivePath(path);
    navigate(path);
    setSidebarOpen(false);
  }, [navigate]);

  const handleExit = useCallback(() => {
    window.sessionStorage.removeItem(SECRETARY_DASHBOARD_SESSION_KEY);
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    window.sessionStorage.setItem(SECRETARY_DASHBOARD_SESSION_KEY, "true");
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const content = useMemo(() => {
    switch (activePath) {
      case "/dashboard":
      case "/dashboard/general":
      case "/dashboard/current":
        return (
          <Dashboard
            tab={activePath === "/dashboard/current" ? "current" : "general"}
            schools={[]}
            selectedSchoolId={null}
            onSelectSchool={() => {}}
            onNavigate={handleNavigate}
          />
        );
      case "/sessions":
        return <Sessions title="Sessions" />;
      case "/sessions/cancellations":
        return <Cancellations title="Annulations" />;
      case "/sessions/propositions":
        return <Propositions />;
      case "/orders":
        return <Orders title="Commandes" />;
      case "/orders/info":
        return <OrdersInfo onBack={() => handleNavigate("/orders")} />;
      case "/orders/baskets":
        return <Baskets />;
      case "/Basketsinfo":
        return <BasketsInfo onBack={() => handleNavigate("/orders/baskets")} />;
      case "/orders/offers":
        return <Offers />;
      case "/offersinfo":
        return <OffersInfo onBack={() => handleNavigate("/orders/offers")} />;
      case "/offersform":
        return <OffersForm onBack={() => handleNavigate("/orders/offers")} />;
      case "/invoice":
        return <Invoice />;
      case "/exams":
        return <Exam title="Examens" />;
      case "/billing":
        return <Billing title="Facturation" />;
      case "/form-cpf":
        return <CpfForm title="Form CPF" />;
      case "/active-students":
        return <StudentsReport title="Rapport des élèves actifs" />;
      case "/active-agency":
        // Pass onSchoolSelect so selecting a school unlocks the sidebar
        return <ActiveAgency onSchoolSelect={handleSchoolSelect} />;
      case "/monitors":
        return <Monitors />;
      case "/add-monitor":
        return <AddMonitor onBack={() => handleNavigate("/monitors")} />;
      case "/candidates":
        return <Candidates />;
      case "/candidateform":
        return <CandidateForm onBack={() => handleNavigate("/candidates")} />;
      case "/info":
        return <Info onBack={() => handleNavigate("/candidates")} />;
      case "/monitors-info":
        return <MonitorsInfo onBack={() => handleNavigate("/monitors")} />;
      case "/secretaries":
        return <Secretaries />;
      case "/secretaryform":
        return <SecretaryForm onBack={() => handleNavigate("/secretaries")} />;
      case "/secretaryinfo":
        return <SecretaryInfo />;
      case "/secretaryinfo1":
        return <SecretaryInfo1 />;
      case "/administrations":
        return <Administrations title="Administrations" />;
      case "/administratorinfo":
        return <AdministratorInfo onBack={() => handleNavigate("/administrations")} />;
      case "/administratorinfo1":
        return <AdministratorInfo1 onBack={() => handleNavigate("/administrations")} />;
      case "/addadministrator":
        return <AddAdministrator onBack={() => handleNavigate("/administrations")} />;
      case "/skills":
        return <Skills title="Compétences" />;
      case "/locations":
        return <Zones title="Localisations" />;
      case "/site-en-ligne":
        return <Online title="Site en ligne" />;
      default:
        return <ActiveAgency onSchoolSelect={handleSchoolSelect} />;
    }
  }, [activePath, handleNavigate, handleSchoolSelect]);
  const activeSidebarPath = activePath.startsWith("/dashboard")
  ? "/dashboard"
  : activePath === "/secretary-dashboard"
    ? "/active-agency"
    : activePath;

  return (
    <CandidatesProvider>
      <MonitorsProvider>
        <div className="app-root">
          <Sidebar
            activePath={activeSidebarPath} 
            onNavigate={handleNavigate}
            schoolSelected={schoolSelected}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            hiddenPaths={HIDDEN_PATHS}
          />

          <div className="right-panel">
            <div className="top-header">
              <div className="header-mobile-logo">
                <img className="header-mobile-logo-img" src={logo} alt="PermiFast" />
              </div>

              <span className="header-page-title">{pageTitle}</span>

              <div className="secretary-header-actions">
                <div className={`header-account${accountMenuOpen ? " is-open" : ""}`} ref={accountMenuRef}>
                  <button
                    type="button"
                    className="header-user"
                    onClick={() => setAccountMenuOpen((open) => !open)}
                    onMouseEnter={() => setAccountMenuOpen(true)}
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                  >
                  <div className="header-avatar">SR</div>
                  <span className="header-username">Vue secrétaire</span>
                  <span className="header-chevron">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </span>
                </button>

                <div className="header-dropdown" role="menu">
                  <button
                    type="button"
                    className="header-dropdown-item active"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    <span>PASSPERMIS FACILE</span>
                    <span className="header-dropdown-check">✓</span>
                  </button>
                  <button
                    type="button"
                    className="header-dropdown-item"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    <span>PASSPERMISFACILE</span>
                  </button>
                  <div className="header-dropdown-divider" />
                  <button
                    type="button"
                    className="header-dropdown-item header-dropdown-item--logout"
                    onClick={handleExit}
                  >
                    <span className="header-dropdown-icon">↪</span>
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
                <button type="button" className="cand-btn-dark" onClick={handleExit}>
                  Retour
                </button>
              </div>

              <button
                type="button"
                className="header-hamburger"
                onClick={() => setSidebarOpen(true)}
                title="Ouvrir le menu"
                aria-label="Open navigation menu"
              >
                <HamburgerIcon />
              </button>
            </div>

            <main className="main-content">
              {content}
            </main>
          </div>
        </div>
      </MonitorsProvider>
    </CandidatesProvider>
  );
}
