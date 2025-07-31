import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const summonerName = searchParams.get('name');
  const action = searchParams.get('action'); // 'summoner' ou 'live'

  if (!summonerName) {
    return NextResponse.json({ error: 'Nom du summoner requis' }, { status: 400 });
  }

  const API_KEY = process.env.RIOT_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Clé API non configurée' }, { status: 500 });
  }

  try {
    // Vérifier si le nom contient un tag (format "Nom#Tag")
    const [gameName, tagLine] = summonerName.split('#');
    const hasTag = !!tagLine;

    if (!hasTag) {
      return NextResponse.json({ 
        error: 'Format invalide. Utilisez "Nom#Tag" (ex: Billy#V1EGO). Le format simple n\'est pas supporté avec cette clé API.' 
      }, { status: 400 });
    }

    if (action === 'live') {
      // Format "Nom#Tag" - utiliser account-v1 puis summoner-v4/by-puuid
      console.log(`🔍 Récupération via account-v1 pour ${gameName}#${tagLine}`);
      
      // 1. Récupérer le compte via account-v1
      const accountResponse = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        {
          headers: { 'X-Riot-Token': API_KEY },
        }
      );

      if (!accountResponse.ok) {
        console.error(`❌ Erreur account API: ${accountResponse.status} - ${accountResponse.statusText}`);
        return NextResponse.json({ error: `Erreur account API: ${accountResponse.status}` }, { status: accountResponse.status });
      }

      const accountData = await accountResponse.json();
      console.log(`✅ Account data récupéré - PUUID: ${accountData.puuid}`);

      // 2. Récupérer les données du summoner par PUUID
      const summonerResponse = await fetch(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`,
        {
          headers: { 'X-Riot-Token': API_KEY },
        }
      );

      if (!summonerResponse.ok) {
        console.error(`❌ Erreur summoner API: ${summonerResponse.status} - ${summonerResponse.statusText}`);
        return NextResponse.json({ error: `Erreur summoner API: ${summonerResponse.status}` }, { status: summonerResponse.status });
      }

      const summonerData = await summonerResponse.json();
      console.log(`✅ Summoner data récupéré - ID: ${summonerData.id}, Name: ${summonerData.name}`);

      // 3. Vérifier s'il est en partie
      const summonerId = summonerData.id || accountData.puuid; // Utiliser PUUID comme fallback
      console.log(`🔍 Vérification live game pour summoner ID: ${summonerId}`);
      const liveResponse = await fetch(
        `https://euw1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${summonerId}`,
        {
          headers: { 'X-Riot-Token': API_KEY },
        }
      );

      if (liveResponse.status === 404) {
        console.log(`ℹ️ ${summonerName} n'est pas en partie`);
        return NextResponse.json({ live: false });
      }

      if (!liveResponse.ok) {
        console.error(`❌ Erreur live API: ${liveResponse.status} - ${liveResponse.statusText}`);
        return NextResponse.json({ error: `Erreur live API: ${liveResponse.status}` }, { status: liveResponse.status });
      }

      const liveData = await liveResponse.json();
      console.log(`✅ ${summonerName} est en partie !`);
      return NextResponse.json({ live: true, game: liveData });

    } else {
      // Récupérer les données du summoner seulement
      // Format "Nom#Tag" - utiliser account-v1 puis summoner-v4/by-puuid
      console.log(`🔍 Récupération via account-v1 pour ${gameName}#${tagLine}`);
      
      // 1. Récupérer le compte via account-v1
      const accountResponse = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        {
          headers: { 'X-Riot-Token': API_KEY },
        }
      );

      if (!accountResponse.ok) {
        console.error(`❌ Erreur account API: ${accountResponse.status} - ${accountResponse.statusText}`);
        return NextResponse.json({ error: `Erreur account API: ${accountResponse.status}` }, { status: accountResponse.status });
      }

      const accountData = await accountResponse.json();
      console.log(`✅ Account data récupéré - PUUID: ${accountData.puuid}`);

      // 2. Récupérer les données du summoner par PUUID
      const summonerResponse = await fetch(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`,
        {
          headers: { 'X-Riot-Token': API_KEY },
        }
      );

      if (!summonerResponse.ok) {
        console.error(`❌ Erreur summoner API: ${summonerResponse.status} - ${summonerResponse.statusText}`);
        return NextResponse.json({ error: `Erreur summoner API: ${summonerResponse.status}` }, { status: summonerResponse.status });
      }

      const summonerData = await summonerResponse.json();
      console.log(`✅ Summoner data récupéré - ID: ${summonerData.id}, Name: ${summonerData.name}`);
      
      // L'API by-puuid ne retourne pas name et id, on les ajoute manuellement
      const enrichedSummonerData = {
        ...summonerData,
        name: gameName, // Utiliser le nom original fourni
        id: summonerData.id || accountData.puuid, // Utiliser PUUID comme fallback pour l'ID
        puuid: accountData.puuid // S'assurer que le PUUID est présent
      };
      
      return NextResponse.json(enrichedSummonerData);
    }
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
} 