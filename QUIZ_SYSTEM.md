# Système de Quiz Quotidien LoL

## 🎯 Vue d'ensemble

Le système de quiz quotidien permet aux joueurs de tester leurs connaissances sur League of Legends avec 10 questions différentes chaque jour, sur une période de 10 jours.

## 📋 Fonctionnalités

### Quiz Quotidien
- **10 questions par jour** sélectionnées aléatoirement depuis une base de 100 questions
- **Rotation sur 10 jours** : les questions ne se répètent pas dans la même période
- **Système de difficulté** : facile, moyen, difficile
- **Catégories** : Champion, Lore, Esport, Item, Gameplay
- **Score sur 10 points** avec feedback immédiat

### Leaderboard
- **Classement quotidien** : top des scores du jour
- **Statistiques personnelles** : meilleur score, moyenne, jours joués
- **Statistiques globales** : participants, score moyen, meilleur score global
- **Top 10 des joueurs** : classement basé sur la moyenne des scores

### Interface
- **Design moderne** avec animations fluides
- **Responsive** : adapté mobile et desktop
- **Thème LoL** : couleurs et style cohérents avec l'univers du jeu
- **Feedback visuel** : indicateurs de difficulté, animations de progression

## 🗂️ Structure des fichiers

```
src/
├── types/
│   └── quiz.ts                    # Types TypeScript pour le quiz
├── services/
│   └── dailyQuizService.ts        # Logique métier du quiz quotidien
├── components/
│   ├── DailyQuiz.tsx             # Composant principal du quiz
│   ├── DailyQuizPreview.tsx      # Aperçu sur la page d'accueil
│   └── QuizStats.tsx             # Page des statistiques
├── app/
│   ├── daily-quiz/
│   │   └── page.tsx              # Page du quiz quotidien
│   └── quiz-stats/
│       └── page.tsx              # Page des statistiques
└── quizz/
    └── lol_quiz_vague_1.json     # Base de données des questions
```

## 📊 Format des données

### Questions JSON
```json
{
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": "Option 1",
  "difficulty": "facile|moyen|difficile",
  "category": "Champion|Lore|Esport|Item|Gameplay"
}
```

### Score
```typescript
{
  id: string;
  playerName: string;
  score: number; // sur 10
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  timeSpent: number;
  dayNumber: number;
}
```

## 🔄 Logique de rotation

1. **Génération initiale** : 100 questions réparties en 10 jours (10 questions/jour)
2. **Rotation automatique** : basée sur la date (modulo 10)
3. **Persistance** : données sauvegardées en localStorage
4. **Réinitialisation** : possible pour changer de vague de questions

## 🎮 Utilisation

### Pour les joueurs
1. Aller sur `/daily-quiz`
2. Entrer son pseudo
3. Répondre aux 10 questions du jour
4. Voir son score et le classement
5. Consulter ses statistiques

### Pour les administrateurs
- **Ajouter des questions** : modifier le fichier JSON
- **Changer de vague** : utiliser `resetDailyQuizData()`
- **Voir les statistiques** : aller sur `/quiz-stats`

## 🛠️ Fonctions principales

### `dailyQuizService.ts`
- `getCurrentDayQuestions()` : récupère les questions du jour
- `saveDailyQuizScore()` : sauvegarde un score
- `getCurrentDayLeaderboard()` : récupère le classement du jour
- `hasPlayerPlayedToday()` : vérifie si un joueur a déjà joué
- `getPlayerStats()` : récupère les stats d'un joueur
- `getDailyQuizStats()` : récupère les stats globales

## 🎨 Styles

Le système utilise les classes CSS existantes :
- `.glass-card` : cartes avec effet de verre
- `.lol-button` : boutons stylisés
- `.quiz-option` : options de quiz
- `.quiz-option-correct/incorrect` : feedback visuel

## 🔧 Configuration

### Variables d'environnement
Aucune configuration supplémentaire requise, le système fonctionne entièrement côté client.

### Personnalisation
- **Questions** : modifier `quizz/lol_quiz_vague_1.json`
- **Styles** : ajuster les classes CSS dans `globals.css`
- **Logique** : modifier `dailyQuizService.ts`

## 🚀 Déploiement

Le système est prêt à être déployé sans configuration supplémentaire. Toutes les données sont stockées localement dans le navigateur.

## 📈 Évolutions possibles

- **Mode multijoueur** : quiz en temps réel
- **Système de récompenses** : badges, achievements
- **Questions dynamiques** : génération automatique
- **Synchronisation** : base de données externe
- **Notifications** : rappels quotidiens 