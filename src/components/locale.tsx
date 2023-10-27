const localeArray = [
  {
    language: "en",
    dialects: ["US"],
  },
  {
    language: "uk",
    dialects: [],
  },
];

const defaultLocale = "en-US";

export function getLocale() {
  //console.log(navigator.userAgentData);

  for (let i = 0; i < navigator.languages.length; i++) {
    const browserLanguage = navigator.languages[i];

    const words = browserLanguage.split("-");

    const language = words[0];
    const dialect = words[1];

    const locale = localeArray.find((locale) => locale.language === language);
    if (!locale) continue;

    if (dialect && locale.dialects.includes(dialect)) {
      return browserLanguage;
    }

    if (!locale.dialects[0]) {
      return `${language}`;
    }
    return `${language}-${locale.dialects[0]}`;
  }

  return defaultLocale;
}

export async function loadLocale(lang: string) {
  const response = await fetch(`/i18n/${lang}.json`);
  document.querySelector("html")?.setAttribute("lang", lang);

  const localeStrings = await response.json();

  return localeStrings;
}
