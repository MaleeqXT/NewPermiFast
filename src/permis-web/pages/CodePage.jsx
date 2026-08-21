import React, { useEffect, useRef, useState } from 'react'
import './CodePage.css'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import deskImg from '../assets/desk.jpeg'
import {
  FaPlay, FaArrowRight, FaCheckCircle, FaCheck,
  FaClock, FaListAlt, FaBook, FaShieldAlt, FaTag,
} from 'react-icons/fa'

/* ── Pack options ── */
const OPTIONS = [
  { id: 'intensif', title: 'Pass permis Code', subtitle: 'Intensif – 10h en 1 semaine', price: '290,00 €' },
  { id: 'normal',   title: 'Pass permis Code', subtitle: 'Normal – accès en ligne',      price: '29,00 €'  },
]

/* ── Pack features ── */
const FEATURES = [
  { id: 1, icon: FaClock,    bold: 'INTENSIF', rest: ' – 10h en 1 semaine' },
  { id: 2, icon: FaListAlt,  bold: null,       rest: '200 séries / 2000 questions' },
  { id: 3, icon: FaBook,     bold: null,       rest: '10 thématiques officielles' },
  { id: 4, icon: FaShieldAlt,bold: null,       rest: 'La formation intensif se fait exclusivement en agence' },
]

const CodePage = () => {
  const sectionRef = useRef(null)
  const [visible, setVisible]   = useState(false)
  const [selected, setSelected] = useState('intensif')

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const activeOption = OPTIONS.find(o => o.id === selected)

  return (
    <>
      <Navbar />

      <main className="cpf-page">
        <div className="cpf-container">

          <section
            ref={sectionRef}
            className={`cpf-section${visible ? ' cpf-section--visible' : ''}`}
          >

            {/* ══ LEFT — hero image card ══ */}
            <div className="cpf-left">
              <div className="cpf-hero-card">

                {/* Background image */}
                <img
                  src={deskImg}
                  alt="Formation code de la route – matériel pédagogique"
                  className="cpf-hero-card__img"
                />

                {/* Bottom dark overlay */}
                <div className="cpf-hero-card__overlay" aria-hidden="true" />

                {/* Bottom content */}
                <div className="cpf-hero-card__content">
                  {/* Badge */}
                  <div className="cpf-hero-card__badge">
                    <FaPlay className="cpf-hero-card__badge-icon" />
                    <span>FORMATION CODE</span>
                  </div>

                  {/* Heading */}
                  <h2 className="cpf-hero-card__heading">
                    Pass permis <span className="cpf-hero-card__heading-green">Code</span>
                  </h2>

                  {/* Description */}
                  <p className="cpf-hero-card__desc">
                    Besoin d'avoir accès au code en ligne, normal ou intensif
                    (10h en 1 semaine) ? Ce pack vous conviendra parfaitement.
                  </p>
                </div>

              </div>
            </div>

            {/* ══ RIGHT — product panel ══ */}
            <div className="cpf-right">

              {/* ── Option selector ── */}
              <div className="cpf-selector">
                <p className="cpf-selector__label">
                  <span className="cpf-selector__label-bar" />
                  CHOISIR LE CODE DÉSIRÉ :
                </p>

                <div className="cpf-options">
                  {OPTIONS.map(opt => {
                    const isActive = selected === opt.id
                    return (
                      <button
                        key={opt.id}
                        className={`cpf-option${isActive ? ' cpf-option--active' : ''}`}
                        onClick={() => setSelected(opt.id)}
                        aria-pressed={isActive}
                        aria-label={`Sélectionner ${opt.title} ${opt.subtitle}`}
                      >
                        {/* Left radio circle */}
                        <span className={`cpf-option__radio${isActive ? ' cpf-option__radio--active' : ''}`}>
                          {isActive && <span className="cpf-option__radio-dot" />}
                        </span>

                        {/* Text */}
                        <span className="cpf-option__body">
                          <span className="cpf-option__title">{opt.title}</span>
                          <span className="cpf-option__price">Prix : {opt.price}</span>
                        </span>

                        {/* Right checkmark – active only */}
                        {isActive && (
                          <span className="cpf-option__check" aria-hidden="true">
                            <FaCheck />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Pack features ── */}
              <div className="cpf-features">
                <p className="cpf-features__label">
                  <span className="cpf-features__label-bar" />
                  CE PACK COMPREND :
                </p>

                <ul className="cpf-features__list">
                  {FEATURES.map((f, i) => {
                    const Icon = f.icon
                    return (
                      <li
                        key={f.id}
                        className={`cpf-feature${visible ? ' cpf-feature--visible' : ''}`}
                        style={{ '--fi': i }}
                      >
                        <span className="cpf-feature__icon-wrap" aria-hidden="true">
                          <Icon className="cpf-feature__icon" />
                        </span>
                        <span className="cpf-feature__text">
                          {f.bold && <strong>{f.bold}</strong>}
                          {f.rest}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* ── Price card ── */}
              <div className="cpf-price-card">
                <span className="cpf-price-card__icon-wrap" aria-hidden="true">
                  <FaTag className="cpf-price-card__icon" />
                </span>
                <div className="cpf-price-card__body">
                  <span className="cpf-price-card__amount">
                    {activeOption.price}
                  </span>
                  <span className="cpf-price-card__ttc">TTC</span>
                </div>
              </div>

              {/* ── CTA button ── */}
              <button className="cpf-cta" aria-label="Réserver cette offre">
                <span className="cpf-cta__text">Réserver cette offre</span>
                <span className="cpf-cta__arrow" aria-hidden="true">
                  <FaArrowRight />
                </span>
              </button>

            </div>{/* /cpf-right */}
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CodePage
