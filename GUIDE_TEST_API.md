# 🧪 **Test API Riot - Guide de validation**

## 🎯 **Problème identifié**
La variable d'environnement `RIOT_API_KEY` n'est pas chargée par Next.js dans les routes API.

## 🔧 **Solution appliquée**
1. ✅ **Configuration Next.js mise à jour** : `next.config.js` avec `env` section
2. ✅ **Routes API backend** : Tous les appels passent par `/api/*`
3. ✅ **Aucun appel direct** : Frontend n'appelle que les routes internes

## 🚀 **Pour tester maintenant :**

### **Étape 1 : Démarrer le serveur**
```bash
cd league-tracker
npm run dev
```

### **Étape 2 : Tester la route API**
Ouvrez votre navigateur et allez sur :
```
http://localhost:3000/api/test-riot
```

### **Étape 3 : Tester l'application**
1. **Ouvrez** : http://localhost:3000
2. **Ajoutez** : `Billy#V1EGO`
3. **Voyez** : Résultat

## 📊 **Résultats attendus**

### ✅ **Si ça fonctionne :**
- **Route API** : 200 OK avec données du summoner
- **Application** : Affichage des vraies données LoL

### ❌ **Si erreur 401/403 :**
- **Route API** : Erreur avec message clair
- **Application** : Basculement automatique en mode démo

## 🎮 **Test complet**

1. **Démarrez le serveur** : `npm run dev`
2. **Testez la route** : http://localhost:3000/api/test-riot
3. **Testez l'app** : http://localhost:3000 + ajoutez `Billy#V1EGO`

## 🎉 **Testez maintenant !**

**Démarrez le serveur et testez les routes API !** 