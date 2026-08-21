import { useEffect, useRef, useState } from "react";
import { DAYS_WEEK, HOURS, adjWeekLabel, weekRangeLabel, getInitials, pad2 } from "./CalConstants.js";
import "./SessionsWeek.css";

const IconChevL = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevR = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>;

const COLOR_FALLBACKS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#ef4444", "#8b5cf6"];

function formatHourLabel(hour) {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "pm" : "am";
  const display = normalized % 12 || 12;
  return `${display}${suffix}`;
}

function hoverTimeLabel(hour) {
  return `${formatHourLabel(hour)} - ${formatHourLabel(hour + 1)}`;
}

function parseLocalDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function parseTimeToMinutes(value) {
  if (!value) return null;
  const [hours, minutes = "0"] = String(value).split(":");
  const h = Number.parseInt(hours, 10);
  const m = Number.parseInt(minutes, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return (h * 60) + m;
}

function safeHexColor(value, fallbackIndex = 0) {
  if (typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) {
    return value.trim();
  }
  return COLOR_FALLBACKS[fallbackIndex % COLOR_FALLBACKS.length];
}

function hexToRgb(hex) {
  const normalized = safeHexColor(hex);
  const raw = normalized.slice(1);
  const chunks = raw.length === 3 ? raw.split("").map((ch) => ch + ch) : raw.match(/.{2}/g);
  if (!chunks) return { r: 99, g: 102, b: 241 };
  const [r, g, b] = chunks.map((part) => Number.parseInt(part, 16));
  return { r, g, b };
}

function mixWithWhite(hex, ratio = 0.18) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r) + (0.587 * g) + (0.114 * b);
  return luminance > 165 ? "#1f2937" : "#ffffff";
}

function getEventSlotState(event, hour) {
  const startMinutes = parseTimeToMinutes(event.startTime);
  const endMinutes = parseTimeToMinutes(event.endTime);
  if (startMinutes == null) return null;

  const slotStart = hour * 60;
  const slotEnd = (hour + 1) * 60;
  const overlaps = endMinutes == null
    ? startMinutes >= slotStart && startMinutes < slotEnd
    : startMinutes < slotEnd && endMinutes > slotStart;

  if (!overlaps) return null;

  const isStartSlot = startMinutes >= slotStart && startMinutes < slotEnd;
  const isEndSlot = endMinutes != null && endMinutes > slotStart && endMinutes <= slotEnd;
  const isSingleSlot = isStartSlot && isEndSlot;

  return {
    isStartSlot,
    isEndSlot,
    isSingleSlot,
  };
}

function getLeadHour(event, hourStart) {
  const startMinutes = parseTimeToMinutes(event.startTime);
  if (startMinutes == null) return hourStart;
  return Math.max(Math.floor(startMinutes / 60), hourStart);
}

function getEventDurationInHours(event, startHour) {
  const startMinutes = parseTimeToMinutes(event.startTime);
  const endMinutes = parseTimeToMinutes(event.endTime);
  if (startMinutes == null || endMinutes == null) return 1.0;
  const effectiveStart = Math.max(startMinutes, startHour * 60);
  const durationMinutes = endMinutes - effectiveStart;
  return Math.max(0.5, durationMinutes / 60);
}

function getReservationSummary(ev) {
  const candidateName = typeof ev.candidate === "string" ? ev.candidate : ev.candidate?.name || "Réservation";
  const monitorName = ev.monitor && (typeof ev.monitor === "string" ? ev.monitor : ev.monitor?.name);
  const placeName = ev.place && (typeof ev.place === "string" ? ev.place : ev.place?.name || ev.mapLocation || "");
  const offerName = ev.offer && (typeof ev.offer === "string" ? ev.offer : ev.offer?.name || ev.offer?.label || "");
  const balance = ev.balance ?? ev.student_balance ?? ev.balanceAvailable ?? null;
  return { candidateName, monitorName, placeName, offerName, balance };
}

function getWindowLabel(ev) {
  const start = ev.startTime || ev.start_at || "";
  const end = ev.endTime || ev.end_at || "";
  return end ? `${start} - ${end}` : start;
}

