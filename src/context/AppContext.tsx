import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, GermanLevel, User } from '@/types';
import i18n from '@/i18n';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  uiLanguage: SupportedLanguage;
  setUiLanguage: (lang: SupportedLanguage) => void;
  currentLevel: GermanLevel;
  setCurrentLevel: (level: GermanLevel) => void;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  setIsOnboarding: (value: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [uiLanguage, setUiLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('uiLanguage') as SupportedLanguage) || 'en';
  });

  const [currentLevel, setCurrentLevelState] = useState<GermanLevel>(() => {
    return (localStorage.getItem('currentLevel') as GermanLevel) || 'A1';
  });

  const [isOnboarding, setIsOnboarding] = useState(() => {
    return !localStorage.getItem('onboardingComplete');
  });

  const setUiLanguage = (lang: SupportedLanguage) => {
    setUiLanguageState(lang);
    localStorage.setItem('uiLanguage', lang);
    i18n.changeLanguage(lang);
    
    // Set document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setCurrentLevel = (level: GermanLevel) => {
    setCurrentLevelState(level);
    localStorage.setItem('currentLevel', level);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingComplete');
    setIsOnboarding(true);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.dir = uiLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [uiLanguage]);

  const value: AppContextType = {
    user,
    setUser,
    uiLanguage,
    setUiLanguage,
    currentLevel,
    setCurrentLevel,
    isAuthenticated: !!user,
    isOnboarding,
    setIsOnboarding,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
