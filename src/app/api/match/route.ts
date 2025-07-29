import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json(
      { message: 'ID du match requis' },
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
    const response = await axios.get(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Erreur API Riot match:', error.response?.data || error.message);
    
    return NextResponse.json(
      {
        message: 'Erreur API Riot',
        detail: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 