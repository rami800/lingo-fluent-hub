import { useTranslation } from 'react-i18next';
import { useLessons } from '@/hooks/useScenarios';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star, Loader2 } from 'lucide-react';

interface LessonSelectorProps {
  scenarioId: string;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
}

export function LessonSelector({ scenarioId, onSelectLesson, onBack }: LessonSelectorProps) {
  const { t } = useTranslation();
  const { data: lessons, isLoading } = useLessons(scenarioId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-muted-foreground">{t('lessons.noLessons')}</p>
        <Button onClick={onBack}>{t('common.back')}</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{t('lessons.selectLesson')}</h2>
          <p className="text-sm text-muted-foreground">
            {lessons.length} {t('common.lessons').toLowerCase()}
          </p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => onSelectLesson(lesson.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">
                    {lesson.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes} {t('common.minutes')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {lesson.xpReward} XP
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
