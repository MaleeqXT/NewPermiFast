import React, { useState } from "react";
import "./LoginPage.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import loginBg from "../assets/login-optimized.jpg";
import cardImg from "../assets/toulouse-pic-optimized.jpg";
import logo from "../assets/logo.webp";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/reducers/authReducer";
import {
  FiMail, FiLock, FiArrowRight, FiShield, FiStar, FiCheckCircle,
} from "react-icons/fi";

/* ── Same role→path mapping as the main LoginPage ── */
function getHomePath(role) {
  switch (String(role ?? "").toLowerCase()) {
    case "admin":     return "/dashboard/general";
    case "super-admin": return "/dashboard/general";
    case "super_admin": return "/dashboard/general";
    case "secretary": return "/secretary-dashboard";
    case "monitor":   return "/monitor-dashboard";
    case "student":   return "/student-dashboard";
    default:          return "/loginpage";
  }
}

const LoginPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Basic client-side validation */
    const errs = {};
    if (!email.trim())    errs.email    = true;
    if (!password.trim()) errs.password = true;
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});

    const result = await dispatch(loginUser({ email, password, remember }));
    if (loginUser.fulfilled.match(result)) {
      const role = String(result.payload.role || "").toLowerCase();
      const requestedPath = location.state?.postLoginPath;
      const continueToCheckout = requestedPath === "/student-dashboard" && role === "student";
      navigate(continueToCheckout ? requestedPath : getHomePath(role), {
        replace: true,
        state: continueToCheckout ? { cartCheckout: true } : undefined,
      });
    }
  };

  return (
    <div className="loginpage-root">
      <div className="loginpage-container">

        {/* ══════════════════════════════
            LEFT COLUMN
        ══════════════════════════════ */}
        <div className="loginpage-left">

          {/* Logo */}
          <NavLink to="/" className="loginpage-logo">
            <img src={logo} alt="PassPermisFacile" decoding="async" />
          </NavLink>

          {/* Eyebrow label */}
          <span className="loginpage-eyebrow">AUTO-ÉCOLE EN LIGNE</span>

          {/* Main heading */}
          <h1 className="loginpage-heading">
            VOTRE RÉUSSITE<br />
            <span className="loginpage-heading-green">
              COMMENCE ICI.
              <span className="loginpage-heading-underline" aria-hidden="true" />
            </span>
          </h1>

          {/* Premium info paragraph */}
          <p className="loginpage-info">
            Chez Pass Permis Facile, nous accompagnons chaque élève avec une
            méthode moderne, des moniteurs expérimentés et un suivi personnalisé
            jusqu'à l'obtention du permis.
          </p>

          {/* Bottom image card */}
          <div className="loginpage-card">
            <img
              src={cardImg}
              alt="Agence PassPermisFacile"
              className="loginpage-card__img"
              loading="lazy"
              decoding="async"
            />
            <div className="loginpage-card__overlay" aria-hidden="true" />
            <div className="loginpage-card__body">
              <div className="loginpage-card__left">
                <span className="loginpage-card__label">À propos</span>
                <h3 className="loginpage-card__title">
                  Pourquoi choisir<br />Pass Permis Facile ?
                </h3>
              </div>
              <div className="loginpage-card__right">
                <p className="loginpage-card__text">
                  Plus de 1200 élèves accompagnés, une pédagogie moderne,
                  des résultats reconnus et un accompagnement personnalisé
                  jusqu'à votre examen.
                </p>
                <NavLink to="/" className="loginpage-card__link">
                  En savoir plus <FiArrowRight />
                </NavLink>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════
            RIGHT COLUMN
        ══════════════════════════════ */}
        <div className="loginpage-right">

          {/* Background image */}
          <img
            src={loginBg}
            alt=""
            className="loginpage-right__bg"
            aria-hidden="true"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="loginpage-right__overlay" aria-hidden="true" />

          {/* Text above the form */}
          <div className="loginpage-right__hero">
            <h2 className="loginpage-right__hero-title">PASS PERMIS FACILE</h2>
            <p className="loginpage-right__hero-sub">Votre réussite commence ici.</p>
          </div>

          {/* Floating login form card */}
          <div className="loginpage-form-card">
            <h3 className="loginpage-form-title">Bienvenue !</h3>
            <p className="loginpage-form-sub">Connectez-vous à votre espace.</p>

            {/* Redux / server error */}
            {error && (
              <div className="loginpage-error-banner">
                {error?.message || error?.email?.[0] || "Échec de la connexion"}
              </div>
            )}

            <form className="loginpage-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="loginpage-field">
                <label className="loginpage-field__label" htmlFor="pw-lp-email">
                  Email
                </label>
                <div className={`loginpage-field__wrap${fieldErrors.email ? " loginpage-field__wrap--error" : ""}`}>
                  <FiMail className="loginpage-field__icon" aria-hidden="true" />
                  <input
                    id="pw-lp-email"
                    type="email"
                    className="loginpage-field__input"
                    placeholder="votremail@exemple.fr"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: false })); }}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="loginpage-field">
                <label className="loginpage-field__label" htmlFor="pw-lp-password">
                  Mot de passe
                </label>
                <div className={`loginpage-field__wrap${fieldErrors.password ? " loginpage-field__wrap--error" : ""}`}>
                  <FiLock className="loginpage-field__icon" aria-hidden="true" />
                  <input
                    id="pw-lp-password"
                    type={showPass ? "text" : "password"}
                    className="loginpage-field__input"
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: false })); }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="loginpage-field__toggle"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPass ? "Masquer" : "Afficher"}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="loginpage-form__row">
                <label className="loginpage-remember">
                  <input
                    type="checkbox"
                    className="loginpage-remember__checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span className="loginpage-remember__box" aria-hidden="true" />
                  <span className="loginpage-remember__label">Se souvenir de moi</span>
                </label>
                <NavLink to="/forgot-password" className="loginpage-forgot">
                  Mot de passe oublié ?
                </NavLink>
              </div>

              {/* Submit */}
              <button type="submit" className="loginpage-btn" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>

            </form>
          </div>

          {/* Bottom info bar */}
          <div className="loginpage-bottom-bar">
            <div className="loginpage-stat">
              <FiCheckCircle className="loginpage-stat__icon" />
              <span>Plus de 1200 élèves accompagnés</span>
            </div>
            <div className="loginpage-stat-divider" aria-hidden="true" />
            <div className="loginpage-stat">
              <FiStar className="loginpage-stat__icon" />
              <span>4,8 / 5 · Avis vérifiés</span>
            </div>
            <div className="loginpage-stat-divider" aria-hidden="true" />
            <div className="loginpage-stat">
              <FiShield className="loginpage-stat__icon" />
              <span>Connexion sécurisée</span>
            </div>
          </div>

        </div>{/* /right */}

      </div>{/* /container */}
    </div>
  );
};

export default LoginPage;
