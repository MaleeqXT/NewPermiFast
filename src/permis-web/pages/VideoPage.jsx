import React, { useEffect, useRef, useState, useCallback } from "react";
import "./VideoPage.css";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { FaPlay, FaTimes, FaClock, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

/* ─── Video data ─────────────────────────────────────── */
const videos = [
  {
    id: 1,
    title: "Réussir son examen du permis",
    desc: "Tous les conseils de nos moniteurs pour aborder l'épreuve pratique avec sérénité et confiance.",
    category: "Examen",
    duration: "8:24",
    date: "12 Jan 2025",
    thumb: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Les erreurs les plus fréquentes",
    desc: "Découvrez les fautes éliminatoires et les erreurs courantes que commettent les candidats au permis.",
    category: "Conseils",
    duration: "6:15",
    date: "20 Fév 2025",
    thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    title: "Stationnement en créneau",
    desc: "Maîtrisez la technique du créneau étape par étape grâce aux explications claires de votre moniteur.",
    category: "Manœuvres",
    duration: "5:48",
    date: "3 Mar 2025",
    thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    title: "Conduite en ville",
    desc: "Apprenez à naviguer en milieu urbain : priorités, ronds-points, voies de bus et comportements à adopter.",
    category: "Pratique",
    duration: "9:02",
    date: "15 Mar 2025",
    thumb: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 5,
    title: "Priorités à droite",
    desc: "Comprenez la règle de priorité à droite et évitez les situations dangereuses sur la route.",
    category: "Code",
    duration: "4:33",
    date: "28 Mar 2025",
    thumb: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 6,
    title: "Comment réussir l'épreuve pratique",
    desc: "Stratégie complète pour le jour J : gestion du stress, communication avec l'examinateur, technique.",
    category: "Examen",
    duration: "11:17",
    date: "5 Avr 2025",
    thumb: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 7,
    title: "Astuces boîte manuelle",
    desc: "Embrayage, passages de vitesse, démarrage en côte — toutes les techniques pour maîtriser la boîte manuelle.",
    category: "Technique",
    duration: "7:41",
    date: "18 Avr 2025",
    thumb: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 8,
    title: "Conseils boîte automatique",
    desc: "Tout ce qu'il faut savoir pour conduire sereinement avec une boîte automatique dès votre première leçon.",
    category: "Technique",
    duration: "6:58",
    date: "2 Mai 2025",
    thumb: "https://images.unsplash.com/photo-1593280443505-d99d3fb63bfe?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 9,
    title: "Témoignages d'élèves",
    desc: "Nos élèves partagent leur expérience PassPermisFacile et leurs conseils pour décrocher le permis du premier coup.",
    category: "Témoignages",
    duration: "3:52",
    date: "20 Mai 2025",
    thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

/* ─── Category badge color map ───────────────────────── */
const categoryColors = {
  "Examen":      { bg: "#fff0e0", color: "#d97706" },
  "Conseils":    { bg: "#e0f2fe", color: "#0284c7" },
  "Manœuvres":   { bg: "#fce7f3", color: "#db2777" },
  "Pratique":    { bg: "#dcfce7", color: "#16a34a" },
  "Code":        { bg: "#ede9fe", color: "#7c3aed" },
  "Technique":   { bg: "#fef9c3", color: "#ca8a04" },
  "Témoignages": { bg: "#e0f5ee", color: "#69B52D" },
};

/* ─── Card component (inline, no separate file) ─────── */
const VideoCard = ({ video, index, onClick }) => {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const cat = categoryColors[video.category] || { bg: "#f0fce6", color: "#69B52D" };

  return (
    <article
      ref={cardRef}
      className={`vp-card${visible ? " vp-card--visible" : ""}`}
      style={{ "--stagger": `${index * 0.08}s` }}
      onClick={() => onClick(video)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(video)}
      aria-label={`Lire : ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="vp-card__thumb">
        <img
          src={video.thumb}
          alt={video.title}
          className="vp-card__img"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="vp-card__overlay" />

        {/* Play button */}
        <div className="vp-card__play" aria-hidden="true">
          <FaPlay className="vp-card__play-icon" />
        </div>

        {/* Duration badge */}
        <span className="vp-card__duration">
          <FaClock className="vp-card__duration-icon" />
          {video.duration}
        </span>
      </div>

      {/* Content */}
      <div className="vp-card__body">
        {/* Category */}
        <span
          className="vp-card__category"
          style={{ background: cat.bg, color: cat.color }}
        >
          {video.category}
        </span>

        <h3 className="vp-card__title">{video.title}</h3>
        <p className="vp-card__desc">{video.desc}</p>

        <div className="vp-card__footer">
          <span className="vp-card__date">
            <FaCalendarAlt className="vp-card__date-icon" />
            {video.date}
          </span>
          <span className="vp-card__watch">
            Regarder <FaChevronRight className="vp-card__watch-icon" />
          </span>
        </div>
      </div>
    </article>
  );
};

/* ─── Modal ──────────────────────────────────────────── */
const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="vp-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div
        className="vp-modal__inner"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="vp-modal__close"
          onClick={onClose}
          aria-label="Fermer la vidéo"
        >
          <FaTimes />
        </button>
        <div className="vp-modal__video-wrap">
          <iframe
            src={`${video.videoUrl}?autoplay=1&rel=0`}
            title={video.title}
            className="vp-modal__iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="vp-modal__info">
          <span className="vp-modal__category">
            {video.category}
          </span>
          <h3 className="vp-modal__title">{video.title}</h3>
          <p className="vp-modal__desc">{video.desc}</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────── */
const VideoPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeroVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const openModal  = useCallback(v  => setActiveVideo(v), []);
  const closeModal = useCallback(() => setActiveVideo(null), []);

  return (
    <>
      <Navbar />

      <main className="vp-page">

        {/* Decorative background blobs */}
        <div className="vp-blob vp-blob--1" aria-hidden="true" />
        <div className="vp-blob vp-blob--2" aria-hidden="true" />
        <div className="vp-blob vp-blob--3" aria-hidden="true" />

        {/* ══════════════ HERO ══════════════ */}
        <section
          ref={heroRef}
          className={`vp-hero${heroVisible ? " vp-hero--visible" : ""}`}
        >
          <div className="vp-hero__badge">
            <span className="vp-hero__badge-dot" aria-hidden="true" />
            ▶ Vidéos pédagogiques
          </div>

          <h1 className="vp-hero__heading">
            Leçons de conduite &{" "}
            <span className="vp-hero__heading-green">
              histoires de réussite
            </span>
          </h1>

          <p className="vp-hero__sub">
            Regardez des conseils de conduite, des leçons pratiques, des guides
            pour l'examen et des témoignages de nos moniteurs pour vous préparer
            avec confiance.
          </p>
        </section>

        {/* ══════════════ GRID ══════════════ */}
        <section className="vp-grid-section">
          <div className="vp-grid">
            {videos.map((v, i) => (
              <VideoCard
                key={v.id}
                video={v}
                index={i}
                onClick={openModal}
              />
            ))}
          </div>
        </section>

      </main>

      {/* Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={closeModal} />
      )}

      <Footer />
    </>
  );
};

export default VideoPage;
