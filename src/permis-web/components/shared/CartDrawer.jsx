import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./CartDrawer.css";
import { useCart } from "../../context/CartContext";
import {
  FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingCart,
  FaArrowRight, FaCheck,
} from "react-icons/fa";

const CartDrawer = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const {
    items, totalQty, totalPrice,
    removeItem, increment, decrement, clearCart,
    drawerOpen, closeDrawer,
  } = useCart();

  /* Lock body scroll while open */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  const fmt = (n) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  const handleContinue = () => {
    closeDrawer();
    const role = String(user?.role || "").toLowerCase();
    const checkoutState = { cartCheckout: true };

    // Keep the cart in localStorage. After authentication, LoginPage forwards
    // the student directly to Commander where it is rehydrated.
    if (!user) {
      navigate("/login-page", { state: { postLoginPath: "/student-dashboard", ...checkoutState } });
      return;
    }

    if (role === "student") {
      navigate("/student-dashboard", { state: checkoutState });
      return;
    }

    navigate("/login-page");
  };

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className={`cdr-overlay${drawerOpen ? " cdr-overlay--open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Drawer panel ── */}
      <aside
        className={`cdr-drawer${drawerOpen ? " cdr-drawer--open" : ""}`}
        aria-label="Panier"
        role="dialog"
      >
        {/* Header */}
        <div className="cdr-header">
          <div className="cdr-header__left">
            <FaShoppingCart className="cdr-header__icon" />
            <div>
              <h2 className="cdr-header__title">Mon panier</h2>
              <span className="cdr-header__count">
                {totalQty === 0
                  ? "Aucun service"
                  : `${totalQty} service${totalQty > 1 ? "s" : ""} sélectionné${totalQty > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>
          <button className="cdr-header__close" onClick={closeDrawer} aria-label="Fermer">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="cdr-body">
          {items.length === 0 ? (
            /* Empty state */
            <div className="cdr-empty">
              <div className="cdr-empty__icon">
                <FaShoppingCart />
              </div>
              <p className="cdr-empty__title">Votre panier est vide</p>
              <p className="cdr-empty__sub">
                Ajoutez un service pour commencer.
              </p>
            </div>
          ) : (
            /* Item list */
            <ul className="cdr-list">
              {items.map((item) => (
                <li key={item.id} className="cdr-item">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="cdr-item__image" />
                  ) : (
                    <div className="cdr-item__icon">{item.icon}</div>
                  )}

                  <div className="cdr-item__info">
                    <span className="cdr-item__title">{item.title}</span>
                    <span className="cdr-item__price">{fmt(item.price * item.quantity)}</span>
                  </div>

                  <div className="cdr-item__controls">
                    <button
                      className="cdr-item__qty-btn"
                      onClick={() => decrement(item.id)}
                      aria-label="Diminuer"
                    >
                      <FaMinus />
                    </button>
                    <span className="cdr-item__qty">{item.quantity}</span>
                    <button
                      className="cdr-item__qty-btn"
                      onClick={() => increment(item.id)}
                      aria-label="Augmenter"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    className="cdr-item__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when cart has items */}
        {items.length > 0 && (
          <div className="cdr-footer">
            <div className="cdr-footer__row cdr-footer__row--total">
              <span className="cdr-footer__label">Total TTC</span>
              <span className="cdr-footer__total">{fmt(totalPrice)}</span>
            </div>

            <button className="cdr-footer__cta" onClick={handleContinue}>
              Continuer
              <FaArrowRight className="cdr-footer__cta-arrow" />
            </button>

            <button className="cdr-footer__clear" onClick={clearCart}>
              Vider le panier
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
