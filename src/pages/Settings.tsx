import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, GraduationCap, LogOut, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/AppContext';
import { useAuthContext } from '@/context/AuthContext';
import { SupportedLanguage, GermanLevel } from '@/types';

const languages: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

const levels: { id: GermanLevel; name: string; description: string }[] = [
  { id: 'A1', name: 'A1 - Anfänger', description: 'Beginner' },
  { id: 'A2', name: 'A2 - Grundlagen', description: 'Elementary' },
  { id: 'B1', name: 'B1 - Mittelstufe', description: 'Intermediate' },
  { id: 'B2', name: 'B2 - Fortgeschritten', description: 'Upper Intermediate' },
  { id: 'C1', name: 'C1 - Fachkundig', description: 'Advanced' },
  { id: 'C2', name: 'C2 - Experte', description: 'Mastery' },
];

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uiLanguage, setUiLanguage, currentLevel, setCurrentLevel } = useApp();
  const { user, profile, signOut, updateProfile } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    setUiLanguage(lang);
    if (profile) {
      await updateProfile({ preferred_language: lang });
    }
  };

  const handleLevelChange = async (level: GermanLevel) => {
    setCurrentLevel(level);
    if (profile) {
      await updateProfile({ current_level: level });
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{t('settings.title', 'Settings')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {profile?.display_name || user?.email?.split('@')[0]}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {currentLevel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {profile?.total_xp || 0} XP
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Language Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t('settings.language', 'App Language')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <Card
                key={lang.code}
                className={`p-3 cursor-pointer transition-all ${
                  uiLanguage === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {uiLanguage === lang.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Level Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t('settings.level', 'German Level')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {levels.map((level) => (
              <Card
                key={level.id}
                className={`p-3 cursor-pointer transition-all ${
                  currentLevel === level.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleLevelChange(level.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{level.id}</span>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                  {currentLevel === level.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Sign Out */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? t('settings.signingOut', 'Signing out...') : t('settings.signOut', 'Sign Out')}
          </Button>
        </motion.section>
      </div>
    </div>
  );
}
