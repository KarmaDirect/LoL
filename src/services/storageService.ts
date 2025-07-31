import { StoredSummoner } from '@/types/league';

const STORAGE_KEY = 'league-tracker-summoners';

export function getStoredSummoners(): StoredSummoner[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture du stockage local:', error);
    return [];
  }
}

// Fonction de migration pour convertir les noms au format Nom#Tag
export function migrateSummonerNames(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const summoners = getStoredSummoners();
    let hasChanges = false;
    
    const migratedSummoners = summoners.map(summoner => {
      // Si le nom ne contient pas de #, ajouter un tag par défaut
      if (!summoner.name.includes('#')) {
        hasChanges = true;
        console.log(`🔄 Migration: ${summoner.name} -> ${summoner.name}#EUW`);
        return {
          ...summoner,
          name: `${summoner.name}#EUW`
        };
      }
      return summoner;
    });
    
    if (hasChanges) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedSummoners));
      console.log('✅ Migration des noms de summoners terminée');
    }
  } catch (error) {
    console.error('Erreur lors de la migration des noms:', error);
  }
}

export function addSummoner(name: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const summoners = getStoredSummoners();
    
    // Vérifier la limite de 15 pseudos (mise à jour pour V2)
    if (summoners.length >= 15) {
      throw new Error('Limite de 15 pseudos atteinte');
    }
    
    // Vérifier si le pseudo existe déjà
    if (summoners.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Ce pseudo existe déjà');
    }
    
    const newSummoner: StoredSummoner = {
      name: name.trim(),
    };
    
    summoners.push(newSummoner);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(summoners));
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du summoner:', error);
    throw error;
  }
}

export function removeSummoner(name: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const summoners = getStoredSummoners();
    const filtered = summoners.filter(s => s.name.toLowerCase() !== name.toLowerCase());
    
    if (filtered.length === summoners.length) {
      throw new Error('Pseudo non trouvé');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du summoner:', error);
    throw error;
  }
}

export function clearAllSummoners(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les summoners:', error);
  }
}

// Classe legacy pour compatibilité (optionnel)
export class StorageService {
  static getStoredSummoners = getStoredSummoners;
  static addSummoner = addSummoner;
  static removeSummoner = removeSummoner;
  static clearAllSummoners = clearAllSummoners;
} 