// Script de test pour vérifier l'API route directement
// À exécuter dans la console du navigateur

console.log('🧪 Test de l\'API route summoner...');

async function testSummonerAPI(summonerName) {
  try {
    console.log(`🔍 Test pour: ${summonerName}`);
    
    // Test 1: Récupération des données du summoner
    const summonerResponse = await fetch(`/api/summoner?name=${encodeURIComponent(summonerName)}`);
    console.log(`📊 Status summoner: ${summonerResponse.status}`);
    
    if (summonerResponse.ok) {
      const summonerData = await summonerResponse.json();
      console.log(`✅ Summoner data:`, summonerData);
      
      // Test 2: Vérification live game
      const liveResponse = await fetch(`/api/summoner?name=${encodeURIComponent(summonerName)}&action=live`);
      console.log(`📊 Status live: ${liveResponse.status}`);
      
      if (liveResponse.ok) {
        const liveData = await liveResponse.json();
        console.log(`✅ Live data:`, liveData);
      } else {
        const errorData = await liveResponse.json();
        console.log(`❌ Live error:`, errorData);
      }
    } else {
      const errorData = await summonerResponse.json();
      console.log(`❌ Summoner error:`, errorData);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${summonerName}:`, error);
  }
}

// Tester avec différents noms
const testNames = [
  'Billy#V1EGO',
  'Stewie2k#ABC'
];

console.log('🚀 Début des tests...');
testNames.forEach(name => {
  setTimeout(() => testSummonerAPI(name), 1000);
}); 