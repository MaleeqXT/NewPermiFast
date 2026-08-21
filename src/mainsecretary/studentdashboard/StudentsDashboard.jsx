import { useState } from "react";
import "./StudentDashboard.css";
import logoblack from "../assets/logo-black.svg";
import FilterDrawer from "./FilterDrawer";
import Notifications from "./Notifications.jsx";
import Commander from "./Commander.jsx";
import Competences from "./Competences.jsx";
import SessionDrawer from "./SessionDrawer.jsx";
import StudentProfile from "./StudentProfile.jsx";
import ExamInformation from "./ExamInformation.jsx";
import StudentOrder from "./StudentOrder.jsx";
import StudentOfferDetail from "./StudentOfferDetail.jsx";
import ReservationsCancellations from "./ReservationsCancellations.jsx";
import MonitorSessions from "../monitordashboard/MonitorSessions.jsx";

const IconHome = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconCalendar = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>);
const IconUser = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconBell = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>);
const IconFilter = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const IconCart = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>);
const IconDoc = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>);
const IconLightbulb = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const IconChevR = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>);
const IconChevD = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>);
const IconChevU = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 15-6-6-6 6"/></svg>);
const IconCheck = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconBook = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);

const TOTAL_SEGMENTS = 14;
const NOTIF_COUNT = 2;
const UPCOMING_SESSIONS = [];

const ENDED_SESSIONS = [
  { month: "April",     count: 1, sessions: [{ id:1, title:"Pass manual F10 driving license", monitor:"Soumaya",    location:"At the CREIL Agency, CREIL", start:"12:00", end:"13:00" }] },
  { month: "October",   count: 1, sessions: [{ id:2, title:"Pass manual driving license F5",  monitor:"Rachid",     location:"At the CREIL Agency, CREIL", start:"16:00", end:"18:00" }] },
  { month: "September", count: 5, sessions: [
    { id:3, title:"Pass manual F20 driving license", monitor:"Mohamed",    location:"At the CREIL Agency, CREIL", start:"09:00", end:"11:00" },
    { id:4, title:"Automatic F13 Driving Licence",   monitor:"Jean Dupont", location:"At the CREIL Agency, CREIL", start:"14:00", end:"15:00" },
  ]},
];

// ── Shared progress bar ───────────────────────────────────────────────────────
function ProgressBar({ percent }) {
  const filled = Math.round((percent / 100) * TOTAL_SEGMENTS);
  return (
    <div className="sd-progress-bar">
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
        <div key={i} className={`sd-progress-seg${i < filled ? " sd-progress-seg--filled" : ""}`} />
      ))}
    </div>
  );
}

// ── Session components ────────────────────────────────────────────────────────
function SessionCard({ session, onOpen }) {
  return (
    <div className="sd-scard" onClick={() => onOpen(session)} style={{ cursor:"pointer" }}>
      <div className="sd-scard-left">
        <div className="sd-scard-title"><strong>{session.title}</strong> with <strong>{session.monitor}</strong></div>
        <div className="sd-scard-loc">{session.location}</div>
      </div>
      <div className="sd-scard-time">{session.start} - {session.end}</div>
    </div>
  );
}

function SessionGroup({ group, onOpenSession }) {
  return (
    <div className="sd-sgroup">
      <div className="sd-sgroup-header">
        <div className="sd-sgroup-dot" />
        <span className="sd-sgroup-label">
          There {group.count === 1 ? "is" : "are"} <strong>{group.count}</strong> training course{group.count > 1 ? "s" : ""} this month: <strong>{group.month}</strong>
        </span>
      </div>
      {group.sessions.map(s => (
        <div key={s.id} className="sd-sgroup-row">
          <div className="sd-sgroup-check"><IconCheck /></div>
          <div className="sd-sgroup-card-wrap"><SessionCard session={s} onOpen={onOpenSession} /></div>
        </div>
      ))}
    </div>
  );
}

function NoTraining() {
  return (
    <div className="sd-no-training">
      <IconBook />
      <div className="sd-no-training-title">Aucune formation</div>
      <div className="sd-no-training-sub">Vous n'avez aucune formation</div>
    </div>
  );
}

