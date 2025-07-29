'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface AddSummonerFormProps {
  onAddSummoner: (summonerName: string) => Promise<void>;
}

export default function AddSummonerForm({ onAddSummoner }: AddSummonerFormProps) {
  const [summonerName, setSummonerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!summonerName.trim()) {
      setError('Veuillez entrer un nom de summoner');
      return;
    }

    // Validation du format Nom#Tag
    if (!summonerName.includes('#')) {
      setError('Format invalide. Utilisez: Nom#Tag (ex: Billy#V1EGO)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onAddSummoner(summonerName.trim());
      setSummonerName('');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'ajout du joueur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="summonerName" className="block text-sm font-medium text-gray-300 mb-2">
          Nom du summoner
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="summonerName"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            placeholder="Billy#V1EGO"
            className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !summonerName.trim()}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Ajout...' : 'Ajouter'}</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="text-sm text-gray-400">
        <p>💡 Utilisez le format <code className="bg-gray-700/50 px-2 py-1 rounded">Nom#Tag</code> (ex: Billy#V1EGO)</p>
        <p>📊 Les données Solo/Duo seront automatiquement récupérées</p>
      </div>
    </form>
  );
} 