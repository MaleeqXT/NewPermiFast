// import React from "react";
// import "./Offers.css";

// import women from "../../assets/women.jpeg";
// import men from "../../assets/men.jpeg";

// import purplePermis from "../../assets/purple-permis.png";
// import pinkPermis from "../../assets/pink-permis.png";

// import purpleAuto from "../../assets/purple-auto.jpeg";
// import pinkAuto from "../../assets/pink-auto.jpeg";

// import {
//   FaCheckCircle,
//   FaFolder,
//   FaUsers,
//   FaGraduationCap,
//   FaBell,
//   FaPhoneAlt,
// } from "react-icons/fa";

// const leftFeatures = [
//   {
//     icon: <FaFolder />,
//     title: "Constitution du dossier",
//     text: "Nous nous occupons de tout.",
//     check: true,
//   },
//   {
//     icon: <FaUsers />,
//     title: "Accès espace élèves illimité",
//     text: "Suivi, documents et échanges facilités.",
//     check: true,
//   },
//   {
//     icon: <FaGraduationCap />,
//     title: "Accompagnement pédagogique",
//     text: "Une équipe à vos côtés à chaque étape.",
//     check: true,
//   },
//   {
//     icon: <FaBell />,
//     title: "Pour les paiements en 2 fois,",
//     text: "être recontacté par le secrétariat",
//     link: "Cliquez ici",
//     check: false,
//   },
// ];

// const rightFeatures = [
//   {
//     icon: <FaFolder />,
//     title: "Constitution du dossier",
//     text: "Nous nous occupons de tout.",
//     check: true,
//   },
//   {
//     icon: <FaUsers />,
//     title: "Accès espace élèves illimité",
//     text: "Suivi, documents et échanges facilités.",
//     check: true,
//   },
//   {
//     icon: <FaGraduationCap />,
//     title: "Accompagnement pédagogique",
//     text: "Une équipe à vos côtés à chaque étape.",
//     check: true,
//   },
//   {
//     icon: <FaBell />,
//     title: "Pour les paiements en 2 fois,",
//     text: "être recontacté par le secrétariat",
//     link: "Cliquez ici",
//     check: false,
//   },
// ];

// const Offers = () => {
//   return (
//     <section className="offers-section">
//       <div className="offers-wrapper">

//         {/* ================= LEFT CARD ================= */}

//         <div className="offer-card">

//           <div className="offer-badge purple-badge">
//             ★ OFFRE RECOMMANDÉE
//           </div>

//           <div className="offer-top">

//             <img
//               src={purplePermis}
//               alt=""
//               className="offer-title-img"
//             />

//             <img
//               src={purpleAuto}
//               alt=""
//               className="offer-box-img"
//             />

//           </div>

//           <div className="driver-image">
//             <img src={women} alt="" />
//           </div>

//           <div className="offer-price-area">

//             <div className="price-circle purple">

//               <span>1h</span>

//               <h2>45€</h2>

//             </div>

//             <div className="offer-points">

//               <div>
//                 <FaCheckCircle />
//                 <span>1h de conduite</span>
//               </div>

//               <div>
//                 <FaCheckCircle />
//                 <span>7h à 20h</span>
//               </div>

//               <div>
//                 <FaCheckCircle />
//                 <span>7 jours / 7</span>
//               </div>

//               <div>
//                 <FaCheckCircle />
//                 <span>Avec un(e) diplômé(e)</span>
//               </div>

//             </div>

//           </div>

//           <button className="choose-btn purple-btn">
//             Choisir cette offre
//           </button>

//           <div className="features">

//             {leftFeatures.map((item, index) => (

//               <div className="feature" key={index}>

//                 <div className="feature-icon">
//                   {item.icon}
//                 </div>

//                 <div className="feature-content">

//                   <h4>{item.title}</h4>

//                   <p>
//                     {item.text}

//                     {item.link && (
//                       <span className="feature-link">
//                         {item.link}
//                       </span>
//                     )}

//                   </p>

//                 </div>

//                 {item.check && (
//                   <FaCheckCircle className="feature-check purple-check" />
//                 )}

//               </div>

//             ))}

//           </div>

//           <button className="contact-btn">
//             <span className="phone-circle">
//               <FaPhoneAlt />
//             </span>

//             ÊTRE RECONTACTÉ
//           </button>

//         </div>

//         {/* ================= RIGHT CARD ================= */}

//         <div className="offer-card">

//           <div className="offer-badge pink-badge">
//             ★ OFFRE RECOMMANDÉE
//           </div>

//           <div className="offer-top">

//             <img
//               src={pinkPermis}
//               alt=""
//               className="offer-title-img"
//             />

//             <img
//               src={pinkAuto}
//               alt=""
//               className="offer-box-img"
//             />

//           </div>

//           <div className="driver-image">
//             <img src={men} alt="" />
//           </div>

//           <div className="offer-price-area">

//             <div className="price-circle pink">

//               <span>1h</span>

//               <h2>38€</h2>

//             </div>

//             <div className="offer-points">

//               <div>
//                 <FaCheckCircle />
//                 <span>1h de conduite</span>
//               </div>

//               <div>
//                 <FaCheckCircle />
//                 <span>7h à 20h</span>
//               </div>

//               <div>
//                 <FaCheckCircle />
//                 <span>7 jours / 7</span>
//               </div>

//               <div>
//                 <FaCheckCircle />
//                 <span>Avec un(e) diplômé(e)</span>
//               </div>

//             </div>

//           </div>

//           <button className="choose-btn pink-btn">
//             Choisir cette offre
//           </button>

//           <div className="features">

//             {rightFeatures.map((item, index) => (

//               <div className="feature" key={index}>

//                 <div className="feature-icon">
//                   {item.icon}
//                 </div>

//                 <div className="feature-content">

//                   <h4>{item.title}</h4>

//                   <p>

//                     {item.text}

//                     {item.link && (
//                       <span className="feature-link">
//                         {item.link}
//                       </span>
//                     )}

//                   </p>

//                 </div>

//                 {item.check && (
//                   <FaCheckCircle className="feature-check pink-check" />
//                 )}

//               </div>

//             ))}

//           </div>

//           <button className="contact-btn">
//             <span className="phone-circle">
//               <FaPhoneAlt />
//             </span>

//             ÊTRE RECONTACTÉ
//           </button>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default Offers;