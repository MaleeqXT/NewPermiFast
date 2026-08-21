// ── Shared constants & helpers for Calendar components ────────────────────────

export const EVENT_COLORS = ["#6366f1","#f59e0b","#10b981","#f472b6","#60a5fa","#ef4444"];
export const DAYS_WEEK    = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
export const DAYS_FULL    = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
export const MONTHS       = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
export const MONTH_SHORT  = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
export const HOURS        = Array.from({ length: 17 }, (_, i) => i + 6);

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  let dow = first.getDay(); dow = dow === 0 ? 6 : dow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < dow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export function getWeekDates(year, month, day) {
  const base = new Date(year, month, day);
  const dow  = base.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base); d.setDate(base.getDate() + offset + i); return d;
  });
}

export function weekRangeLabel(weekDates) {
  const first = weekDates[0], last = weekDates[6];
  if (first.getMonth() === last.getMonth())
    return `${first.getDate()} – ${last.getDate()} ${MONTH_SHORT[first.getMonth()]} ${first.getFullYear()}`;
  return `${first.getDate()} ${MONTH_SHORT[first.getMonth()]} – ${last.getDate()} ${MONTH_SHORT[last.getMonth()]} ${last.getFullYear()}`;
}

export function adjWeekLabel(weekDates, offset) {
  const anchor = new Date(weekDates[offset < 0 ? 0 : 6]);
  anchor.setDate(anchor.getDate() + offset);
  const start = new Date(anchor);
  const d = start.getDay(); start.setDate(start.getDate() + (d === 0 ? -6 : 1 - d));
  const end = new Date(start); end.setDate(start.getDate() + 6);
  if (start.getMonth() === end.getMonth())
    return `${start.getDate()} – ${end.getDate()} ${MONTH_SHORT[start.getMonth()]}`;
  return `${start.getDate()} ${MONTH_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTH_SHORT[end.getMonth()]}`;
}

export function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export function pad2(n) {
  return String(n).padStart(2, "0");
}