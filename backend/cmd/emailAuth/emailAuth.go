package main

import (
	"fmt"
	"math/rand"
	"net/smtp"
	"regexp"
	"strconv"
	"time"
)

const verificationCodeExpiry = 30 * time.Minute // Ограничение по времени для сгенерированного кода

type verificationInfo struct {
	code      string
	createdAt time.Time
}

func generateVerificationCode() string {
	rand.Seed(time.Now().UnixNano())
	return strconv.Itoa(rand.Intn(900000) + 100000)
}

func isValidEmail(email string) bool {

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func sendVerificationEmail(email, code string) error {

}

func main() {
	var userEmail string

	// Тутай типа запрос на ввода почты СВЭГ
	fmt.Print("Enter your email address: ")
	fmt.Scanln(&userEmail)

	if !isValidEmail(userEmail) {
		fmt.Println("Invalid email address.")
		return
	}

	// Генерация кода и часики тик тик
	verificationCode := generateVerificationCode()
	verificationData := verificationInfo{
		code:      verificationCode,
		createdAt: time.Now(),
	}

	// Отправка верефикации мыла
	err := sendVerificationEmail(userEmail, verificationCode)
	if err != nil {
		fmt.Println("Error sending verification email:", err)
		return
	}

	fmt.Println("Verification code sent successfully to", userEmail)

	var userEnteredCode string
	fmt.Print("Enter the 6-digit verification code sent to your email: ")
	fmt.Scanln(&userEnteredCode)

	// Проверка кода верификации на правильность
	if userEnteredCode != verificationData.code {
		fmt.Println("Verification code is incorrect. Identity verification failed.")
		return
	}

	// Проверка срока действия кода(не истек ли он быдло)
	if time.Since(verificationData.createdAt) > verificationCodeExpiry {
		fmt.Println("Verification code has expired. Please request a new code.")
		return
	}

	fmt.Println("Identity verified. Account created!")
	// аккаунт создан типо, а может и нет потому что ты долбаеб соевый
}
