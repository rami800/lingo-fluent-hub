import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useScenarios } from '@/hooks/useScenarios';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, Loader2 } from 'lucide-react';

interface ScenarioListProps {
  onSelectScenario: (scenarioId: string) => void;
}

export function ScenarioList({ onSelectScenario }: ScenarioListProps) {
  const { t } = useTranslation();
  const { currentLevel } = useApp();
  const { data: scenarios, isLoading, error } = useScenarios();

  // Mock progress data for now
  const getProgress = (scenarioId: string) => {
    return 0; // Will be replaced with real user progress later
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>{t('common.error')}</p>
      </div>
    );
  }

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{t('scenarios.noScenarios')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{currentLevel} {t(`levels.${currentLevel}.name`)}</h2>
        <p className="text-muted-foreground text-sm">
          {scenarios.length} {t('common.scenarios').toLowerCase()}
        </p>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const progress = getProgress(scenario.id);
          const isLocked = !scenario.isFree && index > 0 && progress === 0;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${isLocked ? 'opacity-50' : ''}`}
                onClick={() => !isLocked && onSelectScenario(scenario.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-secondary">
                    {scenario.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {scenario.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {scenario.description}
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
