import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EVENT_COLORS, pad2 } from "./CalConstants.js";
import { fetchPlacesByZone, selectPlacesForZone } from "../redux/reducers/locationSlice.jsx";
import { fetchMonitors } from "../redux/reducers/monitorsSlice.jsx";
import { fetchStudents } from "../redux/reducers/candidateSlice.jsx";
import { fetchOffers, getStudentselectedOffers } from "../redux/reducers/offerSlice.jsx";
import CandidatesModal from "./CandidatesModal.jsx";
import MonitorsModal from "./MonitorsModal.jsx";
import OfferModal from "./OfferModal.jsx";

const IconLock = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: 4, verticalAlign: "middle" }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function getName(person) {
  if (!person) return "";
  if (typeof person === "string") return person;
  return (
    person.name ||
    [person.prenom, person.nom].filter(Boolean).join(" ").trim() ||
    person.first_name ||
    person.last_name ||
    ""
  );
}

function getMonitorId(monitor) {
  if (!monitor) return "";
  return String(
    monitor.user?.monitor?.id ??
    monitor.monitor?.id ??
    monitor.monitor_id ??
    monitor.user?.monitor_id ??
    monitor.id ??
    ""
  );
}

function getCandidateStudentId(candidate) {
  if (!candidate) return "";
  return String(
    candidate.student?.id ??
    candidate.student_id ??
    candidate.user?.student?.id ??
    candidate.user?.student_id ??
    candidate.id ??
    ""
  );
}

function getCandidateDisplayName(candidate) {
  if (!candidate) return "";
  return (
    candidate.name ||
    [candidate.first_name, candidate.last_name].filter(Boolean).join(" ").trim() ||
    [candidate.prenom, candidate.nom].filter(Boolean).join(" ").trim() ||
    candidate.user?.name ||
    candidate.user?.first_name ||
    candidate.user?.last_name ||
    ""
  );
}

function resolveSelectedItem(list, candidate) {
  if (!candidate) return "";
  if (typeof candidate === "object" && candidate.id) return String(candidate.id);
  const target = String(getName(candidate)).toLowerCase();
  const match = list.find((item) => getName(item).toLowerCase() === target);
  return match ? String(match.id) : "";
}

function getReservationHours(startTime, endTime) {
  const toMinutes = (time) => {
    const [hours, minutes] = String(time || "").split(":").map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes) ? (hours * 60) + minutes : null;
  };
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  return start !== null && end !== null && end > start ? Math.ceil((end - start) / 60) : 1;
}

