// Script de test pour Billy
// À exécuter dans la console du navigateur

console.log('🧪 Test pour Billy...');

async function testBilly() {
  try {
    console.log(`\n🔍 Test pour: Billy#V1EGO`);
    
    const response = await fetch(`/api/summoner?name=${encodeURIComponent('Billy#V1EGO')}`);
    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Succès:`, data);
      console.log(`Nom: ${data.name}`);
      console.log(`ID: ${data.id}`);
      console.log(`PUUID: ${data.puuid}`);
    } else {
      const error = await response.json();
      console.log(`❌ Erreur:`, error.error);
    }
  } catch (error) {
    console.error(`❌ Exception:`, error);
  }
}

// Exécuter le test
testBilly(); 