import { DAYS_FULL, getMonthGrid } from "./CalConstants.js";

function parseLocalDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_FALLBACKS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#ef4444"];

function safeHexColor(value, fallbackIndex = 0) {
  if (typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) {
    return value.trim();
  }
  return MONTH_FALLBACKS[fallbackIndex % MONTH_FALLBACKS.length];
}

function hexToRgb(hex) {
  const normalized = safeHexColor(hex);
  const raw = normalized.slice(1);
  const chunks = raw.length === 3 ? raw.split("").map((ch) => ch + ch) : raw.match(/.{2}/g);
  if (!chunks) return { r: 99, g: 102, b: 241 };
  const [r, g, b] = chunks.map((part) => Number.parseInt(part, 16));
  return { r, g, b };
}

function mixWithWhite(hex, ratio = 0.1) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r) + (0.587 * g) + (0.114 * b);
  return luminance > 165 ? "#1f2937" : "#ffffff";
}

function getReservationSummary(ev) {
  const candidateName = typeof ev.candidate === "string" ? ev.candidate : ev.candidate?.name || "Réservation";
  const monitorName = ev.monitor && (typeof ev.monitor === "string" ? ev.monitor : ev.monitor?.name);
  const placeName = ev.place && (typeof ev.place === "string" ? ev.place : ev.place?.name || ev.mapLocation || "");
  const offerName = ev.offer && (typeof ev.offer === "string" ? ev.offer : ev.offer?.name || ev.offer?.label || "");
  return { candidateName, monitorName, placeName, offerName };
}

export default function CalMonthView({ year, month, events, onDayClick, onEventClick }) {
  const now = new Date();
  const todayDate = now.getDate();
  const isThisMonth = year === now.getFullYear() && month === now.getMonth();
  const cells = getMonthGrid(year, month);

  const eventsThisMonth = events.filter((e) => {
    const d = parseLocalDate(e.date);
    return d && d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div className="cal-grid-card">
      <div className="cal-day-headers">
        {DAYS_FULL.map((d) => <div key={d} className="cal-day-header">{d}</div>)}
      </div>

      <div className="cal-cells">
        {cells.map((day, i) => {
          const isToday = isThisMonth && day === todayDate;
          const dayEvents = day
            ? eventsThisMonth.filter((e) => parseLocalDate(e.date)?.getDate() === day)
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
                    {dayEvents.map((ev, index) => {
                      const accent = safeHexColor(ev.color, index);
                      const textColor = getReadableTextColor(accent);
                      const softAccent = mixWithWhite(accent, 0.86);
                      const { candidateName, monitorName, placeName, offerName } = getReservationSummary(ev);

                      return (
                        <button
                          type="button"
                          key={ev.id}
                          className="cal-month-event-card"
                          style={{
                            background: `linear-gradient(180deg, ${accent} 0%, ${softAccent} 100%)`,
                            color: textColor,
                            borderLeftColor: accent,
                            boxShadow: `0 10px 20px ${accent}18, inset 0 0 0 1px ${accent}16`,
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            onEventClick?.(ev);
                          }}
                        >
                          <div className="cal-month-event-top">
                            <span className="cal-month-event-time">
                              {ev.startTime && ev.endTime
                                ? `${ev.startTime} – ${ev.endTime}`
                                : ev.startTime || ""}
                            </span>
                            <span className="cal-month-event-chip">{offerName || "Réservation"}</span>
                          </div>
                          <span className="cal-month-event-name">{candidateName}</span>
                          <div className="cal-month-event-subrow">
                            {monitorName && <span className="cal-month-event-sub">{monitorName}</span>}
                            {placeName && <span className="cal-month-event-sub">{placeName}</span>}
                          </div>
                        </button>
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
