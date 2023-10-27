package utils

import (
	"strings"
)

func GetAddrFromStr(addrNPort string) string {
	return strings.Split(
		addrNPort, ":",
	)[0]
}
