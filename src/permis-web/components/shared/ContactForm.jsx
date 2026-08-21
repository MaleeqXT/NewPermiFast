import React, { useEffect, useRef, useState } from "react";
import "./ContactForm.css";
import http from "../../../helpers/http.jsx";
import {
  FaMapMarkerAlt,
  FaChevronRight,
  FaPhone,
  FaClock,
  FaShieldAlt,
  FaHandsHelping,
  FaUser,
  FaEnvelope,
  FaTag,
} from "react-icons/fa";

/* ── Agency cards data ── */
const agencies = [
  {
    id: 1,
    line1: "139 Bd Déodat de Séverac,",
    line2: "31300 Toulouse",
  },
  {
    id: 2,
    line1: "Boulevard André Netwiller,",
    line2: "31200 Toulouse",
  },
  {
    id: 3,
    line1: "15 rue des Pierres,",
    line2: "60100 Creil",
  },
];

/* ── Info rows data ── */
const infoRows = [
  {
    id: 1,
    icon: FaClock,
    title: "Réponse rapide",
    desc: "Nous vous recontactons sous 24 H maximum.",
  },
  {
    id: 2,
    icon: FaShieldAlt,
    title: "Service 100% gratuit",
    desc: "Aucun engagement de votre part.",
  },
  {
    id: 3,
    icon: FaHandsHelping,
    title: "Accompagnement personnalisé",
    desc: "Un conseiller est à votre écoute pour vous aider.",
  },
];

/* ── Component ── */
const ContactForm = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ prenom: "", nom: "", phone: "", subject: "", email: "", message: "" });

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFormError("");
    try {
      await http.post("/contacts", form);
      setSubmitted(true);
      setForm({ prenom: "", nom: "", phone: "", subject: "", email: "", message: "" });
    } catch (error) {
      const errors = error?.response?.data?.errors;
      setFormError(Object.values(errors ?? {})?.[0]?.[0] || error?.response?.data?.message || "Impossible d'envoyer votre message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className={`cf-section${visible ? " cf-section--visible" : ""}`}
      ref={sectionRef}
      aria-label="Formulaire de contact"
    >
      <div className="cf-container">

        {/* ══════════════════════════
            TOP TITLE
        ══════════════════════════ */}
        <div className="cf-title-block">
          <div className="cf-title-row">
            <FaMapMarkerAlt className="cf-title-icon" aria-hidden="true" />
            <h2 className="cf-title">Nos Agences et points de RDV</h2>
          </div>
          <span className="cf-title-line" aria-hidden="true" />
        </div>

        {/* ══════════════════════════
            AGENCY CARDS
        ══════════════════════════ */}
        <div className="cf-cards">
          {agencies.map((a, i) => (
            <div
              key={a.id}
              className="cf-card"
              style={{ "--card-delay": `${i * 0.1}s` }}
              role="button"
              tabIndex={0}
              aria-label={`Agence ${a.line1} ${a.line2}`}
            >
              <div className="cf-card__icon-wrap" aria-hidden="true">
                <FaMapMarkerAlt className="cf-card__icon" />
              </div>
              <div className="cf-card__text">
                <span className="cf-card__line1">{a.line1}</span>
                <span className="cf-card__line2">{a.line2}</span>
              </div>
              <FaChevronRight className="cf-card__arrow" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* ══════════════════════════
            MAIN CARD
        ══════════════════════════ */}
        <div className="cf-main">

          {/* ── LEFT INFO PANEL ── */}
          <aside className="cf-info">

            {/* Badge */}
            {/* <div className="cf-info__badge">
              <FaPhone className="cf-info__badge-icon" aria-hidden="true" />
              <span className="cf-info__badge-text">ÊTRE RECONTACTÉ</span>
            </div> */}

            {/* Feature rows */}
            <ul className="cf-info__list">
              {infoRows.map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.id} className="cf-info__row">
                    <div className="cf-info__row-icon" aria-hidden="true">
                      <Icon />
                    </div>
                    <div className="cf-info__row-body">
                      <span className="cf-info__row-title">{row.title}</span>
                      <span className="cf-info__row-desc">{row.desc}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── RIGHT FORM ── */}
          <form
            className="cf-form"
            onSubmit={handleSubmit}
            aria-label="Formulaire être recontacté"
            noValidate
          >
            {/* Row 1: Prénom + Nom */}
            <div className="cf-form__grid">
              <div className="cf-form__field">
                <FaUser className="cf-form__icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Prénom*"
                  className="cf-form__input"
                  aria-label="Prénom"
                  value={form.prenom}
                  onChange={(e) => setForm((current) => ({ ...current, prenom: e.target.value }))}
                  required
                />
              </div>
              <div className="cf-form__field">
                <FaUser className="cf-form__icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Nom*"
                  className="cf-form__input"
                  aria-label="Nom"
                  value={form.nom}
                  onChange={(e) => setForm((current) => ({ ...current, nom: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Row 2: Téléphone + Sujet */}
            <div className="cf-form__grid">
              <div className="cf-form__field">
                <FaPhone className="cf-form__icon" aria-hidden="true" />
                <input
                  type="tel"
                  placeholder="Téléphone*"
                  className="cf-form__input"
                  aria-label="Téléphone"
                  value={form.phone}
                  onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="cf-form__field">
                <FaTag className="cf-form__icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Sujet*"
                  className="cf-form__input"
                  aria-label="Sujet"
                  value={form.subject}
                  onChange={(e) => setForm((current) => ({ ...current, subject: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Row 3: Email — full width */}
            <div className="cf-form__field cf-form__field--full">
              <FaEnvelope className="cf-form__icon" aria-hidden="true" />
              <input
                type="email"
                placeholder="Email*"
                className="cf-form__input"
                aria-label="Email"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                required
              />
            </div>

            {/* Row 4: Textarea — full width */}
            <div className="cf-form__field cf-form__field--full cf-form__field--textarea">
              <textarea
                className="cf-form__textarea"
                placeholder={"Décrivez vos besoins en formation*\n(si vous avez un handicap)"}
                aria-label="Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))}
                required
              />
            </div>

            {/* Submit button */}
            {formError && <p className="cf-form__error">{formError}</p>}
            {submitted && <p className="cf-form__success">Votre message a été envoyé avec succès.</p>}
            <button
              type="submit"
              className={`cf-form__btn${submitted ? " cf-form__btn--submitted" : ""}`}
              aria-label="Envoyer le formulaire"
              disabled={sending}
            >
              {sending ? "ENVOI EN COURS…" : "ÊTRE RECONTACTÉ"}
            </button>
          </form>

        </div>{/* /cf-main */}
      </div>{/* /cf-container */}
    </section>
  );
};

export default ContactForm;
