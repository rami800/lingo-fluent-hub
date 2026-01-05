import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  lessonItems, 
  lessonItemTranslations, 
  lessons,
  lessonTranslations 
} from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  ChevronLeft, 
  ChevronRight,
  Volume2,
  Check,
  X
} from 'lucide-react';

interface LessonPlayerProps {
  lessonId: string;
  onComplete: () => void;
  onBack: () => void;
}

export function LessonPlayer({ lessonId, onComplete, onBack }: LessonPlayerProps) {
  const { t } = useTranslation();
  const { uiLanguage } = useApp();
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const lesson = lessons.find(l => l.id === lessonId);
  const items = lessonItems.filter(item => item.lessonId === lessonId);
  const currentItem = items[currentItemIndex];
  
  const lessonTranslation = lessonTranslations.find(
    lt => lt.lessonId === lessonId && lt.languageCode === uiLanguage
  );

  const itemTranslation = currentItem
    ? lessonItemTranslations.find(
        it => it.itemId === currentItem.id && it.languageCode === uiLanguage
      )
    : null;

  const progress = items.length > 0 
    ? ((currentItemIndex + 1) / items.length) * 100 
    : 0;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'de-DE';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        setIsRecording(false);
        setShowFeedback(true);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handlePlayAudio = () => {
    if (currentItem?.germanText) {
      const utterance = new SpeechSynthesisUtterance(currentItem.germanText);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleStopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      setRecognizedText('');
      setShowFeedback(false);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNext = () => {
    setRecognizedText('');
    setShowFeedback(false);
    
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    setRecognizedText('');
    setShowFeedback(false);
    
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const isMatch = recognizedText.toLowerCase().trim() === 
    currentItem?.germanText.toLowerCase().replace(/[!?.,]/g, '').trim();

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold truncate">
            {lessonTranslation?.title || 'Lesson'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('lesson.step')} {currentItemIndex + 1} {t('common.of')} {items.length}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-8" />

      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              {/* German Text */}
              <div className="mb-6">
                <p className="text-3xl font-bold mb-2 text-foreground">
                  {currentItem.germanText}
                </p>
                <p className="text-lg text-muted-foreground">
                  {itemTranslation?.translation}
                </p>
              </div>

              {/* Explanation */}
              {itemTranslation?.explanation && (
                <div className="bg-secondary rounded-lg p-3 mb-6">
                  <p className="text-sm text-secondary-foreground">
                    💡 {itemTranslation.explanation}
                  </p>
                </div>
              )}

              {/* Audio Control */}
              <div className="flex justify-center mb-6">
                <Button
                  variant="play"
                  size="iconLg"
                  onClick={isPlaying ? handleStopAudio : handlePlayAudio}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Volume2 className="w-8 h-8" />
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {t('lesson.listenAndRepeat')}
              </p>

              {/* Recording Control */}
              <Button
                variant={isRecording ? 'record' : 'outline'}
                size="lg"
                className="w-full"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    {t('lesson.stopRecording')}
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    {t('lesson.startRecording')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Recognition Result */}
      <AnimatePresence>
        {showFeedback && recognizedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className={`mb-6 ${isMatch ? 'border-success' : 'border-warning'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isMatch ? 'bg-success-soft' : 'bg-accent-soft'
                  }`}>
                    {isMatch ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <X className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {t('lesson.yourPronunciation')}:
                    </p>
                    <p className="font-semibold">{recognizedText}</p>
                  </div>
                </div>
                <p className={`text-sm mt-2 ${isMatch ? 'text-success' : 'text-muted-foreground'}`}>
                  {isMatch ? t('lesson.wellDone') : t('lesson.keepPracticing')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t safe-bottom">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('common.previous')}
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            className="flex-1"
          >
            {currentItemIndex === items.length - 1 
              ? t('common.complete') 
              : t('common.next')}
            {currentItemIndex < items.length - 1 && (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
