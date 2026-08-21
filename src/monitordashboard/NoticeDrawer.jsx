import { useEffect, useState } from "react";
import "./NoticeDrawer.css";

export default function NoticeDrawer({
  open = true,
  onClose,
  onSave,
  session,
  initialReview,
}) {
  const [absent, setAbsent] = useState(initialReview?.status !== "here");
  const [notice, setNotice] = useState(initialReview?.note ?? "");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setAbsent(initialReview?.status !== "here");
    setNotice(initialReview?.note ?? "");
    setIsDirty(false);
  }, [initialReview, session]);

  useEffect(() => {
    const initialAbsent = initialReview?.status !== "here";
    const initialNotice = initialReview?.note ?? "";
    setIsDirty(absent !== initialAbsent || notice !== initialNotice);
  }, [absent, initialReview, notice]);

  const handleSave = () => {
    if (!isDirty || !notice.trim()) return;
    onSave?.({
      status: absent ? "absent" : "here",
      note: notice.trim(),
    });
    setIsDirty(false);
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <>
      <div
        className={`nd-backdrop ${open ? "nd-backdrop--open" : ""}`}
        onClick={handleClose}
      />

      <aside className={`nd-drawer ${open ? "nd-drawer--open" : ""}`}>
        <div className="nd-header">
          <button className="nd-close" onClick={handleClose}>Fermer</button>
          <span className="nd-title">Avis</span>
          <div style={{ width: 48 }} />
        </div>

        <div className="nd-body">
          <p className="nd-section-label">Informations sur la séance</p>

          <div className="nd-info-card">
            <div className="nd-info-row">
              <span className="nd-info-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <span className="nd-info-key">Date</span>
              <span className="nd-info-sep">:</span>
              <span className="nd-info-val">{session?.date ?? "28 avril 2026"}</span>
            </div>
            <div className="nd-info-row nd-info-row--last">
              <span className="nd-info-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              </span>
              <span className="nd-info-key">Heure</span>
              <span className="nd-info-sep">:</span>
              <span className="nd-info-val">{session?.timeLabel ?? session?.time ?? ""}</span>
            </div>
          </div>

          <div className="nd-toggle-row">
            <span className="nd-toggle-label">Absent</span>
            <button
              className={`nd-toggle ${absent ? "nd-toggle--on" : ""}`}
              role="switch"
              aria-checked={absent}
              aria-label="Basculer l’absence"
              onClick={() => setAbsent((p) => !p)}
            >
              <span className="nd-toggle-knob" />
            </button>
          </div>

          <textarea
            className="nd-textarea"
            placeholder="Ajouter un avis…"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          />
        </div>

        <div className="nd-footer">
          <button
            className={`nd-save ${isDirty && notice.trim() ? "nd-save--active" : ""}`}
            disabled={!isDirty || !notice.trim()}
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      </aside>
    </>
  );
}
