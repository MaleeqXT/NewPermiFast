import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Commander.css";
import FilterDrawer from "./FilterDrawer";
import http from "../helpers/http.jsx";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIP_PUBLISHABLE;

const OFFERS = [
  {
    id: 1,
    name: "Pass permis Turbo 20H BM",
    shortName: "Turbo 20H",
    description:
      "Besoin d'une formation intensive de 2 semaines à 45 jours ? Ou d'un pack complet pour bien maîtriser la conduite rapidement ? Ce pack vous conviendra parfaitement.",
    price: 1490,
    paymentLabel: "Paiement en 2 fois",
    paymentAmount: 745,
    features: [
      "Formation intensive 2 semaines a 45 jours",
      "Accompagnement a l'examen",
      "Sans heure d'évaluation",
    ],
    accent: "#2563eb",
  },
  {
    id: 2,
    name: "Pass permis Accompagne BM",
    shortName: "Accompagne",
    description: "20H + 4H RDV pedagogique",
    price: 1290,
    paymentLabel: "Paiement en 3 fois",
    paymentAmount: 430,
    features: [
      "Constitution du dossier",
      "Code en ligne inclus",
      "Évaluation de départ",
    ],
    accent: "#c9a64b",
  },
  {
    id: 3,
    name: "Pass permis Code (Intensif)",
    shortName: "Code",
    description:
      "Besoin d'avoir accès au code en ligne en intensif (10h en 1 semaine) ? Ce pack vous conviendra parfaitement.",
    price: 190,
    paymentLabel: "Offre intensive",
    paymentAmount: 190,
    features: [
      "INTENSIF - 10h en 1 semaine",
      "200 séries / 2 000 questions",
      "10 thématiques officielles",
    ],
    accent: "#0f172a",
  },
  {
    id: 4,
    name: "Pass permis Turbo 20H BM",
    shortName: "Turbo 20H",
    description:
      "Besoin d'une formation intensive de 2 semaines à 45 jours ? Ou d'un pack complet pour bien maîtriser la conduite rapidement ? Ce pack vous conviendra parfaitement.",
    price: 1490,
    paymentLabel: "Paiement en 2 fois",
    paymentAmount: 745,
    features: [
      "Formation intensive 2 semaines a 45 jours",
      "Accompagnement a l'examen",
      "Sans heure d'évaluation",
    ],
    accent: "#2563eb",
  },
  {
    id: 5,
    name: "Pass permis Accompagne BM",
    shortName: "Accompagne",
    description: "20H + 4H RDV pedagogique",
    price: 1290,
    paymentLabel: "Paiement en 3 fois",
    paymentAmount: 430,
    features: [
      "Constitution du dossier",
      "Code en ligne inclus",
      "Évaluation de départ",
    ],
    accent: "#c9a64b",
  },
  {
    id: 6,
    name: "Pass permis Code (Intensif)",
    shortName: "Code",
    description:
      "Besoin d'avoir accès au code en ligne en intensif (10h en 1 semaine) ? Ce pack vous conviendra parfaitement.",
    price: 190,
    paymentLabel: "Offre intensive",
    paymentAmount: 190,
    features: [
      "INTENSIF - 10h en 1 semaine",
      "200 séries / 2 000 questions",
      "10 thématiques officielles",
    ],
    accent: "#0f172a",
  },
];

const STUDENT = {
  initials: "EE",
  name: "ELIF ELMACIOGLU",
  email: "elmaciogluelif@gmail.com",
  phone: "0616057238",
  idLabel: "834",
  balance: "24h",
};

