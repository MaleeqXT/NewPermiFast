import { useEffect, useState } from "react";
import "./Skills.css";

/**
 * SkillToast
 * Props:
 *   message  – string to show in toast body
 *   onClose  – called when toast is dismissed / auto-expires
 */
export default function SkillToast({ message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // give fade-out time
    }, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="skills-toast">
      <div className="skills-toast-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4m0 4h.01"/>
        </svg>
        Successful
        <button className="skills-toast-close" onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>✕</button>
      </div>
      <div className="skills-toast-body">{message || "The action was successfully completed."}</div>
    </div>
  );
}