import React, { useState, useEffect, useRef } from "react";
import "./AgencyMain.css";
import {
  FiMapPin,
  FiChevronRight,
  FiPhone,
  FiMail,
  FiCalendar,
  FiNavigation,
  FiMessageCircle,
  FiUsers,
  FiShield,
  FiCreditCard,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import { FaWhatsapp, FaStar } from "react-icons/fa";

import creilImg    from "../../assets/criel-pic.jpeg";
import saintImg    from "../../assets/saint-pic.jpeg";
import toulouseImg from "../../assets/toulouse-pic.jpeg";

/* ─── Agency data ──────────────────────────────────────── */
const agencies = [
  {
    id: 1,
    name: "Agence Toulouse (Métro Arènes)",
    city: "Toulouse",
    address: "139 Boulevard Déodat de Séverac,\n31300 Toulouse",
    addressLine1: "139 Boulevard Déodat de Séverac,",
    addressLine2: "31300 Toulouse",
    rating: 4.9,
    reviews: 148,
    openingStatus: "Ouvert aujourd'hui",
    openingHours: "16h00 – 19h00",
    weekHours: "Lundi – Vendredi : 16h00 – 19h00",
    phone: "09 70 70 16 16",
    whatsapp: "06 05 65 83 88",
    email: "contact@passpermisfacile.fr",
    image: toulouseImg,
    pickupLocations: [
      { id: 1, name: "Agence Toulouse (Métro Arènes)", address: "139 Boulevard Déodat de Séverac, 31300 Toulouse" },
      { id: 2, name: "Gare Matabiau", address: "Boulevard Pierre Semard, 31000 Toulouse" },
      { id: 3, name: "Jean Jaurès", address: "Place Jean Jaurès, 31000 Toulouse" },
    ],
  },
  {
    id: 2,
    name: "Agence Creil (Secteur Gare)",
    city: "Creil",
    address: "15 Rue des Pierres,\n60100 Creil",
    addressLine1: "15 Rue des Pierres,",
    addressLine2: "60100 Creil",
    rating: 4.8,
    reviews: 112,
    openingStatus: "Ouvert aujourd'hui",
    openingHours: "09h00 – 18h00",
    weekHours: "Mercredi – Samedi : 09h00 – 18h00",
    phone: "09 70 70 16 16",
    whatsapp: "06 05 65 83 88",
    email: "contact@passpermisfacile.fr",
    image: creilImg,
    pickupLocations: [
      { id: 1, name: "Agence Creil (Secteur Gare)", address: "15 Rue des Pierres, 60100 Creil" },
      { id: 2, name: "Gare de Creil", address: "Place de la Gare, 60100 Creil" },
    ],
  },
  {
    id: 3,
    name: "Agence Saint-Denis",
    city: "Saint-Denis",
    address: "Saint-Denis,\nÎle-de-France",
    addressLine1: "Saint-Denis,",
    addressLine2: "Île-de-France",
    rating: 4.9,
    reviews: 97,
    openingStatus: "Ouvert aujourd'hui",
    openingHours: "09h00 – 19h00",
    weekHours: "Lundi – Samedi : 09h00 – 19h00",
    phone: "09 70 70 16 16",
    whatsapp: "06 05 65 83 88",
    email: "contact@passpermisfacile.fr",
    image: saintImg,
    pickupLocations: [
      { id: 1, name: "Agence Saint-Denis", address: "Boulevard André Netwiller, 93200 Saint-Denis" },
      { id: 2, name: "Gare de Saint-Denis", address: "Place du 8 Mai 1945, 93200 Saint-Denis" },
      { id: 3, name: "Basilique Saint-Denis", address: "1 Rue de la Légion d'Honneur, 93200 Saint-Denis" },
    ],
  },
];

/* ─── Feature strip data ───────────────────────────────── */
const features = [
  {
    id: 1,
    icon: <FiTruck size={22} />,
    title: "Véhicules récents",
    desc: "Conduisez avec du matériel moderne et confortable",
  },
  {
    id: 2,
    icon: <FiUsers size={22} />,
    title: "Équipe à votre écoute",
    desc: "Des moniteurs expérimentés et bienveillants",
  },
  {
    id: 3,
    icon: <FiCalendar size={22} />,
    title: "Réservation en ligne",
    desc: "Réservez vos leçons 24h/24 depuis votre espace",
  },
  {
    id: 4,
    icon: <FiShield size={22} />,
    title: "Paiement sécurisé",
    desc: "Payez en 2x, 3x ou 4x en toute sécurité",
  },
];

/* ─── Stars component ──────────────────────────────────── */
const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="agencydetails-stars">
      {Array.from({ length: full  }).map((_, i) => <FaStar key={`f${i}`} />)}
      {half && <FaStar key="h" style={{ opacity: 0.5 }} />}
      {Array.from({ length: empty }).map((_, i) => <FaStar key={`e${i}`} style={{ opacity: 0.2 }} />)}
    </span>
  );
};

