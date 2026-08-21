import React, { useEffect, useRef, useState } from "react";
import "./Services.css";
import {
    FaArrowRight, FaStar, FaShieldAlt, FaBook, FaMobileAlt,
    FaTrophy, FaClock, FaUsers, FaChartBar, FaClipboardList,
    FaCamera, FaUser, FaDesktop, FaBullseye,
    FaCarSide, FaFileAlt, FaCheckCircle, FaGraduationCap,
    FaLaptop, FaIdCard, FaUniversity,FaClipboardCheck,FaUserCircle,FaBookOpen
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";

import purpleClipboard from "../../assets/purple-clipboard.jpeg";
import redClipboard from "../../assets/red-clipboard.jpeg";
import pinkFile from "../../assets/pink-file.jpeg";
import orangePeopleCar from "../../assets/orange-people-car.jpeg";
import mobileBlue from "../../assets/mobile-blue.jpeg";
import peopleLearning from "../../assets/people-learning.jpeg";
import purpleSimulator from '../../assets/purple-simulator.jpeg'
import greenPeopleCar from '../../assets/green-people-car.jpeg'



/* ─── Service data ──────────────────────────────────────── */
const services = [
    {
        id: "decouverte",
        accent: "#F44336",
        accentLight: "#fdecea",
        ribbonColor: "#E84D4D",
        ribbonStep: "PREMIÈRE ÉTAPE",
        ribbonSub: "AVANT VOTRE FORMATION",
        passTitle: "PASS",
        passLine2: "DÉCOUVERTE",
        description: "Toutes les démarches pour bien démarrer.",
        descHighlight: "bien démarrer",
        image: redClipboard,
        imageAlt: "Documents d'inscription - Pass Découverte",
        priceIcon: <FaIdCard />,
        priceDuration: null,
        price: "159€",
        priceDesc: "PACK COMPLET DOSSIER",
        features: [
            { icon: <FaUniversity />, label: "Administration", sub: "Gestion de votre dossier" },
            { icon: <FaDesktop />, label: "En ligne", sub: "Inscription simplifiée" },
            { icon: <FaClipboardList />, label: "Documents", sub: "Pièces justificatives" },
            { icon: <FaUser />, label: "Profil", sub: "Création de votre espace" },
            { icon: <FaCamera />, label: "Photo", sub: "Photo d'identité incluse" },
        ],
        cta: "COMMENCER MON INSCRIPTION",
        footerItems: ["Accompagnement complet", "Sans engagement", "Dossier sécurisé"],
    },
    {
        id: "permis-code",
        accent: "#2AA79B",
        accentLight: "#e0f5f3",
        ribbonColor: "#168C8C",
        ribbonStep: "ÉTAPE THÉORIQUE",
        ribbonSub: "CODE DE LA ROUTE",
        passTitle: "PASS",
        passLine2: "PERMIS CODE",
        description: "Apprenez le code avec un formateur certifié en salle.",
        descHighlight: "formateur certifié",
        image: peopleLearning,
        imageAlt: "Formation code en salle - Pass Permis Code",
        priceIcon: <FaUsers />,
        priceDuration: "En groupe",
        price: "89€",
        priceDesc: "FORMATION EN SALLE",
        features: [
            { icon: <FaDesktop />, label: "Ordinateur", sub: "Exercices interactifs" },
            { icon: <FaBullseye />, label: "Objectifs", sub: "Ciblés par thème" },
            { icon: <FaClipboardList />, label: "Programme", sub: "Syllabus complet" },
            { icon: <FaChartBar />, label: "Statistiques", sub: "Suivi de progression" },
            { icon: <FaUsers />, label: "Groupe", sub: "Ambiance conviviale" },
        ],
        cta: "RÉSERVER MA FORMATION",
        footerItems: ["Formateur diplômé d'État", "Petits groupes", "Horaires flexibles"],
    },
    {
        id: "code",
        accent: "#2F6BFF",
        accentLight: "#e8effe",
        ribbonColor: "#1A56DB",
        ribbonStep: "CODE EN LIGNE",
        ribbonSub: "ACCÈS ILLIMITÉ",
        passTitle: "PASS",
        passLine2: "CODE",
        description: "Révisez le code de la route depuis votre smartphone.",
        descHighlight: "depuis votre smartphone",
        image: mobileBlue,
        imageAlt: "Application mobile code - Pass Code",
        priceIcon: <FaMobileAlt />,
        priceDuration: "Accès illimité",
        price: "29€",
        priceDesc: "APPLICATION MOBILE",
        features: [
            { icon: <FaBook />, label: "Cours", sub: "Tout le programme" },
            { icon: <FaMobileAlt />, label: "Mobile", sub: "iOS & Android" },
            { icon: <FaClipboardList />, label: "Tests blancs", sub: "Examens simulés" },
            { icon: <FaTrophy />, label: "Classement", sub: "Défiez vos amis" },
            { icon: <FaChartBar />, label: "Progression", sub: "Suivi en temps réel" },
        ],
        cta: "ACCÉDER À L'APPLICATION",
        footerItems: ["Paiement en 1 fois", "Sans engagement", "Mise à jour gratuite"],
    },
    {
        id: "simulateur",
        accent: "#7d57c5",
        accentLight: "#F0EBFF",
        ribbonColor: "#7d57c5",
        ribbonStep: "PREMIÈRE ÉTAPE",
        ribbonSub: "AVANT VOTRE FORMATION",
        passTitle: "PASS",
        passLine2: "ÉVALUATION",
        description: "Votre première heure avant de commencer votre formation.",
        descHighlight: "première heure",
        image: purpleClipboard,
        imageAlt: "Bilan d'évaluation personnalisé",
        priceIcon: <FaClock />,
        priceDuration: "1 HEURE",
        price: "38€",
        priceDesc: "ÉVALUATION OBLIGATOIRE AVANT TOUTE INSCRIPTION",
        features: [
            {
                icon: <FaClipboardCheck />,
                label: "ÉVALUATION DE VOTRE NIVEAU",
                sub: "Analyse complète de vos connaissances et de votre niveau"
            },
            {
                icon: <FaChartBar />,
                label: "ESTIMATION PERSONNALISÉE",
                sub: "Mise sous logiciels et devis selon votre niveau"
            }, {
                icon: <FaUserCircle />,
                label: "CONSEILS D'UN FORMATEUR",
                sub: "Des recommandations claires et adaptées pour progresser"
            },
            {
                icon: <FaClipboardList />,
                label: "PLAN DE FORMATION ADAPTÉ",
                sub: "Un parcours sur-mesure, efficace et optimisé"
            },
        ],
        cta: "RÉSERVER MON ÉVALUATION",
        footerItems: [
            "Paiement possible en 2 ou 3 fois",
            "Sans engagement",
            "Déductible lors de votre inscription"
        ],
    },
    {
        id: "accompagne",
        accent: "#E67E22",
        accentLight: "#fef3e2",
        ribbonColor: "#D35400",
        ribbonStep: "CONDUITE",
        ribbonSub: "ACCOMPAGNÉE",
        passTitle: "PASS",
        passLine2: "AAC",
        description: "La conduite accompagnée dès 15 ans avec un proche.",
        descHighlight: "dès 15 ans",
        image: orangePeopleCar,
        imageAlt: "Conduite accompagnée - Pass AAC",
        priceIcon: <FaCarSide />,
        priceDuration: "Par heure",
        price: "45€",
        priceDesc: "LEÇON DE CONDUITE",
        features: [
            { icon: <FaUsers />, label: "Accompagnateur", sub: "Formation incluse" },
            { icon: <FaCarSide />, label: "Conduite", sub: "Dès 15 ans" },
            { icon: <FaClipboardList />, label: "Livret", sub: "Suivi pédagogique" },
            { icon: <FaShieldAlt />, label: "Sécurité", sub: "Formation complète" },
            { icon: <FaChartBar />, label: "Bilan", sub: "Progression suivie" },
        ],
        cta: "DÉMARRER L'AAC",
        footerItems: ["Dès 15 ans", "Formation accompagnateur", "Livret de suivi inclus"],
    },
    {
        id: "administratif",
        accent: "#E91E8C",
        accentLight: "#fde8f4",
        ribbonColor: "#C2185B",
        ribbonStep: "DOSSIER",
        ribbonSub: "ADMINISTRATIF",
        passTitle: "PASS",
        passLine2: "ADMIN",
        description: "Gérez votre dossier administratif en toute simplicité.",
        descHighlight: "toute simplicité",
        image: pinkFile,
        imageAlt: "Dossier administratif - Pass Admin",
        priceIcon: <FaFileAlt />,
        priceDuration: null,
        price: "49€",
        priceDesc: "GESTION COMPLÈTE",
        features: [
            { icon: <FaFileAlt />, label: "Dossier", sub: "Suivi complet" },
            { icon: <FaClipboardList />, label: "Documents", sub: "Vérification incluse" },
            { icon: <FaDesktop />, label: "En ligne", sub: "Démarches simplifiées" },
            { icon: <FaCheckCircle />, label: "Validation", sub: "Relecture experte" },
            { icon: <FaUser />, label: "Conseiller", sub: "Assistance dédiée" },
        ],
        cta: "GÉRER MON DOSSIER",
        footerItems: ["Accompagnement expert", "Délais réduits", "100% sécurisé"],
    },

    {
    id: "green-car",
    accent: "#5E9F2F",
    accentLight: "#EEF8E7",
    ribbonColor: "#5E9F2F",
    ribbonStep: "OFFRE",
    ribbonSub: "RECOMMANDÉE",
    passTitle: "PASS",
    passLine2: "RÉUSSITE EXAMEN",
    description: "La dernière étape avant ton examen !",
    descHighlight: "ton examen",
    image: greenPeopleCar,
    imageAlt: "Pass Réussite Examen",
    priceIcon: <FaClock />,
    priceDuration: "2h de cours collectifs",
    price: "60€",
    priceDesc: "AU LIEU DE 89€ • RÉDUCTION 29€",
    features: [
        { icon: <FaBookOpen />, label: "Toutes les questions officielles révisées", sub: "" },
        { icon: <FaCarSide />, label: "Vérifications du véhicule moteur & habitacle", sub: "" },
        { icon: <FaClipboardCheck />, label: "Mise en situation comme le jour J", sub: "" },
        { icon: <FaGraduationCap />, label: "Conseils de moniteur diplômé d'État", sub: "" },
    ],
    cta: "JE RÉSERVE MA PLACE",
    footerItems: [
        "Paiement 100% sécurisé",
        "Équipe dispo",
        "+ de 1200 élèves accompagnés"
    ],
},

    {
        id: "evaluation",
        accent: "#6F42C1",
        accentLight: "#F0EBFF",
        ribbonColor: "#6F42C1",
        ribbonStep: "NOUVEAUTÉ",
        ribbonSub: "APPRENEZ AUTREMENT",
        passTitle: "PASS",
        passLine2: "SIMULATEUR",
        description: "Apprenez, progressez et gagnez en confiance !",
        descHighlight: "gagnez en confiance !",
        image: purpleSimulator,
        imageAlt: "Simulateur de conduite - Pass Simulateur",
        priceIcon: <FaClock />,
        priceDuration: "À partir de",
        price: "25€",
        priceDesc: "LA SÉANCE",
        features: [
            { icon: <FaCarSide />, label: "SITUATIONS RÉALISTES", sub: "Vivez des conditions de conduite variées" },
            { icon: <FaChartBar />, label: "PROGRESSION RAPIDE", sub: "Corrigez vos erreurs et améliorez-vous" },
            { icon: <FaShieldAlt />, label: "100% SÉCURISÉ", sub: "Apprenez sans stress, zéro risque" },
            { icon: <FaClock />, label: "FLEXIBLE", sub: "Séances de 30 min ou 1h selon vos besoins" },
        ],
        cta: "JE CHOISIS LE PASS SIMULATEUR",
        footerItems: [
            "Paiement sécurisé",
            "Aucune immédiate à la réservation",
            "Auto-école agréée"
        ],
    },
];

/* ─── Single service card ───────────────────────────────── */
const ServiceCard = ({ svc, index, visible, onAddToCart }) => (
    <>
    <article

        className={`svc-card ${visible ? "svc-card--visible" : ""}`}
        style={{ "--accent": svc.accent, "--accent-light": svc.accentLight, "--delay": `${index * 0.12}s` }}
    >
        {/* ── Ribbon ── */}
        <div className="svc-card__ribbon" style={{ background: svc.ribbonColor }}>
            <FaStar className="svc-card__ribbon-star" />
            <div className="svc-card__ribbon-text">
                <span className="svc-card__ribbon-step">{svc.ribbonStep}</span>
                <span className="svc-card__ribbon-sub">{svc.ribbonSub}</span>
            </div>
        </div>

        {/* ── Body: left content + right illustration ── */}
        <div className="svc-card__body">

            {/* LEFT */}
            <div className="svc-card__left">

                {/* PASS title */}
                <div className="svc-card__pass">
                    <span className="svc-card__pass-main">PASS</span>
                    <span className="svc-card__pass-line2" style={{ color: svc.accent }}>
                        {svc.passLine2}
                    </span>
                </div>

                {/* Description */}
                <p className="svc-card__desc">
                    {svc.description.split(svc.descHighlight).map((part, i, arr) =>
                        i < arr.length - 1
                            ? <React.Fragment key={i}>{part}<strong style={{ color: svc.accent }}>{svc.descHighlight}</strong></React.Fragment>
                            : <React.Fragment key={i}>{part}</React.Fragment>
                    )}
                </p>

                {/* Price card */}
                <div className="svc-card__price-card">
                    <div className="svc-card__price-icon" style={{ color: svc.accent }}>
                        {svc.priceIcon}
                    </div>
                    {svc.priceDuration && (
                        <span className="svc-card__price-duration">{svc.priceDuration}</span>
                    )}
                    <span className="svc-card__price-value" style={{ color: svc.accent }}>
                        {svc.price}
                    </span>
                    <span className="svc-card__price-desc">{svc.priceDesc}</span>
                </div>
            </div>

            {/* RIGHT — illustration */}
            <div className="svc-card__right">
                <div className="svc-card__img-bg" style={{ background: svc.accentLight }} />
                <img
                    src={svc.image}
                    alt={svc.imageAlt}
                    className="svc-card__img"
                />
            </div>
        </div>

        {/* ── Feature strip ── */}
        <div className="svc-card__features">
            {svc.features.map((f, fi) => (
                <React.Fragment key={fi}>
                    <div className="svc-card__feature">
                        <span className="svc-card__feature-icon" style={{ color: svc.accent }}>
                            {f.icon}
                        </span>
                        <span className="svc-card__feature-label">{f.label}</span>
                        <span className="svc-card__feature-sub">{f.sub}</span>
                    </div>
                    {fi < svc.features.length - 1 && (
                        <div className="svc-card__feature-divider" />
                    )}
                </React.Fragment>
            ))}
        </div>

        {/* ── CTA button ── */}
        <button
            className="svc-card__cta"
            style={{ background: svc.accent }}
            aria-label={svc.cta}
            onClick={() => onAddToCart(svc)}
        >
            <span>{svc.cta}</span>
            <span className="svc-card__cta-arrow">
                <FaArrowRight />
            </span>
        </button>

        {/* ── Footer trust items ── */}
        <div className="svc-card__footer">
            {svc.footerItems.map((item, fi) => (
                <React.Fragment key={fi}>
                    <span className="svc-card__footer-item">
                        <FaCheckCircle className="svc-card__footer-icon" style={{ color: svc.accent }} />
                        {item}
                    </span>
                    {fi < svc.footerItems.length - 1 && (
                        <span className="svc-card__footer-dot">·</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    </article>
    </>
);

/* ─── Main section ──────────────────────────────────────── */
const Services = () => {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = (svc) => {
        addItem({
            id: svc.id,
            title: `PASS ${svc.passLine2}`,
            image: svc.image,
            price: parseFloat(svc.price.replace('€', '').replace(',', '.')),
            quantity: 1
        });
    };

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.05 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <>
        <div className="svc-wrapper-relative">
        <section className="svc-section" ref={sectionRef}>
            <div className="svc-container">

                {/* ── Section heading ── */}
                <div className={`svc-heading ${visible ? "svc-heading--visible" : ""}`}>
                    <p className="svc-heading__eyebrow">
                        <span className="svc-heading__dash" />
                        NOS SERVICES
                        <span className="svc-heading__dash" />
                    </p>
                    <h2 className="svc-heading__title">
                        Découvrez nos services pour<br />
                        <span className="svc-heading__title-green">réussir votre permis</span>
                    </h2>
                    <p className="svc-heading__subtitle">
                        Des solutions modernes, transparentes et adaptées à chaque étape de votre apprentissage.
                        Choisissez le service qui correspond à vos besoins et progressez à votre rythme avec PassPermisFacile.
                    </p>
                </div>

                {/* ── Cards ── */}
                <div className="svc-grid">
                    {services.map((svc, i) => (
                        <ServiceCard key={svc.id} svc={svc} index={i} visible={visible} onAddToCart={handleAddToCart} />
                    ))}
                </div>

            </div>
        </section>
        </div>
        </>
    );
};

export default Services;
