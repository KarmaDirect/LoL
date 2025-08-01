'use client';

import { motion } from 'framer-motion';
import { Target, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DailyQuizPreview() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-lol-purple/20 rounded-lg">
            <Target className="w-6 h-6 text-lol-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quiz Quotidien</h3>
            <p className="text-sm text-gray-400">Testez vos connaissances LoL</p>
          </div>
        </div>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>
      
      <p className="text-gray-300 mb-4">
        Nouveau quiz disponible ! Testez vos connaissances sur les champions, les items et les mécaniques du jeu.
      </p>
      
      <Link href="/daily-quiz">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lol-button w-full"
        >
          <Target className="w-4 h-4" />
          <span>Commencer le quiz</span>
        </motion.button>
      </Link>
    </motion.div>
  );
} 