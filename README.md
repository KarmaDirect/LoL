# 🏆 League Squad Tracker

Une application moderne et élégante pour suivre les performances de votre équipe League of Legends avec des briefings personnalisés et des analyses détaillées.

## ✨ Fonctionnalités

### 🎯 **Fonctionnalités Principales**
- **Suivi des joueurs** : Ajoutez jusqu'à 10 summoners (EUW)
- **Statistiques détaillées** : KDA, dégâts, CS/min, vision score
- **Briefings personnalisés** : Messages humoristiques générés automatiquement
- **Mode démo** : Testez l'application sans clé API
- **Design moderne** : Interface inspirée de DPM.LOL

### 🎨 **Design Moderne**
- **Thème sombre** professionnel
- **Effet glass UI** avec transparence
- **Gradients colorés** cyan-violet
- **Animations fluides** et micro-interactions
- **Responsive design** mobile et desktop

### 📊 **Statistiques Affichées**
- **KDA** : Kills, Deaths, Assists
- **Dégâts infligés** : En milliers (k)
- **CS/min** : Creep Score par minute
- **Vision Score** : Contrôle de vision
- **Impact Score** : Score de performance personnalisé
- **Durée de partie** : En minutes

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd league-tracker

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

### Accès
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎮 Utilisation

### Mode Démo (Recommandé pour commencer)
1. Cliquez sur **"Mode démo"**
2. Explorez l'interface avec des données fictives
3. Testez toutes les fonctionnalités

### Mode API Riot Games
1. Obtenez une clé API gratuite sur [developer.riotgames.com](https://developer.riotgames.com/)
2. Remplacez la clé dans `src/config/api.ts`
3. Ajoutez des pseudos réels
4. Profitez des vraies données !

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** : Framework React moderne
- **React 18** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Tailwind CSS 3** : Framework CSS utilitaire
- **Lucide React** : Icônes modernes

### Backend & API
- **Riot Games API** : Données LoL officielles
- **Axios** : Client HTTP
- **Local Storage** : Persistance des données

### Design
- **Glass UI** : Effet de verre moderne
- **Gradients** : Dégradés colorés
- **Animations CSS** : Transitions fluides
- **Responsive** : Mobile-first design

## 📁 Structure du Projet

```
league-tracker/
├── src/
│   ├── app/                 # Pages Next.js
│   ├── components/          # Composants React
│   ├── services/           # Services (API, storage)
│   ├── types/              # Types TypeScript
│   ├── config/             # Configuration
│   └── data/               # Données mock
├── public/                 # Assets statiques
├── tailwind.config.js      # Configuration Tailwind
└── package.json           # Dépendances
```

## 🎨 Palette de Couleurs

```css
/* Couleurs principales */
--background-primary: #111722    /* Fond principal */
--background-secondary: #1A1F26  /* Cartes */
--background-card: #2A3038       /* Éléments */

/* Accents */
--accent-cyan: #00FFF7          /* Cyan fluo */
--accent-purple: #8B5CF6        /* Violet */
--accent-green: #10B981         /* Vert */
--accent-red: #EF4444           /* Rouge */

/* Texte */
--text-primary: #E5E5E5         /* Texte principal */
--text-secondary: #9CA3AF       /* Texte secondaire */
```

## 🔧 Configuration API

### Clé API Riot Games
1. Créez un compte sur [developer.riotgames.com](https://developer.riotgames.com/)
2. Générez une clé de développement gratuite
3. Remplacez `API_KEY` dans `src/config/api.ts`

### Limites API
- **20 requêtes/seconde**
- **100 requêtes/2 minutes**
- **Expiration** : 24h (clés de développement)

## 📱 Responsive Design

L'application s'adapte parfaitement à tous les écrans :
- **Mobile** : Interface optimisée tactile
- **Tablette** : Layout adaptatif
- **Desktop** : Expérience complète

## 🎯 Fonctionnalités Avancées

### Briefings Personnalisés
- **Messages humoristiques** générés automatiquement
- **Analyse des performances** basée sur KDA, dégâts, vision
- **Badges de performance** : GODLIKE, WIN, LOSE, CATASTROPHE

### Statistiques Globales
- **Nombre de joueurs** suivis
- **Total des parties** analysées
- **Win rate global** de l'équipe

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
# Déployez sur Vercel
```

### Autres Plateformes
```bash
npm run build
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🙏 Remerciements

- **Riot Games** pour l'API officielle
- **DPM.LOL** pour l'inspiration design
- **Next.js** et **Tailwind CSS** pour les outils

---

**League Squad Tracker** - Suivez vos performances LoL avec style ! 🏆
