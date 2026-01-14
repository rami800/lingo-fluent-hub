import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { BookOpen, Target, Trophy, Flame, ArrowRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onStartLearning: () => void;
}

export const HomePage = ({ onStartLearning }: HomePageProps) => {
  const { t } = useTranslation();
  const { currentLevel } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { 
      icon: Flame, 
      value: '3', 
      label: t('profile.streak'),
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    { 
      icon: Trophy, 
      value: '120', 
      label: 'XP',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      icon: BookOpen, 
      value: '5', 
      label: t('common.lessons'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pt-8 pb-16 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">{t('auth.welcomeBack')}</p>
            <h1 className="text-2xl font-bold">{user?.email?.split('@')[0] || 'Learner'}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground hover:bg-white/10"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Level Badge */}
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary-foreground/80">{t('profile.currentLevel')}</p>
            <p className="font-bold text-lg">{currentLevel} - {t(`levels.${currentLevel}.name`)}</p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 -mt-8">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Progress */}
      <motion.div 
        className="px-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('profile.totalProgress')}</h3>
              <span className="text-sm text-muted-foreground">2/5 {t('common.lessons')}</span>
            </div>
            <Progress value={40} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {t('lesson.keepPracticing')}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="px-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-bold mb-4">{t('common.start')}</h2>
        
        <Card 
          className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow group"
          onClick={onStartLearning}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{t('nav.learn')}</h3>
              <p className="text-sm text-muted-foreground">{t('common.scenarios')}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Learning */}
      <motion.div 
        className="px-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-semibold"
          onClick={onStartLearning}
        >
          <BookOpen className="h-5 w-5 mr-2" />
          {t('common.continue')}
        </Button>
      </motion.div>
    </div>
  );
};
