import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { scenarios, scenarioTranslations } from '@/data/mockData';
import { motion } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';
import type { GermanLevel } from '@/types';

interface ScenarioListProps {
  onSelectScenario: (scenarioId: string) => void;
}

export function ScenarioList({ onSelectScenario }: ScenarioListProps) {
  const { t } = useTranslation();
  const { currentLevel, uiLanguage } = useApp();

  const currentScenarios = scenarios.filter(s => s.levelId === currentLevel);

  const getTranslation = (scenarioId: string) => {
    return scenarioTranslations.find(
      st => st.scenarioId === scenarioId && st.languageCode === uiLanguage
    );
  };

  // Mock progress data
  const getProgress = (scenarioId: string) => {
    const mockProgress: Record<string, number> = {
      'introduction': 60,
      'transport': 30,
    };
    return mockProgress[scenarioId] || 0;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{currentLevel} {t(`levels.${currentLevel}.name`)}</h2>
        <p className="text-muted-foreground text-sm">
          {currentScenarios.length} {t('common.lessons').toLowerCase()}
        </p>
      </div>

      <div className="space-y-3">
        {currentScenarios.map((scenario, index) => {
          const translation = getTranslation(scenario.id);
          const progress = getProgress(scenario.id);
          const isLocked = index > 1 && progress === 0;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant="lesson"
                className={isLocked ? 'opacity-50' : ''}
                onClick={() => !isLocked && onSelectScenario(scenario.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-secondary">
                    {scenario.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {translation?.name || scenario.id}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {translation?.description}
                    </p>
                    {progress > 0 && (
                      <div className="mt-2">
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {progress > 0 && (
                      <span className="text-xs font-medium text-primary">
                        {progress}%
                      </span>
                    )}
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
