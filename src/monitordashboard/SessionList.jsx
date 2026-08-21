import { useState } from "react";

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const DEFAULT_SESSIONS = [
  { id: 1, date: "28 avril 2026", with: "L. Marianne", note: "tout va bien" },
  { id: 2, date: "27 avril 2026", with: "S. FELINE", note: "" },
  { id: 3, date: "25 avril 2026", with: "S. FELINE", note: "" },
  { id: 4, date: "5 mars 2026", with: "S. FELINE", note: "" },
  { id: 5, date: "5 décembre 2025", with: "St. Mary", note: "" },
  { id: 6, date: "5 décembre 2025", with: "St. Mary", note: "" },
  { id: 7, date: "3 décembre 2025", with: "S. FELINE", note: "" },
  { id: 8, date: "3 décembre 2025", with: "T. Sahrane", note: "" },
  { id: 9, date: "1 décembre 2025", with: "S. FELINE", note: "" },
  { id: 10, date: "30 octobre 2025", with: "S. FELINE", note: "" },
  { id: 11, date: "28 octobre 2025", with: "S. FELINE", note: "" },
  { id: 12, date: "10 octobre 2025", with: "S. FELINE", note: "" },
  { id: 13, date: "27 août 2025", with: "S. FELINE", note: "" },
];

export default function SessionList({ onBack, onSelect, sessions = DEFAULT_SESSIONS }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={onBack}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <IconArrowLeft />
        </button>
        <span style={styles.headerTitle}>Keita El hadji</span>
      </div>

      <div style={styles.list}>
        {sessions.map((s) => (
          <button
            key={s.id}
            style={{
              ...styles.card,
              background: hovered === s.id ? "#f9f9f9" : "#fff",
              borderColor: hovered === s.id ? "#d4d4d4" : "#ebebeb",
            }}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect?.(s)}
          >
            <div style={styles.cardTop}>
              <span style={styles.date}>{s.date}</span>
              <span style={styles.dot}>·</span>
              <span style={styles.with}>avec {s.with}</span>
            </div>
            {s.note ? <p style={styles.note}>{s.note}</p> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    background: "#fff",
    minHeight: "100vh",
    color: "#333",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 20px 14px",
    borderBottom: "1px solid #efefef",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  backBtn: {
    background: "none",
    border: "1px solid #e8e8e8",
    borderRadius: 8,
    width: 34,
    height: 34,
    cursor: "pointer",
    fontSize: 16,
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background .15s",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#333",
    letterSpacing: "-0.01em",
  },
  list: {
    padding: "16px 16px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  card: {
    width: "100%",
    textAlign: "left",
    border: "1px solid #ebebeb",
    borderRadius: 10,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "background .15s, border-color .15s",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    flexWrap: "wrap",
  },
  date: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
  },
  dot: {
    fontSize: 14,
    color: "#ccc",
  },
  with: {
    fontSize: 13,
    color: "#888",
    fontWeight: 400,
  },
  note: {
    margin: 0,
    fontSize: 12,
    color: "#aaa",
    fontStyle: "italic",
  },
};
