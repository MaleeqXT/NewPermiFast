import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentStats, selectStudentStatsById, selectStudentStatsLoadingById } from "../../redux/reducers/studentStatsSlice.jsx";
import "./ProposeSessionDrawer.css";

const IconPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>;
const IconCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>;
const IconMapPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;

function getInitials(name = "") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function StatBox({ num, label, accent }) {
  return (
    <div className="psd-stat-box" style={{ borderTopColor: accent }}>
      <div className="psd-stat-num" style={{ color: accent }}>{num}</div>
      <div className="psd-stat-label">{label}</div>
    </div>
  );
}

export default function ProposeSessionDrawer({ candidate, sessions = [], onClose, onConfirm }) {
  const [justification, setJustification] = useState("");
  const dispatch = useDispatch();

  const studentId = candidate?.id ?? candidate?.student_id ?? candidate?.user?.student?.id ?? null;
  const stats = useSelector((state) => selectStudentStatsById(state, studentId));
  const statsLoading = useSelector((state) => selectStudentStatsLoadingById(state, studentId));

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentStats(studentId));
    }
  }, [dispatch, studentId]);

  const data = {
    name: candidate?.name ?? candidate?.user?.name ?? "Candidat",
    email: candidate?.email ?? candidate?.user?.email ?? "",
    progress: stats?.competences?.done ?? candidate?.progress ?? 0,
    seancePasse: stats?.reservations?.passed ?? candidate?.seancePasse ?? 0,
    seanceAvenir: stats?.reservations?.upcoming ?? candidate?.seanceAvenir ?? 0,
    balanceUtilise: stats?.balance?.used ?? candidate?.balanceUtilise ?? 0,
    balanceReste: stats?.balance?.rest ?? candidate?.balanceReste ?? 0,
  };

  const initials = getInitials(data.name);
  const segments = 14;
  const filledCount = Math.round((data.progress / 100) * segments);

  function handleConfirm() {
    onConfirm?.({ justification });
  }

  return (
    <>
      <div className="psd-overlay" onClick={onClose} />

      <aside className="psd-drawer">
        <header className="psd-header">
          <button className="psd-header-link" onClick={onClose}>Fermer</button>
          <h2 className="psd-header-title">Motif du rendez-vous</h2>
          <span style={{ width: 52 }} />
        </header>

        <div className="psd-body">
          <div className="psd-avatar-card">
            {candidate?.profile_photo_url || candidate?.media || candidate?.user?.profile_photo_url || candidate?.user?.media ? (
              <img
                src={candidate.profile_photo_url || candidate.user?.profile_photo_url || `${import.meta.env.VITE_API_URL ?? ""}/storage/${candidate.media || candidate.user?.media}`}
                alt={data.name}
                className="psd-avatar"
                style={{ borderRadius: "50%", objectFit: "cover", width: "42px", height: "42px" }}
              />
            ) : (
              <div className="psd-avatar">{initials}</div>
            )}
            <div className="psd-avatar-info">
              <div className="psd-name">{data.name}</div>
              <div className="psd-email">{data.email}</div>
            </div>
            {candidate?.phone && (
              <a href={`tel:${candidate.phone}`} className="psd-phone-btn" aria-label="Appeler le candidat">
                <IconPhone />
              </a>
            )}
          </div>

          <div className="psd-card">
            <div className="psd-progress-header">
              <span className="psd-progress-title">Progression des compétences</span>
              <span className="psd-progress-pct">{data.progress}%</span>
            </div>

            <div className="psd-progress-bar">
              {Array.from({ length: segments }, (_, index) => (
                <div
                  key={index}
                  className={`psd-progress-seg${index < filledCount ? " psd-progress-seg--filled" : ""}`}
                />
              ))}
            </div>

            <div className="psd-stats-grid">
              <StatBox num={data.seancePasse} label="Séances passées" accent="#f59e0b" />
              <StatBox num={data.seanceAvenir} label="Séances à venir" accent="#3b82f6" />
              <StatBox num={data.balanceUtilise} label="Solde utilisé" accent="#f97316" />
              <StatBox num={data.balanceReste} label="Solde restant" accent="#22c55e" />
            </div>
          </div>

          <div className="psd-card">
            {sessions.map((session) => {
              const dateVal = session.date || "";
              const startVal = session.startTime || session.start || "";
              const endVal = session.endTime || session.end || "";
              const locationVal = session.place || session.mapLocation || session.location || "";
              return (
                <div key={session.id} className="psd-session-item">
                  <div className="psd-info-row">
                    <span className="psd-info-icon"><IconCalendar /></span>
                    <span className="psd-info-label">Séance du</span>
                    <span className="psd-info-value">
                      {dateVal} {startVal} à {endVal}
                    </span>
                  </div>
                  <div className="psd-divider" />
                  <div className="psd-info-row">
                    <span className="psd-info-icon"><IconMapPin /></span>
                    <span className="psd-info-label">Lieu</span>
                    <span className="psd-info-value">{locationVal}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="psd-card psd-textarea-card">
            <textarea
              className="psd-textarea"
              placeholder="Justification et objectifs"
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              rows={5}
            />
          </div>
        </div>

        <footer className="psd-footer">
          <button className="psd-confirm-btn" onClick={handleConfirm}>
            Confirmer et proposer
          </button>
        </footer>
      </aside>
    </>
  );
}
