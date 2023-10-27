package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

const siteVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SiteVerifyResponse struct {
	Success     bool      `json:"success"`
	Score       float64   `json:"score"`
	Action      string    `json:"action"`
	ChallengeTS time.Time `json:"challenge_ts"`
	Hostname    string    `json:"hostname"`
	ErrorCodes  []string  `json:"error-codes"`
}

type SiteVerifyRequest struct {
	RecaptchaResponse string `json:"g-recaptcha-response"`
}

func main() {

	secret := os.Getenv("RECAPTCHA_SECRET")

	http.Handle("/login", RecaptchaMiddleware(secret)(Login()))

	log.Println("Server starting at port 8080...")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func Login() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var body LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func CheckRecaptcha(secret, response string) error {
	req, err := http.NewRequest(http.MethodPost, siteVerifyURL, nil)
	if err != nil {
		return err
	}

	// Add parametrs
	q := req.URL.Query()
	q.Add("secret", secret)
	q.Add("response", response)
	req.URL.RawQuery = q.Encode()

	// Make request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Decode response
	var body SiteVerifyResponse
	if err = json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return err
	}

	if !body.Success {
		return errors.New("unsuccessful recaptcha verify request")
	}

	// Check response score
	if body.Score < 0.5 {
		return errors.New("lower received score than expected")
	}

	// Check response action
	if body.Action != "login" {
		return errors.New("mismatched recaptcha action")
	}

	return nil
}

func RecaptchaMiddleware(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			bodyBytes, err := ioutil.ReadAll(r.Body)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			var body SiteVerifyRequest
			if err := json.Unmarshal(bodyBytes, &body); err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			r.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

			if err := CheckRecaptcha(secret, body.RecaptchaResponse); err != nil {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
