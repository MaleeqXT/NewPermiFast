import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import "./BookingDrawer.css";
import CandidateProfileDrawer from "./CandidateProflileDrawer";
import PedagogicalComments from "./PedagogicalComments.jsx";
import ReservationCommentsSheet from "../../monitordashboard/ReservationCommentsSheet.jsx";
import {
  addReservationComment,
  fetchReservationComments,
  selectReservationComments,
} from "../../redux/reducers/commentsSlice.jsx";

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const IconDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.64 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.46-1.3a2 2 0 0 1 2.11-.45c.84.3 1.72.52 2.62.64A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const IconCircleCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

function getCandidateInitials(name) {
  return (name ?? "?")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MapThumbnail({ onOpen }) {
  return (
    <button type="button" className="bd-map-thumb" onClick={onOpen}>
      <svg width="100%" height="100%" viewBox="0 0 400 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="400" height="144" fill="#f6f7fb" />
        <path d="M8 40 C 40 20, 72 20, 100 40 S 160 60, 188 34 S 240 10, 280 36 S 338 60, 392 32" stroke="#ccd3df" strokeWidth="4" fill="none" />
        <path d="M0 100 C 30 80, 70 78, 116 104 S 202 130, 244 104 S 312 70, 400 102" stroke="#d8dde7" strokeWidth="4" fill="none" />
        <path d="M88 0 L 136 60" stroke="#d8dde7" strokeWidth="4" />
        <path d="M184 24 L 244 96" stroke="#d8dde7" strokeWidth="4" />
        <path d="M284 0 L 324 54" stroke="#d8dde7" strokeWidth="4" />
        <path d="M324 66 L 376 134" stroke="#d8dde7" strokeWidth="4" />
        <path d="M0 64 H 400" stroke="#ffffff" strokeWidth="8" />
        <path d="M124 0 V 144" stroke="#ffffff" strokeWidth="8" />
        <path d="M256 0 V 144" stroke="#ffffff" strokeWidth="8" />
        <path d="M0 88 C 60 76, 136 76, 198 92 S 318 110, 400 84" stroke="#c6d7ec" strokeWidth="5" fill="none" />
        <circle cx="262" cy="44" r="7" fill="#e11d48" />
        <path d="M262 50 V 66" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />
        <circle cx="262" cy="44" r="3" fill="#fff" />
      </svg>
    </button>
  );
}

function MapModal({ location, url, onClose }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = useMemo(
    () => url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
    [url, location],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(location);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return createPortal(
    <div className="bd-modal-backdrop" onClick={onClose}>
      <div className="bd-modal" onClick={(event) => event.stopPropagation()}>
        <div className="bd-modal-header">
          <h3>Point de rendez-vous</h3>
          <button type="button" className="bd-modal-close" onClick={onClose}>Fermer</button>
        </div>
        <div className="bd-modal-map">
          <MapThumbnail onOpen={() => {}} />
        </div>
        <div className="bd-modal-copy">
          <strong>{location}</strong>
          <p>Ouvrez la carte dans Google Maps ou copiez l'adresse.</p>
        </div>
        <div className="bd-modal-actions">
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="bd-modal-button bd-modal-button--dark">
            Ouvrir dans Google Maps
          </a>
          <button type="button" className="bd-modal-button bd-modal-button--light" onClick={handleCopy}>
            {copied ? "Adresse copiée !" : "Copier l'adresse"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="bd-detail-row">
      <span className="bd-detail-icon">{icon}</span>
      <span className="bd-detail-label">{label}</span>
      <span className="bd-detail-colon">:</span>
      <strong className="bd-detail-value">{value}</strong>
    </div>
  );
}

function CandidateCard({ candidate, email, phone, avatarUrl, onOpenProfile }) {
  const initials = getCandidateInitials(candidate);
  return (
    <div className="bd-card bd-candidate-card">
      <div className="bd-candidate-main">
        <div className="bd-candidate-avatar" style={{ overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {avatarUrl
            ? <img src={avatarUrl} alt={candidate} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            : initials
          }
        </div>
        <div className="bd-candidate-copy">
          <h3>{candidate}</h3>
          <p>{email}</p>
          {phone && <p style={{ fontSize: "12px", color: "#6b7280", marginTop: 2 }}>{phone}</p>}
        </div>
        {phone
          ? <a href={`tel:${phone}`} className="bd-phone-button" aria-label={`Appeler ${candidate}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}><IconPhone /></a>
          : <button type="button" className="bd-phone-button" disabled aria-label="Numéro non disponible"><IconPhone /></button>
        }
      </div>

      <button type="button" className="bd-inline-action" onClick={onOpenProfile}>
        <span>Voir les détails du candidat</span>
        <IconChevronRight />
      </button>
    </div>
  );
}

function NoticeCard({ review, onOpenReviewList }) {
  const hasReview = Boolean(review?.note);
  const isAbsent = review?.status === "absent";

  return (
    <div className="bd-card bd-notice-card">
      <div className="bd-notice-header">
        <span>Avis</span>
        <button type="button" onClick={onOpenReviewList}>Voir tous les avis</button>
      </div>

      {hasReview ? (
        <div className="bd-review-summary">
          <div className="bd-review-row">
            <span>Statut</span>
            <strong className={`bd-review-status ${isAbsent ? "bd-review-status--absent" : "bd-review-status--here"}`}>
              {isAbsent ? "Absent" : "Présent"}
            </strong>
          </div>
          <div className="bd-review-row">
            <span>Note</span>
            <p>{review.note}</p>
          </div>
        </div>
      ) : (
        <div className="bd-notice-body">
          <div className="bd-notice-icon">
            <IconWarning />
          </div>
          <h4>Aucun avis n'est disponible pour le moment.</h4>
          <p>Veuillez ajouter une note pour confirmer la session.</p>
        </div>
      )}
    </div>
  );
}

function formatCommentDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function BookingDrawer({
  booking,
  onClose,
  onOpenProposeSession,
  onOpenCompetence,
  onOpenAllSessions,
  onCancelSession,
  onMarkUnavailable,
  onEditReservation,
  onOpenNotice,
  onOpenReviewList,
  review,
  pedagogicalReview,
  onSavePedagogicalReview,
  drawerTitle = "Détails de la réservation",
  primaryActionLabel = " Appel immediat ",
}) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCandidateOpen, setIsCandidateOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPedagogicalOpen, setIsPedagogicalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState("");
  const [markUnavailableLoading, setMarkUnavailableLoading] = useState(false);
  const commentState = useSelector((state) => selectReservationComments(state, booking?.id));
  const commentItems = commentState?.items ?? [];
  const canManageComments = currentUser?.role !== "monitor";
  const isCancelled = booking?.status === "cancelled";
  const isCancellationRequested = Boolean(booking?.cancellationRequested || booking?.pendingCancellation);
  const isAvailability = booking?.type === "availability";
  const canCancelSession = Boolean(onCancelSession) && !isAvailability && !isCancelled && !isCancellationRequested;
  const canMarkUnavailable = Boolean(onMarkUnavailable) && !isAvailability && !isCancelled;
  const canEditReservation = Boolean(onEditReservation) && !isAvailability;
  const offerStyle = booking?.accentColor
    ? {
      background: `linear-gradient(135deg, ${booking.accentColor} 0%, ${booking.accentColor}cc 100%)`,
      boxShadow: `0 14px 28px ${booking.accentColor}33`,
      }
    : undefined;

  const handleOpenProposeSession = (candidateData) => {
    setMenuOpen(false);
    setIsCandidateOpen(false);
    onClose();
    onOpenProposeSession?.(candidateData);
  };

  const pedagogicalStatusLabel = pedagogicalReview?.status
    ? (pedagogicalReview.status === "absent" ? "Absent" : "Here")
    : null;

  useEffect(() => {
    if (!booking?.id) return;
    setCommentDraft("");
    setCommentError("");

    if (booking.type !== "availability") {
      dispatch(fetchReservationComments({ reservationId: booking.id }));
    }
  }, [booking?.id, booking?.type, dispatch]);

  const handleSaveComment = async () => {
    const nextComment = commentDraft.trim();
    if (!nextComment) {
      setCommentError("Comment required.");
      return;
    }

    if (!booking.studentId) {
      setCommentError("Student id is missing for this reservation.");
      return;
    }

    setCommentError("");

    try {
      await dispatch(addReservationComment({
        reservationId: booking.id,
        studentId: booking.studentId,
        comment: nextComment,
      })).unwrap();
      setCommentDraft("");
    } catch (error) {
      const message =
        error?.message ||
        error?.comment ||
        error?.errors?.comment?.[0] ||
        "Unable to save comment.";
      setCommentError(message);
    }
  };

  const handleMarkUnavailable = async () => {
    if (!booking?.id || !onMarkUnavailable) return;

    const confirmed = window.confirm("Marquer cette réservation comme indisponible ?");
    if (!confirmed) return;

    setMarkUnavailableLoading(true);
    try {
      await onMarkUnavailable(booking);
    } catch (error) {
      console.error(error);
    } finally {
      setMarkUnavailableLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <>
      <div className="bd-overlay" onClick={onClose} />

      <aside className={`bd-drawer ${isMapOpen ? "bd-drawer--blurred" : ""}`}>
        <header className="bd-header">
          <button type="button" className="bd-header-close" onClick={onClose}>Fermer</button>
          <h2>{drawerTitle}</h2>
          <div className="bd-header-menu-wrapper">
            <button
              type="button"
              className="bd-header-menu"
              aria-label="Plus dâ€™options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <IconDots />
            </button>
            {menuOpen && (
              <div className="bd-header-menu-dropdown">
                <button
                  type="button"
                  className="bd-header-menu-item"
                  onClick={() =>
                    handleOpenProposeSession({
                      name: booking.candidate,
                      email: booking.email,
                    })
                  }
                >
                  Proposer une session
                </button>
                {canCancelSession && (
                  <button
                    type="button"
                    className="bd-header-menu-item bd-header-menu-item--danger"
                    onClick={() => {
                      setMenuOpen(false);
                      onCancelSession?.(booking);
                    }}
                  >
                    Annuler la session
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="bd-body">
          <section className="bd-section">
            <div className="bd-section-title">
              <div className={`bd-section-icon ${isCancelled ? "bd-section-icon--cancelled" : ""}`}>
                {isCancelled ? <IconWarning /> : <IconCircleCheck />}
              </div>
              <h3>{isAvailability ? "Détails de la disponibilité" : "Détails de la session"}</h3>
            </div>

            <div className="bd-bullet-line">
              <span className="bd-bullet" />
              <p>{booking.displayStatus || (isAvailability ? "La disponibilité a été enregistrée." : "La date de la session est passée")}</p>
            </div>

            {(isCancelled || isCancellationRequested) && (
              <div className="bd-alert-card">
                <strong>
                  {isCancelled
                    ? "La demande d’annulation est en cours de traitement."
                    : "La demande d’annulation a été envoyée à l’administrateur."}
                </strong>
                {booking.cancellationReason && <span>{booking.cancellationReason}</span>}
              </div>
            )}

            <div className="bd-detail-grid">
              <DetailRow icon={<IconCalendar />} label="Date" value={booking.date} />
              <DetailRow icon={<IconClock />} label="Heure" value={booking.timeLabel} />
              <DetailRow icon={<IconBell />} label="Rappel" value={booking.reminder} />
            </div>
          </section>

          <section className="bd-section">
            <div className="bd-section-heading">Point de rendez-vous</div>
            <div className="bd-card bd-map-card">
              <MapThumbnail onOpen={() => setIsMapOpen(true)} />
              <button type="button" className="bd-map-location" onClick={() => setIsMapOpen(true)}>
                <span>{booking.mapLocation}</span>
                <IconChevronRight />
              </button>
            </div>
          </section>

          <section className="bd-section">
            <div className="bd-section-heading">{booking.contextLabel}</div>

            {!isAvailability && (
              <CandidateCard
                candidate={booking.candidate}
                email={booking.email}
                phone={booking.phone}
                avatarUrl={booking.candidateAvatar}
                onOpenProfile={() => setIsCandidateOpen(true)}
              />
            )}

            {isAvailability && (
              <div className="bd-card bd-comments-card">
                <div className="bd-comment-label">Lieu</div>
                <div className="bd-comment-box">{booking.place}</div>
              </div>
            )}
          </section>

          {!isAvailability && (
            <section className="bd-section">
              <div className="bd-section-heading">Offre</div>
              <div
                className={`bd-offer-banner ${isCancelled ? "bd-offer-banner--cancelled" : ""}`}
                style={offerStyle}
              >
                <div className="bd-offer-badge">PASS<br />PERMIS</div>
                <strong>{booking.offer}</strong>
              </div>
            </section>
          )}

          <section className="bd-section">
            <div className="bd-section-heading">Commentaires</div>
            <div className="bd-card bd-comments-card">
              {pedagogicalStatusLabel && (
                <div className="bd-comment-label">Statut : {pedagogicalStatusLabel}</div>
              )}

              <div className="bd-comment-head">
                <div>
                  <div className="bd-comment-label">Dernier commentaire</div>
                  <p className="bd-comment-meta">
                    {commentItems.length} commentaire(s)
                    {commentState.loading ? " · chargement..." : ""}
                  </p>
                </div>

                {commentItems.length > 0 && (
                  <button
                    type="button"
                    className="bd-comments-link"
                    onClick={() => setIsCommentsOpen(true)}
                  >
                    Tous les commentaires
                  </button>
                )}
              </div>

              {commentState.error && (
                <p className="bd-comment-error">
                  {commentState.error?.message ||
                    commentState.error?.error ||
                    Object.values(commentState.error?.errors || {}).flat().filter(Boolean).join(" | ") ||
                    "Unable to load comments."}
                </p>
              )}

              {commentItems[0] ? (
                <div className="bd-comment-list">
                  <article className="bd-comment-item">
                    <div className="bd-comment-box">{commentItems[0].comment}</div>
                    <div className="bd-comment-item-meta">
                      {formatCommentDate(commentItems[0].updated_at || commentItems[0].created_at)}
                    </div>
                  </article>
                </div>
              ) : (
                <p className="bd-comment-empty">Aucun commentaire pour le moment.</p>
              )}

              {!isAvailability && canManageComments ? (
                <div className="bd-comment-compose">
                  <div className="bd-comment-label">Ajouter un commentaire</div>
                  <textarea
                    className="bd-comment-textarea"
                    placeholder="Ajouter un commentaire..."
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    rows={4}
                  />
                  {commentError && <p className="bd-comment-error">{commentError}</p>}
                  {!booking.studentId && (
                    <p className="bd-comment-error">Student id is required to add a comment.</p>
                  )}
                  <button
                    type="button"
                    className="bd-comment-submit"
                    onClick={handleSaveComment}
                    disabled={commentState.saving || !booking.studentId}
                  >
                    {commentState.saving ? "Saving..." : "Save comment"}
                  </button>
                  {canEditReservation && (
                    <button
                      type="button"
                      className="bd-comment-submit bd-comment-submit--secondary"
                      onClick={() => onEditReservation?.(booking)}
                    >
                      Modifier la réservation
                    </button>
                  )}
                  {canMarkUnavailable && (
                    <button
                      type="button"
                      className="bd-comment-submit bd-comment-submit--danger"
                      onClick={handleMarkUnavailable}
                      disabled={markUnavailableLoading}
                    >
                      {markUnavailableLoading ? "Traitement..." : "Marquer indisponible"}
                    </button>
                  )}
                </div>
              ) : !isAvailability ? (
                <p className="bd-comment-empty">Lecture seule pour le moniteur.</p>
              ) : (
                <p className="bd-comment-empty">Commentaires non disponibles pour une disponibilité.</p>
              )}
            </div>
          </section>

          <NoticeCard review={review} onOpenReviewList={onOpenReviewList} />
        </div>

        <footer className="bd-footer">
          {booking?.phone && !onOpenNotice ? (
            <a
              href={`tel:${booking.phone}`}
              className="bd-primary-action"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", gap: "8px" }}
            >
              <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" fill="currentColor" d="M6.75 4.5c-1.283 0-2.213 1.025-2.044 2.127.384 2.498 1.296 4.459 2.707 5.89 1.41 1.43 3.373 2.389 5.96 2.786 1.101.17 2.126-.76 2.126-2.044v-.727a.25.25 0 0 0-.187-.242l-1.9-.498a.25.25 0 0 0-.182.022l-1.067.576c-.69.373-1.638.492-2.422-.056a8.678 8.678 0 0 1-2.071-2.09c-.542-.787-.423-1.735-.045-2.428l.57-1.047a.252.252 0 0 0 .022-.182l-.498-1.9a.25.25 0 0 0-.242-.187h-.726Zm-3.526 2.355c-.334-2.174 1.497-3.856 3.527-3.855h.726a1.75 1.75 0 0 1 1.693 1.306l.498 1.9c.113.43.058.885-.153 1.276l-.001.002-.572 1.05c-.191.351-.169.668-.036.86a7.184 7.184 0 0 0 1.694 1.71c.187.13.498.156.85-.034l1.067-.576a1.75 1.75 0 0 1 1.276-.153l1.9.498a1.75 1.75 0 0 1 1.306 1.693v.727c0 2.03-1.68 3.86-3.854 3.527-2.838-.436-5.12-1.511-6.8-3.216-1.68-1.703-2.701-3.978-3.121-6.715Z" />
              </svg>
              {primaryActionLabel || "Appel immédiat"}
            </a>
          ) : (
            <button type="button" className="bd-primary-action" onClick={onOpenNotice}>
              <svg style={{ width: "20px", height: "20px", paddingTop: "5px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" fill="currentColor" d="M6.75 4.5c-1.283 0-2.213 1.025-2.044 2.127.384 2.498 1.296 4.459 2.707 5.89 1.41 1.43 3.373 2.389 5.96 2.786 1.101.17 2.126-.76 2.126-2.044v-.727a.25.25 0 0 0-.187-.242l-1.9-.498a.25.25 0 0 0-.182.022l-1.067.576c-.69.373-1.638.492-2.422-.056a8.678 8.678 0 0 1-2.071-2.09c-.542-.787-.423-1.735-.045-2.428l.57-1.047a.252.252 0 0 0 .022-.182l-.498-1.9a.25.25 0 0 0-.242-.187h-.726Zm-3.526 2.355c-.334-2.174 1.497-3.856 3.527-3.855h.726a1.75 1.75 0 0 1 1.693 1.306l.498 1.9c.113.43.058.885-.153 1.276l-.001.002-.572 1.05c-.191.351-.169.668-.036.86a7.184 7.184 0 0 0 1.694 1.71c.187.13.498.156.85-.034l1.067-.576a1.75 1.75 0 0 1 1.276-.153l1.9.498a1.75 1.75 0 0 1 1.306 1.693v.727c0 2.03-1.68 3.86-3.854 3.527-2.838-.436-5.12-1.511-6.8-3.216-1.68-1.703-2.701-3.978-3.121-6.715Z" />
              </svg>
              {primaryActionLabel || "Appel immédiat"}
            </button>
          )}
        </footer>
      </aside>

      {isMapOpen && (
        <MapModal location={booking.mapLocation} url={booking.lieuUrl} onClose={() => setIsMapOpen(false)} />
      )}

      {isCandidateOpen && (
        <CandidateProfileDrawer
          candidate={{ id: booking.studentId, name: booking.candidate, email: booking.email, phone: booking.phone }}
          onClose={() => setIsCandidateOpen(false)}
          onPropose={handleOpenProposeSession}
          onOpenPedagogicalComments={() => {
            setIsCandidateOpen(false);
            setIsPedagogicalOpen(true);
          }}
          onOpenAllSessions={(candidateData) => {
            setIsCandidateOpen(false);
            onClose();
            onOpenAllSessions?.(candidateData);
          }}
          onOpenCompetence={(candidateData) => {
            setIsCandidateOpen(false);
            onClose();
            onOpenCompetence?.(candidateData);
          }}
        />
      )}

      {isPedagogicalOpen && (
        <PedagogicalComments
          title={`${booking.date} ${booking.timeLabel}`}
          initialReview={pedagogicalReview}
          onBack={() => setIsPedagogicalOpen(false)}
          onSave={(nextReview) => {
            onSavePedagogicalReview?.(nextReview);
            setIsPedagogicalOpen(false);
          }}
        />
      )}

      {isCommentsOpen && (
        <ReservationCommentsSheet
          booking={booking}
          open={isCommentsOpen}
          readOnly={!canManageComments}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
}




