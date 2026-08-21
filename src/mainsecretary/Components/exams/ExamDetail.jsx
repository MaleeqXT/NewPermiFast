import { useState, useRef, useEffect } from "react";
import "./Exam.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

// ── Scroll Picker (hours or minutes or days or months or years) ───────────────
function ScrollCol({ items, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const idx = items.findIndex(i => String(i) === String(value));
    if (ref.current && idx >= 0) {
      ref.current.scrollTop = idx * 48;
    }
  }, [value, items]);

  return (
    <div className="exd-scroll-col" ref={ref}>
      {/* padding items top and bottom so selection can center */}
      {[null, null].map((_, i) => <div key={`top-${i}`} className="exd-scroll-item" />)}
      {items.map(item => (
        <div
          key={item}
          className={`exd-scroll-item ${String(item) === String(value) ? "exd-scroll-item--active" : ""}`}
          onClick={() => onChange(item)}
        >
          {item}
        </div>
      ))}
      {[null, null].map((_, i) => <div key={`bot-${i}`} className="exd-scroll-item" />)}
    </div>
  );
}

// ── Date Picker (year / month / day scroll) ───────────────────────────────────
function DatePickerCard({ value, onChange, onClose }) {
  const today = new Date();
  const parsed = value ? new Date(value) : today;

  const [selYear,  setSelYear]  = useState(parsed.getFullYear());
  const [selMonth, setSelMonth] = useState(parsed.getMonth()); // 0-indexed
  const [selDay,   setSelDay]   = useState(parsed.getDate());

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const years  = Array.from({ length: 10 }, (_, i) => today.getFullYear() - 2 + i);
  const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
  const days   = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function handleValidate() {
    const d = new Date(selYear, selMonth, selDay);
    onChange(d.toISOString().split("T")[0]);
    onClose();
  }

  return (
    <div className="exd-picker-card">
      <div className="exd-scroll-pickers">
        <ScrollCol items={years}  value={selYear}           onChange={setSelYear}  />
        <div className="exd-scroll-divider" />
        <ScrollCol items={MONTHS} value={MONTHS[selMonth]}  onChange={v => setSelMonth(MONTHS.indexOf(v))} />
        <div className="exd-scroll-divider" />
        <ScrollCol items={days}   value={selDay}            onChange={setSelDay}   />
      </div>
      <div className="exd-picker-footer">
        <button className="exd-picker-close-btn" onClick={onClose}>Close</button>
        <button className="exd-picker-validate-btn" onClick={handleValidate}>To validate</button>
      </div>
    </div>
  );
}

// ── Time Picker (hours / minutes scroll) ─────────────────────────────────────
function TimePickerCard({ value, onChange, onClose }) {
  const [selH, setSelH] = useState(value?.hour ?? 8);
  const [selM, setSelM] = useState(value?.minute ?? 0);

  const hours   = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  function handleValidate() {
    onChange({ hour: selH, minute: selM });
    onClose();
  }

  return (
    <div className="exd-picker-card">
      <div className="exd-scroll-pickers">
        <ScrollCol
          items={hours}
          value={selH}
          onChange={setSelH}
        />
        <div className="exd-scroll-divider" />
        <ScrollCol
          items={minutes.map(m => String(m).padStart(2,"0"))}
          value={String(selM).padStart(2,"0")}
          onChange={v => setSelM(parseInt(v))}
        />
      </div>
      <div className="exd-picker-footer">
        <button className="exd-picker-close-btn" onClick={onClose}>Close</button>
        <button className="exd-picker-validate-btn" onClick={handleValidate}>To validate</button>
      </div>
    </div>
  );
}

// ── ExamDetail ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   exam      – current exam object
 *   onSave    – (updatedExam) => void
 *   onBack    – () => void
 */
