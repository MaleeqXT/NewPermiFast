import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/logo.webp";

/* ─── Icon components ───────────────────────────────── */
const PhoneIcon = () => (
  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 11.5 19.79 19.79 0 01.79 2.87 2 2 0 012.76 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.73a16 16 0 006.36 6.36l1.09-1.1a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#55B126" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#55B126" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MailIcon = () => (
  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#55B126" strokeWidth="1.8"/>
    <path d="M2 7l10 7 10-7" stroke="#55B126" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#55B126" strokeWidth="1.8"/>
    <circle cx="12" cy="9" r="2.5" stroke="#55B126" strokeWidth="1.8"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Social icons */
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#17233D" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke="#17233D" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1" fill="#17233D"/>
  </svg>
);

const TikTokIconDark = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#17233D">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#17233D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="#17233D" strokeWidth="2"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="#17233D" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

/* ─── Data ──────────────────────────────────────────── */
const menuAutoEcole = [
  { label: "Accueil",      to: "/"               },
  { label: "Nos agences",  to: "/agency-page"    },
  { label: "Services",     to: "/services-page"  },
  { label: "Nos forfaits", to: "/packages-page"  },
  { label: "Vidéos",       to: "/video-page"     },
  { label: "Le Code",      to: "/code-page"      },
  { label: "CPF",          to: "/cpf-page"       },
  { label: "Contact",      to: "/contact-page"   },
  { label: "Se connecter", to: "/login-page"     },
];
const menuFormations = ["Permis B (Voiture)", "Conduite accompagnée", "Conduite supervisée", "Permis Moto", "Boîte automatique", "Code de la route"];
const menuInfos = ["Financement CPF", "Paiement en 3x ou 4x", "Questions fréquentes", "Documents utiles", "Conditions générales", "Mentions légales"];

/* ─── Component ─────────────────────────────────────── */
const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-container">

        {/* ══════════════════════════════════
            CTA CARD
        ══════════════════════════════════ */}
        <div className="footer-cta-card">
          <div className="footer-cta-left">
            <h2 className="footer-cta-heading">Prêt à passer le permis ?</h2>
            <p className="footer-cta-sub">Rejoignez plus de 1200 élèves satisfaits.</p>
          </div>
          <div className="footer-cta-right">
            <button className="footer-cta-btn">
              JE CHOISIS MON PACK
              <span className="footer-cta-btn-arrow"><ArrowRight /></span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════
            MAIN GRID
        ══════════════════════════════════ */}
        <div className="footer-grid">

          {/* Col 1 — Logo + slogan + flag */}
          <div className="footer-col footer-col--brand">
            <img src={logo} alt="PassPermisFacile" className="footer-logo" />
            <p className="footer-slogan">
              Passer le permis<br />
              devient un jeu d'enfants.
            </p>
            <div className="footer-flag">
              <span className="footer-flag-bar footer-flag-bar--blue" />
              <span className="footer-flag-bar footer-flag-bar--white" />
              <span className="footer-flag-bar footer-flag-bar--red" />
            </div>
          </div>

          {/* Col 2 — Auto-école */}
          <div className="footer-col">
            <h4 className="footer-col-heading">AUTO-ÉCOLE</h4>
            <ul className="footer-menu">
              {menuAutoEcole.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="footer-menu-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Formations */}
          <div className="footer-col">
            <h4 className="footer-col-heading">FORMATIONS</h4>
            <ul className="footer-menu">
              {menuFormations.map(item => (
                <li key={item}><a href="/" className="footer-menu-link">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Infos pratiques */}
          <div className="footer-col">
            <h4 className="footer-col-heading">INFOS PRATIQUES</h4>
            <ul className="footer-menu">
              {menuInfos.map(item => (
                <li key={item}><a href="/" className="footer-menu-link">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Contact */}
          <div className="footer-col footer-col--contact">
            <h4 className="footer-col-heading">NOUS CONTACTER</h4>

            <div className="footer-contact-row">
              <PhoneIcon />
              <div>
                <span className="footer-contact-main">09 70 16 16 16</span>
                <span className="footer-contact-sub">7j/7 - 8h à 20h</span>
              </div>
            </div>

            <div className="footer-contact-row">
              <WhatsAppIcon />
              <div>
                <span className="footer-contact-main">06 05 65 83 88</span>
                <span className="footer-contact-sub">Réponse rapide</span>
              </div>
            </div>

            <div className="footer-contact-row">
              <MailIcon />
              <div>
                <span className="footer-contact-main footer-contact-main--sm">contact@passpermisfacile.fr</span>
              </div>
            </div>

            <div className="footer-contact-row">
              <LocationIcon />
              <div>
                <span className="footer-contact-main footer-contact-main--sm">Siège : Toulouse</span>
                <span className="footer-contact-sub">139 Bd Déodat de Séverac, 31300 Toulouse</span>
              </div>
            </div>
          </div>

        </div>{/* /footer-grid */}

        {/* ══════════════════════════════════
            DIVIDER
        ══════════════════════════════════ */}
        <div className="footer-divider" />

        {/* ══════════════════════════════════
            BOTTOM BAR
        ══════════════════════════════════ */}
        <div className="footer-bottom">

          {/* Left — copyright */}
          <p className="footer-copyright">
            © 2026 PassPermisFacile. Tous droits réservés.
          </p>

          {/* Center — certifications / payment */}
          <div className="footer-badges">
            {/* CPF badge */}
            <div className="footer-badge footer-badge--cpf">
              <span className="footer-badge-cpf-eligible">ÉLIGIBLE</span>
              <span className="footer-badge-cpf-main">CPF</span>
              <span className="footer-badge-cpf-sub">PRÉPARATION ÉLIGIBLE</span>
            </div>

            {/* Qualiopi badge */}
            <div className="footer-badge footer-badge--qualiopi">
              <span className="footer-badge-qualiopi-title">Qualiopi</span>
              <span className="footer-badge-qualiopi-sub">PROCESSUS CERTIFIÉ</span>
              <span className="footer-badge-qualiopi-fr">RÉPUBLIQUE FRANÇAISE</span>
            </div>

            {/* Payment */}
            <div className="footer-badge footer-badge--payment">
              <span className="footer-payment-label">🔒 Paiement sécurisé</span>
              <div className="footer-payment-icons">
                <span className="footer-pay-card footer-pay-card--visa">VISA</span>
                <span className="footer-pay-card footer-pay-card--mc">
                  <span className="footer-mc-circle footer-mc-circle--left" />
                  <span className="footer-mc-circle footer-mc-circle--right" />
                </span>
              </div>
            </div>
          </div>

          {/* Right — social */}
          <div className="footer-social">
            <span className="footer-social-label">Suivez-nous</span>
            <div className="footer-social-icons">
              <a href="/" className="footer-social-btn" aria-label="Instagram"><InstagramIcon /></a>
              <a href="/" className="footer-social-btn" aria-label="TikTok"><TikTokIconDark /></a>
              <a href="/" className="footer-social-btn" aria-label="Facebook"><FacebookIcon /></a>
              <a href="/" className="footer-social-btn" aria-label="YouTube"><YoutubeIcon /></a>
            </div>
          </div>

        </div>{/* /footer-bottom */}

      </div>{/* /footer-container */}
    </footer>
  );
};

export default Footer;
