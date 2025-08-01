'use client';

import { motion } from 'framer-motion';
import { Radio, Users, Clock } from 'lucide-react';

export default function LiveStatusSection() {
  // Simulation de données en direct
  const livePlayers = 0; // À connecter avec l'API Riot plus tard
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lol-green/20 rounded-lg">
              <Radio className="w-6 h-6 text-lol-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Statut en Direct</h3>
              <p className="text-sm text-gray-400">Joueurs actuellement en partie</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-lol-green">
            <div className="w-2 h-2 bg-lol-green rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">En direct</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Users className="w-8 h-8 text-lol-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{livePlayers}</div>
            <div className="text-sm text-gray-400">En partie</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Clock className="w-8 h-8 text-lol-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">--</div>
            <div className="text-sm text-gray-400">Temps moyen</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Radio className="w-8 h-8 text-lol-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">--</div>
            <div className="text-sm text-gray-400">Parties actives</div>
          </div>
        </div>
        
        {livePlayers === 0 && (
          <div className="text-center py-6 text-gray-400">
            <Radio className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun joueur en partie actuellement</p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 