package utils

import (
	"errors"
	"github.com/logisshtick/mono/pkg/cryptograph"
	"os"
)

const (
	// false == left
	// true  == right
	powLeftOrRight = false
)

var (
	globalPowGetted bool
	globalPow       string
)

// concat pow with string
func PowCat(str, pow string) string {
	if powLeftOrRight {
		return str + pow
	}
	return pow + str
}

// get global pow
func GetGlobalPow() (string, error) {
	if globalPowGetted {
		return globalPow, nil
	}

	powStr := os.Getenv("GLOBAL_POW")
	if powStr == "" {
		return "", errors.New("GLOBAL_POW env var is empty")
	}

	globalPow = powStr
	globalPowGetted = true
	return powStr, nil
}

func HashPassWithPows(pass, localPow, globalPow string) string {
	return cryptograph.HashPass(
		PowCat(
			PowCat(pass, localPow),
			globalPow,
		),
	)
}
