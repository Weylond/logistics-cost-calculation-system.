import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { createEffect, type Component } from "solid-js";
import Dashboard from "./routes/Dashboard";
//import Login from './routes/Login';
import { usePrefersDark } from "@solid-primitives/media";

import "./global.css";
import "./fonts.css";
import Header from "./components/Header";
import Splash from "./components/Splash";
import Login from "./routes/Login";
import { loadLocale } from "./components/locale";
import { useI18n } from "@solid-primitives/i18n";

const App: Component = () => {
  const [, { add, locale }] = useI18n();

  const prefersDark = usePrefersDark();

  createEffect(() => {
    const theme = prefersDark() ? "dark" : "light";

    document.querySelector("html")?.setAttribute("data-theme", theme);
  });

  createEffect(() => {
    loadLocale(locale()).then((localeStrings) => {
      add(locale(), localeStrings);
      locale(locale());
    });
  });

  return (
    <>
      <Splash />
      <main>
        <Router>
        <Header />
          <Routes>
            <Route path="/" element={<Navigate href="/dashboard" />} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
          </Routes>
        </Router>
      </main>
    </>
  );
};

export default App;
