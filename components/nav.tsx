'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, BarChart2, Zap } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/matches', label: 'Matches', icon: Calendar },
  { href: '/standings', label: 'Table', icon: BarChart2 },
  { href: '/insights', label: 'Insights', icon: Zap },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-nav bg-white border-t border-black/[0.06]">
      <div className="flex items-center justify-around h-[4.5rem] max-w-lg mx-auto px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 min-w-[64px] py-2 relative">
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(74,94,42,0.08)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <motion.div
                animate={{ color: active ? '#4a5e2a' : '#aaa', scale: active ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </motion.div>
              <span className="text-[10px] font-semibold relative z-10 transition-colors duration-200"
                style={{ color: active ? '#4a5e2a' : '#bbb' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
