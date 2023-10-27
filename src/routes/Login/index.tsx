import TextField from "../../components/UI/TextField";
import "./styles.css";
import SetLocaleMenu from "./setLocaleMenu";
import { createSignal } from "solid-js";
import { useI18n } from "@solid-primitives/i18n";
import { createMediaQuery } from "@solid-primitives/media";
import type { LoginBody, LoginResponse } from "../../types/endpoint_models/login"
import checkPassword from "../../components/checkPassword";
import api from "../../components/api";

export default function Login() {
  let emailTextField: HTMLInputElement | undefined;
  let passwordTextField: HTMLInputElement | undefined;
  let submitButton: HTMLButtonElement | undefined;

  const [t] = useI18n();

  const [isLoading, setIsLoading] = createSignal(false);

  const isPhone = createMediaQuery("(max-width: 480px)");



  async function handleSubmit(e: Event) {
    function rejectInput() {
      const form = e.target as HTMLFormElement;
  
      navigator.vibrate && navigator.vibrate([7, 7, 7, 7]);
  
      form.animate(
        [
          {
            transform: "translateX(0)",
          },
          {
            transform: "translateX(7px)",
          },
          {
            transform: "translateX(-7px)",
          },
          {
            transform: "translateX(7px)",
          },
          {
            transform: "translateX(0)",
          },
        ],
        400,
      );
  
      setIsLoading(false);
  
      setTimeout(() => {
        if (submitButton) submitButton.disabled = false;
      }, 500);
    }


    e.preventDefault();
    if (!submitButton) return;

    submitButton.disabled = true;

    setIsLoading(true);


    if (!emailTextField || emailTextField.value.length > 256) {
      rejectInput();
      return;
    }

    if (!passwordTextField || !checkPassword(passwordTextField.value)) {
      rejectInput();
      return;
    }

    
    
    const body: LoginBody = {
      email: emailTextField.value.trim(),
      pass: passwordTextField.value,
      device_id: "dds"
    }


    const data = await api<LoginResponse>("/api/login", 'POST', body)

    console.log(data);

  }

  function handleForm() {
    if (!submitButton) return;

    submitButton.disabled =
      !emailTextField?.value.trim().length ||
      !passwordTextField?.value.trim().length;
  }

  return (
    <>
      <div class="background">
        <div class="wrapper">
          {!isPhone() && (
            <div id="QRWindow">
              <img
                src="https://cdn.discordapp.com/attachments/1112822004014391347/1116692420722176021/image.png"
                alt="QRWindow"
              />

              <div class="description">
                <h1>
                  Sign in by QR-code
                  <button>
                    <svg viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M37.5 75C58.2107 75 75 58.2107 75 37.5C75 16.7893 58.2107 0 37.5 0C16.7893 0 0 16.7893 0 37.5C0 58.2107 16.7893 75 37.5 75ZM34.992 39.536C34.64 40.4 34.464 41.392 34.464 42.512H41.712C41.712 41.648 41.904 40.896 42.288 40.256C42.704 39.616 43.216 39.008 43.824 38.432C44.432 37.856 45.072 37.264 45.744 36.656C46.448 36.048 47.104 35.392 47.712 34.688C48.32 33.984 48.816 33.152 49.2 32.192C49.584 31.232 49.776 30.128 49.776 28.88C49.776 26.96 49.248 25.344 48.192 24.032C47.168 22.72 45.744 21.728 43.92 21.056C42.096 20.352 39.984 20 37.584 20C34.352 20 31.6 20.592 29.328 21.776C27.056 22.928 25.28 24.48 24 26.432L29.808 29.84C30.576 28.72 31.552 27.856 32.736 27.248C33.92 26.608 35.264 26.288 36.768 26.288C38.336 26.288 39.584 26.64 40.512 27.344C41.472 28.048 41.952 28.976 41.952 30.128C41.952 30.832 41.76 31.472 41.376 32.048C41.024 32.624 40.56 33.184 39.984 33.728C39.44 34.24 38.848 34.784 38.208 35.36C37.568 35.936 36.96 36.56 36.384 37.232C35.84 37.904 35.376 38.672 34.992 39.536ZM34.8 53.264C35.664 54.128 36.768 54.56 38.112 54.56C39.488 54.56 40.592 54.128 41.424 53.264C42.288 52.4 42.72 51.376 42.72 50.192C42.72 48.976 42.288 47.968 41.424 47.168C40.592 46.336 39.488 45.92 38.112 45.92C36.768 45.92 35.664 46.336 34.8 47.168C33.936 47.968 33.504 48.976 33.504 50.192C33.504 51.376 33.936 52.4 34.8 53.264Z"
                      />
                    </svg>
                  </button>
                </h1>
                <p>
                  Scan the code with another <b>logisshtick app</b> to log into
                  your account right away
                </p>
              </div>
            </div>
          )}

          <div id="authWindow">
            <h1>
              {t("welcome")}
              <img
                width={36}
                height={36}
                src="/src/assets/pictures/waving-hand.png"
                alt="authWindow"
              />
            </h1>

            <p>{t("description")}</p>
            <div class="selector">
              <button class="active">{t("signIn")}</button>
              <button>{t("createNewAccount")}</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label for="email">{"Email"}</label>
              <TextField
                type="email"
                ref={emailTextField}
                disabled={isLoading()}
                id="email"
                name="email"
                placeholder="john.appleseed@domain.com"
                onInput={handleForm}
              />

              <label for="password">{t("password")}</label>
              <TextField
                type="password"
                ref={passwordTextField}
                disabled={isLoading()}
                id="password"
                name="password"
                onInput={handleForm}
              />

              <button
                class={isLoading() ? "loading" : ""}
                ref={submitButton}
                disabled={true}
                type="submit"
              >
                {isLoading() ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    width="64px"
                    height="64px"
                    viewBox="0 0 128 128"
                    xml-space="preserve"
                  >
                    <g>
                      <path
                        d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z"
                        fill="#ffffff"
                      />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 64 64"
                        to="360 64 64"
                        dur="600ms"
                        repeatCount="indefinite"
                      />
                    </g>
                  </svg>
                ) : (
                  t("continue")
                )}
              </button>
            </form>
          </div>

          <SetLocaleMenu />
        </div>
      </div>
    </>
  );
}