export default function CalReservationDrawer({
  onSave,
  onClose,
  defaultDate,
  defaultHour,
  prefillZone,
  prefillPlace,
  prefillMonitor,
  prefillCandidate,
  initialReservation = null,
  mode = "create",
  submitLabel,
}) {
  const dispatch = useDispatch();
  const selectedSchool = useSelector((state) => state.schools.selected);
  const fallbackZone = selectedSchool ?? prefillZone ?? null;
  const zoneId = fallbackZone?.id ?? null;
  const zoneName = fallbackZone?.name ?? "Zone sélectionnée";
  const sourceReservation = initialReservation || null;

  const places = useSelector(selectPlacesForZone(zoneId));
  const monitors = useSelector((state) => state.monitors.list);
  const monitorsLoading = useSelector((state) => state.monitors.loading);
  const candidates = useSelector((state) => state.candidates.list);
  const candidatesLoading = useSelector((state) => state.candidates.loading);
  const selectedOffers = useSelector((state) => state.offers.selectedOffers);
  const selectedOffersLoading = useSelector((state) => state.offers.selectedOffersLoading);

  const today = defaultDate || new Date().toISOString().split("T")[0];
  const initialDate = sourceReservation?.date || today;
  const initialStartTime = sourceReservation?.start_at || sourceReservation?.startTime || (defaultHour != null ? `${pad2(defaultHour)}:00` : "");
  const initialEndTime = sourceReservation?.end_at || sourceReservation?.endTime || (defaultHour != null ? `${pad2(defaultHour + 1)}:00` : "");
  const initialEnabled = sourceReservation?.is_active != null ? Boolean(Number(sourceReservation.is_active)) : true;
  const initialColor = sourceReservation?.color || EVENT_COLORS[0];

  const [enabled, setEnabled] = useState(initialEnabled);
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [placeId, setPlaceId] = useState(sourceReservation?.place?.id ? String(sourceReservation.place.id) : "");
  const [monitorId, setMonitorId] = useState(
    sourceReservation?.monitorId
      ? String(sourceReservation.monitorId)
      : sourceReservation?.monitor_id
        ? String(sourceReservation.monitor_id)
        : sourceReservation?.monitor?.user?.monitor?.id
      ? String(sourceReservation.monitor.user.monitor.id)
      : sourceReservation?.monitor?.monitor?.id
        ? String(sourceReservation.monitor.monitor.id)
        : sourceReservation?.monitor?.monitor_id
          ? String(sourceReservation.monitor.monitor_id)
          : sourceReservation?.monitor?.id
            ? String(sourceReservation.monitor.id)
            : sourceReservation?.monitor_id
              ? String(sourceReservation.monitor_id)
              : ""
  );
  const [candidateId, setCandidateId] = useState(sourceReservation?.candidate?.id ? String(sourceReservation.candidate.id) : "");
  const [offerId, setOfferId] = useState(sourceReservation?.offer?.id ? String(sourceReservation.offer.id) : "");
  const [color, setColor] = useState(initialColor);
  const [errors, setErrors] = useState({});
  const [showMon, setShowMon] = useState(false);
  const [showCand, setShowCand] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [monitorSearch, setMonitorSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const prefillPlaceValue = sourceReservation?.place ?? prefillPlace ?? null;
  const prefillMonitorValue = sourceReservation?.monitor ?? prefillMonitor ?? null;
  const prefillCandidateValue = sourceReservation?.candidate ?? prefillCandidate ?? null;
  const prefillOfferValue = sourceReservation?.offer ?? null;
  const initialPlaceId = useMemo(() => resolveSelectedItem(places, prefillPlaceValue), [places, prefillPlaceValue]);
  const initialMonitorId = useMemo(() => resolveSelectedItem(monitors, prefillMonitorValue), [monitors, prefillMonitorValue]);
  const initialCandidateId = useMemo(() => resolveSelectedItem(candidates, prefillCandidateValue), [candidates, prefillCandidateValue]);
  const initialOfferId = useMemo(() => resolveSelectedItem(selectedOffers.map((item) => item.offer ?? item).filter(Boolean), prefillOfferValue), [selectedOffers, prefillOfferValue]);

  const effectivePlaceId = placeId || initialPlaceId;
  const effectiveMonitorId = monitorId || initialMonitorId;
  const effectiveCandidateId = candidateId || initialCandidateId;

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => getCandidateStudentId(candidate) === String(effectiveCandidateId)) || null,
    [candidates, effectiveCandidateId]
  );
  const selectedStudentId = selectedCandidate
    ? getCandidateStudentId(selectedCandidate)
    : String(effectiveCandidateId || "");

  const selectedMonitor = useMemo(
    () => monitors.find((monitor) => getMonitorId(monitor) === String(effectiveMonitorId)) || null,
    [monitors, effectiveMonitorId]
  );

  // The wallet endpoint returns wallet rows with an embedded offer. Preserve the
  // wallet balance here; using only `item.offer` showed the offer's default
  // balance instead of the selected student's remaining hours.
  const selectedOfferItems = useMemo(
    () => selectedOffers.map((wallet) => {
      const offer = wallet.offer ?? wallet;
      if (!offer) return null;
      return {
        ...offer,
        id: offer.id ?? wallet.offer_id ?? wallet.id,
        offer_id: offer.id ?? wallet.offer_id ?? wallet.id,
        wallet_id: wallet.id ?? null,
        balance: wallet.balance ?? wallet.total_balance ?? offer.balance ?? 0,
        total_balance: wallet.total_balance ?? wallet.balance ?? offer.total_balance ?? 0,
      };
    }).filter(Boolean),
    [selectedOffers]
  );

  const offerItems = useMemo(
    () => (selectedCandidate || selectedStudentId ? selectedOfferItems : []),
    [selectedCandidate, selectedStudentId, selectedOfferItems]
  );

  const selectedOffer = useMemo(
    () => offerItems.find((offer) => String(offer.id) === String(offerId)) || null,
    [offerItems, offerId]
  );
  const selectedOfferId = offerId || initialOfferId;

  const activePlaces = useMemo(
    () => places.filter(Boolean).map((place) => ({
      id: String(place.id),
      label: place.name || place.title || place.label || `Lieu ${place.id}`,
    })),
    [places]
  );

  const activeCandidates = useMemo(
    () => candidates.map((candidate) => ({
      id: getCandidateStudentId(candidate),
      label: getCandidateDisplayName(candidate),
    })),
    [candidates]
  );

  const selectedPlace = useMemo(
    () => activePlaces.find((item) => item.id === effectivePlaceId) || null,
    [activePlaces, effectivePlaceId]
  );
  const candidateLabelText = selectedCandidate?.name || sourceReservation?.candidate?.name || sourceReservation?.student_name || "Séléctionner un candidat";
  const monitorLabelText = selectedMonitor?.name || sourceReservation?.monitor?.name || sourceReservation?.monitor_name || "Sélectionner un moniteur";
  const offerLabelText = selectedOffer?.name || selectedOffer?.label || sourceReservation?.offer?.name || sourceReservation?.offer_name || (
    selectedCandidate
      ? (selectedOffersLoading ? "Chargement des offres..." : "Aucune offre disponible")
      : "Sélectionner un candidat d'abord"
  );
  const placeLabelText = selectedPlace?.label || sourceReservation?.place?.name || sourceReservation?.place_name || "Sélectionner un lieu";

  useEffect(() => {
    if (!zoneId) return;
    dispatch(fetchPlacesByZone(zoneId));
  }, [dispatch, zoneId]);

  useEffect(() => {
    dispatch(fetchMonitors({ page: 1, search: "", status: 1 }));
    dispatch(fetchStudents({ page: 1, search: "", status: 1 }));
    dispatch(fetchOffers({}));
  }, [dispatch, zoneId]);

  useEffect(() => {
    if (!showMon) return;
    const timer = setTimeout(() => {
      dispatch(fetchMonitors({ page: 1, search: monitorSearch, status: 1 }));
    }, 250);
    return () => clearTimeout(timer);
  }, [dispatch, showMon, monitorSearch]);

  useEffect(() => {
    if (!showCand) return;
    const timer = setTimeout(() => {
      dispatch(fetchStudents({ page: 1, search: candidateSearch, status: 1 }));
    }, 250);
    return () => clearTimeout(timer);
  }, [dispatch, showCand, candidateSearch]);

  useEffect(() => {
    if (!selectedStudentId) return;
    dispatch(getStudentselectedOffers({ studentId: selectedStudentId }));
  }, [dispatch, selectedStudentId]);

  function clearError(key) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate() {
    const next = {};
    if (!date) next.date = "La date est requise";
    if (!startTime) next.startTime = "L'heure de début est requise";
    if (!endTime) next.endTime = "L'heure de fin est requise";
    if (!zoneId) next.zone = "La zone est requise";
    if (!effectivePlaceId) next.placeId = "Le lieu est requis";
    if (!effectiveMonitorId) next.monitorId = "Le moniteur est requis";
    if (!effectiveCandidateId) next.candidateId = "Le candidat est requis";
    if (!offerId) next.offerId = "L'offre est requise";
    return next;
  }

  function handleSave() {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave?.({
      date,
      start_at: startTime,
      end_at: endTime,
      is_active: enabled ? 1 : 0,
      hour: getReservationHours(startTime, endTime),
      color,
      lieu_id: effectivePlaceId,
      monitor_id: effectiveMonitorId,
      student_id: selectedStudentId,
      offer_id: offerId,
      zone_id: zoneId,
      zone_name: zoneName,
      place_name: selectedPlace?.label || "",
      monitor_name: selectedMonitor ? getName(selectedMonitor) : "",
      student_name: activeCandidates.find((item) => item.id === String(selectedStudentId))?.label || "",
      offer_name: selectedOffer?.name || selectedOffer?.label || "",
    });

    onClose?.();
  }

  const monitorLabel = selectedMonitor ? getName(selectedMonitor) : "Sélectionner un moniteur";
  const candidateLabel = selectedCandidate ? getName(selectedCandidate) : "Sélectionner un candidat";
  const offerLabel = selectedOffer?.name || selectedOffer?.label || (
    selectedCandidate
      ? (selectedOffersLoading ? "Chargement des offres..." : "Aucune offre disponible")
      : "Sélectionner un candidat d'abord"
  );

  return (
    <>
      <div className="cal-drawer-overlay" onClick={onClose} />
      <div className="cal-drawer">
        <div className="cal-drawer-header">
          <button className="cal-drawer-close" onClick={onClose}>Fermer</button>
          <span className="cal-drawer-title">{mode === "edit" ? "Modifier la réservation" : "Nouvelle réservation"}</span>
          <span style={{ width: 50 }} />
        </div>

        <div className="cal-drawer-body">
          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">Zone déjà sélectionnée</label>
            <div className="cal-drawer-select cal-drawer-select--full" style={{ cursor: "not-allowed", opacity: 0.92 }}>
              {zoneName}
            </div>
          </div>

          <div className="cal-toggle-row">
            <span className="cal-drawer-label">Activer</span>
            <label className="cal-ios-toggle">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              <span className="cal-ios-track" />
              <span className="cal-ios-thumb" />
            </label>
          </div>

          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">Date de la leçon</label>
            <input
              className="cal-drawer-input"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                clearError("date");
              }}
              style={{ borderColor: errors.date ? "#dc2626" : "" }}
            />
            {errors.date && <span className="cal-field-error">{errors.date}</span>}
          </div>

          <div className="cal-drawer-two-col">
            <div className="cal-drawer-field">
              <label className="cal-drawer-field-label">Heure de début</label>
              <input
                className="cal-drawer-input"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  clearError("startTime");
                }}
                style={{ borderColor: errors.startTime ? "#dc2626" : "" }}
              />
              {errors.startTime && <span className="cal-field-error">{errors.startTime}</span>}
            </div>
            <div className="cal-drawer-field">
              <label className="cal-drawer-field-label">Heure de fin</label>
              <input
                className="cal-drawer-input"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  clearError("endTime");
                }}
                style={{ borderColor: errors.endTime ? "#dc2626" : "" }}
              />
              {errors.endTime && <span className="cal-field-error">{errors.endTime}</span>}
            </div>
          </div>

          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">Lieu</label>
            <select
              className="cal-drawer-input"
              value={placeId}
              onChange={(e) => {
                setPlaceId(e.target.value);
                clearError("placeId");
              }}
              style={{ borderColor: errors.placeId ? "#dc2626" : "" }}
            >
              <option value="">Sélectionner un lieu</option>
              {activePlaces.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.label}
                </option>
              ))}
            </select>
            {errors.placeId && <span className="cal-field-error">{errors.placeId}</span>}
          </div>

          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">Moniteur {!monitorLabel && <IconLock />}</label>
            <button
              type="button"
              className="cal-drawer-select cal-drawer-select--full"
              onClick={() => setShowMon(true)}
              style={{ borderColor: errors.monitorId ? "#dc2626" : "" }}
            >
              {monitorLabel}
            </button>
            {errors.monitorId && <span className="cal-field-error">{errors.monitorId}</span>}
          </div>

        <div className="cal-drawer-field">
          <label className="cal-drawer-field-label">Candidat {!candidateLabel && <IconLock />}</label>
          <button
            type="button"
            className="cal-drawer-select cal-drawer-select--full"
              onClick={() => setShowCand(true)}
              style={{ borderColor: errors.candidateId ? "#dc2626" : "" }}
            >
              {candidateLabel}
            </button>
            {errors.candidateId && <span className="cal-field-error">{errors.candidateId}</span>}
          </div>

          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">Offre {!offerId && <IconLock />}</label>
            <button
              type="button"
              className="cal-drawer-select cal-drawer-select--full"
              disabled={!selectedCandidate || selectedOffersLoading}
              onClick={() => selectedCandidate && !selectedOffersLoading && setShowOffer(true)}
              style={{ borderColor: errors.offerId ? "#dc2626" : "" }}
            >
              {offerLabel}
            </button>
            {errors.offerId && <span className="cal-field-error">{errors.offerId}</span>}
          </div>

          <div className="cal-drawer-field">
            <label className="cal-drawer-field-label">
              Couleur {!offerId && <IconLock />}
            </label>
            <div className="cal-color-row">
              {EVENT_COLORS.map((item) => (
                <button
                  key={item}
                  className={`cal-color-dot ${color === item ? "cal-color-dot--active" : ""}`}
                  style={{ background: item }}
                  onClick={() => setColor(item)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="cal-drawer-footer">
          <button className="cal-btn cal-btn--ghost cal-btn--md" onClick={onClose}>
            Annuler
          </button>
          <button className="cal-btn cal-btn--green cal-btn--md" onClick={handleSave}>
            {submitLabel || (mode === "edit" ? "Mettre à jour" : "Enregistrer")}
          </button>
        </div>
      </div>

      {showMon && (
        <MonitorsModal
          selected={selectedMonitor ? [selectedMonitor] : []}
          items={monitors.map((monitor) => ({ ...monitor, id: getMonitorId(monitor) }))}
          singleSelect
          loading={monitorsLoading}
          searchValue={monitorSearch}
          onSearchChange={setMonitorSearch}
          onSave={(monitor) => {
            setMonitorId(monitor ? getMonitorId(monitor) : "");
            clearError("monitorId");
          }}
          onClose={() => setShowMon(false)}
          title="Sélectionner le moniteur"
        />
      )}

        {showCand && (
        <CandidatesModal
          selected={selectedCandidate ? [selectedCandidate] : []}
          items={candidates}
          singleSelect
          loading={candidatesLoading}
          searchValue={candidateSearch}
          onSearchChange={setCandidateSearch}
          onSave={(candidate) => {
            setCandidateId(candidate ? getCandidateStudentId(candidate) : "");
            setOfferId("");
            clearError("candidateId");
            clearError("offerId");
          }}
          onClose={() => setShowCand(false)}
          title="Sélectionner le candidat"
        />
      )}

      {showOffer && (
        <OfferModal
          selected={selectedOffer}
          items={offerItems}
          loading={selectedOffersLoading}
          onSave={(offer) => {
            setOfferId(offer ? String(offer.id) : "");
            clearError("offerId");
          }}
          onClose={() => setShowOffer(false)}
          title="Choisir l'offre"
        />
      )}
    </>
  );
}
