'use client';

import { Gamepad2, Trophy, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                League Squad Tracker
              </h1>
              <p className="text-sm text-gray-400">Performance tracking immersif</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link href="/">
              <button className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                pathname === '/' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}>
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </button>
            </Link>
            
            <Link href="/leaderboard">
              <button className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                pathname === '/leaderboard' 
                  ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}>
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 