/* ─── Pickup Location Selector ─────────────────────────── */
const PickupSelector = ({ locations }) => {
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? null);
  const [open, setOpen]             = useState(false);
  const wrapRef = useRef(null);

  /* Reset to first location whenever the agency changes */
  useEffect(() => {
    setSelectedId(locations[0]?.id ?? null);
    setOpen(false);
  }, [locations]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = locations.find(l => l.id === selectedId) ?? locations[0];

  return (
    <div className="pickup-wrap" ref={wrapRef}>
      {/* Section label */}
      <div className="pickup-label-row">
        <FiMapPin className="pickup-label-icon" size={13} />
        <span className="pickup-label-text">CHOISIR VOTRE POINT DE PRISE EN CHARGE</span>
      </div>

      {/* Trigger button */}
      <button
        className={`pickup-trigger${open ? " pickup-trigger--open" : ""}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="pickup-trigger__content">
          <FiMapPin className="pickup-trigger__pin" size={14} />
          <span className="pickup-trigger__text">
            <span className="pickup-trigger__name">{selected?.name}</span>
            <span className="pickup-trigger__addr">{selected?.address}</span>
          </span>
        </span>
        <FiChevronRight
          className={`pickup-trigger__arrow${open ? " pickup-trigger__arrow--open" : ""}`}
          size={16}
        />
      </button>

      {/* Dropdown list */}
      <div className={`pickup-dropdown${open ? " pickup-dropdown--open" : ""}`} role="listbox">
        {locations.map(loc => {
          const isActive = loc.id === selectedId;
          return (
            <button
              key={loc.id}
              role="option"
              aria-selected={isActive}
              className={`pickup-option${isActive ? " pickup-option--active" : ""}`}
              onClick={() => { setSelectedId(loc.id); setOpen(false); }}
              type="button"
            >
              {/* Radio indicator */}
              <span className={`pickup-option__radio${isActive ? " pickup-option__radio--active" : ""}`}>
                {isActive && <span className="pickup-option__radio-dot" />}
              </span>
              <span className="pickup-option__text">
                <span className="pickup-option__name">{loc.name}</span>
                <span className="pickup-option__addr">{loc.address}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
const ContactRow = ({ icon, title, value }) => (
  <div className="agencydetails-contact-row">
    <div className="agencydetails-contact-icon">{icon}</div>
    <div className="agencydetails-contact-body">
      <span className="agencydetails-contact-title">{title}</span>
      <span className="agencydetails-contact-value">{value}</span>
    </div>
  </div>
);

/* ─── Contact row ──────────────────────────────────────── */
const AgencyMain = () => {
  const [selected, setSelected] = useState(agencies[0]);
  const [fade, setFade]         = useState(true);
  const prevRef = useRef(agencies[0].id);

  const select = (agency) => {
    if (agency.id === prevRef.current) return;
    setFade(false);
    setTimeout(() => {
      setSelected(agency);
      prevRef.current = agency.id;
      setFade(true);
    }, 200);
  };

  return (
    <section className="agencydetails-section">
      <div className="agencydetails-container">

        {/* ══════════════════════════════
            THREE-COLUMN LAYOUT
        ══════════════════════════════ */}
        <div className="agencydetails-layout">

          {/* ── COL 1: Agency sidebar ── */}
          <aside className="agencydetails-sidebar">
            <h3 className="agencydetails-sidebar-title">NOS AGENCES</h3>

            <div className="agencydetails-list">
              {agencies.map((a) => {
                const isActive = a.id === selected.id;
                return (
                  <button
                    key={a.id}
                    className={`agencydetails-card ${isActive ? "agencydetails-card--active" : ""}`}
                    onClick={() => select(a)}
                    aria-label={`Sélectionner l'agence ${a.name}`}
                  >
                    {/* Thumbnail */}
                    <div className="agencydetails-card-thumb">
                      <img src={a.image} alt={`Agence ${a.name}`} />
                    </div>

                    {/* Text */}
                    <div className="agencydetails-card-info">
                      <span className="agencydetails-card-name">{a.name}</span>
                      <span className="agencydetails-card-addr">
                        {a.addressLine1}<br />{a.addressLine2}
                      </span>
                      <span className="agencydetails-card-status">{a.openingStatus}</span>
                      <span className="agencydetails-card-hours">{a.openingHours}</span>
                    </div>

                    {/* Right icon */}
                    <div className="agencydetails-card-icon">
                      {isActive
                        ? <FiMapPin className="agencydetails-card-icon--active" />
                        : <FiChevronRight className="agencydetails-card-icon--inactive" />
                      }
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom link */}
            <button className="agencydetails-future-btn" aria-label="Voir les prochaines ouvertures">
              <FiCalendar size={14} />
              <span>Voir les prochaines ouvertures</span>
            </button>
          </aside>

          {/* ── COL 2: Center image ── */}
          <div className="agencydetails-image-col">
            <div className="agencydetails-image-wrap">
              <img
                key={selected.id}
                src={selected.image}
                alt={`Agence ${selected.name}`}
                className={`agencydetails-main-img ${fade ? "agencydetails-main-img--visible" : ""}`}
              />
            </div>
          </div>

          {/* ── COL 3: Agency details ── */}
          <div className="agencydetails-info-col">
            <div className={`agencydetails-info-card ${fade ? "agencydetails-info-card--visible" : ""}`}>

              {/* Status badge */}
              <div className="agencydetails-status-badge">
                <span className="agencydetails-status-dot" />
                <span className="agencydetails-status-text">AGENCE OUVERTE</span>
              </div>

              {/* Agency name */}
              <h2 className="agencydetails-agency-name">{selected.name}</h2>

              {/* Address */}
              <p className="agencydetails-agency-addr">
                {selected.addressLine1} {selected.addressLine2}
              </p>

              {/* Rating */}
              <div className="agencydetails-rating">
                <Stars rating={selected.rating} />
                <span className="agencydetails-rating-text">
                  {selected.rating}/{selected.reviews} avis Google)
                </span>
              </div>

              {/* ── Right column action buttons (top-right) ── */}
              <div className="agencydetails-actions">
                <button className="agencydetails-btn agencydetails-btn--primary" aria-label="Prendre rendez-vous">
                  <FiCalendar size={16} />
                  <span>Prendre rendez-vous</span>
                </button>
                <button className="agencydetails-btn agencydetails-btn--secondary" aria-label="Itinéraire">
                  <FiNavigation size={16} />
                  <span>Itinéraire</span>
                </button>
                <button className="agencydetails-btn agencydetails-btn--secondary" aria-label="Nous appeler">
                  <FiPhone size={16} />
                  <span>Nous appeler</span>
                </button>
                <button className="agencydetails-btn agencydetails-btn--secondary" aria-label="Envoyer un message">
                  <FiMessageCircle size={16} />
                  <span>Envoyer un message</span>
                </button>
              </div>

              {/* ── Contact info ── */}
              <div className="agencydetails-contacts">
                <ContactRow
                  icon={<FiClock size={17} />}
                  title="Horaires d'ouverture"
                  value={selected.weekHours}
                />
                <ContactRow
                  icon={<FiPhone size={17} />}
                  title="Téléphone"
                  value={selected.phone}
                />
                <ContactRow
                  icon={<FaWhatsapp size={17} />}
                  title="WhatsApp"
                  value={selected.whatsapp}
                />
                <ContactRow
                  icon={<FiMail size={17} />}
                  title="Email"
                  value={selected.email}
                />
              </div>

            </div>
          </div>

        </div>{/* /layout */}

        {/* ══════════════════════════════
            FEATURE STRIP
        ══════════════════════════════ */}
        <div className="agencydetails-features">
          {features.map((f) => (
            <div key={f.id} className="agencydetails-feature">
              <div className="agencydetails-feature-icon">{f.icon}</div>
              <span className="agencydetails-feature-title">{f.title}</span>
              <span className="agencydetails-feature-desc">{f.desc}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AgencyMain;