export default function ExamDetail({ exam, onSave, onBack }) {
  const [status,      setStatus]      = useState(exam.status      ?? "on_hold");
  const [resultPermis,setResultPermis]= useState(exam.resultPermis ?? "");   // "refusal" | "accepted" | ""
  const [comment,     setComment]     = useState(exam.comment      ?? "");
  const [examDate,    setExamDate]    = useState(exam.examDate      ?? "");  // ISO date string
  const [startTime,   setStartTime]   = useState(exam.startTime    ?? { hour: 8, minute: 0 });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  function fmtDate(iso) {
    if (!iso) return "dd/mm/yyyy";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  }

  function fmtTime(t) {
    if (!t) return "--:--";
    return `${String(t.hour).padStart(2,"0")}:${String(t.minute).padStart(2,"0")}`;
  }

  function handleSave() {
    onSave({
      ...exam,
      status,
      resultPermis,
      comment,
      examDate,
      startTime,
    });
  }

  return (
    <div className="exd-page">

      {/* Header */}
      <div className="exd-header">
        <button className="exd-back-btn" onClick={onBack}>
          <IconArrowLeft />
        </button>
        <h1 className="exd-title">Examination list</h1>
      </div>

      <div className="exd-body">

        {/* ── Left: Details card ── */}
        <div className="exd-details-card">
          <h2 className="exd-card-title">Details</h2>

          {/* Status */}
          <div className="exd-field-row">
            <span className="exd-field-label">Status</span>
            <div className="exd-status-group">
              {[
                { key:"successful", label:"Successful" },
                { key:"failed",     label:"Failed"     },
                { key:"on_hold",    label:"On hold"    },
              ].map(s => (
                <button
                  key={s.key}
                  className={`exd-status-btn exd-status-btn--${s.key} ${status === s.key ? "active" : ""}`}
                  onClick={() => setStatus(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result permis */}
          <div className="exd-field-row">
            <span className="exd-field-label">Result permis</span>
            <div className="exd-result-group">
              {[
                { key:"refusal",  label:"Refusal"  },
                { key:"accepted", label:"accepted" },
              ].map(r => (
                <button
                  key={r.key}
                  className={`exd-result-btn exd-result-btn--${r.key} ${resultPermis === r.key ? "active" : ""}`}
                  onClick={() => setResultPermis(prev => prev === r.key ? "" : r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="exd-field-row" style={{ flexDirection:"column", alignItems:"stretch", gap:10 }}>
            <span className="exd-field-label">Comment</span>
            <textarea
              className="exd-comment-area"
              placeholder="Comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>

          {/* Footer buttons */}
          <div className="exd-footer">
            <button className="exd-btn-dismiss" onClick={onBack}>Dismiss</button>
            <button className="exd-btn-save"    onClick={handleSave}>Save changes</button>
          </div>
        </div>

        {/* ── Right: Date + Time pickers ── */}
        <div className="exd-datetime-card">

          {/* Exam date field */}
          <div
            className="exd-date-field"
            onClick={() => { setShowDatePicker(p => !p); setShowTimePicker(false); }}
          >
            <div className="exd-date-field-label">Exam date</div>
            <input
              className="exd-date-input"
              readOnly
              value={fmtDate(examDate)}
              placeholder="dd/mm/yyyy"
            />
          </div>
          {showDatePicker && (
            <DatePickerCard
              value={examDate}
              onChange={v => setExamDate(v)}
              onClose={() => setShowDatePicker(false)}
            />
          )}

          {/* Start time field */}
          <div
            className="exd-date-field"
            onClick={() => { setShowTimePicker(p => !p); setShowDatePicker(false); }}
          >
            <div className="exd-date-field-label">Start time</div>
            <input
              className="exd-date-input"
              readOnly
              value={`${fmtTime(startTime)} am`}
            />
          </div>
          {showTimePicker && (
            <TimePickerCard
              value={startTime}
              onChange={v => setStartTime(v)}
              onClose={() => setShowTimePicker(false)}
            />
          )}

        </div>
      </div>
    </div>
  );
}