import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  tr: { translation: tr },
  uk: { translation: uk },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('uiLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
