import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export async function GET(request: NextRequest) {
  try {
    const summonerName = 'Billy#V1EGO'; // Pseudo de test de Billy

    // Vérifier que la clé API est disponible
    const RIOT_API_KEY = process.env.RIOT_API_KEY;
    if (!RIOT_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Clé API non trouvée dans les variables d\'environnement',
        message: 'La variable d\'environnement RIOT_API_KEY n\'est pas définie'
      }, { status: 500 });
    }
    
    console.log('🔑 Clé API utilisée:', RIOT_API_KEY.substring(0, 10) + '...');

    // Étape 1: Convertir le nom en PUUID via account-v1
    const [gameName, tagLine] = summonerName.split('#');
    
    if (!tagLine) {
      return NextResponse.json({
        success: false,
        error: 'Format invalide',
        message: 'Format invalide. Utilisez: Nom#Tag'
      }, { status: 400 });
    }

    console.log('🔍 Recherche du compte:', gameName, tagLine);

    const accountResponse = await axios.get(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY,
        },
      }
    );

    const account = accountResponse.data;
    console.log('✅ Compte trouvé:', account.gameName, account.tagLine);

    // Étape 2: Récupérer les infos summoner via summoner-v4/by-puuid
    const summonerResponse = await axios.get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY,
        },
      }
    );

    const summoner = summonerResponse.data;
    console.log('✅ Summoner trouvé:', summoner.name);

    return NextResponse.json({ 
      success: true, 
      message: 'Clé API fonctionnelle !', 
      data: {
        account,
        summoner
      }
    });
  } catch (error: any) {
    console.error('❌ Erreur API:', error.response?.data || error.message);
    
    return NextResponse.json({
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.status?.message || error.message,
      detail: error.response?.data || 'Erreur inconnue'
    }, { status: error.response?.status || 500 });
  }
} 