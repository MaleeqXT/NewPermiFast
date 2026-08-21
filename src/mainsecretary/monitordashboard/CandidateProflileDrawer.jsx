import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CandidateProfileDrawer.css";
import { fetchStudentStats, selectStudentStatsById, selectStudentStatsLoadingById } from "../../redux/reducers/studentStatsSlice.jsx";

const IconPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>;
const IconDots = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>;
const IconChevR = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>;

function getInitials(name = "") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function StatBox({ num, label, accent }) {
  return (
    <div className="cpd-stat-box" style={{ borderTopColor: accent }}>
      <div className="cpd-stat-num" style={{ color: accent }}>{num}</div>
      <div className="cpd-stat-label">{label}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="cpd-info-row">
      <span className="cpd-info-label">{label}</span>
      <span className="cpd-info-value">{value}</span>
    </div>
  );
}

export default function CandidateProfileDrawer({
  candidate,
  onClose,
  onPropose,
  onOpenCompetence,
  onOpenAllSessions,
  onOpenPedagogicalComments,
}) {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const studentId = candidate?.id ?? candidate?.studentId ?? candidate?.user?.id ?? null;
  const studentStats = useSelector((state) => selectStudentStatsById(state, studentId));
  const studentStatsLoading = useSelector((state) => selectStudentStatsLoadingById(state, studentId));

  useEffect(() => {
    if (!studentId) return;
    dispatch(fetchStudentStats(studentId));
  }, [dispatch, studentId]);

  const reservationsStats = studentStats?.reservations ?? {};
  const balanceStats = studentStats?.balance ?? {};
  const competenceStats = studentStats?.competences ?? {};

  const data = {
    name: candidate?.name ?? "Keita El hadji",
    email: candidate?.email ?? "ekeita934@gmail.com",
    phone: candidate?.phone ?? candidate?.tel ?? candidate?.telephone ?? "",
    neph: candidate?.neph ?? "220331300974",
    estimation: candidate?.estimation ?? "N/A",
    progress: Number(competenceStats.done ?? candidate?.progress ?? 0),
    seancePasse: Number(reservationsStats.passed ?? candidate?.seancePasse ?? 0),
    seanceAvenir: Number(reservationsStats.upcoming ?? candidate?.seanceAvenir ?? 0),
    balanceUtilise: Number(balanceStats.used ?? candidate?.balanceUtilise ?? 0),
    balanceReste: Number(balanceStats.rest ?? candidate?.balanceReste ?? 0),
  };

  const menuOptions = [
    { label: "Toutes les sÃ©ances", action: () => { setMenuOpen(false); onOpenAllSessions?.(data); } },
    { label: "Commentaires pÃ©dagogiques", action: () => { setMenuOpen(false); onOpenPedagogicalComments?.(data); } },
    { label: "CompÃ©tences", action: () => { setMenuOpen(false); onOpenCompetence?.(data); } },
    { label: "Proposer une sÃ©ance", action: () => { setMenuOpen(false); onPropose?.(data); } },
  ];

  const initials = getInitials(data.name);
  const segments = 14;
  const filledCount = Math.round((data.progress / 100) * segments);

  return (
    <>
      <div className="cpd-overlay" onClick={onClose} />

      <aside className="cpd-drawer">
        <header className="cpd-header">
          <button className="cpd-header-link" onClick={onClose}>Fermer</button>
          <h2 className="cpd-header-title">DÃ©tails du candidat</h2>
          <div className="cpd-header-menu-wrapper">
            <button
              className="cpd-header-menu"
              aria-label="Plus dâ€™options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <IconDots />
            </button>
            {menuOpen && (
              <div className="cpd-header-menu-dropdown">
                {menuOptions.map((option) => (
                  <button
                    key={option.label}
                    className="cpd-header-menu-item"
                    type="button"
                    onClick={option.action}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="cpd-body">
          <div className="cpd-avatar-card">
            <div className="cpd-avatar">{initials}</div>
            <div className="cpd-avatar-info">
              <div className="cpd-name">{data.name}</div>
              <div className="cpd-email">{data.email}</div>
            </div>
            <button className="cpd-phone-btn" aria-label="Appeler le candidat">
              <IconPhone />
            </button>
          </div>

          <div className="cpd-card">
            <div className="cpd-progress-header">
              <span className="cpd-progress-title">Progression des compÃ©tences</span>
              <span className="cpd-progress-pct">{studentStatsLoading ? "..." : `${data.progress}%`}</span>
            </div>
            <div className="cpd-progress-bar">
              {Array.from({ length: segments }, (_, index) => (
                <div key={index} className={`cpd-progress-seg${index < filledCount ? " cpd-progress-seg--filled" : ""}`} />
              ))}
            </div>
            <div className="cpd-stats-grid">
              <StatBox num={data.seancePasse} label="DerniÃ¨re sÃ©ance" accent="#f59e0b" />
              <StatBox num={data.seanceAvenir} label="SÃ©ance Ã  venir" accent="#3b82f6" />
              <StatBox num={data.balanceUtilise} label="Solde utilisÃ©" accent="#f97316" />
              <StatBox num={data.balanceReste} label="Solde restant" accent="#22c55e" />
            </div>
          </div>

          <div className="cpd-card">
            <div className="cpd-section-title">Informations personnelles</div>
            <div className="cpd-info-rows">
              <InfoRow label="NumÃ©ro NEPH" value={data.neph} />
              <InfoRow label="Estimation" value={data.estimation} />
              <InfoRow label="TÃ©lÃ©phone" value={data.phone || "—"} />
            </div>
          </div>

          <button className="cpd-see-profile-btn">
            Voir le profil complet <IconChevR />
          </button>
        </div>

        <footer className="cpd-footer">
          <button className="cpd-call-btn">
            <IconPhone /> Appel immÃ©diat
          </button>
        </footer>
      </aside>
    </>
  );
}