// ── Welcome tab ───────────────────────────────────────────────────────────────
function TabAccueil({ studentName, onOpenNotifications, onOpenCommander, onOpenCarnet }) {
  const [sessionTab,    setSessionTab]    = useState("upcoming");
  const [drawerSession, setDrawerSession] = useState(null);

  return (
    <div className="sd-tab-content">
      <div className="sd-greeting-card">
        <div className="sd-greeting-avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
        </div>
        <div className="sd-greeting-text">
          <div className="sd-greeting-hello">Bonjour {studentName}</div>
          <div className="sd-greeting-sub">Bon retour</div>
        </div>
        <button className="sd-greeting-bell" onClick={onOpenNotifications} aria-label="Notifications" style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <IconBell /><span className="sd-bell-badge">{NOTIF_COUNT}</span>
        </button>
      </div>

      <div className="sd-section-title">Aperçu de vos activités</div>

      <div className="sd-badges-row">
        <span className="sd-badge sd-badge--balance">Solde : <strong>10h</strong></span>
        <span className="sd-badge sd-badge--used">Utilisé : <strong>12h</strong></span>
        <button className="sd-commander-btn" onClick={onOpenCommander}><IconCart /> Commander</button>
      </div>

      <div className="sd-card">
        <div className="sd-card-header">
          <div className="sd-card-icon-wrap"><IconLightbulb /></div>
          <span className="sd-card-title">Progrès</span>
          <button className="sd-voir-carnet" onClick={onOpenCarnet}>Voir le carnet <IconChevR /></button>
        </div>
        <div className="sd-progress-shell">
          <div className="sd-progress-topline">
            <span className="sd-progress-caption">Votre progression de formation</span>
            <span className="sd-progress-value">0%</span>
          </div>
          <ProgressBar percent={0} />
          <div className="sd-progress-label">Évaluation des compétences en cours</div>
        </div>
      </div>

      <button className="sd-contract-btn"><IconDoc /> Voir mon contrat</button>

      <div className="sd-sessions-section">
        <div className="sd-session-tabs-wrap">
          <button className={`sd-session-tab ${sessionTab==="upcoming"?"sd-session-tab--active":""}`} onClick={() => setSessionTab("upcoming")}>Séance à venir</button>
          <button className={`sd-session-tab ${sessionTab==="ended"?"sd-session-tab--active":""}`} onClick={() => setSessionTab("ended")}>Séance terminée</button>
        </div>
        <div className="sd-session-list-body">
          {sessionTab==="upcoming" && (UPCOMING_SESSIONS.length===0 ? <NoTraining /> : UPCOMING_SESSIONS.map(g => <SessionGroup key={g.month} group={g} onOpenSession={setDrawerSession} />))}
          {sessionTab==="ended"   && (ENDED_SESSIONS.length===0    ? <NoTraining /> : ENDED_SESSIONS.map(g =>   <SessionGroup key={g.month} group={g} onOpenSession={setDrawerSession} />))}
        </div>
      </div>

      {drawerSession && <SessionDrawer session={drawerSession} onClose={() => setDrawerSession(null)} />}
    </div>
  );
}

