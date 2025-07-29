# 🔑 Guide API Riot Games - League Squad Tracker

## 🚨 Problème actuel : "Clé API invalide ou expirée"

### 📋 **Causes possibles :**

1. **Clé API expirée** (les clés de développement expirent après 24h)
2. **Clé non activée** (délai d'activation de quelques minutes)
3. **Limite de requêtes atteinte** (20/sec, 100/2min)
4. **Clé sans permissions** (nécessite les bonnes permissions)

### 🔧 **Solutions :**

#### **Option 1 : Renouveler la clé API**
1. Allez sur https://developer.riotgames.com/
2. Connectez-vous à votre compte
3. Générez une **nouvelle clé de développement**
4. Remplacez la clé dans `.env.local` :
   ```
   RIOT_API_KEY=VOTRE_NOUVELLE_CLE
   RIOT_REGION=euw1
   RIOT_CONTINENT=europe
   ```
5. Redémarrez le serveur : `npm run dev`

#### **Option 2 : Utiliser le mode démo (recommandé pour tester)**
1. L'application bascule automatiquement en mode démo en cas d'erreur API
2. Cliquez sur "Mode démo" dans l'interface
3. Testez toutes les fonctionnalités avec des données fictives

### 🎯 **Fonctionnalités disponibles :**

✅ **Mode démo** : Interface complète avec données fictives
✅ **Ajout/suppression** de joueurs
✅ **Leaderboard** avec tri et détails
✅ **Stats du squad** en temps réel
✅ **Design responsive** et moderne

### 🚀 **Pour tester l'application :**

1. **Ouvrez** http://localhost:3000
2. **Cliquez sur "Mode démo"** pour voir les données fictives
3. **Ajoutez des joueurs** avec le formulaire
4. **Testez le leaderboard** : http://localhost:3000/leaderboard
5. **Explorez toutes les fonctionnalités**

### 📞 **Support :**

- **Mode démo** : Fonctionne immédiatement sans API
- **API Riot** : Nécessite une clé valide et active
- **Interface** : Complètement fonctionnelle dans les deux modes

---

**💡 Conseil :** Utilisez le mode démo pour tester l'interface, puis activez l'API Riot quand vous avez une clé valide ! 