import React, { useState, useEffect, useRef } from "react";
import "./CPFHero.css";
import cpfBg from "../../assets/green-people-car.jpeg";
import {
  FiCheckCircle, FiSearch, FiFileText, FiThumbsUp,
  FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

/* ── CPF steps data ── */
const steps = [
  {
    id: 1,
    icon: FiSearch,
    title: "Vérifiez votre éligibilité",
    bullets: [
      "Vérifiez que votre permis est nécessaire pour votre projet professionnel.",
      "Consultez votre solde CPF disponible.",
    ],
  },
  {
    id: 2,
    icon: FiFileText,
    title: "Inscrivez-vous à la formation",
    bullets: [
      "Recherchez Pass Permis Facile sur Mon Compte Formation.",
      "Sélectionnez la formation adaptée à vos besoins.",
    ],
  },
  {
    id: 3,
    icon: FiCheckCircle,
    title: "Complétez votre dossier",
    bullets: [
      "Renseignez vos informations personnelles.",
      "Validez les documents demandés.",
      "Effectuez votre déclaration sur l'honneur si nécessaire.",
    ],
  },
  {
    id: 4,
    icon: FiThumbsUp,
    title: "Validation de votre demande",
    bullets: [
      "Notre équipe vérifie votre dossier.",
      "Après validation, vous pourrez planifier vos heures de conduite.",
      "Nous vous accompagnons jusqu'au début de votre formation.",
    ],
  },
];

/* ── Zone options ── */
const zones = [
  "Toulouse – Centre", "Toulouse – Arènes", "Creil", "Saint-Denis", "Autre",
];

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

/* ── Component ── */
const CPFHero = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", zone: "", rappel: "",
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const toggleDay = (d) =>
    setSelectedDays(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      className={`cpfhero${visible ? " cpfhero--visible" : ""}`}
    >
      {/* ── Background image + overlay ── */}
      <div className="cpfhero__bg">
        <img src={cpfBg} alt="" className="cpfhero__bg-img" aria-hidden="true" />
        <div className="cpfhero__bg-overlay" aria-hidden="true" />
      </div>

      {/* ── Inner layout ── */}
      <div className="cpfhero__inner">

        {/* ════════ LEFT ════════ */}
        <div className="cpfhero__left">

          {/* Small label */}
          <span className="cpfhero__eyebrow">FINANCEMENT CPF</span>

          {/* Main heading */}
          <h1 className="cpfhero__heading">
            Financez votre permis<br />
            grâce à votre <span className="cpfhero__heading-green">CPF.</span>
          </h1>

          {/* Intro paragraph */}
          <p className="cpfhero__intro">
            Obtenez votre permis de conduire grâce au financement CPF. Notre
            équipe vous accompagne à chaque étape afin de constituer votre
            dossier rapidement et simplement.
          </p>

          {/* 4 steps grid */}
          <div className="cpfhero__steps">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`cpfhero__step${visible ? " cpfhero__step--visible" : ""}`}
                  style={{ "--si": i }}
                >
                  <div className="cpfhero__step-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <div className="cpfhero__step-body">
                    <h3 className="cpfhero__step-title">{step.title}</h3>
                    <ul className="cpfhero__step-list">
                      {step.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ════════ RIGHT — form card ════════ */}
        <div className="cpfhero__right">
          <div className="cpfhero__form-card">

            <h2 className="cpfhero__form-title">Demande de financement CPF</h2>
            <p className="cpfhero__form-sub">
              Complétez ce formulaire et notre équipe vous recontactera
              rapidement pour vous accompagner dans votre financement CPF.
            </p>

            <form className="cpfhero__form" onSubmit={handleSubmit} noValidate>

              {/* Nom et prénom */}
              <div className="cpfhero__field">
                <label className="cpfhero__field-label" htmlFor="ch-nom">
                  Nom et prénom
                </label>
                <div className="cpfhero__field-wrap">
                  <FiUser className="cpfhero__field-icon" aria-hidden="true" />
                  <input
                    id="ch-nom"
                    name="nom"
                    type="text"
                    placeholder="Jean Dupont"
                    className="cpfhero__input"
                    value={form.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="cpfhero__field">
                <label className="cpfhero__field-label" htmlFor="ch-email">
                  Adresse e-mail
                </label>
                <div className="cpfhero__field-wrap">
                  <FiMail className="cpfhero__field-icon" aria-hidden="true" />
                  <input
                    id="ch-email"
                    name="email"
                    type="email"
                    placeholder="jean@exemple.fr"
                    className="cpfhero__input"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="cpfhero__field">
                <label className="cpfhero__field-label" htmlFor="ch-tel">
                  Téléphone
                </label>
                <div className="cpfhero__field-wrap">
                  <FiPhone className="cpfhero__field-icon" aria-hidden="true" />
                  <input
                    id="ch-tel"
                    name="telephone"
                    type="tel"
                    placeholder="06 00 00 00 00"
                    className="cpfhero__input"
                    value={form.telephone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Zone de conduite */}
              <div className="cpfhero__field">
                <label className="cpfhero__field-label" htmlFor="ch-zone">
                  Zone de conduite
                </label>
                <div className="cpfhero__field-wrap">
                  <FiMapPin className="cpfhero__field-icon" aria-hidden="true" />
                  <select
                    id="ch-zone"
                    name="zone"
                    className="cpfhero__input cpfhero__select"
                    value={form.zone}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Choisissez votre agence</option>
                    {zones.map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Préférence de rappel */}
              <div className="cpfhero__field">
                <label className="cpfhero__field-label" htmlFor="ch-rappel">
                  Préférence de rappel
                </label>
                <div className="cpfhero__field-wrap">
                  <FiClock className="cpfhero__field-icon" aria-hidden="true" />
                  <select
                    id="ch-rappel"
                    name="rappel"
                    className="cpfhero__input cpfhero__select"
                    value={form.rappel}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Choisissez un créneau</option>
                    <option>Matin (08h – 12h)</option>
                    <option>Après-midi (12h – 17h)</option>
                    <option>Soir (17h – 20h)</option>
                  </select>
                </div>
              </div>

              {/* Jours disponibles */}
              <div className="cpfhero__field">
                <label className="cpfhero__field-label">
                  <FiCalendar style={{ marginRight: 6, verticalAlign: "middle" }} aria-hidden="true" />
                  Quels jours êtes-vous disponible ?
                </label>
                <div className="cpfhero__days">
                  {days.map(d => (
                    <button
                      key={d}
                      type="button"
                      className={`cpfhero__day${selectedDays.includes(d) ? " cpfhero__day--active" : ""}`}
                      onClick={() => toggleDay(d)}
                      aria-pressed={selectedDays.includes(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`cpfhero__btn${submitted ? " cpfhero__btn--sent" : ""}`}
              >
                {submitted
                  ? "✓ Demande envoyée !"
                  : "Envoyer ma demande CPF"}
                {!submitted && <FiArrowRight className="cpfhero__btn-arrow" />}
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CPFHero;
