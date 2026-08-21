import { useEffect, useMemo, useState } from "react";
import "./PedagogicalComments.css";

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="lr-toggle"
      style={{ background: value ? "#333" : "#d8d8d8" }}
    >
      <span
        className="lr-toggle-knob"
        style={{ transform: value ? "translateX(22px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function LessonReviewPage({ onBack, onSave, initialReview, title }) {
  const init = useMemo(
    () => ({
      comment: initialReview?.note ?? "",
      absent: initialReview?.status ? initialReview.status !== "here" : true,
    }),
    [initialReview],
  );
  const [comment, setComment] = useState(init.comment);
  const [absent, setAbsent] = useState(init.absent);

  useEffect(() => {
    setComment(init.comment);
    setAbsent(init.absent);
  }, [init]);

  const isDirty = comment !== init.comment || absent !== init.absent;

  const handleSave = () => {
    if (!isDirty) return;
    onSave?.({
      note: comment.trim(),
      status: absent ? "absent" : "here",
    });
  };

  return (
    <div className="lr-page">
      <main className="lr-main">
        <div className="lr-card">
          <h2 className="lr-title">{title || "Lesson review"}</h2>

          <textarea
            className="lr-textarea"
            placeholder="Commentaire (Ecrivez commentaire de votre review)"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <div className="lr-absent-row">
            <span className="lr-absent-label">L'eleve est absent</span>
            <Toggle value={absent} onChange={setAbsent} />
          </div>

          <div className="lr-divider" />

          <div className="lr-actions">
            <button className="lr-back-link" onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Retour
            </button>
            <button
              className={`lr-save-btn${isDirty ? " lr-save-btn--active" : ""}`}
              onClick={handleSave}
              disabled={!isDirty || !comment.trim()}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
