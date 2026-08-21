import React, { useEffect, useRef, useState } from "react";
import "./ContactHero.css";
import contactImg from "../../assets/contact.jpeg";
import { FaCommentDots, FaCheckCircle } from "react-icons/fa";

const ContactHero = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className={`cta${visible ? " cta--visible" : ""}`}
      ref={sectionRef}
      aria-label="Nous contacter"
    >
      {/* Soft background radial glows */}
      <div className="cta__bg-glow cta__bg-glow--left"  aria-hidden="true" />
      <div className="cta__bg-glow cta__bg-glow--right" aria-hidden="true" />

      <div className="cta__container">

        {/* ── LEFT ── */}
        <div className="cta__content">

          {/* Badge — text LEFT, large white bubble with icon RIGHT (overlapping) */}
          <div className="cta__badge">
            <span className="cta__badge-text">CONTACT</span>
            <span className="cta__badge-bubble" aria-hidden="true">
              <FaCommentDots />
            </span>
          </div>

          {/* Heading */}
          <h2 className="cta__heading">
            Besoin de<br />
            nous{" "}
            <span className="cta__heading-green">
              contacter
              <span className="cta__heading-underline" aria-hidden="true" />
            </span>{" "}
            ?
          </h2>

          {/* Description */}
          <p className="cta__desc">
            <FaCheckCircle className="cta__desc-icon" aria-hidden="true" />
            <span>
              Nous vous recontacterons<br />
              dans les <strong className="cta__desc-highlight">24 H</strong>.
            </span>
          </p>

        </div>

        {/* ── RIGHT ── */}
        <div className="cta__illustration">
          {/* Decorative circle behind image */}
          <div className="cta__circle" aria-hidden="true" />

          <img
            src={contactImg}
            alt="Illustration contact - enveloppe"
            className="cta__img"
          />
        </div>

      </div>
    </section>
  );
};

export default ContactHero;
