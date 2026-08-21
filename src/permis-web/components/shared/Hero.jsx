import React from "react";
import "./Hero.css";
import heroVideo from "../../assets/hero-video-faststart.mp4";
import mobileHeroVideo from "../../assets/Car_and_motorcycle_drifting_video_202608131522.mp4";
import { FiArrowRight, FiPlay, FiCheckCircle } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="hero" aria-label="Héros PassPermisFacile">

      {/* ── Layer 1: Video background ── */}
      <video
        className="hero__bg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={mobileHeroVideo} media="(max-width: 768px)" type="video/mp4" />
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* ── Cinematic overlay — left-weighted, preserves video quality ── */}
      <div className="hero__overlay" aria-hidden="true" />

      {/* ── CPF badge – top right ── */}
      <div className="hero__cpf">
        <FiCheckCircle className="hero__cpf-check" />
        <span className="hero__cpf-label">
          <span className="hero__cpf-eligible">ÉLIGIBLE</span>
          <strong>CPF</strong>
        </span>
      </div>

      {/* ── Hero content ── */}
      <div className="hero__container">
        <div className="hero__content">

          {/* School label */}
          <div className="hero__label">
            <div className="hero__flag">
              <span className="hero__flag-blue"  />
              <span className="hero__flag-white" />
              <span className="hero__flag-red"   />
            </div>
            <span className="hero__label-text">AUTO-ÉCOLE PASSPERMISFACILE</span>
          </div>

          {/* Heading */}
          <h1 className="hero__title">
            <span className="hero__title-line">Passer le permis</span>
            <span className="hero__title-line">devient un jeu</span>
            <span className="hero__title-green">
              d'enfants.
              <svg
                className="hero__underline"
                viewBox="0 0 320 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 12 C60 4, 160 4, 316 12"
                  stroke="#69b32a"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero__subtitle">
            Des formations modernes, un accompagnement personnalisé
            <br />
            et des résultats qui parlent d'eux-mêmes.
          </p>

          {/* CTA buttons */}
          <div className="hero__buttons">

            {/* Primary – premium green pill */}
            <a href="/packages-page" className="hero__btn hero__btn--primary">
              <span className="hero__btn-icon-wrap"><FaCar /></span>
              <span>JE CHOISIS MON PACK</span>
              <span className="hero__btn-arrow-wrap"><FiArrowRight /></span>
            </a>

            {/* Secondary – frosted glass */}
            <a href="/services-page" className="hero__btn hero__btn--secondary">
              <span className="hero__btn-play"><FiPlay /></span>
              <span>DÉCOUVRIR L'AUTO-ÉCOLE</span>
            </a>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
