import React, { useRef, useState, useEffect } from "react";
import "./Comments.css";

/* ─── Data ─────────────────────────────────────────── */
const googleReviews = [
  {
    id: 1,
    name: "Manon B.",
    time: "Il y a 3 semaines",
    initials: "M",
    color: "#67B933",
    text: "Équipe au top, moniteurs très pédagogues et à l'écoute. J'ai eu mon permis du premier coup, merci !",
  },
  {
    id: 2,
    name: "Yanis L.",
    time: "Il y a 1 mois",
    initials: "Y",
    color: "#F59E0B",
    text: "Dates d'examens rapides et super accompagnement. Je recommande à 100% !",
  },
  {
    id: 3,
    name: "Sarah D.",
    time: "Il y a 1 mois",
    initials: "S",
    color: "#8B5CF6",
    text: "Auto-école sérieuse, disponible et très professionnelle. Merci pour tout !",
  },
  {
    id: 4,
    name: "Lucas M.",
    time: "Il y a 3 semaines",
    initials: "L",
    color: "#2563EB",
    text: "Permis obtenu grâce à une équipe motivante et des cours clairs et efficaces.",
  },
  {
    id: 5,
    name: "Aya K.",
    time: "Il y a 2 mois",
    initials: "A",
    color: "#EC4899",
    text: "Je recommande vivement ! Une équipe bienveillante et des résultats au rendez-vous.",
  },
  {
    id: 6,
    name: "Théo R.",
    time: "Il y a 2 semaines",
    initials: "T",
    color: "#14B8A6",
    text: "Formation sérieuse et bien structurée. Les moniteurs sont patients et très compétents.",
  },
];

const tiktokReviews = [
  {
    id: 1,
    user: "@theo_ppf",
    title: "Permis obtenu ! Merci à toute l'équipe",
    likes: "12,5K",
    thumbnail: null,
    bg: "linear-gradient(160deg,#1a1a2e,#16213e)",
  },
  {
    id: 2,
    user: "@spariis",
    title: "Super auto-école, je recommande à 100% !",
    likes: "9,8K",
    thumbnail: null,
    bg: "linear-gradient(160deg,#0f3460,#533483)",
  },
  {
    id: 3,
    user: "@floris_ppf",
    title: "Grâce à eux j'ai eu mon permis du 1er coup 🙌",
    likes: "15,2K",
    thumbnail: null,
    bg: "linear-gradient(160deg,#1b262c,#0f4c75)",
  },
  {
    id: 4,
    user: "@nico_permis",
    title: "Équipe au top, pédagogie au rendez-vous !",
    likes: "6,7K",
    thumbnail: null,
    bg: "linear-gradient(160deg,#2d6a4f,#1b4332)",
  },
  {
    id: 5,
    user: "@marouan_",
    title: "Je suis trop contente ! Merci PassPermisFacile 🎉",
    likes: "10,2K",
    thumbnail: null,
    bg: "linear-gradient(160deg,#7b2d8b,#4a0e8f)",
  },
  {
    id: 6,
    user: "@nasser_el",
    title: "Des moniteurs en or et des résultats !",
    likes: "7,6K",
    thumbnail: null,
    bg: "linear-gradient(160deg,#b5451b,#6b2737)",
  },
];

const stats = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="review-stat-icon">
        <circle cx="12" cy="12" r="10" stroke="#67B933" strokeWidth="1.8" />
        <path d="M8 12s1.5 2 4 2 4-2 4-2" stroke="#67B933" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="10" r="1" fill="#67B933" />
        <circle cx="15" cy="10" r="1" fill="#67B933" />
      </svg>
    ),
    value: "95%",
    label: "de satisfaction",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="review-stat-icon">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#67B933" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    value: "Des élèves",
    label: "accompagnés et écoutés",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="review-stat-icon">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#67B933" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    value: "La réussite",
    label: "est notre priorité",
  },
];

/* ─── Sub-components ────────────────────────────────── */
const Avatar = ({ initials, color }) => (
  <div className="review-avatar" style={{ background: color }}>{initials}</div>
);

const Stars = ({ count = 5 }) => (
  <div className="review-stars">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="review-star">★</span>
    ))}
  </div>
);

