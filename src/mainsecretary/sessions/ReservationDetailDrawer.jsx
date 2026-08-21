import BookingDrawer from "../monitordashboard/BookingDrawer.jsx";
import AvailabilityDrawer from "../monitordashboard/AvailabilityDrawer.jsx";
import "./ReservationDetailDrawer.css";

export default function ReservationDetailDrawer({ reservation, onClose, onOpenMonitor, onDeleteReservation, onMarkUnavailable, onEditReservation }) {
  if (!reservation) {
    return null;
  }

  return (
    reservation.type === "availability" ? (
      <AvailabilityDrawer
        availability={reservation}
        onClose={onClose}
      />
    ) : (
      <BookingDrawer
        booking={reservation}
        onClose={onClose}
        onOpenMonitor={onOpenMonitor}
        onDeleteReservation={onDeleteReservation}
        onMarkUnavailable={onMarkUnavailable}
        onEditReservation={onEditReservation}
        drawerTitle="Reservation details"
        primaryActionLabel="Immediate call"
      />
    )
  );
}
