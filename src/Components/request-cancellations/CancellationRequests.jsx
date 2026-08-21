import { useEffect, useState } from "react";
import "./CancellationRequests.css";
import http from "../../helpers/http.jsx";

/* ────────────────────────────────────────────────────────────
   Small inline icon (same pattern Billing.jsx uses for icons:
   a tiny component that just returns raw SVG markup)
   ──────────────────────────────────────────────────────────── */
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* Same idea as Billing.jsx's STATUS_CONFIG object:
   one place that maps a status string -> label + colors.
   Today only "pending" exists, but this makes it trivial
   to add "approved" / "rejected" later without touching JSX. */
const STATUS_CONFIG = {
  pending:  { label: "Pending",  bg: "#fef3c7", color: "#b45309" },
  approved: { label: "Approved", bg: "#dcfce7", color: "#16a34a" },
  rejected: { label: "Rejected", bg: "#fee2e2", color: "#dc2626" },
};

export default function CancellationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    http.get("/approvels")
      .then((response) => {
        if (!active) return;
        setRequests((response.data?.data ?? []).map((row) => ({
          id: row.id,
          student: row.student_name || "Élève",
          reservation: row.reservation_id || "—",
          hours: row.hours_requested,
          status: row.status,
        })));
      })
      .catch((requestError) => active && setError(requestError.response?.data?.message || "Impossible de charger les demandes."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function updateStatus(id, newStatus) {
    try {
      const response = await http.post(`/approvels/${id}/${newStatus === "approved" ? "approve" : "reject"}`);
      const updated = response.data?.cancellation;
      setRequests((prev) => prev.map((row) => row.id === id ? { ...row, status: updated?.status || newStatus } : row));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Impossible de mettre à jour la demande.");
    }
  }

  return (
    <div className="cand-page">
      {/* ── Header — reuses the exact class Billing.jsx uses ── */}
      <div className="bil-header">
        <h1 className="ord-title">Cancellation Requests</h1>
      </div>

      {/* ── Card + scroll wrapper, same pattern as Billing's table ── */}
      <div className="cand-table-card">
        {error && <p className="cand-empty">{error}</p>}
        <div className="bil-table-scroll">
          <table className="cand-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Reservation</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="cand-empty">Chargement des demandes…</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="cand-empty">No cancellation requests</td></tr>
              ) : (
                requests.map((row) => {
                  const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 500, color: "#111827" }}>{row.student}</td>
                      <td>
                        <span className="canc-reservation-link">
                          #{row.reservation}
                        </span>
                      </td>
                      <td style={{ color: "#374151" }}>{row.hours}</td>
                      <td>
                        <span className="canc-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td>
                        <div className="canc-actions-cell">
                          <button
                            className="canc-approve-btn"
                            disabled={row.status !== "pending"}
                            onClick={() => updateStatus(row.id, "approved")}
                          >
                            <IconCheck /> Approve
                          </button>
                          <button
                            className="canc-reject-btn"
                            disabled={row.status !== "pending"}
                            onClick={() => updateStatus(row.id, "rejected")}
                          >
                            <IconX /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
