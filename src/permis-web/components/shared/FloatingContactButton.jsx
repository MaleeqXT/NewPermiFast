import React from "react";
import { Link } from "react-router-dom";
import "./FloatingContactButton.css";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const FloatingContactButton = () => {
  return (
    <nav className="fcb" aria-label="Contact rapide">
      <div className="fcb__actions">
        <a
          href="tel:+33970701616"
          className="fcb__action fcb__action--phone"
          aria-label="Appeler PassPermisFacile au 09 70 70 16 16"
          title="Appeler"
        >
          <span className="fcb__label">Appeler</span>
          <span className="fcb__icon-wrap" aria-hidden="true">
            <FiPhone className="fcb__icon" />
          </span>
        </a>

        <a
          href="https://wa.me/33605658388"
          className="fcb__action fcb__action--whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter PassPermisFacile sur WhatsApp"
          title="WhatsApp"
        >
          <span className="fcb__label">WhatsApp</span>
          <span className="fcb__icon-wrap" aria-hidden="true">
            <FaWhatsapp className="fcb__icon" />
          </span>
        </a>

        <Link
          to="/contact-page"
          className="fcb__action fcb__action--contact"
          aria-label="Ouvrir la page de contact"
          title="Nous écrire"
        >
          <span className="fcb__label">Nous écrire</span>
          <span className="fcb__icon-wrap" aria-hidden="true">
            <FiMail className="fcb__icon" />
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default FloatingContactButton;
