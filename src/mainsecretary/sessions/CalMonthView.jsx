import { DAYS_FULL, getMonthGrid } from "./CalConstants.js";

// Parse "YYYY-MM-DD" as LOCAL date to avoid UTC midnight rollback
function parseLocalDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function CalMonthView({ year, month, events, onDayClick, onEventClick }) {
  const now         = new Date();
  const todayDate   = now.getDate();
  const isThisMonth = year === now.getFullYear() && month === now.getMonth();
  const cells       = getMonthGrid(year, month);

  const eventsThisMonth = events.filter(e => {
    const d = parseLocalDate(e.date);
    return d && d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div className="cal-grid-card">
      {/* En-têtes des jours */}
      <div className="cal-day-headers">
        {DAYS_FULL.map(d => <div key={d} className="cal-day-header">{d}</div>)}
      </div>

      {/* Grille de cellules */}
      <div className="cal-cells">
        {cells.map((day, i) => {
          const isToday   = isThisMonth && day === todayDate;
          const dayEvents = day
            ? eventsThisMonth.filter(e => parseLocalDate(e.date)?.getDate() === day)
            : [];

          return (
            <div
              key={i}
              className={`cal-cell ${!day ? "cal-cell--empty" : ""} ${isToday ? "cal-cell--today" : ""}`}
              onClick={() => onDayClick(day)}
            >
              {day && (
                <>
                  <span className={`cal-cell-num ${isToday ? "cal-cell-num--today" : ""}`}>
                    {day}
                  </span>

                  <div className="cal-cell-events">
                    {dayEvents.map(ev => {
                      const candidateName =
                        typeof ev.candidate === "string" ? ev.candidate : ev.candidate?.name || "Réservation";
                      const monitorName =
                        ev.monitor ? (typeof ev.monitor === "string" ? ev.monitor : ev.monitor?.name) : null;

                      return (
                        <div
                          key={ev.id}
                          className="cal-month-event-card"
                          style={{ borderLeftColor: ev.color, cursor: "pointer" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            onEventClick?.(ev);
                          }}
                        >
                          <span className="cal-month-event-time">
                            {ev.startTime && ev.endTime
                              ? `${ev.startTime} – ${ev.endTime}`
                              : ev.startTime || ""}
                          </span>
                          <span className="cal-month-event-name">{candidateName}</span>
                          {monitorName && (
                            <span className="cal-month-event-sub">{monitorName}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
