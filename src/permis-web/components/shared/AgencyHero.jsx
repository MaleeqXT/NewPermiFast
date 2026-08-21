import React, { useEffect, useRef, useState } from "react";
import "./AgencyHero.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

/* ─── Enable all map interactions + auto-fit bounds ─── */
const FitBounds = () => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([
      [43.5993, 1.4148],
      [49.2590, 2.4840],
      [48.9362, 2.3574],
    ]);
    map.fitBounds(bounds, { padding: [80, 80] });
  }, [map]);
  return null;
};

/* ─── Custom agency marker with floating label ───────
   Green ring → white fill → green dot + label beside it */
const makeAgencyIcon = (name, dept) =>
  L.divIcon({
    className: "",
    html: `
      <div class="af-marker-wrap">
        <div class="af-marker">
          <div class="af-marker__ring"></div>
          <div class="af-marker__white"></div>
          <div class="af-marker__dot"></div>
        </div>
        <div class="af-label">
          <div class="af-label__name">${name}</div>
          <div class="af-label__dept">(${dept})</div>
        </div>
      </div>
    `,
    iconSize: [130, 44],
    iconAnchor: [14, 22],   /* anchor on the marker circle center */
    popupAnchor: [0, -22],
  });

/* ─── Plain city name label (no marker circle) ───────── */
const makeCityLabel = (name) =>
  L.divIcon({
    className: "",
    html: `<span class="af-city">${name}</span>`,
    iconSize: [72, 16],
    iconAnchor: [36, 8],
  });

/* ─── Data ───────────────────────────────────────────── */
const agencies = [
  { id: 1, name: "Toulouse",    dept: "31", lat: 43.5993, lng: 1.4148,
    address: "139 Boulevard Déodat de Séverac, 31300 Toulouse" },
  { id: 2, name: "Creil",       dept: "60", lat: 49.2590, lng: 2.4840,
    address: "15 Rue des Pierres, 60100 Creil" },
  { id: 3, name: "Saint-Denis", dept: "93", lat: 48.9362, lng: 2.3574,
    address: "Boulevard André Netwiller, 93200 Saint-Denis" },
];

/*
  Curved dashed path – flows: Toulouse → up-right arc → Saint-Denis → small arc up to Creil.
  We go south-to-north visually (Toulouse at bottom, Creil at top) matching the screenshot.
*/
const curvePath = [
  [43.5993, 1.4148],  // Toulouse
  [44.6,    1.9  ],
  [45.5,    2.1  ],
  [46.5,    2.3  ],
  [47.5,    2.4  ],
  [48.5,    2.38 ],
  [48.9362, 2.3574],  // Saint-Denis
  [49.0,    2.38 ],
  [49.15,   2.43 ],
  [49.2590, 2.4840],  // Creil
];

const cityLabels = [
  { name: "Lille",     lat: 50.629, lng: 3.057  },
  { name: "Rennes",    lat: 48.117, lng: -1.678 },
  { name: "Nantes",    lat: 47.218, lng: -1.554 },
  { name: "Bordeaux",  lat: 44.838, lng: -0.579 },
  { name: "Lyon",      lat: 45.764, lng: 4.836  },
  { name: "Marseille", lat: 43.297, lng: 5.370  },
];

/* ─── Component ──────────────────────────────────────── */
const AgencyHero = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className={`agencyfinder-section${visible ? " agencyfinder-section--visible" : ""}`}
      ref={sectionRef}
    >
      <div className="agencyfinder-container">

        {/* ══ LEFT COLUMN ══ */}
        <div className="agencyfinder-left">

          <div className="agencyfinder-label">
            <span className="agencyfinder-label__dot" />
            <span className="agencyfinder-label__text">RÉSEAU NATIONAL</span>
          </div>

          <h1 className="agencyfinder-heading">
            <span className="agencyfinder-heading__dark">Trouvez l'agence</span>
            <span className="agencyfinder-heading__green">la plus proche de vous.</span>
          </h1>

          <p className="agencyfinder-desc">
            PassPermisFacile, c'est un réseau d'auto-écoles<br />
            de proximité pour vous accompagner vers la réussite.
          </p>

          <div className="agencyfinder-stats">
            <div className="agencyfinder-stat">
              <svg className="agencyfinder-stat__icon" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#58B526" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="#58B526" strokeWidth="1.8"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#58B526" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div className="agencyfinder-stat__body">
                <span className="agencyfinder-stat__value">+ de 1200 élèves</span>
                <span className="agencyfinder-stat__label">accompagnés</span>
              </div>
            </div>
            <div className="agencyfinder-stat">
              <svg className="agencyfinder-stat__icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#58B526" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="agencyfinder-stat__body">
                <span className="agencyfinder-stat__value">4,8/5</span>
                <span className="agencyfinder-stat__label">sur plus de 300 avis</span>
              </div>
            </div>
          </div>

          <div className="agencyfinder-search">
            <div className="agencyfinder-search__input-wrap">
              <svg className="agencyfinder-search__pin" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#9ca3af" strokeWidth="1.8"/>
                <circle cx="12" cy="9" r="2.5" stroke="#9ca3af" strokeWidth="1.8"/>
              </svg>
              <input
                type="text"
                className="agencyfinder-search__input"
                placeholder="Entrez votre ville ou code postal"
              />
            </div>
            <button className="agencyfinder-search__btn">Rechercher</button>
          </div>

        </div>

        {/* ══ RIGHT / MAP ══ */}
        <div className="agencyfinder-map-wrap">

          <MapContainer
            center={[46.5, 2.4]}
            zoom={6}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            touchZoom={true}
            keyboard={true}
            className="agencyfinder-map"
          >
            <FitBounds />

            {/* CartoDB Positron – clean white/grey minimal tiles, no API key needed */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={19}
            />

            {/* Dashed curved connection line */}
            <Polyline
              positions={curvePath}
              pathOptions={{
                color: "#58B526",
                weight: 2.2,
                dashArray: "7 7",
                lineCap: "round",
                lineJoin: "round",
                opacity: 0.85,
              }}
            />

            {/* City background labels */}
            {cityLabels.map(c => (
              <Marker
                key={c.name}
                position={[c.lat, c.lng]}
                icon={makeCityLabel(c.name)}
                interactive={false}
              />
            ))}

            {/* Agency markers */}
            {agencies.map(a => (
              <Marker
                key={a.id}
                position={[a.lat, a.lng]}
                icon={makeAgencyIcon(a.name, a.dept)}
                interactive={false}
              />
            ))}
          </MapContainer>

          {/* Floating legend — top-right */}
          <div className="agencyfinder-legend">
            <div className="agencyfinder-legend__row">
              <span className="agencyfinder-legend__marker agencyfinder-legend__marker--green" />
              <span className="agencyfinder-legend__text">Agences ouvertes</span>
            </div>
            <div className="agencyfinder-legend__row">
              <span className="agencyfinder-legend__marker agencyfinder-legend__marker--gray" />
              <span className="agencyfinder-legend__text">Prochainement</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AgencyHero;
