import { useState } from "react";
import "./DrivingSchoolForm.css";
import { useDispatch } from "react-redux";
import { addSchool } from "../../redux/reducers/schoolReducer";

const INITIAL = {
  siret: "",
  approval: "",
  name: "",
  phone: "",
  // address: "",
  postalCode: "",
};

export default function DrivingSchoolForm({ onBack, onSubmit }) {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // from api redux
    const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();

  const validateField = (value) =>
    String(value).trim() ? "" : "Ce champ est obligatoire.";

  const validateAll = (data) => {
    const next = {};
    Object.keys(INITIAL).forEach((k) => {
      const msg = validateField(data[k]);
      if (msg) next[k] = msg;
    });
    return next;
  };

  const handleChange = (field) => (e) => {
    const next = e.target.value;
    setValues((prev) => ({ ...prev, [field]: next }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: validateField(next) }));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    //here work
    setLoading(true);
    setApiError("");
     try {
      const result = await dispatch(addSchool({
        straight: values.siret.trim(),
        prefectural_approval_number: values.approval.trim(),
        name: values.name.trim(),
        phone: values.phone.trim(),
        // address: values.address.trim(),
        postal_code: values.postalCode.trim(),
      })).unwrap();
      if (typeof onSubmit === "function") onSubmit(result);

    }catch (err) {
      setApiError("Erreur lors de la création. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
    



    // const newSchool = {
    //   id: Date.now(),
    //   name: values.name.trim(),
    //   address: `${values.address.trim()}${
    //     values.postalCode.trim() ? ", " + values.postalCode.trim() : ""
    //   }`,
    //   phone: values.phone.trim(),
    //   subscription: "Club 300",
    //   waitingStudents: 0,
    //   unreadMessages: 0,
    //   status: "Actif",
    //   siret: values.siret.trim(),
    //   approval: values.approval.trim(),
    //   postalCode: values.postalCode.trim(),
    // };

    // if (typeof onSubmit === "function") onSubmit(newSchool);
  };

  const fieldClass = (field) => `field${errors[field] ? " field-error" : ""}`;

  return (
    <form className="driving-school-container" onSubmit={handleSubmit} noValidate>
      <h1>Création de l'auto-école</h1>
      <p className="subtitle">
        Renseignez les informations de votre auto-école.
      </p>

      <div className="form-grid">
        <div className={fieldClass("siret")}>
          <label htmlFor="ds-siret">SIRET *</label>
          <input
            id="ds-siret"
            type="text"
            placeholder="SIRET"
            value={values.siret}
            onChange={handleChange("siret")}
          />
          {errors.siret && <span className="field-error-msg">{errors.siret}</span>}
        </div>

        <div className={fieldClass("approval")}>
          <label htmlFor="ds-approval">Numéro d'agrément préfectoral *</label>
          <input
            id="ds-approval"
            type="text"
            placeholder="Numéro d'agrément préfectoral"
            value={values.approval}
            onChange={handleChange("approval")}
          />
          {errors.approval && <span className="field-error-msg">{errors.approval}</span>}
        </div>

        <div className={fieldClass("name")}>
          <label htmlFor="ds-name">Nom de l'auto-école *</label>
          <input
            id="ds-name"
            type="text"
            placeholder="Nom de l'auto-école"
            value={values.name}
            onChange={handleChange("name")}
          />
          {errors.name && <span className="field-error-msg">{errors.name}</span>}
        </div>

        <div className={fieldClass("phone")}>
          <label htmlFor="ds-phone">Téléphone de l'auto-école *</label>
          <input
            id="ds-phone"
            type="text"
            placeholder="Téléphone de l'auto-école"
            value={values.phone}
            onChange={handleChange("phone")}
          />
          {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
        </div>

        {/* <div className={fieldClass("address")}>
          <label htmlFor="ds-address">Adresse de l'auto-école *</label>
          <input
            id="ds-address"
            type="text"
            placeholder="Adresse de l'auto-école"
            value={values.address}
            onChange={handleChange("address")}
          />
          {errors.address && <span className="field-error-msg">{errors.address}</span>}
        </div> */}

        <div className={fieldClass("postalCode")}>
          <label htmlFor="ds-postal">Code postal *</label>
          <input
            id="ds-postal"
            type="text"
            placeholder="Code postal"
            value={values.postalCode}
            onChange={handleChange("postalCode")}
          />
          {errors.postalCode && <span className="field-error-msg">{errors.postalCode}</span>}
        </div>
      </div>

      <p className="required-note">*Champs obligatoires</p>
        {apiError && <p style={{ color: 'red', marginBottom: '10px' }}>{apiError}</p>}


      <button className="create-btn" type="submit" disabled={loading}>
          {loading ? "Création en cours..." : "Créer l'auto-école"}
      </button>

      <button className="back-btn" type="button" onClick={onBack}>
        Retour
      </button>
    </form>
  );
}