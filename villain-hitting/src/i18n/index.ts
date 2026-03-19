import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhHK from "./zh-HK.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: {
    "zh-HK": { translation: zhHK },
    en: { translation: en },
  },
  lng: "zh-HK",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
