import { useEffect } from "react";

const iconStyle = {
  width: 16,
  height: 16,
  flexShrink: 0,
};

export default function ActionToast({ message, title = "Succès", onClose, autoCloseMs = 2400 }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      onClose?.();
    }, autoCloseMs);

    return () => window.clearTimeout(timer);
  }, [message, onClose, autoCloseMs]);

  if (!message) return null;

  return (
    <>
      <style>{`
        @keyframes cpfToastIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="cpf-toast"
        style={{
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 18,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          animation: "cpfToastIn 0.3s ease",
        }}
        role="status"
        aria-live="polite"
      >
        <div
          className="cpf-toast-top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 16px",
            background: "#333",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{title}</span>
          <button
            type="button"
            className="cpf-toast-close"
            onClick={() => onClose?.()}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="Fermer la notification"
          >
            ×
          </button>
        </div>
        <div
          className="cpf-toast-bottom"
          style={{
            padding: "12px 16px",
            fontSize: 14,
            color: "#374151",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {message}
        </div>
      </div>
    </>
  );
}
