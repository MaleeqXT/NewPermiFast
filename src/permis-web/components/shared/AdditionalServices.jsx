import React, { useEffect, useRef, useState } from "react";
import "./AdditionalServices.css";
import { useCart } from "../../context/CartContext";
import additionalImg from "../../assets/additional.jpeg";
import {
  FaPlus, FaCheck, FaUniversity, FaIdCard, FaChalkboardTeacher,
  FaCar, FaBook, FaTools, FaFileAlt,
} from "react-icons/fa";

/* ─── Service data ──────────────────────────────────────── */
const serviceList = [
  { id: "insc-pref",   title: "Inscription préfectorale",           price: 49.90, icon: <FaUniversity /> },
  { id: "fab-permis",  title: "Fabrication permis",                 price: 49.90, icon: <FaIdCard /> },
  { id: "rdv-peda",    title: "RDV pédagogique (2h)",               price: 99,    icon: <FaChalkboardTeacher /> },
  { id: "acc-exam",    title: "Accompagnement examen",              price: 59,    icon: <FaCar /> },
  { id: "acc-exam-1h", title: "Accompagnement examen (1h)",         price: 150,   icon: <FaCar /> },
  { id: "forfait-10h", title: "Forfait 10H",                        price: 20,    icon: <FaIdCard /> },
  { id: "livre-code",  title: "Livre de code",                      price: 150,   icon: <FaBook /> },
  { id: "cond-sup",    title: "Conduite supervisée 2h",             price: 59,    icon: <FaIdCard /> },
  { id: "heure-unit",  title: "Heure à l'unité boîte manuelle",     price: 59,    icon: <FaTools /> },
];

/* ─── Add button with animation ────────────────────────── */
const AddButton = ({ serviceId, service }) => {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isInCart = items.some(i => i.id === serviceId);

  const handleAdd = () => {
    addItem(service);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      className={`as-row__btn${added || isInCart ? " as-row__btn--added" : ""}`}
      onClick={handleAdd}
      aria-label={`Ajouter ${service.title}`}
    >
      {added || isInCart
        ? <><FaCheck className="as-row__btn-icon" /> Ajouté</>
        : <><FaPlus  className="as-row__btn-icon" /> Ajouter</>
      }
    </button>
  );
};

/* ─── Main component ────────────────────────────────────── */
const AdditionalServices = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const fmt = (n) =>
    n % 1 === 0
      ? `${n} €`
      : n.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

  return (
    <section className="as-section" ref={sectionRef}>
      <div className="as-container">

        {/* ── Section heading ── */}
        <div className={`as-heading ${visible ? "as-heading--visible" : ""}`}>
          <p className="as-heading__eyebrow">
            <span className="as-heading__dash" />
            SERVICES COMPLÉMENTAIRES
            <span className="as-heading__dash" />
          </p>
          <h2 className="as-heading__title">
            Des prestations <span className="as-heading__green">à la carte</span>
          </h2>
          <p className="as-heading__subtitle">
            Des prestations à la carte pour répondre à vos besoins spécifiques.
            Ajoutez uniquement les services dont vous avez besoin et composez
            votre formation sur mesure.
          </p>
        </div>

        {/* ── Card ── */}
        <div className={`as-card ${visible ? "as-card--visible" : ""}`}>
     
          {/* Header image */}
          <div className="as-card__img-wrap">
            <img
              src={additionalImg}
              alt="PASS Permis à la carte"
              className="as-card__img"
            />
          </div>

          {/* Service rows */}
          <ul className="as-list">
            {serviceList.map((svc) => (
              <li key={svc.id} className="as-row">
                <div className="as-row__left">
                  <span className="as-row__icon">{svc.icon}</span>
                  <span className="as-row__title">{svc.title}</span>
                </div>
                <div className="as-row__right">
                  <span className="as-row__price">{fmt(svc.price)}</span>
                  <AddButton serviceId={svc.id} service={svc} />
                </div>
              </li>
            ))}
          </ul>

          {/* Footer notice — white strip with check + text left, file icon right */}
          <div className="as-card__notice">
            <div className="as-card__notice-left">
              {/* Green circle check */}
              <div className="as-card__notice-check">
                <FaCheck />
              </div>
              <div className="as-card__notice-text">
                <span className="as-card__notice-heading">TOUS NOS PRIX SONT EN TTC</span>
                <span className="as-card__notice-sub">
                  Documentation détaillée disponible sur simple demande à l'accueil.
                </span>
              </div>
            </div>
            {/* Outlined file icon right */}
            <div className="as-card__notice-file" aria-hidden="true">
              <FaFileAlt />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdditionalServices;
