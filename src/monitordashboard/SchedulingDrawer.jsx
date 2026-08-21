import { useState } from "react";
import "./SchedulingDrawer.css";

const MAY_2026 = {
  year: 2026,
  month: 4,
  label: "Mai",
  firstDay: 4,
  days: 31,
};

const PERIOD = { start: 22, end: 28 };

const buildHours = () =>
  Array.from({ length: 16 }, (_, i) => {
    const h = i + 7;
    return {
      id: i,
      label: `${String(h).padStart(2, "0")}:00 - ${String(h + 1).padStart(2, "0")}:00`,
      startHour: h,
    };
  });

const buildQuarters = (hour) =>
  [0, 15, 30, 45].map((m) => {
    const from = `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const toH = m === 45 ? hour + 1 : hour;
    const toM = m === 45 ? 0 : m + 15;
    const to = `${String(toH).padStart(2, "0")}:${String(toM).padStart(2, "0")}`;
    return { from, to, label: `${from} à ${to}` };
  });

const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];
const DAY_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const FIRST_DOW = 4;

export default function SchedulingDrawer({ open = true, onClose, onSubmit }) {
  const [monthChecked, setMonthChecked] = useState(false);
  const [selectedDays, setSelectedDays] = useState(() => new Set([22, 23, 24, 25, 26, 27, 28]));
  const [comment, setComment] = useState("");
  const [hoursModal, setHoursModal] = useState(null);
  const [dayHours, setDayHours] = useState(() => {
    const base = {};
    for (let d = 22; d <= 28; d++) {
      base[d] = new Set([7, 8, 9, 10, 11, 14, 15, 16, 17]);
    }
    return base;
  });
  const [quarterModal, setQuarterModal] = useState(null);
  const [quarterSel, setQuarterSel] = useState({});

  const isPeriod = (d) => d >= PERIOD.start && d <= PERIOD.end;

  const toggleDay = (d) => {
    if (monthChecked) return;
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  };

  const isSelected = (d) => monthChecked || selectedDays.has(d);
  const canInteract = (d) => isSelected(d) && isPeriod(d);

  const openHours = (d) => {
    if (!canInteract(d)) return;
    setHoursModal({ day: d });
  };

  const toggleHour = (day, h) => {
    setDayHours((prev) => {
      const next = { ...prev };
      const set = new Set(next[day] || []);
      set.has(h) ? set.delete(h) : set.add(h);
      next[day] = set;
      return next;
    });
  };

  const openQuarter = (day, startHour) => {
    const key = `${day}-${startHour}`;
    setQuarterModal({ day, startHour, selected: quarterSel[key] || "00" });
  };

  const handleSubmit = () => {
    onSubmit?.({
      monthChecked,
      selectedDays: Array.from(selectedDays),
      comment,
      dayHours,
      quarterSel,
    });
    onClose?.();
  };

  const selectQuarter = (day, startHour, minute) => {
    const key = `${day}-${startHour}`;
    setQuarterSel((prev) => ({ ...prev, [key]: minute }));
    setQuarterModal(null);
  };

  const cells = [];
  for (let i = 0; i < FIRST_DOW; i++) cells.push(null);
  for (let d = 1; d <= 31; d++) cells.push(d);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <>
      <div className={`sd-backdrop ${open ? "sd-backdrop--open" : ""}`} onClick={onClose} />

      <aside className={`sd-drawer ${open ? "sd-drawer--open" : ""}`}>
        <div className="sd-header">
          <span className="sd-header__title">Choisissez le lieu et la période concernée.</span>
          <button className="sd-header__close" onClick={onClose}>×</button>
        </div>

        <div className="sd-body">
          <div className="sd-field">
            <label className="sd-label">Lieu :</label>
            <span className="sd-value">Non défini</span>
          </div>

          <div className="sd-field">
            <label className="sd-label">Période :</label>
            <div className="sd-period-badge">
              22 mai 2026 → 28 mai 2026
            </div>
          </div>

          <div className="sd-field">
            <label className="sd-label">Heures :</label>
            <div className="sd-hours-chips">
              <span className="sd-chip">07:00 → 12:00</span>
              <span className="sd-chip">14:00 → 18:00</span>
            </div>
          </div>

          <div className="sd-month-row">
            <label className="sd-checkbox-wrap">
              <input
                type="checkbox"
                checked={monthChecked}
                onChange={(e) => setMonthChecked(e.target.checked)}
              />
              <span className="sd-checkbox-box" />
              <span className="sd-month-label">Mai</span>
            </label>
            <span className="sd-chevron">▲</span>
          </div>

          <div className="sd-calendar">
            <div className="sd-cal-head">
              {DAY_NAMES.map((n, i) => (
                <div key={i} className="sd-cal-cell sd-cal-cell--head">{n}</div>
              ))}
            </div>

            <div className="sd-cal-row sd-cal-row--pens">
              {DAY_NAMES.map((_, ci) => {
                const colDays = weeks.map((w) => w[ci]).filter((d) => d && isPeriod(d) && isSelected(d));
                const active = colDays.length > 0 && (monthChecked || colDays.some((d) => selectedDays.has(d)));
                return (
                  <div key={ci} className="sd-cal-cell">
                    <button
                      className={`sd-pen-btn ${active ? "sd-pen-btn--active" : ""}`}
                      disabled={!active}
                      onClick={() => active && openHours(colDays[0])}
                      title={active ? "Modifier les horaires" : ""}
                    >
                      ✎
                    </button>
                  </div>
                );
              })}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="sd-cal-row">
                {week.map((d, di) => {
                  if (!d) return <div key={di} className="sd-cal-cell" />;
                  const sel = isSelected(d);
                  const inPeriod = isPeriod(d);
                  return (
                    <div
                      key={di}
                      className={`sd-cal-cell sd-day
                        ${inPeriod ? "sd-day--period" : ""}
                        ${sel && inPeriod ? "sd-day--selected" : ""}
                        ${!inPeriod ? "sd-day--outside" : ""}
                      `}
                      onClick={() => inPeriod && toggleDay(d)}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="sd-field sd-field--col">
            <label className="sd-label">Commentaire pour l’administrateur :</label>
            <textarea
              className="sd-textarea"
              placeholder="Ajoutez un commentaire pour l’administrateur (facultatif)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button type="button" className="sd-submit" onClick={handleSubmit}>
            Envoyer la demande à l’administrateur
          </button>
        </div>
      </aside>

      {hoursModal && (
        <div className="sd-overlay" onClick={() => setHoursModal(null)}>
          <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal__header">
              <span>Options de planification des horaires</span>
              <button onClick={() => setHoursModal(null)}>×</button>
            </div>
            <div className="sd-modal__sub">Mai 2026</div>
            <div className="sd-modal__day-label">
              {DAY_FULL[(new Date(2026, 4, hoursModal.day).getDay() + 6) % 7]} {hoursModal.day}
            </div>
            <div className="sd-hours-list">
              {buildHours().map((slot) => {
                const enabled = (dayHours[hoursModal.day] || new Set()).has(slot.startHour);
                const key = `${hoursModal.day}-${slot.startHour}`;
                const qSel = quarterSel[key];
                return (
                  <div key={slot.id} className="sd-hour-row">
                    <label className="sd-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleHour(hoursModal.day, slot.startHour)}
                      />
                      <span className="sd-checkbox-box" />
                    </label>
                    <span className="sd-hour-label">
                      {slot.label}
                      {qSel !== undefined && qSel !== "00" && (
                        <span className="sd-quarter-badge"> (:{qSel})</span>
                      )}
                    </span>
                    <button
                      className="sd-pen-btn sd-pen-btn--active sd-pen-btn--sm"
                      onClick={() => openQuarter(hoursModal.day, slot.startHour)}
                    >
                      ✎
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {quarterModal && (
        <div className="sd-overlay" onClick={() => setQuarterModal(null)}>
          <div className="sd-modal sd-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal__header">
              <span>Option de créneau</span>
              <button onClick={() => setQuarterModal(null)}>×</button>
            </div>
            <div className="sd-modal__sub">Début du créneau</div>
            <div className="sd-quarters-list">
              {buildQuarters(quarterModal.startHour).map((q) => {
                const key = `${quarterModal.day}-${quarterModal.startHour}`;
                const isSel =
                  (quarterSel[key] === undefined && q.from.endsWith(":00")) ||
                  quarterSel[key] === q.from.split(":")[1];
                return (
                  <div
                    key={q.from}
                    className={`sd-quarter-row ${isSel ? "sd-quarter-row--sel" : ""}`}
                    onClick={() => selectQuarter(quarterModal.day, quarterModal.startHour, q.from.split(":")[1])}
                  >
                    <span className={`sd-quarter-accent ${isSel ? "sd-quarter-accent--sel" : ""}`} />
                    {q.label}
                    {isSel && <span className="sd-quarter-check">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
