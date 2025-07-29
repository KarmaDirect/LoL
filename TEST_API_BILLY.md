# 🧪 **Test API Riot - Billy#V1EGO**

## 🎯 **Objectif**
Valider le bon fonctionnement de votre clé API Riot approuvée avec le pseudo `Billy#V1EGO`.

## 🔐 **Clé API configurée**
```
RIOT_API_KEY=RGAPI-861b2a54-7487-4c82-af50-7aed6ff86ad6
```

## 🚀 **Comment tester**

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

### **Étape 3 : Interpréter les résultats**

#### ✅ **Si ça fonctionne (200 OK) :**
```json
{
  "success": true,
  "message": "Clé API fonctionnelle !",
  "data": {
    "id": "...",
    "accountId": "...",
    "puuid": "...",
    "name": "Billy#V1EGO",
    "profileIconId": 123,
    "revisionDate": 1234567890,
    "summonerLevel": 123
  }
}
```

#### ❌ **Si erreur 401 :**
```json
{
  "success": false,
  "status": 401,
  "message": "Cannot process request apikey or authorization header is empty"
}
```
**Cause :** Clé API non transmise ou absente

#### ❌ **Si erreur 403 :**
```json
{
  "success": false,
  "status": 403,
  "message": "Forbidden"
}
```
**Cause :** Clé API non autorisée ou restrictions

#### ❌ **Si erreur 404 :**
```json
{
  "success": false,
  "status": 404,
  "message": "Data not found"
}
```
**Cause :** Pseudo `Billy#V1EGO` introuvable sur EUW

## 🎮 **Test dans l'application**

1. **Ouvrez** : http://localhost:3000
2. **Ajoutez** : `Billy#V1EGO`
3. **Voyez** : Vos vraies données LoL ou mode démo

## 📊 **Résultats attendus**

| Résultat | Signification | Action |
|----------|---------------|---------|
| 200 OK + données | ✅ API fonctionnelle | Tout est prêt ! |
| 401 Unauthorized | ❌ Clé non transmise | Vérifier .env.local |
| 403 Forbidden | ❌ Clé non autorisée | Attendre activation |
| 404 Not Found | ❌ Pseudo introuvable | Vérifier le pseudo |

## 🎉 **Testez maintenant !**

**Allez sur http://localhost:3000/api/test-riot pour voir le résultat !** 