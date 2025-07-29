'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Home, Brain, Users, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/quiz', icon: Brain, label: 'Quiz LoL' },
  { href: '/tierlist', icon: Users, label: 'Tier List' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass-card border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-br from-lol-blue to-lol-purple rounded-xl shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                League Squad
              </h1>
              <p className="text-sm text-gray-400">Performance tracking immersif</p>
            </div>
          </motion.div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-lol-blue to-lol-purple text-white shadow-lg' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </motion.button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
} 