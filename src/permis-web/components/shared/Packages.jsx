import React, { useEffect, useRef, useState } from "react";
import "./Packages.css";
import { FaArrowRight, FaCar, FaCheck, FaClock, FaGift } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import greenCar from "../../assets/green-car.jpeg";
import redCar from "../../assets/red-car.jpeg";

const TABS = [
  { id: "all",        label: "Tous" },
  { id: "manual",    label: "Boîte Manuelle" },
  { id: "automatic", label: "Boîte Automatique" },
];

function plainText(value) {
  if (value === null || value === undefined) return "";
  const source = String(value);
  if (typeof window === "undefined") return source.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const documentNode = new DOMParser().parseFromString(source, "text/html");
  return (documentNode.body.textContent || "").replace(/\s+/g, " ").trim();
}

function featureTexts(value) {
  if (Array.isArray(value)) return value.map(plainText).filter(Boolean);
  if (typeof value !== "string") return [];

  const documentNode = new DOMParser().parseFromString(value, "text/html");
  const items = Array.from(documentNode.querySelectorAll("li"))
    .map((item) => plainText(item.textContent))
    .filter(Boolean);

  return items.length ? items : plainText(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

const Packages = ({
  packages     = [],
  title        = "CHOISISSEZ LA FORMULE QUI VOUS CONVIENT",
  subtitle     = "",
  showSubtitle = false,
  showTabs     = false,
  showCpfFilter = false,
  loading = false,
  error = "",
}) => {
  const sectionRef = useRef(null);
  const [visible,   setVisible]   = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [switching, setSwitching] = useState(false);
  const [cpfFilter, setCpfFilter] = useState("with-code");
  const { addItem } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -100px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTab = (tabId) => {
    if (tabId === activeTab) return;
    setSwitching(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setSwitching(false);
    }, 180);
  };

  const normalizeApiOffer = (offer) => {
    const automatic = Number(offer.is_auto) === 1;
    const requestedColor = String(offer.color || "");
    const color = /^#[0-9a-f]{6}$/i.test(requestedColor)
      ? requestedColor
      : automatic ? "#0E9F6E" : "#2563EB";
    const rawFeatures = featureTexts(offer.caracteristiques);
    const price = offer.final_price ?? offer.discounted_price ?? offer.price_ht ?? offer.original_price ?? 0;

    return {
      ...offer,
      type: automatic ? "automatic" : "manual",
      badge: offer.type_offre || (automatic ? "AUTOMATIQUE" : "MANUELLE"),
      badgeColor: color,
      accent: color,
      accentLight: `${color}18`,
      gradStart: `${color}2E`,
      car: automatic ? greenCar : redCar,
      carAlt: offer.name || "Formule permis",
      packLabel: "FORMULE",
      packName: offer.name || "Permis",
      packSub: plainText(offer.description) || "Une formule adaptée à votre formation.",
      packIcon: FaCar,
      hours: offer.balance ? `${offer.balance}h` : "",
      features: rawFeatures.length ? rawFeatures.map((text) => ({ text: String(text), highlight: false })) : [{ text: offer.description || "Formation personnalisée", highlight: false }],
      checkColor: color,
      price: `${price}€`,
      priceSub: offer.multi_payment ? "Paiement possible en plusieurs fois" : "Formation",
      bonus: typeof offer.options === "string" ? plainText(offer.options) : "Accompagnement personnalisé inclus.",
      bonusIcon: FaGift,
      bonusBg: `${color}12`,
      btnLabel: "Choisir cette formule",
    };
  };

  const normalizedPackages = packages.map((pkg) => Object.prototype.hasOwnProperty.call(pkg, "is_auto") ? normalizeApiOffer(pkg) : pkg);

  /* Filter only when tabs are active */
  const visiblePackages = normalizedPackages.filter(pkg => {
    const typeMatch = showTabs ? (activeTab === "all" || pkg.type === activeTab) : true;
    const cpfMatch = showCpfFilter ? pkg.cpfType === cpfFilter : true;
    return typeMatch && cpfMatch;
  });

  return (
    <section className="pkg-section" ref={sectionRef}>

      {/* ── Section heading ── */}
      <div className={`pkg-heading ${visible ? "pkg-heading--visible" : ""}`}>
        <span className="pkg-heading__line pkg-heading__line--blue" />
        <h2 className="pkg-heading__text">{title}</h2>
        <span className="pkg-heading__line pkg-heading__line--red" />
      </div>

      {/* ── Optional subtitle (Packages page only) ── */}
      {showSubtitle && subtitle && (
        <p className={`pkg-subtitle ${visible ? "pkg-subtitle--visible" : ""}`}>
          {subtitle}
        </p>
      )}

      {/* ── Premium tabs (Packages page only) ── */}
      {showTabs && (
        <div className={`pkg-tabs ${visible ? "pkg-tabs--visible" : ""}`}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`pkg-tabs__btn${activeTab === tab.id ? " pkg-tabs__btn--active" : ""}`}
              onClick={() => handleTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── CPF filter (CPF page only) ── */}
      {showCpfFilter && (
        <div className={`pkg-cpf-filter ${visible ? "pkg-cpf-filter--visible" : ""}`}>
          <button
            className={`pkg-cpf-filter__btn${cpfFilter === "with-code" ? " pkg-cpf-filter__btn--active" : ""}`}
            onClick={() => setCpfFilter("with-code")}
          >
            Avec Code
          </button>
          <button
            className={`pkg-cpf-filter__btn${cpfFilter === "without-code" ? " pkg-cpf-filter__btn--active" : ""}`}
            onClick={() => setCpfFilter("without-code")}
          >
            Sans Code
          </button>
        </div>
      )}

      {/* ── Cards grid ── */}
      <div className={`pkg-grid${switching ? " pkg-grid--switching" : ""}`}>
        {error && <p className="pkg-subtitle">{error}</p>}
        {loading && <p className="pkg-subtitle">Chargement des formules…</p>}
        {!loading && !error && visiblePackages.length === 0 && <p className="pkg-subtitle">Aucune formule disponible.</p>}
        {visiblePackages.map((pkg, i) => {
          const PackIcon  = pkg.packIcon;
          const BonusIcon = pkg.bonusIcon;

          return (
          <div
            key={pkg.id}
            className={`pkg-card ${visible && !switching ? "pkg-card--visible" : ""} ${pkg.popular ? "pkg-card--popular" : ""}`}
            style={{
              "--accent":       pkg.accent,
              "--accent-light": pkg.accentLight,
              "--grad-start":   pkg.gradStart,
              "--delay":        `${i * 0.08}s`,
            }}
          >
            {/* Corner gradient glow */}
            <div className="pkg-card__glow" />

            {/* Badge */}
            <div
              className="pkg-card__badge"
              style={{ background: pkg.badgeColor }}
            >
              {pkg.badge}
            </div>

            {/* Vehicle image */}
            <div className="pkg-card__car-wrap">
              <img src={pkg.car} alt={pkg.carAlt} className="pkg-card__car" />
            </div>

            {/* Pack label row — icon + PACK / NAME only, no hours here */}
            <div className="pkg-card__pack-row">
              <span
                className="pkg-card__pack-icon"
                style={{ background: pkg.accentLight, color: pkg.accent }}
              >
                <PackIcon />
              </span>
              <div>
                <p className="pkg-card__pack-label">{pkg.packLabel}</p>
                <p className="pkg-card__pack-name" style={{ color: pkg.accent }}>
                  {pkg.packName}
                </p>
              </div>
            </div>

            {/* Subtitle */}
            <p className="pkg-card__pack-sub">{pkg.packSub}</p>

            {/* ── Premium Hours card — only when pkg.hours is defined ── */}
            {pkg.hours && (
              <div
                className="pkg-card__hours-card"
                style={{
                  background: pkg.accentLight,
                  borderColor: `color-mix(in srgb, ${pkg.accent} 30%, transparent)`,
                }}
              >
                <div className="pkg-card__hours-icon-wrap" style={{ color: pkg.accent }}>
                  <FaClock />
                </div>
                <div className="pkg-card__hours-body">
                  <span className="pkg-card__hours-value" style={{ color: pkg.accent }}>
                    {pkg.hours.toUpperCase()} HEURES
                  </span>
                  <span className="pkg-card__hours-label">de conduite</span>
                </div>
              </div>
            )}

            {/* Feature list */}
            <ul className="pkg-card__features">
              {pkg.features.map((f, fi) => (
                <li key={fi} className="pkg-card__feature">
                  <span
                    className="pkg-card__check"
                    style={{ color: pkg.checkColor }}
                  >
                    <FaCheck />
                  </span>
                  <span className={f.highlight ? "pkg-card__feature-text pkg-card__feature-text--bold" : "pkg-card__feature-text"}>
                    {f.text}
                    {f.sub && (
                      <span className="pkg-card__feature-sub">{f.sub}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {/* Dotted divider */}
            <div
              className="pkg-card__divider"
              style={{ borderColor: pkg.accent }}
            />

            {/* Price */}
            <div className="pkg-card__price-row">
              <span className="pkg-card__price" style={{ color: pkg.accent }}>
                {pkg.price}
              </span>
              <span className="pkg-card__price-sub">{pkg.priceSub}</span>
            </div>

            {/* Bonus row */}
            <div
              className="pkg-card__bonus"
              style={{ background: pkg.bonusBg }}
            >
              <span
                className="pkg-card__bonus-icon"
                style={{ color: pkg.accent }}
              >
                <BonusIcon />
              </span>
              <span className="pkg-card__bonus-label">
                <strong>BONUS</strong> {pkg.bonus}
              </span>
            </div>

            {/* CTA button */}
            <button
              className="pkg-card__btn"
              style={{ background: pkg.accent }}
              onClick={() => addItem({
                id: pkg.id,
                title: `${pkg.packLabel} ${pkg.packName}`,
                image: pkg.car,
                price: parseFloat(pkg.price.replace('€', '').replace(',', '.')),
                type: pkg.type,
                balance: Number(pkg.balance || 0),
                installments: Number(pkg.installments || 1),
                paymentAmount: Number(pkg.paymentAmount || pkg.price || 0),
                quantity: 1
              })}
            >
              {pkg.btnLabel}
              <span className="pkg-card__btn-arrow">
                <FaArrowRight />
              </span>
            </button>
          </div>
          );
        })}
      </div>
    </section>
  );
};

export default Packages;
