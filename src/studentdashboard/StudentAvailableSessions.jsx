import { useEffect, useMemo, useState } from "react";
import CalWeekView from "../sessions/Calweekview.jsx";
import AvailabilityDrawer from "../monitordashboard/AvailabilityDrawer.jsx";
import SessionDrawer from "./SessionDrawer.jsx";
import http from "../helpers/http.jsx";

const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const startOfWeek = (date) => { const result = new Date(date); const day = result.getDay() || 7; result.setHours(0, 0, 0, 0); result.setDate(result.getDate() - day + 1); return result; };
const endOfWeek = (date) => { const result = new Date(date); result.setDate(result.getDate() + 6); return result; };
const displayName = (user) => user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Moniteur";
const walletBalance = (wallet) => Number(wallet?.total_balance ?? wallet?.balance ?? 0);

export default function StudentAvailableSessions({ studentId = null }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [events, setEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [trainingsLoading, setTrainingsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [walletsError, setWalletsError] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => { const date = new Date(weekStart); date.setDate(date.getDate() + index); return date; }), [weekStart]);

  const loadAvailabilities = async () => {
    setLoading(true); setError("");
    try {
      const response = await http.get("/student/reservations/list", { params: { date_1: isoDate(weekStart), date_2: isoDate(endOfWeek(weekStart)) } });
      const grouped = response.data?.data ?? {};
      setEvents(Object.values(grouped).flatMap((slots) => slots || []).filter((slot) => !slot.training).map((slot) => ({
        id: slot.id, date: String(slot.date ?? slot.datef).slice(0, 10), startTime: String(slot.start_at ?? "").slice(0, 5), endTime: String(slot.end_at ?? "").slice(0, 5),
        type: "availability", status: "Disponible", monitor: { name: displayName(slot.monitor?.user) }, candidate: "Disponible", place: slot.lieu?.name ?? "Lieu",
        mapLocation: slot.lieu?.zone?.name ? `${slot.lieu.zone.name}, ${slot.lieu.name}` : slot.lieu?.name ?? "Lieu", color: "#16a34a", source: slot,
      })));
    } catch (requestError) { setError(requestError.response?.data?.message || "Impossible de charger les disponibilités."); }
    finally { setLoading(false); }
  };

  const loadTrainings = async () => {
    setTrainingsLoading(true);
    try {
      const response = await http.get("/student/reservations/schedule", {
        params: studentId ? { student_id: studentId } : undefined,
      });
      setTrainings(response.data?.data ?? []);
    } catch (requestError) {
      setTrainings([]);
      setError(requestError.response?.data?.message || "Impossible de charger vos séances réservées.");
    } finally {
      setTrainingsLoading(false);
    }
  };

  useEffect(() => { loadAvailabilities(); loadTrainings(); }, [weekStart, studentId]);
  const loadWallets = async () => {
    setWalletsLoading(true);
    setWalletsError("");

    try {
      const response = await http.get("/student/wallets", { params: studentId ? { student_id: studentId } : undefined });
      const payload = response.data;
      const items = Array.isArray(payload) ? payload : payload?.data ?? [];
      setWallets(items);
      setSelectedOfferId((current) => current || items.find((wallet) => walletBalance(wallet) > 0)?.offer_id || items[0]?.offer_id || "");
    } catch (requestError) {
      setWallets([]);
      setWalletsError(requestError.response?.data?.message || "Impossible de charger vos offres.");
    } finally {
      setWalletsLoading(false);
    }
  };

  useEffect(() => { loadWallets(); }, [studentId]);

  const changeWeek = (days) => setWeekStart((date) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; });
  const bookSelected = async () => {
    if (!selected) return;
    if (!selectedOfferId) {
      setError("Choisissez une offre avant de réserver cette séance.");
      return;
    }
    setBooking(true); setError("");
    try {
      await http.post("/student/reservations/book", { reservation_id: selected.id, offer_id: selectedOfferId, ...(studentId ? { student_id: studentId } : {}) });
      setMessage("Votre séance est réservée.");
      setSelected(null);
      await Promise.all([loadAvailabilities(), loadTrainings(), loadWallets()]);
    }
    catch (requestError) { setError(requestError.response?.data?.message || "Impossible de réserver ce créneau."); }
    finally { setBooking(false); }
  };

  const calendarEvents = useMemo(() => [
    ...events,
    ...trainings.map((reservation) => {
      const training = reservation.training ?? {};
      const offer = training.offer ?? {};
      const wallet = wallets.find((item) => String(item.offer_id) === String(training.offer_id));

      return {
        id: `training-${training.id ?? reservation.id}`,
        date: String(reservation.date ?? reservation.datef).slice(0, 10),
        startTime: String(reservation.start_at ?? "").slice(0, 5),
        endTime: String(reservation.end_at ?? "").slice(0, 5),
        type: "training",
        status: "Réservée",
        candidate: offer.name || "Séance réservée",
        offer,
        monitor: { name: displayName(reservation.monitor?.user) },
        place: reservation.lieu?.name ?? "Lieu",
        mapLocation: reservation.lieu?.zone?.name ? `${reservation.lieu.zone.name}, ${reservation.lieu.name}` : reservation.lieu?.name ?? "Lieu",
        balance: wallet ? walletBalance(wallet) : null,
        color: "#2563eb",
        source: reservation,
      };
    }),
  ], [events, trainings, wallets]);

  return <div className="sd-tab-content sd-tab-content--sessions"><div className="sd-card" style={{ padding: 18 }}>
    <div className="sd-section-title" style={{ marginTop: 0 }}>Disponibilités des moniteurs</div>
    <p style={{ color: "#64748b", margin: "0 0 14px" }}>Choisissez un créneau disponible pour réserver votre séance.</p>
    {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}{message && <div style={{ color: "#15803d", marginBottom: 12 }}>{message}</div>}
    {trainingsLoading && <div style={{ color: "#64748b", marginBottom: 12 }}>Chargement de vos séances réservées…</div>}
    {loading ? <div>Chargement des disponibilités…</div> : <CalWeekView weekDates={weekDates} events={calendarEvents} interactive={false} onPrevWeek={() => changeWeek(-7)} onNextWeek={() => changeWeek(7)} onEventClick={(event) => {
      if (event.type === "training" || event.source?.training || event.training) {
        setSelected(null);
        setSelectedTraining(event);
        return;
      }
      if (event.type === "availability") {
        setSelected(event);
        setMessage("");
      }
    }} />}
    {selected && <AvailabilityDrawer availability={selected} onClose={() => setSelected(null)} onBook={bookSelected} booking={booking} wallets={wallets} walletsLoading={walletsLoading} walletsError={walletsError} selectedOfferId={selectedOfferId} onSelectOffer={setSelectedOfferId} />}
    {selectedTraining && <SessionDrawer key={selectedTraining.id} session={selectedTraining} studentId={studentId} onClose={() => setSelectedTraining(null)} />}
  </div></div>;
}
