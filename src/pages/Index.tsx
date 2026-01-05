import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { LevelSelector } from '@/components/LevelSelector';
import { ScenarioList } from '@/components/ScenarioList';
import { LessonPlayer } from '@/components/LessonPlayer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { lessons } from '@/data/mockData';

type Screen = 'welcome' | 'language' | 'level' | 'home' | 'scenario' | 'lesson';

const Index = () => {
  const { t } = useTranslation();
  const { isOnboarding, setIsOnboarding } = useApp();
  const [screen, setScreen] = useState<Screen>(isOnboarding ? 'welcome' : 'home');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const handleStartOnboarding = () => setScreen('language');
  const handleLanguageComplete = () => setScreen('level');
  const handleLevelComplete = () => {
    setIsOnboarding(false);
    localStorage.setItem('onboardingComplete', 'true');
    setScreen('home');
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenarioLessons = lessons.filter(l => l.scenarioId === scenarioId);
    if (scenarioLessons.length > 0) {
      setSelectedLesson(scenarioLessons[0].id);
      setScreen('lesson');
    }
  };

  const handleLessonComplete = () => {
    setScreen('home');
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <span className="text-4xl">🇩🇪</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{t('onboarding.welcome')}</h1>
            <p className="text-muted-foreground mb-8 max-w-sm">{t('onboarding.subtitle')}</p>
            <Button size="lg" onClick={handleStartOnboarding}>
              {t('auth.getStarted')}
            </Button>
          </motion.div>
        )}

        {screen === 'language' && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <LanguageSelector onComplete={handleLanguageComplete} />
            <Button className="mt-6" onClick={handleLanguageComplete}>
              {t('common.continue')}
            </Button>
          </motion.div>
        )}

        {screen === 'level' && (
          <motion.div
            key="level"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <LevelSelector />
            <Button className="mt-6" onClick={handleLevelComplete}>
              {t('common.start')}
            </Button>
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pb-24"
          >
            <header className="p-4 pt-6 safe-top">
              <h1 className="text-2xl font-bold">{t('app.name')}</h1>
              <p className="text-muted-foreground">{t('app.tagline')}</p>
            </header>
            <main className="p-4">
              <ScenarioList onSelectScenario={handleSelectScenario} />
            </main>
            <BottomNav />
          </motion.div>
        )}

        {screen === 'lesson' && selectedLesson && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-screen p-4 pt-6 safe-top"
          >
            <LessonPlayer
              lessonId={selectedLesson}
              onComplete={handleLessonComplete}
              onBack={() => setScreen('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