// ── Sessions tab ──────────────────────────────────────────────────────────────
function TabSessions() {
  return (
    <div className="sd-tab-content sd-tab-content--sessions">
      <MonitorSessions variant="student" title="Mes séances" subtitle="Consultez vos réservations et votre planning hebdomadaire" allowAvailabilityCreation={false} />
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function TabProfile({ studentName, onOpenStudentProfile, onOpenExamInformation, onOpenCommander, onOpenOrders, onOpenCancellations }) {
  const OPTIONS = [
    { label: "Infos examen",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { label: "Offres",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
    { label: "Mes achats",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> },
    { label: "Mes séances annulées",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/></svg> },
  ];

  return (
    <div className="sd-tab-content">

      {/* Identity card */}
      <div className="sd-card sd-profile-identity-card">
        <div className="sd-profile-identity-top">
          <div className="sd-profile-avatar-lg">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div className="sd-profile-identity-info">
            <div className="sd-profile-identity-name">{studentName}</div>
            <div className="sd-profile-identity-email">chiendent.jennyfer@gmail.com</div>
          </div>
        </div>
        <div className="sd-profile-identity-divider" />
        <button className="sd-profile-voir-btn" onClick={onOpenStudentProfile}>
          Voir le profil <IconChevR />
        </button>
      </div>

      {/* Progress / stats card — dark, matching screenshot */}
      <div className="sd-profile-stats-card">
        <div className="sd-profile-stats-header">
          <span className="sd-profile-stats-title">La progression de vos compétences</span>
          <span className="sd-profile-stats-pct">0%</span>
        </div>
        {/* Reuse same progress bar segments — styled dark via wrapper */}
        <div className="sd-profile-progress-wrap">
          <ProgressBar percent={0} />
        </div>
        <div className="sd-profile-stats-grid">
          <div className="sd-profile-stat-box sd-profile-stat-box--yellow">
            <div className="sd-profile-stat-num">13</div>
            <div className="sd-profile-stat-label">Séances passées</div>
          </div>
          <div className="sd-profile-stat-box sd-profile-stat-box--blue">
            <div className="sd-profile-stat-num">0</div>
            <div className="sd-profile-stat-label">Séances à venir</div>
          </div>
          <div className="sd-profile-stat-box sd-profile-stat-box--orange">
            <div className="sd-profile-stat-num">13</div>
            <div className="sd-profile-stat-label">Solde utilisé</div>
          </div>
          <div className="sd-profile-stat-box sd-profile-stat-box--green">
            <div className="sd-profile-stat-num">0</div>
            <div className="sd-profile-stat-label">Solde restant</div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="sd-profile-options-section">
        <div className="sd-profile-options-label">Options</div>
        <div className="sd-card sd-profile-options-card">
          {OPTIONS.map((opt, i) => (
            <button
              key={opt.label}
              className={`sd-profile-option-row${i < OPTIONS.length - 1 ? " sd-profile-option-row--bordered" : ""}`}
              onClick={() => {
                if (opt.label === "Infos examen") return onOpenExamInformation();
                if (opt.label === "Offres") return onOpenCommander();
                if (opt.label === "Mes achats") return onOpenOrders();
                if (i === 3) return onOpenCancellations();
              }}
            >
              <span className="sd-profile-option-icon">{opt.icon}</span>
              <span className="sd-profile-option-label">{opt.label}</span>
              <span className="sd-profile-option-chev"><IconChevR /></span>
            </button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <button className="sd-signout-btn">Se déconnecter</button>

    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
function DashboardShell({ headerOpen, setHeaderOpen, onClose, tabs, activeTab, setActiveTab, children, closeOverlayOnTabClick }) {
  return (
    <div className="sd-overlay">
      <div className="sd-root">
        <div className={`sd-header-wrap${headerOpen ? "" : " sd-header-wrap--closed"}`}>
          {headerOpen && (
            <div className="sd-header">
              <div className="sd-header-left">
                <img src={logoblack} alt="logo" className="sd-logo-img" />
                <span className="easy">Easy<span className="text-primary"> moniteur</span></span>
                <div className="sd-header-divider" />
                <div className="sd-superadmin-pill">
                  <div className="sd-superadmin-avatar">SA</div>
                <span>Super admin</span>
                </div>
              </div>
              <button className="sd-quitter-btn" onClick={onClose}>Quitter</button>
            </div>
          )}
          <button className="sd-header-toggle" onClick={() => setHeaderOpen(o => !o)}>
            {headerOpen ? <IconChevU /> : <IconChevD />}
          </button>
        </div>

        <div className="sd-tabbar">
          <div className="sd-tabbar-logo"><img src={logoblack} alt="logo" className="sd-tabbar-logo-img" /></div>
          <div className="sd-tabs-pill">
            {tabs.map(tab => (
              <button key={tab.id} className={`sd-tab-btn${activeTab===tab.id?" sd-tab-btn--active":""}`}
                onClick={() => { setActiveTab(tab.id); if (closeOverlayOnTabClick) closeOverlayOnTabClick(); }}>
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sd-content">{children}</div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function StudentDashboard({ onClose, openFilterOnOpen = false }) {
  const [activeTab,         setActiveTab]         = useState("accueil");
  const [headerOpen,        setHeaderOpen]        = useState(true);
  const [showFilters,       setShowFilters]       = useState(openFilterOnOpen);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommander,     setShowCommander]     = useState(false);
  const [showCompetences,   setShowCompetences]   = useState(false);
  const [showStudentProfile,setShowStudentProfile]= useState(false);
  const [showExamInformation, setShowExamInformation] = useState(false);
  const [showStudentOrders, setShowStudentOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancellations, setShowCancellations] = useState(false);

  const studentName = "SOPHIE";
  const TABS = [
    { id:"accueil",  label:"Accueil",     icon:<IconHome /> },
    { id:"sessions", label:"Mes séances", icon:<IconCalendar /> },
    { id:"profile",  label:"Profil",     icon:<IconUser /> },
  ];
  const shellProps = { headerOpen, setHeaderOpen, onClose, tabs:TABS, activeTab, setActiveTab };

  if (showNotifications) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowNotifications(false)}>
      <Notifications onBack={() => setShowNotifications(false)} />
    </DashboardShell>
  );
  if (showCompetences) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowCompetences(false)}>
      <Competences onBack={() => setShowCompetences(false)} onOpenNotifications={() => { setShowCompetences(false); setShowNotifications(true); }} notifCount={NOTIF_COUNT} />
    </DashboardShell>
  );
  if (showCommander) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowCommander(false)}>
      <Commander
        onHome={() => setShowCommander(false)}
        onOpenNotifications={() => { setShowCommander(false); setShowNotifications(true); }}
        notifCount={NOTIF_COUNT}
      />
    </DashboardShell>
  );
  if (showStudentProfile) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowStudentProfile(false)}>
      <StudentProfile
        onBack={() => setShowStudentProfile(false)}
        onOpenNotifications={() => { setShowStudentProfile(false); setShowNotifications(true); }}
        notifCount={NOTIF_COUNT}
      />
    </DashboardShell>
  );
  if (showExamInformation) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowExamInformation(false)}>
      <ExamInformation
        onBack={() => setShowExamInformation(false)}
        onOpenNotifications={() => { setShowExamInformation(false); setShowNotifications(true); }}
        notifCount={NOTIF_COUNT}
      />
    </DashboardShell>
  );
  if (showStudentOrders) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowStudentOrders(false)}>
      <StudentOrder
        onBack={() => setShowStudentOrders(false)}
        onOpenNotifications={() => { setShowStudentOrders(false); setShowNotifications(true); }}
        notifCount={NOTIF_COUNT}
        onOpenOrderDetail={(order) => { setSelectedOrder(order); setShowStudentOrders(false); }}
      />
    </DashboardShell>
  );
  if (selectedOrder) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setSelectedOrder(null)}>
      <StudentOfferDetail
        order={{
          id: selectedOrder.id,
          offer: selectedOrder.offer,
          balance: selectedOrder.duration,
          total: selectedOrder.price,
          description: selectedOrder.id === "AD25-836TJSQP"
            ? "Besoin de quelques heures en plus en boite manuelle ? ou d'un pack complet pour bien maitriser la conduite ? ce pack vous conviendra parfaitement."
            : "Une offre reservee pour faire progresser votre parcours selon vos besoins de formation.",
          purchaseDate: selectedOrder.id === "AD25-836TJSQP" ? "10 Nov 2025" : "03 Mars 2026",
          paymentMethod: selectedOrder.id === "AD25-836TJSQP" ? "Stripe" : "Carte bancaire",
          paymentType: selectedOrder.id === "AD25-836TJSQP" ? "Par 3 tranches" : "Une fois",
          paymentStatus: selectedOrder.status === "Paid" ? "Paye" : "En attente",
        }}
        onBack={() => setSelectedOrder(null)}
        onOpenNotifications={() => { setSelectedOrder(null); setShowNotifications(true); }}
        notifCount={NOTIF_COUNT}
      />
    </DashboardShell>
  );
  if (showCancellations) return (
    <DashboardShell {...shellProps} closeOverlayOnTabClick={() => setShowCancellations(false)}>
      <ReservationsCancellations
        onBack={() => setShowCancellations(false)}
        onOpenNotifications={() => { setShowCancellations(false); setShowNotifications(true); }}
        notifCount={NOTIF_COUNT}
      />
    </DashboardShell>
  );

  return (
    <DashboardShell {...shellProps}>
      {activeTab==="accueil"  && <TabAccueil studentName={studentName} onOpenNotifications={() => setShowNotifications(true)} onOpenCommander={() => setShowCommander(true)} onOpenCarnet={() => setShowCompetences(true)} />}
      {activeTab==="sessions" && <TabSessions />}
      {activeTab==="profile"  && (
        <TabProfile
          studentName={studentName}
          onOpenStudentProfile={() => setShowStudentProfile(true)}
          onOpenExamInformation={() => setShowExamInformation(true)}
          onOpenCommander={() => setShowCommander(true)}
          onOpenOrders={() => setShowStudentOrders(true)}
          onOpenCancellations={() => setShowCancellations(true)}
        />
      )}
      {showFilters && <FilterDrawer onClose={() => setShowFilters(false)} />}
    </DashboardShell>
  );
}
