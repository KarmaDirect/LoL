# 🧪 Test API avec Billy#V1EGO

## 🎯 **Objectif : Tester vos vraies données LoL**

### 📋 **Étapes pour tester :**

1. **Ouvrez l'application** : http://localhost:3000

2. **Ajoutez votre pseudo** :
   - Dans le champ "Nom du summoner (EUW)"
   - Tapez : `Billy#V1EGO`
   - Cliquez sur "Ajouter le joueur"

3. **Attendez le chargement** :
   - L'application va récupérer vos vraies données
   - Si la clé API n'est pas encore active, vous verrez un message d'erreur

### 🔍 **Ce que vous devriez voir :**

#### **Si l'API fonctionne :**
- ✅ Votre rang LoL (Tier + Division + LP)
- ✅ Votre winrate et nombre de games
- ✅ Vos 3 dernières games avec :
  - Champion joué
  - KDA (Kills/Deaths/Assists)
  - CS par minute
  - Dégâts infligés
  - Vision score
  - Durée de la game
  - Résultat (Victoire/Défaite)
  - Brief fun personnalisé

#### **Si la clé API n'est pas encore active :**
- ⚠️ Message d'erreur "Clé API invalide ou expirée"
- 💡 L'application basculera automatiquement en mode démo

### 🛠️ **En cas de problème :**

#### **Erreur 401/403 :**
- La clé API n'est pas encore active
- Attendez 5-15 minutes après la génération
- Ou générez une nouvelle clé sur https://developer.riotgames.com/

#### **Erreur 404 :**
- Le pseudo n'existe pas sur EUW
- Vérifiez l'orthographe exacte

#### **Erreur 429 :**
- Limite de requêtes dépassée
- Attendez quelques secondes

### 🎮 **Test via l'interface :**

1. **Page principale** : http://localhost:3000
   - Ajoutez `Billy#V1EGO`
   - Voyez vos stats en temps réel

2. **Leaderboard** : http://localhost:3000/leaderboard
   - Votre classement dans le squad
   - Tri par rang/winrate/LP

### 📊 **Données attendues :**

Pour chaque game, vous devriez voir :
```
🎮 Game 1:
   Champion: [Votre champion]
   Rôle: [Votre rôle]
   KDA: X/Y/Z (ratio)
   CS: XXX (X.X/min)
   Dégâts: XXX,XXX
   Vision: XX
   Durée: XXmin
   Résultat: 🏆 VICTOIRE ou 💀 DÉFAITE
   Brief: [Message personnalisé]
```

### 🔄 **Actualisation :**

- Cliquez sur "Actualiser" pour récupérer les dernières games
- L'application met à jour automatiquement les données

---

## 🎉 **Résultat attendu :**

**Vos vraies données LoL affichées en temps réel !**

- ✅ Stats réelles de votre compte
- ✅ Historique de vos dernières games
- ✅ Analyse personnalisée de vos performances
- ✅ Interface moderne et responsive

**Testez maintenant avec votre pseudo `Billy#V1EGO` !** 🏆 