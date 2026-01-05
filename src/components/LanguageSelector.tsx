import { useTranslation } from 'react-i18next';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { languages } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  onComplete?: () => void;
}

export function LanguageSelector({ onComplete }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const { uiLanguage, setUiLanguage } = useApp();

  const handleSelect = (langCode: string) => {
    setUiLanguage(langCode as any);
    if (onComplete) {
      setTimeout(onComplete, 200);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {t('onboarding.chooseLanguage')}
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang, index) => (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="language"
              className={`w-full h-auto flex flex-col items-center gap-2 py-5 ${
                uiLanguage === lang.code 
                  ? 'border-primary bg-primary-soft shadow-glow' 
                  : ''
              }`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="font-semibold">{lang.nativeName}</span>
              {uiLanguage === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
