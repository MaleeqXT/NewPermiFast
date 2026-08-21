# Structure du projet frontend — PassPermis Facile

Ce projet est une application React construite avec Vite. Le code source est dans `src/` et le résultat compilé est dans `dist/`.

```text
passpermis_frontEnd-main/
├── src/                         # Code React principal
│   ├── App.jsx                   # Routes, authentification et shell admin
│   ├── main.jsx                  # Point de démarrage React
│   ├── App.css                   # Styles généraux
│   ├── assets/                   # Logos, images et médias locaux
│   ├── Components/               # Écrans et composants espace admin
│   │   ├── dashboard/            # Dashboard général admin
│   │   ├── candidates/           # Liste et profil des candidats
│   │   ├── monitors/             # Gestion des moniteurs
│   │   ├── students/             # Gestion des élèves
│   │   ├── message-clients/      # Messages du formulaire public
│   │   ├── request-cancellations/# Demandes d'annulation
│   │   ├── shared/               # Composants partagés (sidebar, médias...)
│   │   └── ...                   # Écoles, facturation, CPF, examens, etc.
│   ├── studentdashboard/         # Espace élève
│   │   ├── StudentsDashboard.jsx # Dashboard élève
│   │   ├── Commander.jsx         # Catalogue, panier et paiement Stripe
│   │   ├── StudentProfile.jsx    # Profil élève
│   │   ├── SessionDrawer.jsx     # Détail / annulation d'une séance
│   │   └── ...
│   ├── monitordashboard/         # Espace moniteur
│   │   ├── MonitorDashboard.jsx  # Dashboard moniteur
│   │   ├── AvailabilityDrawer.jsx# Création de disponibilités
│   │   ├── BookingDrawer.jsx     # Détail des réservations
│   │   └── ...
│   ├── mainsecretary/            # Variantes des écrans pour secrétaire
│   ├── sessions/                 # Calendriers, réservations et séances
│   ├── Orders/                   # Commandes, offres, paniers et factures
│   ├── Preferences/              # Zones, lieux, codes postaux, compétences
│   ├── permis-web/               # Site public PassPermis Facile
│   │   ├── pages/                # Home, login, packages, contact, CPF...
│   │   ├── components/shared/    # Navbar, Packages, CartDrawer, ContactForm...
│   │   ├── context/CartContext.jsx # Panier public persistant
│   │   ├── data/                 # Données et contenus statiques
│   │   └── assets/               # Images du site public
│   ├── redux/                    # État global Redux
│   │   ├── store.jsx             # Configuration Redux
│   │   └── reducers/             # Auth, écoles, offres, réservations...
│   └── helpers/http.jsx          # Client API Axios et jeton d'authentification
├── public/                       # Fichiers publics copiés tels quels au build
├── dist/                         # Version compilée, prête à déployer
│   ├── index.html                # Point d'entrée HTML généré
│   ├── assets/                   # JavaScript, CSS, images et médias optimisés
│   ├── favicon.svg               # Icône du site
│   └── icons.svg                 # Sprite d'icônes
├── index.html                    # Template HTML Vite utilisé pendant le build
├── package.json                  # Dépendances et scripts npm
├── package-lock.json             # Versions exactes des dépendances
├── vite.config.js                # Configuration Vite
├── eslint.config.js              # Règles de qualité JavaScript
├── .env                          # Variables frontend (API et clé Stripe)
└── README.md                     # Documentation de base du projet
```

## Dossier `dist/`

`dist/` est créé ou mis à jour avec la commande :

```bash
npm run build
```

Il ne contient pas le code source modifiable. Il contient les fichiers optimisés que le serveur web doit servir en production :

- `dist/index.html` charge l'application.
- `dist/assets/index-*.js` contient le JavaScript React compilé.
- `dist/assets/index-*.css` contient les styles compilés.
- Les autres fichiers dans `dist/assets/` sont les logos, images, vidéos et autres ressources optimisées.

Pour modifier une page, il faut toujours modifier les fichiers de `src/`, puis relancer `npm run build` pour régénérer `dist/`.
