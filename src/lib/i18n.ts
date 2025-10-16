import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translation using http
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    debug: process.env['NODE_ENV'] === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    backend: {
      // Path where resources are loaded from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ar'],
    
    // Namespaces
    ns: ['common', 'home', 'navigation', 'forms', 'errors'],
    defaultNS: 'common',
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;