export default function CalWeekView({
  weekDates,
  events,
  onSlotClick,
  onPrevWeek,
  onNextWeek,
  interactive = true,
  onEventClick,
  renderEvent,
  renderSlotOverlay,
  isSlotSelected,
  getSlotClassName,
}) {
  const [hoverCell, setHoverCell] = useState(null);
  const bodyRef = useRef(null);
  const today = new Date();
  const hourStart = HOURS[0];

  // auto-scroll to current hour (or 8am fallback) on mount
  useEffect(() => {
    if (!bodyRef.current) return;
    const currentHour = today.getHours();
    const targetHour = HOURS.includes(currentHour) ? currentHour : HOURS[Math.max(0, 2)]; // 8am fallback
    const rowHeight = bodyRef.current.scrollHeight / HOURS.length;
    const targetIndex = HOURS.indexOf(targetHour);
    if (targetIndex >= 0) {
      bodyRef.current.scrollTop = rowHeight * Math.max(0, targetIndex - 1);
    }
  // run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getEventsForSlot(date, hour) {
    return events.filter((e) => {
      if (!e.date || !e.startTime) return false;
      const d = parseLocalDate(e.date);
      if (!d) return false;
      if (
        d.getFullYear() !== date.getFullYear() ||
        d.getMonth() !== date.getMonth() ||
        d.getDate() !== date.getDate()
      ) return false;
      return Boolean(getEventSlotState(e, hour));
    });
  }

  function isToday(date) {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  function handleMouseMove(_e, col, hour) {
    setHoverCell({ col, hour });
  }

  return (
   
   <div className="cal-week-wrap">
      <div className="cal-week-nav-row">
        <button className="cal-week-nav-btn" onClick={onPrevWeek}>
          <IconChevL />
          <span className="cal-week-nav-text">
            <span className="cal-week-nav-label">Semaine précédente</span>
            <span className="cal-week-nav-date">{adjWeekLabel(weekDates, -7)}</span>
          </span>
        </button>

        <span className="cal-week-nav-current">{weekRangeLabel(weekDates)}</span>

        <button className="cal-week-nav-btn" onClick={onNextWeek}>
          <span className="cal-week-nav-text cal-week-nav-text--end">
            <span className="cal-week-nav-label">Semaine suivante</span>
            <span className="cal-week-nav-date">{adjWeekLabel(weekDates, 1)}</span>
          </span>
          <IconChevR />
        </button>
      </div>

      <div className="cal-week-header">
        <div className="cal-week-time-gutter" />
        {weekDates.map((date, i) => (
          <div key={i} className={`cal-week-day-head ${isToday(date) ? "cal-week-day-head--today" : ""}`}>
            <span className="cal-week-day-name">{DAYS_WEEK[i]}</span>
            <span className={`cal-week-day-num ${isToday(date) ? "cal-week-day-num--today" : ""}`}>
              {date.getDate()}
            </span>
          </div>
        ))}
      </div>

      <div className="cal-week-body" ref={bodyRef}>
        {HOURS.map((hour) => (
          <div key={hour} className="cal-week-row">
            <div className="cal-week-time-label">{pad2(hour)}:00</div>

            {weekDates.map((date, col) => {
              const slotEvents = getEventsForSlot(date, hour);
              const isHovered = interactive && hoverCell?.col === col && hoverCell?.hour === hour;
              const selected = isSlotSelected ? isSlotSelected(date, hour) : false;
              const extraSlotClassName = getSlotClassName ? getSlotClassName(date, hour, slotEvents) : "";

              return (
                <div
                  key={col}
                  className={`cal-week-cell ${isToday(date) ? "cal-week-cell--today" : ""}${interactive ? "" : " cal-week-cell--readonly"}${selected ? " cal-week-cell--selected" : ""}${extraSlotClassName ? ` ${extraSlotClassName}` : ""}`}
                  onClick={interactive ? () => onSlotClick(date, hour) : undefined}
                  onMouseMove={interactive ? (e) => handleMouseMove(e, col, hour) : undefined}
                  onMouseLeave={interactive ? () => setHoverCell(null) : undefined}
                >
                  {isHovered && (
                    <div className="cal-week-hover-time">{hoverTimeLabel(hour)}</div>
                  )}

                  {isHovered && slotEvents.length === 0 && (
                    <div className="cal-week-plus">+</div>
                  )}

                  {slotEvents.map((ev) => {
                    const slotState = getEventSlotState(ev, hour);
                    const leadHour = getLeadHour(ev, hourStart);
                    const isLeadVisibleSlot = slotState?.isStartSlot || hour === leadHour;
                    if (!isLeadVisibleSlot) return null;

                    const durationHours = getEventDurationInHours(ev, hourStart);
                    const { candidateName, monitorName, placeName, offerName, balance } = getReservationSummary(ev);
                    const accent = safeHexColor(ev.color, String(ev.id ?? "").split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) || 0);
                    const textColor = getReadableTextColor(accent);
                    const softAccent = mixWithWhite(accent, 0.84);

                    return (
                      <button
                        type="button"
                        key={ev.id}
                        className="cal-week-event-trigger"
                        style={{
                          height: `calc(${durationHours} * (100% + 1px) - 2 * var(--cell-padding, 3px))`
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          onEventClick?.(ev, date, hour);
                        }}
                      >
                        {renderEvent ? renderEvent(ev, date, hour, slotState, {
                          isLeadVisibleSlot,
                          accent,
                          textColor,
                          softAccent,
                        }) : (
                          <div
                            className={[
                              "cal-week-event",
                              slotState?.isStartSlot ? "cal-week-event--start" : "cal-week-event--continuation",
                              slotState?.isEndSlot ? "cal-week-event--end" : "",
                              slotState?.isSingleSlot ? "cal-week-event--single" : "",
                              isLeadVisibleSlot ? "cal-week-event--lead" : "",
                            ].filter(Boolean).join(" ")}
                            style={{
                              background: `linear-gradient(135deg, ${accent} 0%, ${softAccent} 100%)`,
                              color: textColor,
                              boxShadow: `0 12px 24px ${accent}18, inset 0 0 0 1px ${accent}24`,
                              borderLeftColor: accent,
                            }}
                          >
                            {isLeadVisibleSlot ? (
                              <>
                                <div className="cal-week-event-topline">
                                  <span className="cal-week-event-time">
                                    {getWindowLabel(ev)}
                                  </span>
                                  <span className="cal-week-event-badge">{slotState?.isSingleSlot ? "Solo" : "Réservation"}</span>
                                </div>
                                <span className="cal-week-event-name">{candidateName}</span>
                                <div className="cal-week-event-meta">
                                  {offerName && <span className="cal-week-badge">{offerName}</span>}
                                  {placeName && <span className="cal-week-badge cal-week-badge--soft">{placeName}</span>}
                                </div>
                                <div className="cal-week-event-footer">
                                  <span className="cal-week-event-location">
                                    {monitorName || "Moniteur non défini"}
                                  </span>
                                  <span className="cal-week-event-balance">
                                    {balance != null ? `${balance} h` : "Planifiée"}
                                  </span>
                                </div>
                                <div className="cal-week-event-avatars">
                                  {monitorName && (
                                    <div className="cal-week-event-avatar">
                                      {getInitials(monitorName)}
                                    </div>
                                  )}
                                  <div className="cal-week-event-avatar">
                                    {getInitials(candidateName)}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="cal-week-event-topline">
                                  <span className="cal-week-event-time cal-week-event-time--continuation">
                                    Suite
                                  </span>
                                  <span className="cal-week-event-badge cal-week-event-badge--ghost">Suite</span>
                                </div>
                                <span className="cal-week-event-name cal-week-event-name--continuation">
                                  {candidateName}
                                </span>
                                <span className="cal-week-event-location cal-week-event-location--continuation">
                                  {getWindowLabel(ev)}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {renderSlotOverlay?.({
                    date,
                    hour,
                    events: slotEvents,
                    isHovered,
                    isSelected: selected,
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
