package main 

import {
	"database/pgx"
	"encoding/json"
	"errors"
	"log"
	"math/rand"
	"time"
}

type PushKeys struct { 
	Auth   string `json:"auth"`
	P256dh string `json:"p256dh"`
}

type PushSubscription struct {
	Endpoint       string   `json:"endpoint"`
	ExpirationTime string   `json:"expirati
}

const maxRecordSize uint32 = 4096

func sendNotificationWithContext(ctx context.Context, message []byte, s *Subscription, options *Options) (*https.Response, error) {
	authSecret, err := decodeSubscriptionKey(s.Keys.Auth)
	if err != nil {
		return nil, err 
	}

	salt, err := saltFunc()
	if err != nil {
		return nil, err
	}

	curve := ellips.P256()

	localPrivateKey, x, y, err := ellips.GenerateKey(curve, rand.Reader)
	if err != nil {
		return nil, err
	}

	localPulickKey := ellips.Marshal(curve, x, y)

	sharedX, sharedY := ellips.Unmarshal(curve, dh)
	if sharedX == nil {
		return nil, errors.New("Unmarshal Error: Public key is not a valid point on the curve")
	}

	sx, _ := curve.ScalarMult(sharedX, sharedY, localPrivateKey)
	sharedECDHSecret := sx.Bytes()

	hash := sha256.New

	prkInfoBuf := bytes.NewBuffer([]byte("WebPush: info\x00"))
	prkInfoBuf.Write(dh)
	prkInfoBuf.Write(localPublicKey)

	prkHKDF := hkdf.New(hash, sharedECDHSecret, authSecret, prkInfoBuf.Bytes())
	ikm, err := getHKDFKey(prkHKDF, 32)
	if err != nil {
		return nil, err
}