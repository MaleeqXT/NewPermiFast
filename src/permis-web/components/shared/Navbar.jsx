import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { useCart } from "../../context/CartContext";
import {
  FiShoppingBag,
  FiX,
  FiMenu,
  FiArrowRight,
  FiUser,
  FiCalendar,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";

/* ── Nav links config ───────────────────────────────── */
const NAV_LINKS = [
  { label: "Accueil",     to: "/"               },
  { label: "Nos agences", to: "/agency-page"    },
  { label: "Services",    to: "/services-page"  },
  { label: "Nos forfaits",to: "/packages-page"  },
  { label: "Le Code",     to: "/code-page"       },
  { label: "Vidéos",      to: "/video-page"     },
  { label: "CPF",         to: "/cpf-page"       },
  { label: "Contact",     to: "/contact-page"   },
];

/* ── Fake auth state (replace with your real auth) ─── */
const useFakeAuth = () => {
  // Set to an object with `name` and `avatar` when logged in, or null when logged out
  const [user] = useState(null);
  return user;
};

const Navbar = () => {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const avatarRef = useRef(null);

  const { totalQty, openDrawer } = useCart();
  const user = useFakeAuth();

  /* Close avatar dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ════════════════ DESKTOP HEADER ════════════════ */}
      <header className="nav-bar">
        <div className="nav-bar__inner">

          {/* Logo */}
          <NavLink to="/" className="nav-bar__logo" aria-label="Accueil">
            <img src={logo} alt="PassPermisFacile" />
          </NavLink>

          {/* Desktop nav links */}
          <nav className="nav-bar__links" aria-label="Navigation principale">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to + label}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  "nav-bar__link" + (isActive ? " nav-bar__link--active" : "")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="nav-bar__actions">

            {/* Cart */}
            <button
              className="nav-bar__cart"
              onClick={openDrawer}
              aria-label="Ouvrir le panier"
            >
              <FiShoppingBag className="nav-bar__cart-icon" />
              {totalQty > 0 && (
                <span className="nav-bar__cart-badge" key={totalQty}>
                  {totalQty}
                </span>
              )}
            </button>

            {/* Avatar — only when logged in */}
            {user && (
              <div className="nav-bar__avatar-wrap" ref={avatarRef}>
                <button
                  className="nav-bar__avatar"
                  onClick={() => setAvatarOpen(v => !v)}
                  aria-label="Menu utilisateur"
                  aria-expanded={avatarOpen}
                >
                  <img src={user.avatar} alt={user.name} />
                </button>

                {/* Dropdown */}
                <div className={`nav-bar__dropdown${avatarOpen ? " nav-bar__dropdown--open" : ""}`}>
                  <div className="nav-bar__dropdown-name">{user.name}</div>
                  <div className="nav-bar__dropdown-divider" />
                  <NavLink to="/profile"       className="nav-bar__dropdown-item" onClick={() => setAvatarOpen(false)}><FiUser />       Profil</NavLink>
                  <NavLink to="/reservations"  className="nav-bar__dropdown-item" onClick={() => setAvatarOpen(false)}><FiCalendar />  Mes réservations</NavLink>
                  <NavLink to="/orders"        className="nav-bar__dropdown-item" onClick={() => setAvatarOpen(false)}><FiPackage />   Commandes</NavLink>
                  <div className="nav-bar__dropdown-divider" />
                  <button className="nav-bar__dropdown-item nav-bar__dropdown-logout"><FiLogOut /> Déconnexion</button>
                </div>
              </div>
            )}

            {/* Login button */}
            <NavLink to="/login-page" className="nav-bar__contact">
              Se connecter
              <FiArrowRight className="nav-bar__contact-arrow" />
            </NavLink>

            {/* Hamburger */}
            <button
              className="nav-bar__hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <span className="nav-bar__ham-line" />
              <span className="nav-bar__ham-line nav-bar__ham-line--mid" />
              <span className="nav-bar__ham-line" />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════ MOBILE OVERLAY ════════════════ */}
      <div
        className={`nav-overlay${menuOpen ? " nav-overlay--show" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ════════════════ MOBILE PANEL ════════════════ */}
      <aside
        className={`nav-panel${menuOpen ? " nav-panel--open" : ""}`}
        aria-label="Menu mobile"
      >
        {/* Panel header */}
        <div className="nav-panel__header">
          <NavLink to="/" className="nav-panel__logo" onClick={closeMenu}>
            <img src={logo} alt="PassPermisFacile" />
          </NavLink>
          <button
            className="nav-panel__close"
            onClick={closeMenu}
            aria-label="Fermer le menu"
          >
            <FiX />
          </button>
        </div>

        {/* Panel links */}
        <nav className="nav-panel__links" aria-label="Navigation mobile">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to + label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                "nav-panel__link" + (isActive ? " nav-panel__link--active" : "")
              }
              onClick={closeMenu}
            >
              {label}
              <FiArrowRight className="nav-panel__link-arrow" />
            </NavLink>
          ))}
        </nav>

        {/* Panel footer */}
        <div className="nav-panel__footer">
          <NavLink
            to="/login-page"
            className="nav-panel__cta"
            onClick={closeMenu}
          >
             Se connecter 
            <FiArrowRight />
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