const GoogleG = ({ size = 24 }) => (
  <svg className="review-google-g" width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const TikTokIcon = ({ size = 20, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z"/>
  </svg>
);

/* Static section label: line — icon + text — line */
const SectionLabel = ({ children }) => (
  <div className="review-section-label">
    <span className="review-section-label__line" />
    <span className="review-section-label__content">{children}</span>
    <span className="review-section-label__line" />
  </div>
);

/* Carousel nav hook */
const useCarousel = (total, visible) => {
  const [index, setIndex] = useState(0);
  const max = Math.max(0, total - visible);
  return {
    index,
    prev: () => setIndex(i => Math.max(0, i - 1)),
    next: () => setIndex(i => Math.min(max, i + 1)),
    canPrev: index > 0,
    canNext: index < max,
  };
};

/* ─── Main ──────────────────────────────────────────── */
const Comments = () => {
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

  const gCarousel = useCarousel(googleReviews.length, 5);
  const tCarousel = useCarousel(tiktokReviews.length, 5);

  return (
    <section
      className={`review-section${visible ? " review-section--visible" : ""}`}
      ref={sectionRef}
    >
      <div className="review-container">

        {/* ── Top Badge ── */}
        <div className="review-badge">
          <span className="review-badge-star">⭐</span>
          <span className="review-badge-text">AVIS GOOGLE</span>
        </div>

        {/* ── Heading ── */}
        <h2 className="review-heading">
          Ils ont obtenu leur permis<br />
          avec <span className="review-heading-green">PassPermisFacile</span>
        </h2>

        {/* ── Stats row ── */}
        <div className="review-stats-row">
          <div className="review-google-score">
            <GoogleG size={52} />
            <div className="review-google-score-right">
              <span className="review-google-score-num">4,8/5</span>
              <Stars />
              <span className="review-google-score-label">+200 avis certifiés</span>
            </div>
          </div>

          <div className="review-stats-divider" />

          {stats.map((s, i) => (
            <div key={i} className="review-stat">
              {s.icon}
              <div className="review-stat-content">
                <span className="review-stat-value">{s.value}</span>
                <span className="review-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── AVIS GOOGLE label ── */}
        <SectionLabel>
          <GoogleG size={18} />
          AVIS GOOGLE
        </SectionLabel>

        {/* ── Google carousel ── */}
        <div className="review-carousel-wrap">
          <button
            className="review-nav-btn"
            onClick={gCarousel.prev}
            disabled={!gCarousel.canPrev}
            aria-label="Précédent"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M15 18l-6-6 6-6" stroke="#18233D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="review-carousel">
            <div
              className="review-carousel-track"
              style={{ transform: `translateX(calc(-${gCarousel.index} * (var(--g-card-w) + 16px)))` }}
            >
              {googleReviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-card-top">
                    <Avatar initials={r.initials} color={r.color} />
                    <div className="review-card-meta">
                      <span className="review-card-name">{r.name}</span>
                      <span className="review-card-time">{r.time}</span>
                    </div>
                  </div>
                  <Stars />
                  <p className="review-card-text">{r.text}</p>
                  <div className="review-card-footer">
                    <span className="review-verified">✓ Avis vérifié</span>
                    <GoogleG size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="review-nav-btn"
            onClick={gCarousel.next}
            disabled={!gCarousel.canNext}
            aria-label="Suivant"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M9 18l6-6-6-6" stroke="#18233D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ── AVIS VIDÉO TIKTOK label ── */}
        <SectionLabel>
          <TikTokIcon size={18} color="#18233D" />
          AVIS VIDÉO TIKTOK
        </SectionLabel>

        {/* ── TikTok carousel ── */}
        <div className="review-carousel-wrap">
          <button
            className="review-nav-btn"
            onClick={tCarousel.prev}
            disabled={!tCarousel.canPrev}
            aria-label="Précédent"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M15 18l-6-6 6-6" stroke="#18233D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="review-carousel review-carousel--tiktok">
            <div
              className="review-carousel-track"
              style={{ transform: `translateX(calc(-${tCarousel.index} * (var(--t-card-w) + 16px)))` }}
            >
              {tiktokReviews.map(r => (
                <div
                  key={r.id}
                  className="review-tiktok-card"
                  style={r.thumbnail ? {} : { background: r.bg }}
                >
                  {/* Real thumbnail when provided */}
                  {r.thumbnail && (
                    <img
                      src={r.thumbnail}
                      alt={r.title}
                      className="review-tiktok-thumb"
                    />
                  )}

                  {/* TikTok logo top-left */}
                  <div className="review-tiktok-logo">
                    <TikTokIcon size={16} color="white" />
                  </div>

                  {/* Play button center */}
                  <div className="review-play-btn">
                    <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  {/* Bottom overlay */}
                  <div className="review-tiktok-overlay">
                    <span className="review-tiktok-user">{r.user}</span>
                    <span className="review-tiktok-title">{r.title}</span>
                    <span className="review-tiktok-likes">
                      <span className="review-tiktok-heart">♥</span>
                      {r.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="review-nav-btn"
            onClick={tCarousel.next}
            disabled={!tCarousel.canNext}
            aria-label="Suivant"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M9 18l6-6-6-6" stroke="#18233D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Comments;
