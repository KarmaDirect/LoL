'use client';

import { motion } from 'framer-motion';
import { Trophy, Calendar, Radio, Users, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/daily-quiz', icon: Calendar, label: 'Quiz Quotidien' },
  { href: '/live', icon: Radio, label: 'Suivi Direct' },
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
          {/* Logo cliquable */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 cursor-pointer"
            >
              <div className="p-2 bg-black rounded-xl shadow-lg border border-red-500/30">
                <Image
                  src="/vrai-logo.png"
                  alt="Les Parias Logo"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  Les Parias
                </h1>
              </div>
            </motion.div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 min-w-[120px] justify-center ${
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