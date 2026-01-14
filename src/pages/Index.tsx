import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { LevelSelector } from '@/components/LevelSelector';
import { ScenarioList } from '@/components/ScenarioList';
import { LessonSelector } from '@/components/LessonSelector';
import { LessonPlayer } from '@/components/LessonPlayer';
import { BottomNav } from '@/components/BottomNav';
import { HomePage } from '@/components/HomePage';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

type Screen = 'welcome' | 'language' | 'level' | 'home' | 'scenarios' | 'scenario' | 'lesson';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    setScreen('scenario');
  };

  const handleStartLearning = () => {
    setScreen('scenarios');
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLesson(lessonId);
    setScreen('lesson');
  };

  const handleLessonComplete = () => {
    setScreen('scenario');
    setSelectedLesson(null);
  };

  const handleBackToScenarios = () => {
    setScreen('scenarios');
    setSelectedScenario(null);
    setSelectedLesson(null);
  };

  const handleBackToHome = () => {
    setScreen('home');
    setSelectedScenario(null);
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
          >
            <HomePage onStartLearning={handleStartLearning} />
            <BottomNav />
          </motion.div>
        )}

        {screen === 'scenarios' && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pb-24"
          >
            <header className="p-4 pt-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{t('app.name')}</h1>
                <p className="text-muted-foreground">{t('app.tagline')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                <Settings className="h-5 w-5" />
              </Button>
            </header>
            <main className="p-4">
              <ScenarioList onSelectScenario={handleSelectScenario} />
            </main>
            <BottomNav />
          </motion.div>
        )}

        {screen === 'scenario' && selectedScenario && (
          <motion.div
            key="scenario"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen p-4 pt-6"
          >
            <LessonSelector
              scenarioId={selectedScenario}
              onSelectLesson={handleSelectLesson}
              onBack={handleBackToScenarios}
            />
          </motion.div>
        )}

        {screen === 'lesson' && selectedLesson && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-screen p-4 pt-6"
          >
            <LessonPlayer
              lessonId={selectedLesson}
              onComplete={handleLessonComplete}
              onBack={() => setScreen('scenario')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
