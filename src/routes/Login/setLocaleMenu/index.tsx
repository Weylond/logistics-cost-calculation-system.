import { useI18n } from "@solid-primitives/i18n";
import "./styles.css";
import {createEffect, createSignal, For} from "solid-js";

export default function SetLocaleMenu() {
  const [, { locale }] = useI18n();
  const [langName, setLangName] = createSignal<string>();
  const [isMenuShown, setIsMenuShown] = createSignal(false);

  const languages = [
    {
      code: "de",
      preffered: false,
    },
    {
      code: "en-US",
      preffered: false,
    },
    {
      code: "fr",
      preffered: false,
    },
    {
      code: "pl",
      preffered: false,
    },
    {
      code: "uk",
      preffered: false,
    },
  ];

  function setLocale(lang: string) {
    navigator.vibrate && navigator.vibrate([1]);

    locale(lang);
  }



  createEffect(() => {
    const languageNames = new Intl.DisplayNames(locale(), {
      type: "language",
      style: "short",
      languageDisplay: "standard"
    });

    setLangName(languageNames.of(locale()));
  });

  return (
    <>
      <div class={isMenuShown() ? "setLocaleMenu" : "setLocaleMenu hidden"}>
        <For each={languages}>{(lang) => {
          const languageNames = new Intl.DisplayNames(lang.code, {
            type: "language",
            style: "short",
            languageDisplay: "standard"
          });

          return (
            <button
              disabled={locale() == lang.code}
              class="locale"
              onClick={() => setLocale(lang.code)}
            >
              <img src={`/flags/${lang.code}.png`} alt={"Lol"} />
              {languageNames.of(lang.code)}
              {locale() == lang.code && (
                <svg viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.43192 9.06521C4.88786 9.60926 4.00508 9.60926 3.46128 9.06521L0.408044 6.01197C-0.136015 5.46817 -0.136015 4.58539 0.408044 4.0416C0.951839 3.49754 1.83462 3.49754 2.37868 4.0416L4.19781 5.86046C4.33514 5.99753 4.55806 5.99753 4.69565 5.86046L9.62132 0.934792C10.1651 0.390734 11.0479 0.390734 11.592 0.934792C11.8532 1.19606 12 1.55053 12 1.91998C12 2.28942 11.8532 2.6439 11.592 2.90516L5.43192 9.06521Z" />
                </svg>
              )}
            </button>
          );
        }}</For>
      </div>
      <div class="setLocale" onClick={() => setIsMenuShown((prev) => !prev)}>
        <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.187 2.81796C14.376 1.99888 13.4111 1.34812 12.3478 0.903081C11.2845 0.458036 10.1437 0.227473 8.99102 0.224636C7.83833 0.221799 6.69644 0.446744 5.63095 0.886549C4.56546 1.32635 3.59737 1.97235 2.7823 2.78743C1.96722 3.6025 1.32123 4.57059 0.881422 5.63608C0.441617 6.70157 0.216672 7.84346 0.219509 8.99615C0.222346 10.1488 0.45291 11.2896 0.897954 12.3529C1.343 13.4162 1.99375 14.3811 2.81283 15.1922C3.62388 16.0113 4.58878 16.662 5.65209 17.1071C6.7154 17.5521 7.85617 17.7827 9.00886 17.7855C10.1615 17.7883 11.3034 17.5634 12.3689 17.1236C13.4344 16.6838 14.4025 16.0378 15.2176 15.2227C16.0327 14.4076 16.6787 13.4395 17.1185 12.3741C17.5583 11.3086 17.7832 10.1667 17.7804 9.01399C17.7775 7.8613 17.547 6.72053 17.1019 5.65722C16.6569 4.59391 16.0061 3.62901 15.187 2.81796ZM1.49994 9.00507C1.49966 8.34128 1.58767 7.68041 1.76166 7.03983C2.04838 7.65702 2.46478 8.19022 2.74799 8.82342C3.114 9.63749 4.09681 9.41171 4.5308 10.125C4.91595 10.7582 4.50463 11.559 4.79291 12.2215C5.00228 12.7023 5.49603 12.8074 5.83666 13.159C6.1847 13.5137 6.17728 13.9996 6.23041 14.4621C6.29035 15.0055 6.38759 15.5441 6.52142 16.0742C6.52142 16.0781 6.52142 16.0824 6.52455 16.0863C3.6015 15.0598 1.49994 12.2734 1.49994 9.00507ZM8.99994 16.5051C8.58109 16.5049 8.16298 16.4699 7.74994 16.4004C7.75424 16.2945 7.75619 16.1957 7.76674 16.1269C7.86166 15.5058 8.17259 14.8984 8.59213 14.4336C9.00658 13.975 9.57455 13.6648 9.92455 13.1445C10.2675 12.6367 10.3703 11.9531 10.2288 11.3598C10.0206 10.4832 8.82963 10.1906 8.18744 9.71522C7.8183 9.44178 7.48978 9.01913 7.00502 8.98475C6.78158 8.96913 6.59447 9.01717 6.37299 8.96014C6.16986 8.90741 6.01049 8.79803 5.79408 8.82655C5.38978 8.87967 5.1347 9.31171 4.70033 9.25311C4.28822 9.19803 3.86361 8.71561 3.76986 8.32303C3.64955 7.81835 4.04877 7.65467 4.4765 7.60975C4.65502 7.591 4.85541 7.57069 5.02689 7.63632C5.25267 7.71991 5.35931 7.941 5.56205 8.05272C5.94213 8.26132 6.01908 7.92811 5.96088 7.59061C5.87377 7.08514 5.7722 6.87928 6.22299 6.53124C6.53549 6.29139 6.80267 6.11796 6.75267 5.6871C6.72299 5.43397 6.58431 5.31952 6.71361 5.06757C6.81166 4.87577 7.0808 4.70272 7.25619 4.58827C7.70892 4.29296 9.19564 4.31483 8.58822 3.48827C8.4097 3.24569 8.08041 2.8121 7.76791 2.75272C7.37728 2.67889 7.20384 3.11483 6.93158 3.30702C6.65033 3.50585 6.10267 3.73163 5.82103 3.42421C5.44213 3.01053 6.0722 2.87499 6.21166 2.58593C6.27611 2.45116 6.21166 2.26405 6.10306 2.08788C6.24395 2.0285 6.38718 1.97342 6.53275 1.92264C6.62398 1.99003 6.73221 2.03061 6.84525 2.03983C7.10658 2.05702 7.35306 1.91561 7.58119 2.09374C7.83431 2.28905 8.01674 2.53592 8.35267 2.59686C8.67767 2.65585 9.02181 2.46639 9.10228 2.13358C9.15111 1.93124 9.10228 1.71757 9.05541 1.50858C10.5164 1.51699 11.9426 1.95451 13.157 2.76678C13.0788 2.7371 12.9855 2.74061 12.8703 2.79413C12.6331 2.90428 12.2972 3.18475 12.2695 3.46288C12.2378 3.7785 12.7035 3.82303 12.9245 3.82303C13.2566 3.82303 13.5929 3.6746 13.4859 3.291C13.4394 3.1246 13.3761 2.95155 13.2742 2.84686C13.5192 3.01692 13.754 3.20136 13.9773 3.39921C13.9738 3.40272 13.9703 3.40585 13.9667 3.40975C13.7417 3.64413 13.4804 3.82968 13.3265 4.11483C13.2179 4.31561 13.0956 4.41093 12.8757 4.46288C12.7546 4.49139 12.6163 4.50194 12.5148 4.58319C12.232 4.80585 12.3929 5.341 12.6609 5.50155C12.9995 5.70428 13.5019 5.60897 13.7574 5.31952C13.957 5.09296 14.0745 4.6996 14.4335 4.69999C14.5916 4.69966 14.7434 4.76154 14.8562 4.87225C15.0046 5.02616 14.9753 5.16991 15.007 5.3621C15.0628 5.7035 15.364 5.51835 15.5472 5.34608C15.6807 5.58375 15.8012 5.82851 15.9081 6.07928C15.7066 6.36952 15.5464 6.68592 15.0617 6.34764C14.7714 6.14491 14.5929 5.85077 14.2285 5.75936C13.9101 5.68124 13.5839 5.76249 13.2695 5.81678C12.912 5.87889 12.4882 5.90624 12.2171 6.17694C11.955 6.43788 11.8163 6.7871 11.5374 7.04921C10.998 7.55702 10.7703 8.11132 11.1195 8.82928C11.4554 9.51952 12.1581 9.89413 12.9163 9.84491C13.6613 9.7953 14.4351 9.36327 14.4136 10.4457C14.4058 10.8289 14.4859 11.0941 14.6035 11.45C14.7124 11.7781 14.705 12.0961 14.73 12.4348C14.7538 12.8313 14.8158 13.2247 14.9152 13.6094C14.215 14.5108 13.3181 15.2404 12.2929 15.7422C11.2677 16.2441 10.1414 16.505 8.99994 16.5051Z" />
        </svg>
        {langName()}
      </div>
    </>
  );
}