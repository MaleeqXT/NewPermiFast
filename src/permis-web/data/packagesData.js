/* ── Vehicle images ── */
import greenCar from "../assets/green-car.jpeg";
import blueCar from "../assets/blue-car.jpeg";
import redCar from "../assets/red-car.jpeg";
import bikePkg from "../assets/package-bike.jpeg";
import blackCar from "../assets/black-car-img1.jpeg";
import greenCar2 from "../assets/green-car-img2.jpeg";
import purpleCar from "../assets/purple-car-img3.jpeg";
import yellowCar from "../assets/yellow-car-img4.jpeg";
import brownCar from "../assets/brown-car-img5.jpeg";

/* ── Icons ── */
import {
  FaLeaf,
  FaStar,
  FaRocket,
  FaMotorcycle,
  FaGift,
  FaBolt,
  FaShieldAlt,
  FaUserGraduate,
  FaAward,
  FaCar,
  FaRoad,
  FaStopwatch,
  FaUsers,
  FaCompass,
  FaClipboardList,


} from "react-icons/fa";

/* ═══════════════════════════════════════════════════════
   MANUAL PACKAGES (Boîte Manuelle)
═══════════════════════════════════════════════════════ */
export const packages = [
  /* ==========================================================
     1 — PASS HEURES D'ÉVALUATION
  ========================================================== */
  {
    id: "manual-evaluation",
    type: "manual",
    cpfType: "without-code",

    badge: "EXPRESS",

    badgeColor: "#9B59B6",

    accent: "#9B59B6",

    accentLight: "#F5E6F8",

    gradStart: "rgba(155,89,182,.18)",

    gradEnd: "rgba(155,89,182,0)",

    car: purpleCar,

    carAlt: "Voiture - Pass Heures d'Évaluation",

    packLabel: "PASS",

    packName: "HEURES D'ÉVALUATION",

    packSub:
      "Évaluez votre niveau avant de commencer votre formation.",

    packIcon: FaShieldAlt,

    hours: "1h",

    features: [
      { text: "1 heure d'évaluation", highlight: true },
      { text: "Analyse du niveau", highlight: false },
      { text: "Conseils personnalisés", highlight: false },
      { text: "Bilan complet", highlight: false },
    ],

    checkColor: "#8E44AD",

    price: "45€",

    priceSub: "Évaluation",

    bonus:
      "Compte-rendu personnalisé permettant de choisir la formule idéale.",

    bonusIcon: FaGift,

    bonusBg: "#F5E6F8",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     2 — PASS MANUELLE
  ========================================================== */
  {
    id: "manual",
    type: "manual",
    cpfType: "without-code",

    badge: "ESSENTIEL",

    badgeColor: "#27AE60",

    accent: "#27AE60",

    accentLight: "#E8F8F0",

    gradStart: "rgba(39,174,96,.18)",

    gradEnd: "rgba(39,174,96,0)",

    car: greenCar,

    carAlt: "Voiture - Pass Manuelle",

    packLabel: "PASS",

    packName: "MANUELLE",

    packSub:
      "La formule idéale pour débuter votre apprentissage.",

    packIcon: FaBolt,

    features: [
      { text: "Accès au code", highlight: false },
      { text: "Livret numérique", highlight: false },
      { text: "Suivi pédagogique", highlight: false },
      { text: "Accompagnement personnalisé", highlight: false },
    ],

    checkColor: "#1E8449",

    price: "495€",

    priceSub: "Formation",

    bonus:
      "Accès à la plateforme élève pendant toute la formation.",

    bonusIcon: FaGift,

    bonusBg: "#E8F8F0",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     3 — PASS DÉCOUVERTE
  ========================================================== */
  {
    id: "manual-decouverte",
    type: "manual",
    cpfType: "without-code",

    badge: "DÉCOUVERTE",

    badgeColor: "#3498DB",

    accent: "#3498DB",

    accentLight: "#EBF5FB",

    gradStart: "rgba(52,152,219,.18)",

    gradEnd: "rgba(52,152,219,0)",

    car: blueCar,

    carAlt: "Voiture - Pass Découverte",

    packLabel: "PASS",

    packName: "DÉCOUVERTE",

    packSub:
      "Découvrez la conduite avant de commencer une formation complète.",

    packIcon: FaShieldAlt,

    hours: "12h",

    features: [
      { text: "12 heures de conduite", highlight: true },
      { text: "Découverte progressive", highlight: false },
      { text: "Conseils du moniteur", highlight: false },
      { text: "Évaluation continue", highlight: false },
    ],

    checkColor: "#2980B9",

    price: "790€",

    priceSub: "Découverte",

    bonus:
      "Une excellente formule pour faire vos premiers kilomètres.",

    bonusIcon: FaGift,

    bonusBg: "#EBF5FB",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     4 — PASS MOTO
  ========================================================== */
  {
    id: "motorcycle",
    type: "motorcycle",
    cpfType: "without-code",

    badge: "DEUX-ROUES",

    badgeColor: "#4B5563",

    accent: "#6B7280",

    accentLight: "#F3F4F6",

    gradStart: "rgba(107,114,128,.22)",

    gradEnd: "rgba(107,114,128,0)",

    car: bikePkg,

    carAlt: "Moto - Pass Moto",

    packLabel: "PASS",

    packName: "MOTO",

    packSub:
      "Une formation complète pour maîtriser votre moto et prendre la route en confiance.",

    packIcon: FaMotorcycle,

    hours: "20h",

    features: [
      { text: "20 heures de formation moto", highlight: true },
      { text: "Séances plateau et circulation", highlight: true },
      { text: "Moniteurs spécialisés deux-roues", highlight: false },
      { text: "Progression personnalisée", highlight: false },
      { text: "Préparation complète à l'examen", highlight: false },
    ],

    checkColor: "#4B5563",

    price: "890€",

    priceSub: "Formation moto complète",

    bonus:
      "Suivi personnalisé pendant toute votre formation moto.",

    bonusIcon: FaGift,

    bonusBg: "#F3F4F6",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     5 — PASS MANUELLE 20H
  ========================================================== */
  {
    id: "manual-20h",
    type: "manual",
    cpfType: "without-code",

    badge: "MEILLEURE OFFRE",

    badgeColor: "#16A085",

    accent: "#16A085",

    accentLight: "#E0F2F1",

    gradStart: "rgba(22,160,133,.18)",

    gradEnd: "rgba(22,160,133,0)",

    car: greenCar,

    carAlt: "Voiture - Pass Manuelle 20H",

    packLabel: "PASS",

    packName: "MANUELLE",

    packSub:
      "Notre formule complète pour réussir votre permis sereinement.",

    packIcon: FaBolt,

    hours: "20h",

    features: [
      { text: "20 heures de conduite", highlight: true },
      { text: "Formation complète", highlight: true },
      { text: "Préparation examen", highlight: false },
      { text: "Livret numérique", highlight: false },
      { text: "Accompagnement jusqu'à l'examen", highlight: false },
    ],

    checkColor: "#0E6655",

    price: "1290€",

    priceSub: "Formation complète",

    bonus:
      "Accompagnement premium jusqu'à l'obtention du permis.",

    bonusIcon: FaGift,

    bonusBg: "#E0F2F1",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     6 — PASS MANUELLE 10H
  ========================================================== */
  {
    id: "manual-10h",
    type: "manual",
    cpfType: "without-code",

    badge: "POPULAIRE",

    badgeColor: "#2ECC71",

    accent: "#2ECC71",

    accentLight: "#EAFAF1",

    gradStart: "rgba(46,204,113,.18)",

    gradEnd: "rgba(46,204,113,0)",

    car: greenCar,

    carAlt: "Voiture - Pass Manuelle 10H",

    packLabel: "PASS",

    packName: "MANUELLE",

    packSub:
      "Complétez votre apprentissage avec des heures supplémentaires.",

    packIcon: FaBolt,

    hours: "10h",

    features: [
      { text: "10 heures de conduite", highlight: true },
      { text: "Boîte manuelle", highlight: false },
      { text: "Planning flexible", highlight: false },
      { text: "Préparation pratique", highlight: false },
      { text: "Suivi pédagogique", highlight: false },
    ],

    checkColor: "#27AE60",

    price: "720€",

    priceSub: "10 heures",

    bonus:
      "Suivi personnalisé avec votre moniteur.",

    bonusIcon: FaGift,

    bonusBg: "#EAFAF1",

    btnLabel: "Choisir cette formule",
  },
  /* ==========================================================
     7 — PASS ACCOMPAGNÉ
  ========================================================== */
  {
    id: "manual-accompagne",
    type: "manual",
    cpfType: "without-code",

    badge: "AAC",

    badgeColor: "#F39C12",

    accent: "#F39C12",

    accentLight: "#FEF5E7",

    gradStart: "rgba(243,156,18,.18)",

    gradEnd: "rgba(243,156,18,0)",

    car: yellowCar,

    carAlt: "Voiture - Pass Accompagné",

    packLabel: "PASS",

    packName: "ACCOMPAGNÉ",

    packSub:
      "Idéal pour apprendre sereinement avec la conduite accompagnée.",

    packIcon: FaShieldAlt,

    hours: "24h",

    features: [
      { text: "24 heures de conduite", highlight: true },
      { text: "Conduite accompagnée", highlight: true },
      { text: "Suivi pédagogique", highlight: false },
      { text: "Livret numérique", highlight: false },
      { text: "Accompagnement personnalisé", highlight: false },
    ],

    checkColor: "#D68910",

    price: "1490€",

    priceSub: "AAC",

    bonus:
      "Accompagnement complet pendant toute votre formation.",

    bonusIcon: FaGift,

    bonusBg: "#FEF5E7",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     8 — PASS TURBO 6H
  ========================================================== */
  {
    id: "manual-turbo-6h",
    type: "manual",
    cpfType: "without-code",

    badge: "EXPRESS",

    badgeColor: "#E74C3C",

    accent: "#E74C3C",

    accentLight: "#FADBD8",

    gradStart: "rgba(231,76,60,.18)",

    gradEnd: "rgba(231,76,60,0)",

    car: redCar,

    carAlt: "Voiture - Pass Turbo 6H",

    packLabel: "PASS",

    packName: "TURBO",

    packSub:
      "Une formation intensive pour progresser rapidement.",

    packIcon: FaRocket,

    hours: "6h",

    features: [
      { text: "6 heures de conduite", highlight: true },
      { text: "Formation intensive", highlight: true },
      { text: "Planning accéléré", highlight: false },
      { text: "Préparation pratique", highlight: false },
      { text: "Suivi personnalisé", highlight: false },
    ],

    checkColor: "#C0392B",

    price: "520€",

    priceSub: "Formation Express",

    bonus:
      "Créneaux prioritaires selon les disponibilités.",

    bonusIcon: FaGift,

    bonusBg: "#FADBD8",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     9 — PASS À LA CARTE
  ========================================================== */
  {
    id: "manual-carte",
    type: "manual",
    cpfType: "without-code",

    badge: "FLEXIBLE",

    badgeColor: "#E91E63",

    accent: "#E91E63",

    accentLight: "#FCE4EC",

    gradStart: "rgba(233,30,99,.18)",

    gradEnd: "rgba(233,30,99,0)",

    car: purpleCar,

    carAlt: "Voiture - Pass À La Carte",

    packLabel: "PASS",

    packName: "À LA CARTE",

    packSub:
      "Ajoutez des heures de conduite quand vous le souhaitez.",

    packIcon: FaBolt,

    features: [
      { text: "Heures à l'unité", highlight: true },
      { text: "Sans engagement", highlight: false },
      { text: "Planning flexible", highlight: false },
      { text: "Réservation rapide", highlight: false },
    ],

    checkColor: "#C2185B",

    price: "75€",

    priceSub: "Par heure",

    bonus:
      "Réservez uniquement les heures dont vous avez besoin.",

    bonusIcon: FaGift,

    bonusBg: "#FCE4EC",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     10 — PASS TURBO 20H
  ========================================================== */
  {
    id: "manual-turbo-20h",
    type: "manual",
    cpfType: "without-code",

    badge: "PREMIUM",

    badgeColor: "#C0392B",

    accent: "#C0392B",

    accentLight: "#F9EBEA",

    gradStart: "rgba(192,57,43,.18)",

    gradEnd: "rgba(192,57,43,0)",

    car: redCar,

    carAlt: "Voiture - Pass Turbo 20H",

    packLabel: "PASS",

    packName: "TURBO",

    packSub:
      "Notre formule intensive la plus complète.",

    packIcon: FaRocket,

    hours: "20h",

    features: [
      { text: "20 heures de conduite", highlight: true },
      { text: "Planning prioritaire", highlight: true },
      { text: "Moniteur dédié", highlight: false },
      { text: "Préparation examen", highlight: false },
      { text: "Accompagnement personnalisé", highlight: false },
    ],

    checkColor: "#922B21",

    price: "1650€",

    priceSub: "Turbo Premium",

    bonus:
      "Accompagnement complet jusqu'à l'examen.",

    bonusIcon: FaGift,

    bonusBg: "#F9EBEA",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     11 — PASS CODE
  ========================================================== */
  {
    id: "manual-code",
    type: "manual",
    cpfType: "with-code",

    badge: "CODE",

    badgeColor: "#2980B9",

    accent: "#2980B9",

    accentLight: "#D4E6F1",

    gradStart: "rgba(41,128,185,.18)",

    gradEnd: "rgba(41,128,185,0)",

    car: blueCar,

    carAlt: "Voiture - Pass Code",

    packLabel: "PASS",

    packName: "CODE",

    packSub:
      "Préparez efficacement votre Code de la route.",

    packIcon: FaBolt,

    hours: "5h",

    features: [
      { text: "Cours de code", highlight: true },
      { text: "Accès plateforme", highlight: false },
      { text: "Tests illimités", highlight: false },
      { text: "Correction détaillée", highlight: false },
    ],

    checkColor: "#1A5276",

    price: "190€",

    priceSub: "Code de la route",

    bonus:
      "Accès aux séries de code pendant toute la durée de votre formation.",

    bonusIcon: FaGift,

    bonusBg: "#D4E6F1",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     12 — PASS EXAMEN
  ========================================================== */
  {
    id: "manual-examen",
    type: "manual",
    cpfType: "without-code",

    badge: "EXAMEN",

    badgeColor: "#7F8C8D",

    accent: "#7F8C8D",

    accentLight: "#F4F6F6",

    gradStart: "rgba(127,140,141,.18)",

    gradEnd: "rgba(127,140,141,0)",

    car: blackCar,

    carAlt: "Voiture - Pass Examen",

    packLabel: "PASS",

    packName: "EXAMEN",

    packSub:
      "Le véhicule et votre moniteur le jour de l'examen.",

    packIcon: FaShieldAlt,

    features: [
      { text: "Véhicule fourni", highlight: true },
      { text: "Présence du moniteur", highlight: false },
      { text: "Conseils avant l'épreuve", highlight: false },
      { text: "Accompagnement jusqu'au centre d'examen", highlight: false },
    ],

    checkColor: "#5F6A69",

    price: "95€",

    priceSub: "Passage examen",

    bonus:
      "Accompagnement complet le jour de votre examen pratique.",

    bonusIcon: FaGift,

    bonusBg: "#F4F6F6",

    btnLabel: "Choisir cette formule",
  },

  /* ═══════════════════════════════════════════════════════
     AUTOMATIC PACKAGES (Boîte Automatique)
  ═══════════════════════════════════════════════════════ */
  /* ===========================================================
     1 — PASS HEURES D'ÉVALUATION
  =========================================================== */

  {
    id: "auto-evaluation",
    type: "automatic",
    cpfType: "without-code",
    badge: "NOUVEAU",
    badgeColor: "#8E44AD",
    accent: "#8E44AD",
    accentLight: "#F4ECF7",
    gradStart: "rgba(142,68,173,.18)",
    gradEnd: "rgba(142,68,173,0)",
    car: greenCar,
    carAlt: "Voiture - Pass Heures d'Évaluation",

    packLabel: "PASS",
    packName: "HEURES D'ÉVALUATION",
    packSub:
      "La première étape indispensable pour déterminer la formule idéale selon votre niveau.",

    packIcon: FaShieldAlt,

    hours: "1h",

    features: [
      { text: "1 heure d'évaluation", highlight: true },
      { text: "Analyse complète de votre niveau", highlight: false },
      { text: "Évaluation sur plusieurs critères", highlight: false },
      { text: "Conseils personnalisés du moniteur", highlight: false },
      { text: "Orientation vers la formule adaptée", highlight: false },
    ],

    checkColor: "#7D3C98",

    price: "45€",
    priceSub: "Paiement unique",

    bonus:
      "Le coût de l'évaluation est remboursé lors de votre inscription à une formule.",

    bonusIcon: FaGift,
    bonusBg: "#F4ECF7",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     2 — PASS AUTOMATIQUE
  =========================================================== */

  {
    id: "auto",
    type: "automatic",
    badge: "POPULAIRE",
    badgeColor: "#F1C40F",
    accent: "#F1C40F",
    accentLight: "#FEF9E7",
    gradStart: "rgba(241,196,15,.18)",
    gradEnd: "rgba(241,196,15,0)",

    car: greenCar,
    carAlt: "Voiture - Pass Automatique",

    packLabel: "PASS",
    packName: "AUTOMATIQUE",

    packSub:
      "Une formation moderne en boîte automatique, idéale pour apprendre rapidement.",

    packIcon: FaCar,

    hours: "13h",

    features: [
      { text: "13 heures de conduite", highlight: true },
      { text: "2 heures sur simulateur", highlight: false },
      { text: "Accès au code en ligne", highlight: false },
      { text: "Livret numérique", highlight: false },
      { text: "Suivi pédagogique personnalisé", highlight: false },
      { text: "Accompagnement jusqu'à l'examen", highlight: false },
    ],

    checkColor: "#B7950B",

    price: "495€",
    priceSub: "Tout compris",

    bonus:
      "Accès immédiat à votre espace élève avec suivi de progression.",

    bonusIcon: FaGift,
    bonusBg: "#FEF9E7",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     3 — PASS AUTOMATIQUE 13H
  =========================================================== */

  {
    id: "auto-13h",
    type: "automatic",

    badge: "MEILLEURE OFFRE",

    badgeColor: "#00B894",

    accent: "#00B894",

    accentLight: "#E0F7FA",

    gradStart: "rgba(0,184,148,.18)",

    gradEnd: "rgba(0,184,148,0)",

    car: greenCar,
    carAlt: "Voiture - Pass Automatique 13H",

    packLabel: "PASS",

    packName: "AUTOMATIQUE",

    packSub:
      "Le meilleur équilibre entre budget, rapidité et efficacité.",

    packIcon: FaBolt,

    hours: "13h",

    features: [
      { text: "13 heures de conduite", highlight: true },
      { text: "Boîte automatique", highlight: false },
      { text: "Planning flexible", highlight: false },
      { text: "Préparation pratique", highlight: false },
      { text: "Livret numérique", highlight: false },
      { text: "Accompagnement examen", highlight: false },
    ],

    checkColor: "#00806A",

    price: "900€",

    priceSub: "Formation complète",

    bonus:
      "Bilan personnalisé réalisé avant la présentation à l'examen.",

    bonusIcon: FaGift,

    bonusBg: "#E0F7FA",

    btnLabel: "Choisir cette formule",
  },
  /* ===========================================================
     4 — PASS AUTOMATIQUE 20H
  =========================================================== */

  {
    id: "auto-20h",
    type: "automatic",

    badge: "RECOMMANDÉ",

    badgeColor: "#D35400",

    accent: "#D35400",

    accentLight: "#FAE5D3",

    gradStart: "rgba(211,84,0,.18)",

    gradEnd: "rgba(211,84,0,0)",

    car: greenCar,

    carAlt: "Voiture - Pass Automatique 20H",

    packLabel: "PASS",

    packName: "AUTOMATIQUE",

    packSub:
      "La formule idéale pour progresser sereinement avec davantage de pratique.",

    packIcon: FaRoad,

    hours: "20h",

    features: [
      { text: "20 heures de conduite", highlight: true },
      { text: "2 heures sur simulateur", highlight: false },
      { text: "Code en ligne inclus", highlight: false },
      { text: "Suivi pédagogique renforcé", highlight: false },
      { text: "Présentation à l'examen", highlight: false },
      { text: "Livret numérique", highlight: false },
    ],

    checkColor: "#A04000",

    price: "1360€",

    priceSub: "Premium",

    bonus:
      "Planning personnalisé selon vos disponibilités avec suivi renforcé.",

    bonusIcon: FaGift,

    bonusBg: "#FAE5D3",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     5 — PASS TURBO 17H
  =========================================================== */

  {
    id: "auto-turbo-17h",
    type: "automatic",

    badge: "RAPIDE",

    badgeColor: "#1ABC9C",

    accent: "#1ABC9C",

    accentLight: "#D1F2EB",

    gradStart: "rgba(26,188,156,.18)",

    gradEnd: "rgba(26,188,156,0)",

    car: redCar,

    carAlt: "Voiture - Pass Turbo 17H",

    packLabel: "PASS",

    packName: "TURBO",

    packSub:
      "Formation accélérée pour obtenir votre permis dans les meilleurs délais.",

    packIcon: FaRocket,

    hours: "17h",

    features: [
      { text: "17 heures de conduite", highlight: true },
      { text: "Formation intensive", highlight: true },
      { text: "Planning prioritaire", highlight: false },
      { text: "Leçons rapprochées", highlight: false },
      { text: "Préparation examen", highlight: false },
      { text: "Suivi premium", highlight: false },
    ],

    checkColor: "#17A589",

    price: "1290€",

    priceSub: "Accéléré",

    bonus:
      "Créneaux prioritaires et accompagnement intensif jusqu'à l'examen.",

    bonusIcon: FaGift,

    bonusBg: "#D1F2EB",

    btnLabel: "Choisir cette formule",
  },

  /* ==========================================================
     6 — PASS TURBO 8H
  =========================================================== */

  {
    id: "auto-turbo-8h",
    type: "automatic",

    badge: "INTENSIF",

    badgeColor: "#FF7675",

    accent: "#FF7675",

    accentLight: "#FDEDEC",

    gradStart: "rgba(255,118,117,.18)",

    gradEnd: "rgba(255,118,117,0)",

    car: redCar,

    carAlt: "Voiture - Pass Turbo 8H",

    packLabel: "PASS",

    packName: "TURBO",

    packSub:
      "Une formule express destinée aux élèves ayant déjà une bonne maîtrise de la conduite.",

    packIcon: FaStopwatch,

    hours: "8h",

    features: [
      { text: "8 heures de conduite", highlight: true },
      { text: "Formation intensive", highlight: true },
      { text: "Révision des points essentiels", highlight: false },
      { text: "Préparation ciblée à l'examen", highlight: false },
      { text: "Conseils personnalisés", highlight: false },
      { text: "Planning accéléré", highlight: false },
    ],

    checkColor: "#D35400",

    price: "930€",

    priceSub: "Stage Express",

    bonus:
      "Programme intensif idéal avant le passage de votre examen pratique.",

    bonusIcon: FaGift,

    bonusBg: "#FDEDEC",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     7 — PASS TURBO 20H
  =========================================================== */

  {
    id: "auto-turbo-20h",
    type: "automatic",

    badge: "PREMIUM",

    badgeColor: "#6C5CE7",

    accent: "#6C5CE7",

    accentLight: "#E8E0F5",

    gradStart: "rgba(108,92,231,.18)",

    gradEnd: "rgba(108,92,231,0)",

    car: redCar,

    carAlt: "Voiture - Pass Turbo 20H",

    packLabel: "PASS",

    packName: "TURBO",

    packSub:
      "Notre formule la plus complète pour une réussite rapide et sereine.",

    packIcon: FaRocket,

    hours: "20h",

    features: [
      { text: "20 heures de conduite", highlight: true },
      { text: "Planning ultra prioritaire", highlight: true },
      { text: "Moniteur référent", highlight: false },
      { text: "Préparation intensive", highlight: false },
      { text: "Passage examen rapide", highlight: false },
      { text: "Accompagnement personnalisé", highlight: false },
    ],

    checkColor: "#5B2C6F",

    price: "1790€",

    priceSub: "Ultra Premium",

    bonus:
      "Priorité maximale sur les créneaux et accompagnement jusqu'à l'obtention du permis.",

    bonusIcon: FaGift,

    bonusBg: "#E8E0F5",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     8 — PASS DÉCOUVERTE
  =========================================================== */

  {
    id: "auto-decouverte",
    type: "automatic",

    badge: "ESSAI",

    badgeColor: "#74B9FF",

    accent: "#74B9FF",

    accentLight: "#D6EAF8",

    gradStart: "rgba(116,185,255,.18)",

    gradEnd: "rgba(116,185,255,0)",

    car: blueCar,

    carAlt: "Voiture - Pass Découverte",

    packLabel: "PASS",

    packName: "DÉCOUVERTE",

    packSub:
      "Découvrez la conduite en boîte automatique avant de choisir votre formule.",

    packIcon: FaCompass,

    hours: "1h",

    features: [
      { text: "1 heure de conduite", highlight: true },
      { text: "Découverte du véhicule", highlight: false },
      { text: "Évaluation du niveau", highlight: false },
      { text: "Conseils personnalisés", highlight: false },
      { text: "Sans engagement", highlight: false },
    ],

    checkColor: "#2E86C1",

    price: "120€",

    priceSub: "Découverte",

    bonus:
      "Parfait pour effectuer un premier contact avec la conduite.",

    bonusIcon: FaGift,

    bonusBg: "#D6EAF8",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     9 — PASS ACCOMPAGNÉ
  =========================================================== */

  {
    id: "auto-accompagne",
    type: "automatic",

    badge: "AAC",

    badgeColor: "#E67E22",

    accent: "#E67E22",

    accentLight: "#FDEBD0",

    gradStart: "rgba(230,126,34,.18)",

    gradEnd: "rgba(230,126,34,0)",

    car: yellowCar,

    carAlt: "Voiture - Pass Accompagné",

    packLabel: "PASS",

    packName: "ACCOMPAGNÉ",

    packSub:
      "Progressez sereinement grâce à un apprentissage encadré et personnalisé.",

    packIcon: FaUsers,

    hours: "24h",

    features: [
      { text: "24 heures de conduite", highlight: true },
      { text: "Conduite accompagnée", highlight: true },
      { text: "Boîte automatique", highlight: false },
      { text: "Suivi pédagogique", highlight: false },
      { text: "Livret numérique inclus", highlight: false },
      { text: "Présentation à l'examen", highlight: false },
    ],

    checkColor: "#BA4A00",

    price: "1490€",

    priceSub: "Formation AAC",

    bonus:
      "Un accompagnement complet jusqu'à l'obtention de votre permis.",

    bonusIcon: FaGift,

    bonusBg: "#FDEBD0",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     10 — PASS À LA CARTE
  =========================================================== */

  {
    id: "auto-carte",
    type: "automatic",

    badge: "FLEXIBLE",

    badgeColor: "#FD79A8",

    accent: "#FD79A8",

    accentLight: "#FADBD8",

    gradStart: "rgba(253,121,168,.18)",

    gradEnd: "rgba(253,121,168,0)",

    car: purpleCar,

    carAlt: "Voiture - Pass À La Carte",

    packLabel: "PASS",

    packName: "À LA CARTE",

    packSub:
      "Réservez uniquement les heures dont vous avez besoin, sans formule complète.",

    packIcon: FaClipboardList,

    features: [
      { text: "Leçon individuelle", highlight: true },
      { text: "Paiement à la séance", highlight: false },
      { text: "Sans engagement", highlight: false },
      { text: "Réservation flexible", highlight: false },
      { text: "Disponible toute l'année", highlight: false },
    ],

    checkColor: "#E84393",

    price: "75€",

    priceSub: "Par heure",

    bonus:
      "Idéal pour compléter une formation ou reprendre la conduite.",

    bonusIcon: FaGift,

    bonusBg: "#FADBD8",

    btnLabel: "Choisir cette formule",
  },

  /* ===========================================================
     11 — PASS EXAMEN
  =========================================================== */

  {
    id: "auto-examen",
    type: "automatic",

    badge: "EXAMEN",

    badgeColor: "#636E72",

    accent: "#636E72",

    accentLight: "#F0F3F4",

    gradStart: "rgba(99,110,114,.18)",

    gradEnd: "rgba(99,110,114,0)",

    car: blackCar,

    carAlt: "Voiture - Pass Examen",

    packLabel: "PASS",

    packName: "EXAMEN",

    packSub:
      "Le véhicule et l'accompagnement nécessaires pour passer votre examen dans les meilleures conditions.",

    packIcon: FaAward,

    hours: "1h",

    features: [
      { text: "1 heure de conduite avant examen", highlight: true },
      { text: "Véhicule fourni", highlight: false },
      { text: "Présence du moniteur", highlight: false },
      { text: "Accompagnement au centre d'examen", highlight: false },
      { text: "Débriefing après l'épreuve", highlight: false },
    ],

    checkColor: "#4A6572",

    price: "75€",

    priceSub: "Jour J",

    bonus:
      "Profitez des derniers conseils de votre moniteur juste avant votre passage.",

    bonusIcon: FaGift,

    bonusBg: "#F0F3F4",

    btnLabel: "Choisir cette formule",
  },
]