function formatPrice(amount) {
  const value = Number(amount) || 0;
  return `${value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function plainText(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function offerFeatures(value) {
  if (Array.isArray(value)) return value.map(plainText).filter(Boolean);

  const items = String(value ?? "")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .split(/\n+/)
    .map(plainText)
    .filter(Boolean);

  return items.length ? items : ["Offre disponible dans votre agence"];
}

function toCommanderOffer(offer) {
  const price = Number(offer.final_price ?? offer.discounted_price ?? offer.price_ht ?? offer.original_price) || 0;
  const installments = Math.max(1, Number(offer.multi_payment) || 1);
  const installmentAmount = Number(offer.second_price) || price / installments;
  const name = offer.name || "Offre permis";

  return {
    id: offer.id,
    name,
    shortName: name.replace(/^pass permis\s*/i, "").slice(0, 24) || name,
    description: plainText(offer.description) || "Offre disponible dans votre agence.",
    price,
    paymentLabel: installments > 1 ? `Paiement en ${installments} fois` : "Paiement comptant",
    paymentAmount: installmentAmount,
    installments,
    balance: Number(offer.balance) || 0,
    rawOffer: offer,
    features: offerFeatures(offer.caracteristiques),
    accent: /^#[0-9a-f]{3,8}$/i.test(offer.color || "") ? offer.color : "#2563eb",
  };
}

function loadStripeJs() {
  if (window.Stripe) return Promise.resolve(window.Stripe);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://js.stripe.com/v3/"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Stripe));
      existing.addEventListener("error", () => reject(new Error("Stripe n'a pas pu être chargé.")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve(window.Stripe);
    script.onerror = () => reject(new Error("Stripe n'a pas pu être chargé."));
    document.head.appendChild(script);
  });
}

function StripeCardField({ onReady, onError }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let cardElement;
    let active = true;

    async function mountCard() {
      if (!STRIPE_PUBLISHABLE_KEY) {
        onError("La clé publique Stripe est absente de la configuration frontend.");
        return;
      }

      try {
        const Stripe = await loadStripeJs();
        if (!active || !Stripe || !mountRef.current) return;

        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        const elements = stripe.elements();
        cardElement = elements.create("card", {
          style: {
            base: { color: "#1f2937", fontFamily: "Inter, sans-serif", fontSize: "15px", "::placeholder": { color: "#94a3b8" } },
            invalid: { color: "#dc2626" },
          },
        });
        cardElement.mount(mountRef.current);
        cardElement.on("change", (event) => onError(event.error?.message || ""));
        onReady({ stripe, cardElement });
      } catch (error) {
        onError(error.message || "Stripe n'a pas pu être initialisé.");
      }
    }

    mountCard();
    return () => {
      active = false;
      cardElement?.destroy();
      onReady(null);
    };
  }, [onError, onReady]);

  return <div ref={mountRef} className="cmd-stripe-card" />;
}

function IconCart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function OfferCard({ offer, inCart, onAdd, onRemove }) {
  return (
    <article className={`cmd-offer-card${inCart ? " cmd-offer-card--active" : ""}`}>
      <div className="cmd-offer-banner">
        <div className="cmd-offer-banner-top">
          <span className="cmd-offer-banner-pill" style={{ backgroundColor: `${offer.accent}18`, color: offer.accent }}>
            {offer.paymentLabel}
          </span>
          <span className="cmd-offer-banner-amount">{formatPrice(offer.paymentAmount)}</span>
        </div>
      </div>

      <div className="cmd-offer-logo" style={{ color: offer.accent }}>
        <span>{offer.shortName}</span>
      </div>

      <h3 className="cmd-offer-name">{offer.name}</h3>
      <p className="cmd-offer-description">{offer.description}</p>
      <div className="cmd-offer-price">{formatPrice(offer.price)}</div>

      {inCart ? (
        <button className="cmd-offer-button cmd-offer-button--subtle" onClick={() => onRemove(offer.id)}>
          Retirer du panier
        </button>
      ) : (
        <button className="cmd-offer-button" onClick={() => onAdd(offer)}>
          Ajouter au panier
        </button>
      )}

      <div className="cmd-offer-feature-title">Caractéristiques</div>
      <ul className="cmd-offer-features">
        {offer.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  );
}

function SuccessModal({ count, onClose }) {
  return (
    <div className="cmd-modal-overlay">
      <div className="cmd-modal">
        <div className="cmd-modal-head">
          <IconInfo />
          <span>Ajouté au panier</span>
        </div>
        <div className="cmd-modal-body">
          {count > 1 ? "Les produits ont été ajoutés au panier." : "Le produit a été ajouté au panier."}
        </div>
        <button className="cmd-modal-close" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

function PaymentSuccessModal({ offers, onClose }) {
  return (
    <div className="cmd-modal-overlay">
      <div className="cmd-modal">
        <div className="cmd-modal-head"><IconInfo /><span>Paiement confirmé</span></div>
        <div className="cmd-modal-body">
          Votre paiement a été enregistré. Offre{offers.length > 1 ? "s" : ""} activée{offers.length > 1 ? "s" : ""} : {offers.map((offer) => offer.name).join(", ")}.
        </div>
        <button className="cmd-modal-close" onClick={onClose}>Continuer</button>
      </div>
    </div>
  );
}

function OffersDrawer({ items, total, onClose, onRemove, onCheckout }) {
  return (
    <>
      <div className="cmd-drawer-overlay" onClick={onClose} />
      <aside className="cmd-drawer">
        <div className="cmd-drawer-header">
          <button className="cmd-drawer-link" onClick={onClose}>
            Fermer
          </button>
          <div className="cmd-drawer-title">Mes offres</div>
          <div className="cmd-drawer-spacer" />
        </div>

        <div className="cmd-drawer-body">
          <div className="cmd-cart-list">
            {items.map((item) => (
              <div key={item.id} className="cmd-cart-card">
                <div className="cmd-cart-card-head">
                  <div>
                    <div className="cmd-cart-name">{item.name}</div>
                    <div className="cmd-cart-pill">{item.paymentLabel}</div>
                  </div>
                  <button className="cmd-cart-delete" onClick={() => onRemove(item.id)} aria-label="Supprimer">
                    <IconDelete />
                  </button>
                </div>

                <div className="cmd-cart-price">{formatPrice(item.price)}</div>
                <div className="cmd-cart-installment">{`${formatPrice(item.paymentAmount)} x ${Math.max(1, Math.round(item.price / item.paymentAmount))}`}</div>
                <div className="cmd-cart-student">
                  Étudiant : {STUDENT.name} (ID : {STUDENT.idLabel}, E-mail : {STUDENT.email})
                </div>
              </div>
            ))}
          </div>

          <div className="cmd-drawer-summary">
            <div className="cmd-drawer-row">
              <span>Sous-total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="cmd-drawer-subtext">{`${items.length} offre${items.length > 1 ? "s" : ""}`}</div>
            <div className="cmd-drawer-divider" />
            <div className="cmd-drawer-total-row">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="cmd-drawer-note">
              Confirmez votre panier pour passer a l'etape de paiement et finaliser les offres choisies.
            </p>
          </div>
        </div>

        <div className="cmd-drawer-footer">
          <button className="cmd-drawer-checkout" onClick={onCheckout}>
            Continuer vers le paiement
          </button>
        </div>
      </aside>
    </>
  );
}

function CheckoutPage({ items, total, studentId, onBack, onRemove, onPaymentSuccess }) {
  const [paymentMode, setPaymentMode] = useState("standard");
  const [stripeContext, setStripeContext] = useState(null);
  const [cardholderName, setCardholderName] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const amountToPay = useMemo(() => (
    paymentMode === "split"
      ? items.reduce((sum, item) => sum + Number(item.paymentAmount || item.price || 0), 0)
      : total
  ), [items, paymentMode, total]);

  const handleStripeReady = useCallback((context) => {
    setStripeContext(context);
  }, []);

  const handleStripeError = useCallback((message) => {
    setPaymentError(message || "");
  }, []);

  async function handlePayment() {
    if (!stripeContext?.stripe || !stripeContext?.cardElement) {
      setPaymentError("Le formulaire de carte est en cours de chargement.");
      return;
    }

    if (!cardholderName.trim()) {
      setPaymentError("Veuillez saisir le nom du titulaire de la carte.");
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      const cartData = items.map((item) => {
        const isInstallment = paymentMode === "split" && item.installments > 1;
        const trancheCount = Math.max(1, Number(item.installments) || 1);
        const balance = isInstallment
          ? Math.ceil(Number(item.balance || 0) / trancheCount)
          : Number(item.balance || 0);

        return {
          offer_id: item.id,
          quantity: 1,
          tranches: trancheCount,
          selected_price_type: isInstallment ? "installment" : "final",
          ...(isInstallment ? { selected_installment_no: 1 } : {}),
          price: isInstallment ? Number(item.paymentAmount) : Number(item.price),
          balance,
        };
      });

      // The payment service creates Sales from the authenticated student's pending cart.
      // Store the selected offers there first so the sale, wallet and offer are linked.
      await http.post("/carts/many", { data: cartData, ...(studentId ? { student_id: studentId } : {}) });

      const installments = paymentMode === "split"
        ? items
          .filter((item) => Number(item.installments) > 1)
          .map((item) => ({ offer_id: item.id, installment_no: 1 }))
        : [];

      // A student uses the protected student Stripe API. Staff viewing a student
      // dashboard use the staff-aware payment API with the selected student_id.
      const stripeStoreUrl = studentId ? "/payment/stripe/complete" : "/student/strip";
      const stripeSuccessUrl = studentId ? "/payment/stripe/success" : "/student/strip/success";

      const { data: intentData } = await http.post(stripeStoreUrl, {
        amount: amountToPay,
        balance: cartData.reduce((sum, item) => sum + Number(item.balance || 0), 0),
        ...(studentId ? { student_id: studentId } : {}),
        ...(installments.length ? { installments } : {}),
      });

      const sale = intentData?.sale || intentData?.sales?.[0];
      if (!intentData?.clientSecret || !sale?.id) {
        throw new Error("La création du paiement a échoué. Veuillez réessayer.");
      }

      const { error, paymentIntent } = await stripeContext.stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: stripeContext.cardElement,
          billing_details: { name: cardholderName.trim() },
        },
      });

      if (error) throw error;
      if (paymentIntent?.status !== "succeeded") {
        throw new Error("Le paiement n'a pas été confirmé par Stripe.");
      }

      const { data: successData } = await http.post(stripeSuccessUrl, {
        paymentIntentId: paymentIntent.id,
        saleId: sale.id,
        ...(studentId ? { student_id: studentId } : {}),
      });

      if (!successData?.success) {
        throw new Error("Le paiement a été reçu mais sa validation a échoué.");
      }

      onPaymentSuccess(successData.sales || [successData.sale]);
    } catch (error) {
      setPaymentError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Le paiement a échoué. Veuillez réessayer."
      );
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <div className="cmd-checkout">
      <div className="cmd-checkout-main">
        <div className="cmd-checkout-head">
          <button className="cmd-back-button" onClick={onBack}>
            <IconBack />
          </button>
          <h2>Finalisez votre commande</h2>
        </div>

        <div className="cmd-checkout-section-title">Informations élève</div>
        <div className="cmd-student-card">
          <div className="cmd-student-avatar">{STUDENT.initials}</div>
          <div className="cmd-student-meta">
            <div className="cmd-student-name">{STUDENT.name}</div>
            <div className="cmd-student-sub">{`${STUDENT.email} | ${STUDENT.phone}`}</div>
          </div>
          <div className="cmd-student-arrow">
            <IconArrowRight />
          </div>
        </div>

        <div className="cmd-checkout-divider">
          <span>Choisissez votre mode de paiement</span>
        </div>

        <div className="cmd-payment-grid">
          <button
            className={`cmd-payment-option${paymentMode === "standard" ? " cmd-payment-option--active" : ""}`}
            onClick={() => setPaymentMode("standard")}
          >
            <div className="cmd-payment-option-title">Standard</div>
            <div className="cmd-payment-option-sub">Réglez l'intégralité du montant en une seule transaction.</div>
          </button>
          <button
            className={`cmd-payment-option${paymentMode === "split" ? " cmd-payment-option--active" : ""}`}
            onClick={() => setPaymentMode("split")}
          >
            <div className="cmd-payment-option-title">Paiement par tranche</div>
            <div className="cmd-payment-option-sub">Utilisez les echeances disponibles selon les offres du panier.</div>
          </button>
        </div>

        <div className="cmd-checkout-section-title">Informations de paiement</div>
        <div className="cmd-form-grid">
          <input
            className="cmd-input cmd-input--full"
            placeholder="Nom du titulaire de la carte"
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
          />
          <div className="cmd-card-field cmd-input--full">
            <StripeCardField onReady={handleStripeReady} onError={handleStripeError} />
          </div>
        </div>

        {paymentError && <p style={{ color: "#b91c1c", marginTop: 12 }}>{paymentError}</p>}

        <p className="cmd-terms">
          Votre commande est presque terminée. En cliquant sur « Confirmer et payer », vous acceptez nos conditions générales de vente et notre politique de confidentialité.
        </p>

        <button className="cmd-pay-button" onClick={handlePayment} disabled={paymentLoading}>
          {paymentLoading ? "Paiement en cours…" : `Confirmer et payer (${formatPrice(amountToPay)})`}
        </button>

        <div className="cmd-secure-banner">
          <IconLock />
          <span>Paiement 100 % sécurisé</span>
        </div>

        <div className="cmd-policy-title">Informations utiles</div>
        <div className="cmd-policy-list">
          <p>Nous acceptons les cartes Visa, Mastercard et American Express.</p>
          <p>Les paiements sont protégés par chiffrement SSL.</p>
          <p>Vous pouvez consulter les détails de vos offres depuis votre espace élève.</p>
          <p>Notre equipe d'assistance reste disponible pour toute question sur votre commande.</p>
        </div>
      </div>

      <aside className="cmd-checkout-summary">
        <h3>Récapitulatif</h3>
        <div className="cmd-checkout-summary-list">
          {items.map((item) => (
            <div key={item.id} className="cmd-checkout-summary-item">
              <div>
                <div className="cmd-checkout-summary-name">{item.name}</div>
                <div className="cmd-checkout-summary-balance">{`Solde : ${Number(item.balance || 0)}h`}</div>
              </div>
              <div className="cmd-checkout-summary-side">
                <strong>{formatPrice(item.price)}</strong>
                <button className="cmd-checkout-remove" onClick={() => onRemove(item.id)}>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cmd-checkout-summary-row">
          <span>Paiement</span>
          <strong>{paymentMode === "split" ? "Par tranche" : "Standard"}</strong>
        </div>
        <div className="cmd-checkout-summary-row">
          <span>Sous-total</span>
          <strong>{formatPrice(amountToPay)}</strong>
        </div>
        <div className="cmd-checkout-summary-total">
          <span>Total à payer</span>
          <strong>{formatPrice(amountToPay)}</strong>
        </div>
        <p className="cmd-checkout-summary-note">
          Le total s'ajuste automatiquement selon les offres ajoutées ou retirées du panier.
        </p>
      </aside>
    </div>
  );
}

export default function Commander({ studentId = null, initialCheckout = false, onHome, onPaymentCompleted = () => {}, onOpenNotifications = () => {}, notifCount = 0 }) {
  const [cartItems, setCartItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [view, setView] = useState("catalog");
  const [paidOffers, setPaidOffers] = useState([]);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOffers() {
      setOffersLoading(true);
      setOffersError("");

      try {
        const response = await http.get("/student/offers", {
          params: studentId ? { student_id: studentId } : undefined,
        });
        const payload = response.data?.offers;
        const rows = Array.isArray(payload) ? payload : payload?.data ?? [];

        if (!active) return;

        const commanderOffers = rows.map(toCommanderOffer);
        setOffers(commanderOffers);

        if (initialCheckout) {
          let savedItems = [];
          try { savedItems = JSON.parse(window.localStorage.getItem("ppf_cart") || "[]"); } catch (_) {}

          const importedItems = savedItems
            .map((saved) => {
              const offer = commanderOffers.find((item) => String(item.id) === String(saved.id));
              if (!offer) return null;
              return {
                ...offer,
                quantity: Math.max(1, Number(saved.quantity) || 1),
                balance: Number(saved.balance ?? offer.balance ?? 0),
                price: Number(saved.price ?? offer.price ?? 0),
                installments: Math.max(1, Number(saved.installments ?? offer.installments ?? 1)),
                paymentAmount: Number(saved.paymentAmount ?? offer.paymentAmount ?? offer.price ?? 0),
              };
            })
            .filter(Boolean);

          if (importedItems.length) {
            setCartItems(importedItems);
            setView("checkout");
          }
        }
      } catch (requestError) {
        if (active) {
          setOffers([]);
          setOffersError(requestError.response?.data?.message || "Impossible de charger les offres de votre agence.");
        }
      } finally {
        if (active) setOffersLoading(false);
      }
    }

    loadOffers();
    return () => { active = false; };
  }, [studentId, initialCheckout]);

  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price, 0), [cartItems]);

  const totalLabel = useMemo(() => {
    if (cartItems.length === 0) return "Choisissez une offre";
    return `${cartItems.length} offre${cartItems.length > 1 ? "s" : ""} • ${formatPrice(total)}`;
  }, [cartItems, total]);

  function handleAddOffer(offer) {
    setCartItems((prev) => (prev.some((item) => item.id === offer.id) ? prev : [...prev, offer]));
    setShowSuccess(true);
  }

  function handleRemoveOffer(id) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handlePaymentSuccess() {
    setPaidOffers(cartItems);
    setCartItems([]);
    setView("catalog");
    setShowPaymentSuccess(true);
    onPaymentCompleted();
  }

  if (view === "checkout" && cartItems.length > 0) {
    return (
      <CheckoutPage
        items={cartItems}
        total={total}
        studentId={studentId}
        onBack={() => setView("catalog")}
        onRemove={handleRemoveOffer}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <>
      <div className="cmd-page">
        <div className="cmd-head">
          <div className="kicker-text">
            <div className="cmd-kicker">EE</div>
            <div><h1 className="cmd-title">Choisissez l'offre qui vous convient</h1></div>
          </div>
          <button className="cmd-filter-button cmd-filter-button--icon" onClick={onOpenNotifications} aria-label="Notifications">
            <IconBell />
            <span className="cmd-filter-badge">{notifCount}</span>
          </button>
        </div>

        <div className="cmd-grid">
          {offersLoading && <p>Chargement des offres…</p>}
          {!offersLoading && offersError && <p style={{ color: "#b91c1c" }}>{offersError}</p>}
          {!offersLoading && !offersError && offers.length === 0 && <p>Aucune offre n'est disponible pour votre agence.</p>}
          {!offersLoading && offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              inCart={cartItems.some((item) => item.id === offer.id)}
              onAdd={handleAddOffer}
              onRemove={handleRemoveOffer}
            />
          ))}
        </div>

        {paidOffers.length > 0 && (
          <div className="cmd-payment-complete">
            <strong>Vos offres activées</strong>
            <span>{paidOffers.map((offer) => offer.name).join(" • ")}</span>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="cmd-bottom-bar">
            <button className="cmd-home-pill" onClick={onHome} aria-label="Accueil">
              <IconHome />
            </button>
            <button className="cmd-total-button" onClick={() => setShowCart(true)}>
              <IconCart />
              <span>{totalLabel}</span>
            </button>
          </div>
        )}
      </div>

      {showFilter && <FilterDrawer onClose={() => setShowFilter(false)} />}
      {showSuccess && <SuccessModal count={cartItems.length} onClose={() => setShowSuccess(false)} />}
      {showPaymentSuccess && <PaymentSuccessModal offers={paidOffers} onClose={() => setShowPaymentSuccess(false)} />}
      {showCart && cartItems.length > 0 && (
        <OffersDrawer
          items={cartItems}
          total={total}
          onClose={() => setShowCart(false)}
          onRemove={handleRemoveOffer}
          onCheckout={() => {
            setShowCart(false);
            setView("checkout");
          }}
        />
      )}
    </>
  );
}
