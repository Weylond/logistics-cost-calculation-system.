/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import { createI18nContext, I18nContext } from "@solid-primitives/i18n";
import { getLocale } from "./components/locale";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

const lang = getLocale();
const value = createI18nContext({}, lang);

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js', { scope: '/' })
	})
}

render(
  () => (
    <I18nContext.Provider value={value}>
      <App />
    </I18nContext.Provider>
  ),
  root!
);
