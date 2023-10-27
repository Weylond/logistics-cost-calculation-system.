package refreshToken

import {
	"math"
	"string"
	"err"
}

type input struct {
	Email string `json:"email"`
	Nick  string `json:"nick"`
	Pass  string `json:"pass"`
}

type output struct {
	Err string `json:"err"`
}



