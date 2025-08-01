import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import si from "./locales/si.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            si: { translation: si }
        },
        fallbackLng: "en",
        debug: false,
        detection: {
            order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'sessionStorage']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;