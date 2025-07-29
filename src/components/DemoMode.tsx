'use client';

import { Info, Sparkles } from 'lucide-react';

export default function DemoMode() {
  return (
    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-blue-400 font-semibold mb-1">💡 Mode démo disponible</h4>
          <p className="text-blue-300 text-sm mb-2">
            Si vous n'avez pas de clé API Riot, vous pouvez tester l'application en mode démo.
          </p>
          <p className="text-blue-300 text-sm">
            <strong>Pour utiliser les vraies données :</strong> Configurez votre clé API Riot dans le fichier .env.local
          </p>
        </div>
      </div>
    </div>
  );
} 