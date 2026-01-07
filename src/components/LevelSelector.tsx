import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { levels } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { GermanLevel } from '@/types';

interface LevelSelectorProps {
  onComplete?: () => void;
}

export function LevelSelector({ onComplete }: LevelSelectorProps) {
  const { t } = useTranslation();
  const { currentLevel, setCurrentLevel } = useApp();

  const levelColors: Record<GermanLevel, string> = {
    'A1': 'bg-level-a1',
    'A2': 'bg-level-a2',
    'B1': 'bg-level-b1',
    'B2': 'bg-level-b2',
    'C1': 'bg-level-c1',
    'C2': 'bg-level-c2',
  };

  const handleSelect = (levelId: GermanLevel) => {
    setCurrentLevel(levelId);
    if (onComplete) {
      setTimeout(onComplete, 200);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">
        {t('onboarding.chooseLevel')}
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        {t('onboarding.levelHelp')}
      </p>
      
      <div className="space-y-3">
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              variant="level"
              className={`relative overflow-hidden ${
                currentLevel === level.id 
                  ? 'border-primary shadow-glow' 
                  : 'border-border'
              }`}
              onClick={() => handleSelect(level.id)}
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${levelColors[level.id]}`} />
              <CardContent className="p-4 pl-6 flex items-center gap-4">
                <div className="text-4xl">{level.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{level.name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {t(`levels.${level.id}.name`)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(`levels.${level.id}.description`)}
                  </p>
                </div>
                {currentLevel === level.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
