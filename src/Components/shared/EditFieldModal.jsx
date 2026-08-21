import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./EditFieldModal.css";

/**
 * EditFieldModal — reusable modal for editing one or more fields
 *
 * ── PROPS ──────────────────────────────────────────────────────────────────
 *
 *  title      string          Modal heading, e.g. "Change name"
 *
 *  fields     Array<{
 *               key:         string   — unique key for this field
 *               label:       string   — label shown above input
 *               type?:       string   — input type (default "text")
 *               placeholder? string
 *             }>
 *
 *  values     object         Current values keyed by field.key
 *                            e.g. { firstName: "John", lastName: "Doe" }
 *
 *  onSave     (updatedValues: object) => void
 *             Called only when at least one value changed
 *
 *  onClose    () => void
 *
 * ── USAGE EXAMPLE ──────────────────────────────────────────────────────────
 *
 *  // 1. Trigger state in your component
 *  const [nameModal, setNameModal] = useState(false);
 *
 *  // 2. Render the edit icon button wherever you want
 *  <button className="cp-edit-icon" onClick={() => setNameModal(true)}>✎</button>
 *
 *  // 3. Render the modal (put it anywhere in your JSX, even at the bottom)
 *  {nameModal && (
 *    <EditFieldModal
 *      title="Change name"
 *      fields={[
 *        { key: "lastName",  label: "Name",       placeholder: "Last name"  },
 *        { key: "firstName", label: "First name", placeholder: "First name" },
 *      ]}
 *      values={{ lastName: form.lastName, firstName: form.firstName }}
 *      onSave={(updated) => {
 *        set("lastName",  updated.lastName);
 *        set("firstName", updated.firstName);
 *      }}
 *      onClose={() => setNameModal(false)}
 *    />
 *  )}
 *
 * ── TO USE IN A DIFFERENT COMPONENT ───────────────────────────────────────
 *  Same pattern — just change `fields`, `values`, and `onSave`.
 *  Works for a single field too:
 *
 *  <EditFieldModal
 *    title="Change email"
 *    fields={[{ key: "email", label: "Email", type: "email" }]}
 *    values={{ email: form.email }}
 *    onSave={(updated) => set("email", updated.email)}
 *    onClose={() => setEmailModal(false)}
 *  />
 */
export default function EditFieldModal({ title, fields, values, onSave, onClose }) {
  // Local draft state — a copy of values so edits don't affect parent until Save
    console.log(fields);
  console.log(title);
  console.log(values);

  
  const [draft, setDraft] = useState(() => ({ ...values }));

  // Keep draft in sync if parent values change while modal is open
  useEffect(() => {
    setDraft({ ...values });
  }, [JSON.stringify(values)]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(key, val) {
    setDraft(prev => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    // Only call onSave if something actually changed
    const changed = fields.some(f => draft[f.key] !== values[f.key]);
    if (changed) onSave(draft);
    onClose();
  }

  // Close on Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return createPortal(
    <div className="efm-overlay" onClick={onClose}>
      <div className="efm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="efm-header">
          <span className="efm-title">{title}</span>
          <button className="efm-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Fields */}
        <div className="efm-body">
          {fields.map(field => (
            <div key={field.key} className="efm-field">
              <label className="efm-label">{field.label}</label>
              <input
                className="efm-input"
                type={field.type || "text"}
                placeholder={field.placeholder || ""}
                value={draft[field.key] ?? ""}
                onChange={e => handleChange(field.key, e.target.value)}
                autoFocus={fields[0].key === field.key}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="efm-footer">
          <button className="efm-btn efm-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="efm-btn efm-btn--save"   onClick={handleSave}>Save</button>
        </div>

      </div>
    </div>,
    document.body
  );
}