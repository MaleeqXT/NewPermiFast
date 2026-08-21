import React from "react";
import { Link } from "react-router-dom";
import "./ServicesHero.css";
import servicesBg from "../../assets/services-bg.jpeg";

const ServicesHero = ({
  bgImage    = servicesBg,
  eyebrow    = "SERVICES",
  heading    = "Nos Services",
  breadcrumb = "Services",
}) => {
  return (
    <section className="svchero">
      {/* Background image */}
      <div
        className="svchero__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />

      {/* Overlay: dark + subtle left→right gradient */}
      <div className="svchero__overlay" aria-hidden="true" />

      {/* Centered content */}
      <div className="svchero__content">
        {/* Eyebrow label */}
        <span className="svchero__eyebrow">{eyebrow}</span>

        {/* Main heading */}
        <h1 className="svchero__heading">{heading}</h1>

        {/* Breadcrumb */}
        <nav className="svchero__breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="svchero__breadcrumb-link">
            Accueil
          </Link>
          <span className="svchero__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="svchero__breadcrumb-current">{breadcrumb}</span>
        </nav>
      </div>
    </section>
  );
};

export default ServicesHero;
