import translations from "./locales/translations.json";

const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = new Set(["en", "ru", "uk", "pl"]);
const LANGUAGE_LOCALES = {
  en: "en-US",
  ru: "ru-RU",
  uk: "uk-UA",
  pl: "pl-PL",
};

const detectLanguage = () => {
  if (typeof navigator === "undefined") return DEFAULT_LANGUAGE;

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const browserLanguage of browserLanguages) {
    const language = browserLanguage?.toLowerCase().split(/[-_]/)[0];
    if (SUPPORTED_LANGUAGES.has(language)) return language;
  }

  return DEFAULT_LANGUAGE;
};

const getValue = (language, key) =>
  key.split(".").reduce((value, part) => value?.[part], translations[language]);

export const currentLanguage = detectLanguage();
export const currentLocale = LANGUAGE_LOCALES[currentLanguage];

export const t = (key, variables = {}) => {
  const translatedValue = getValue(currentLanguage, key);
  const fallbackValue = getValue(DEFAULT_LANGUAGE, key);
  const value = translatedValue ?? fallbackValue ?? key;

  if (typeof value !== "string") return key;

  return Object.entries(variables).reduce(
    (text, [variable, replacement]) =>
      text.replaceAll(`{{${variable}}}`, String(replacement)),
    value,
  );
};

export const initializeI18n = () => {
  document.documentElement.lang = currentLanguage;
  document.title = t("meta.title");
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", t("meta.description"));
};
