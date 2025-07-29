// Configuration de l'API Riot Games
// 
// INSTRUCTIONS :
// 1. Allez sur https://developer.riotgames.com/
// 2. Créez un compte et obtenez une clé de développement gratuite
// 3. Ajoutez votre clé dans le fichier .env.local
// 4. La clé est limitée à 20 requêtes/seconde et 100 requêtes/2 minutes

export const RIOT_API_CONFIG = {
  // Clé API Riot Games (côté serveur uniquement)
  API_KEY: process.env.RIOT_API_KEY,
  
  // Région pour les données summoner
  REGION: process.env.RIOT_REGION || 'euw1',
  
  // Continent pour les données match
  CONTINENT: process.env.RIOT_CONTINENT || 'europe',
  
  // Limites de l'API
  RATE_LIMITS: {
    REQUESTS_PER_SECOND: 20,
    REQUESTS_PER_2_MINUTES: 100,
  },
};

// Vérification de la configuration
export function validateApiConfig() {
  if (!RIOT_API_CONFIG.API_KEY || RIOT_API_CONFIG.API_KEY === 'RGAPI-your-api-key-here') {
    console.warn('⚠️  ATTENTION: Clé API Riot Games non configurée !');
    console.warn('   Veuillez configurer votre clé API dans .env.local');
    console.warn('   Obtenez une clé gratuite sur https://developer.riotgames.com/');
    return false;
  }
  return true;
} 