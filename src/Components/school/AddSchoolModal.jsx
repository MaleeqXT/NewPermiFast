import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AddSchoolModal.css";

// ─── Validation rules ──────────────────────────────────────────────────────
const FIELDS = [
  {
    key: "siret",
    label: "SIRET",
    type: "text",
    placeholder: "14-digit SIRET number",
    col: "left",
    validate: (v) => {
      if (!v.trim()) return "This field is required.";
      if (!/^\d+$/.test(v)) return "SIRET must contain numbers only.";
      if (v.length !== 14) return "Invalid SIRET number. It must be exactly 14 digits.";
      return "";
    },
  },
  {
    key: "approvalNumber",
    label: "Numéro d'agrément préfectoral ",
    type: "text",
    placeholder: "Numéro d'agrément préfectoral",
    col: "right",
    validate: (v) => {
      if (!v.trim()) return "This field is required.";
      return "";
    },
  },
  {
    key: "name",
    label: "Nom de l'auto-école",
    type: "text",
    placeholder: "Nom de l'auto-école",
    col: "left",
    validate: (v) => {
      if (!v.trim()) return "This field is required.";
      return "";
    },
  },
  {
    key: "phone",
    label: "Téléphone de l'auto-école",
    type: "tel",
    placeholder: "+33XXXXXXXXX",
    col: "right",
    validate: (v) => {
      if (!v.trim()) return "This field is required.";
      if (!/^\+33\d{9}$/.test(v)) return "The phone number must be valid (+33XXXXXXXXX).";
      return "";
    },
  },
  {
    key: "address",
    label: "Adresse de l'auto-école ",
    type: "text",
    placeholder: "Adresse de l'auto-école",
    col: "left",
    validate: (v) => {
      if (!v.trim()) return "This field is required.";
      return "";
    },
  },
  {
    key: "postalCode",
    label: "Postal code",
    type: "text",
    placeholder: "5-digit postal code",
    col: "right",
    validate: (v) => {
      if (!v.trim()) return "This field is required.";
      if (!/^\d+$/.test(v)) return "The postal code must contain numbers only.";
      if (v.length !== 5) return "The postal code must contain 5 digits.";
      return "";
    },
  },
];

// ─── Single field component ────────────────────────────────────────────────
// No touched state — errors are passed in from parent after submit attempt
function FormField({ field, value, onChange, error }) {
  const handleChange = (e) => {
    let val = e.target.value;
    if (field.key === "siret" || field.key === "postalCode") {
      val = val.replace(/\D/g, "");
    }
    onChange(field.key, val);
  };

  return (
    <div className="form-field">
      <label className="form-label">
        {field.label} <span className="required-star">*</span>
      </label>

      <input
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
        className={`form-input${error ? " error" : ""}`}
        maxLength={
          field.key === "siret"      ? 14 :
          field.key === "postalCode" ? 5  :
          undefined
        }
      />

      {/* Always rendered so layout doesn't jump */}
      <span className="form-error">{error || ""}</span>
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────────
export default function AddSchoolPage({ onAdd }) {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    siret: "",
    approvalNumber: "",
    name: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  // errors only populated after the user clicks submit
  const [errors, setErrors] = useState({});

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    // Clear the error for a field as soon as the user starts fixing it
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = () => {
    // Run all validations at once
    const newErrors = {};
    FIELDS.forEach((f) => {
      const err = f.validate(values[f.key]);
      if (err) newErrors[f.key] = err;
    });

    // If there are any errors, show them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // All valid — pass data up and navigate
    if (onAdd) {
      onAdd({
        siret: values.siret,
        approvalNumber: values.approvalNumber,
        name: values.name.toUpperCase(),
        phone: values.phone,
        address: values.address,
        postalCode: values.postalCode,
      });
    }

    navigate("/dashboard/general");
  };

  const leftFields  = FIELDS.filter((f) => f.col === "left");
  const rightFields = FIELDS.filter((f) => f.col === "right");

  return (
    <div className="add-school-page">
      <div className="add-school-card">
        <div className="add-school-page-title">Création de l'auto-école</div>
        <div className="add-school-page-subtitle">Renseignez les informations de votre auto-école.</div>

        <div className="form-grid">
          {leftFields.map((leftField, i) => {
            const rightField = rightFields[i];
            return (
              <>
                <FormField
                  key={leftField.key}
                  field={leftField}
                  value={values[leftField.key]}
                  onChange={handleChange}
                  error={errors[leftField.key]}
                />
                {rightField && (
                  <FormField
                    key={rightField.key}
                    field={rightField}
                    value={values[rightField.key]}
                    onChange={handleChange}
                    error={errors[rightField.key]}
                  />
                )}
              </>
            );
          })}
        </div>

        <p className="form-required-note">*Champs obligatoire</p>
       <div className="submit-btns">
        <button
          className="form-submit-btn"
          onClick={handleSubmit}
        >
          Créer l'auto-école
        </button>
       <Link to = '/dashboard'> <button
          className="form-submit-btn1"
          
        >
          Retour
        </button>
        </Link>
        </div>
      </div>
    </div>
  );
}