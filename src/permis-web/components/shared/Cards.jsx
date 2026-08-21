import React, { useEffect, useRef, useState } from "react";
import "./Cards.css";
import car from "../../assets/car.jpeg";
import bike from "../../assets/bike.jpeg";
import arrow from "../../assets/arrow.jpeg";
import mobile from '../../assets/mobile.jpeg'

const cards = [
  {
    id: "exam-dates",
    accent: "#69b32a",      
    bgCircle: "#e8f5d6",
    img: car,
    imgAlt: "Dates d'examen rapides",
    titleStart: "Dates d'examen",
    titleAccent: "rapides",
    text: "Trouvez les meilleurs créneaux adaptés à votre emploi du tempset réservez votre leçon de conduite en quelques clics.",
  },
  {
    id: "motorcycle-training",
    accent: "#2563eb",      
    bgCircle: "#dbeafe",
    img: bike,
    imgAlt: "Formation Moto",
    titleStart: "Formation",
    titleAccent: "Moto",
    text: "Du débutant au permis A, un accompagnement sur mesure à chaque étapepour vous former sereinement et réussir votre permis en toute confiance.",
  },
  {
    id: "online-management",
    accent: "#7c3aed",     
    bgCircle: "#ede9fe",
    img: mobile,
    imgAlt: "Tout gérer en ligne",
    titleStart: "Tout gérer",
    titleAccent: "en ligne",
    text: "Votre auto-école, toujours à vos côtés pour chaque étape de votre formation et vous accompagner sereinement jusqu’à la réussite de votre permis.",
  },
  {
    id: "satisfaction",
    accent: "#ef4444",     
    bgCircle: "#fee2e2",
    img: arrow,
    imgAlt: "de satisfaction",
    titleStart: "95%",
    titleAccent: "de satisfaction",
    text: "Votre réussite, notre priorité pour vous accompagner vers le permis Plus de 1 200 élèves accompagnés et une note moyenne de 4,8/5.",
  },
];

const Cards = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cards-section" ref={sectionRef}>

      {/* ── Section header ── */}
      <div className={`cards-header ${visible ? "cards-header--visible" : ""}`}>
        <p className="cards-header__eyebrow">
          <span className="cards-header__dash" />
          POURQUOI NOUS CHOISIR ?
          <span className="cards-header__dash" />
        </p>

        <h2 className="cards-header__title">
          Pourquoi choisir
          <br />
          <span className="cards-header__title-green">PassPermisFacile&nbsp;?</span>
        </h2>

        {/* Curvy underline under the green line */}
        <svg
          className="cards-header__underline"
          viewBox="0 0 340 16"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 11 C80 3, 260 3, 336 11"
            stroke="#69b32a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <p className="cards-header__subtitle">
          Des formations modernes, un accompagnement personnalisé
          <br />
          et des résultats qui parlent d'eux-mêmes.
        </p>
      </div>

      {/* ── Card grid ── */}
      <div className="cards-grid">
        {cards.map((card, i) => (
          <article
            key={card.id}
            className={`card ${visible ? "card--visible" : ""}`}
            style={{ "--accent": card.accent, "--delay": `${i * 0.12}s` }}
          >
            {/* Heading + image */}
            <div className="card__top-row">
              <div className="card__heading">
                <h3 className="card__title">
                  {card.titleStart}
                  <br />
                  <span className="card__title-accent" style={{ color: card.accent }}>
                    {card.titleAccent}
                  </span>
                </h3>

                <svg
                  className="card__title-underline"
                  viewBox="0 0 140 10"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7 C35 2, 105 2, 138 7"
                    stroke={card.accent}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              <div
                className="card__img-wrap"
                style={{ background: card.bgCircle }}
              >
                <img
                  src={card.img}
                  alt={card.imgAlt}
                  className={`card__img${card.id === "motorcycle-training" ? " card__img--bike" : ""}`}
                />
              </div>
            </div>

            {/* Body text */}
            <p className="card__text">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Cards;
