import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');
  const count = searchParams.get('count') || '10';
  const queue = searchParams.get('queue') || '420'; // Par défaut Solo/Duo

  if (!puuid) {
    return NextResponse.json(
      { message: 'PUUID requis' },
      { status: 400 }
    );
  }

  // Vérifier que la clé API est disponible
  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  if (!RIOT_API_KEY) {
    return NextResponse.json(
      { 
        message: 'Clé API Riot non configurée',
        error: 'La variable d\'environnement RIOT_API_KEY n\'est pas définie'
      },
      { status: 500 }
    );
  }

  try {
    // Construire l'URL avec le filtre queue
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${queue}&start=0&count=${count}`;
    
    console.log('🔍 Récupération des matchs:', url);

    const response = await axios.get(url, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY
      }
    });

    console.log('✅ Matchs trouvés:', response.data.length);
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('Erreur API Riot matches:', error.response?.data || error.message);
    
    return NextResponse.json(
      {
        message: 'Erreur API Riot',
        detail: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 