// /login endpoint
//
// json example
//
// input:
//
//	{
//	  "email": "example@mail.com",
//	  "pass": "example_password",
//	  "device_id": "any uniq to session key",
//	}
//
//	notes:
//	  max username len 64
//	  max password len 64
//	  max email    len 256
//
// output:
//
//	{
//	  "err": "nil",
//	  "access_token": 75298352711,
//	  "refresh_token": "cbe02bcc-6126-4079-8f2f-05a1562df0b0",
//	}
//
//	notes:
//	  if error is not "nil"
//	  u shouldnt check any other fields
//	  coz its can be incorrect or have any crap.
//	  access token type is uint64
package login

import (
	//"fmt"
	"context"
	"log"
	"net/http"

	"github.com/logisshtick/mono/internal/auth"
	"github.com/logisshtick/mono/internal/constant"
	"github.com/logisshtick/mono/internal/db"
	"github.com/logisshtick/mono/internal/utils"
	"github.com/logisshtick/mono/internal/vars"

	"github.com/jackc/pgx/v5"
	"github.com/logisshtick/mono/pkg/cryptograph"
	"github.com/logisshtick/mono/pkg/limiter"
	"github.com/logisshtick/mono/pkg/validator"
)

var (
	endPoint string
	mlog     *log.Logger
	wlog     *log.Logger
	elog     *log.Logger

	dbConn    *pgx.Conn
	limit     *limiter.Limiter[string]
	globalPow string
)

type input struct {
	Email    string `json:"email"`
	Pass     string `json:"pass"`
	DeviceId string `json:"device_id"`
}

type output struct {
	Err          string `json:"err"`
	AccessToken  uint64 `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func Start(ep string, m *log.Logger, w *log.Logger, e *log.Logger) error {
	endPoint = ep
	mlog = m
	wlog = w
	elog = e

	var err error
	dbConn, err = pgx.Connect(context.Background(), utils.GetDbUrl())
	if err != nil {
		elog.Printf("%s | database connection failed: %v\n", endPoint, err)
		return err
	}

	err = auth.Init(dbConn)
	if err != nil {
		elog.Print("%s | auth system init failed: %v\n", endPoint, err)
		return err
	}

	err = cryptograph.Init()
	if err != nil {
		elog.Printf("%s | cryptograph error: %v\n", endPoint, err)
		return err
	}

	limit = limiter.New[string](10, 1800, 2048, 4096, 20)
	globalPow, err = utils.GetGlobalPow()
	if err != nil {
		elog.Printf("%s | pow error: %v\n", endPoint, err)
		return err
	}

	mlog.Printf("%s | login module inited\n", endPoint)
	return nil
}

// http handler that used as callback for http.HandleFunc()
func Handler(w http.ResponseWriter, r *http.Request) {
	mlog.Printf("%s %s | connected\n", endPoint, r.RemoteAddr)
	defer r.Body.Close()

	out := output{}

	if !limit.Try(
		utils.GetAddrFromStr(r.RemoteAddr),
	) {
		mlog.Printf("%s %s | action limited\n", endPoint, r.RemoteAddr)
		out.Err = vars.ErrActionLimited.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusServiceUnavailable,
		)
		return
	}

	if utils.ErrWithContentLen(w, &out, r.ContentLength) {
		elog.Printf("%s %s | body len too big: %d\n", endPoint, r.RemoteAddr, r.ContentLength)
		return
	}

	var body []byte
	if utils.BodyReading(w, r, &out, &body) {
		elog.Printf("%s %s | body reading failed\n", endPoint, r.RemoteAddr)
		return
	}

	in := input{}
	if utils.UnmarshalJson(w, &in, &out, body) {
		elog.Printf("%s %s | body json is incorrect\n", endPoint, r.RemoteAddr)
		return
	}

	if len(in.Pass) > constant.C.RegMaxPasswordLen ||
		len(in.Email) > constant.C.RegMaxEmailLen {
		elog.Printf("%s %s | json fields is too big\n", endPoint, r.RemoteAddr)
		out.Err = vars.ErrFieldTooBig.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusUnprocessableEntity,
		)
		return
	}
	if !validator.IsEmail(in.Email) {
		elog.Printf("%s %s | email pattern is incorrect\n", endPoint, r.RemoteAddr)
		out.Err = vars.ErrEmailIncorrect.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusUnprocessableEntity,
		)
		return
	}

	userData, err := db.GetUserByEmail(dbConn, in.Email)
	if err != nil {
		elog.Printf("%s %s | error with db select: %v\n", endPoint, r.RemoteAddr, err)
		out.Err = vars.ErrWithDb.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusInternalServerError,
		)
		return
	}

	if userData.Pass != utils.HashPassWithPows(in.Pass, userData.Pow, globalPow) {
		elog.Printf("%s %s | user password is incorrect\n", endPoint, r.RemoteAddr)
		out.Err = vars.ErrPassIncorrect.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusForbidden,
		)
		return
	}

	deviceIdHash, err := auth.HashDeviceId(in.DeviceId)
	if err != nil {
		elog.Printf("%s %s | in.DeviceId hashing failed: %v\n", endPoint, r.RemoteAddr, err)
		out.Err = err.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusUnprocessableEntity,
		)
		return
	}

	accessToken, refreshToken, err := auth.GenTokensPair(
		userData.Id,
		deviceIdHash,
	)
	out = output{
		Err:          "nil",
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	utils.WriteJsonAndStatusInRespone(w, &out,
		http.StatusOK,
	)
}

func Stop() error {
	if dbConn != nil {
		dbConn.Close(context.Background())
	}
	mlog.Printf("%s | login module stoped\n", endPoint)
	return nil
}
