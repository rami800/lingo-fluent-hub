import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/learn', icon: BookOpen, label: t('nav.learn') },
    { path: '/progress', icon: BarChart3, label: t('nav.progress') },
    { path: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t safe-bottom">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 py-1 px-4 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-soft rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <span 
                className={`text-xs font-medium relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
