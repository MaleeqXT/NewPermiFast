import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReservationComment,
  selectReservationComments,
  updateReservationComment,
} from "../redux/reducers/commentsSlice.jsx";

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

function formatCommentDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ReservationCommentsSheet({ booking, open, onClose, readOnly = false }) {
  const dispatch = useDispatch();
  const commentState = useSelector((state) => selectReservationComments(state, booking?.id));
  const items = commentState?.items ?? [];
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setEditDraft("");
      setLocalError("");
    }
  }, [open]);

  if (!open || !booking || typeof document === "undefined") return null;

  const startEdit = (item) => {
    if (readOnly) return;
    setLocalError("");
    setEditingId(item.id);
    setEditDraft(item.comment || "");
  };

  const cancelEdit = () => {
    if (readOnly) return;
    setEditingId(null);
    setEditDraft("");
    setLocalError("");
  };

  const saveEdit = async () => {
    if (readOnly) return;
    const nextComment = editDraft.trim();
    if (!nextComment) {
      setLocalError("Comment required.");
      return;
    }

    try {
      await dispatch(updateReservationComment({
        reservationId: booking.id,
        commentId: editingId,
        comment: nextComment,
      })).unwrap();
      cancelEdit();
    } catch (error) {
      setLocalError(
        error?.message ||
        error?.comment ||
        error?.errors?.comment?.[0] ||
        "Unable to update comment.",
      );
    }
  };

  const handleDelete = async (item) => {
    if (readOnly) return;
    const confirmed = window.confirm("Supprimer ce commentaire ?");
    if (!confirmed) return;

    try {
      await dispatch(deleteReservationComment({
        reservationId: booking.id,
        commentId: item.id,
      })).unwrap();
      if (editingId === item.id) {
        cancelEdit();
      }
    } catch (error) {
      setLocalError(
        error?.message ||
        error?.error ||
        "Unable to delete comment.",
      );
    }
  };

  return createPortal(
    <div className="bd-comments-sheet-backdrop" onClick={onClose}>
      <aside className="bd-comments-sheet" onClick={(event) => event.stopPropagation()}>
        <header className="bd-comments-sheet-header">
          <button type="button" className="bd-comments-sheet-close" onClick={onClose}>
            Fermer
          </button>
          <h2>Tous les commentaires</h2>
          <span className="bd-comments-sheet-spacer" />
        </header>

        <div className="bd-comments-sheet-body">
          {commentState.loading && items.length === 0 ? (
            <p className="bd-comment-empty">Chargement des commentaires...</p>
          ) : items.length === 0 ? (
            <p className="bd-comment-empty">Aucun commentaire pour le moment.</p>
          ) : (
            items.map((item, index) => (
              <section key={item.id ?? `${item.created_at}-${index}`} className="bd-comment-item-card">
                <div className="bd-comment-item-title">Commentaire #{index + 1}</div>

                {editingId === item.id && !readOnly ? (
                  <>
                    <textarea
                      className="bd-comment-textarea bd-comment-textarea--sheet"
                      value={editDraft}
                      onChange={(event) => setEditDraft(event.target.value)}
                      rows={4}
                      autoFocus
                    />
                    {localError && <p className="bd-comment-error">{localError}</p>}
                    <div className="bd-comment-actions">
                      <button type="button" className="bd-comment-link" onClick={cancelEdit}>
                        Annuler
                      </button>
                      <button type="button" className="bd-comment-link" onClick={saveEdit}>
                        Enregistrer
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bd-comment-box bd-comment-box--sheet">{item.comment}</div>
                    <div className="bd-comment-item-meta">
                      {formatCommentDate(item.updated_at || item.created_at)}
                    </div>
                    {!readOnly ? (
                      <div className="bd-comment-actions">
                        <button type="button" className="bd-comment-link" onClick={() => startEdit(item)}>
                          Modifier
                        </button>
                        <button type="button" className="bd-comment-link bd-comment-link--danger" onClick={() => handleDelete(item)}>
                          Supprimer
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </section>
            ))
          )}

          {commentState.error && (
            <p className="bd-comment-error">
              {commentState.error?.message ||
                commentState.error?.error ||
                Object.values(commentState.error?.errors || {}).flat().filter(Boolean).join(" | ") ||
                "Unable to load comments."}
            </p>
          )}
        </div>

        <button type="button" className="bd-comments-sheet-fab" onClick={onClose} aria-label="Fermer">
          <IconX />
        </button>
      </aside>
    </div>,
    document.body,
  );
}
