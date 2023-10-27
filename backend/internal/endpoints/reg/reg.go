/*
/reg endpoint

json example

input:

	{
	  "email": "example@mail.com",
	  "nick": "example_nickname",
	  "pass": "example_password",
	}

	notes:
	  max username len 64
	  max password len 64
	  max email    len 256

output:

	{
	  "err": "nil",
	}
*/
package reg

import (
	"context"
	"log"
	"net/http"

	"github.com/logisshtick/mono/internal/constant"
	"github.com/logisshtick/mono/internal/db"
	"github.com/logisshtick/mono/internal/utils"
	"github.com/logisshtick/mono/internal/vars"

	"github.com/jackc/pgx/v5"
	"github.com/logisshtick/mono/pkg/cryptograph"
	"github.com/logisshtick/mono/pkg/limiter"
	"github.com/logisshtick/mono/pkg/validator"
)

type input struct {
	Email string `json:"email"`
	Nick  string `json:"nick"`
	Pass  string `json:"pass"`
}

type output struct {
	Err string `json:"err"`
}

var (
	endPoint string
	mlog     *log.Logger
	wlog     *log.Logger
	elog     *log.Logger

	dbConn    *pgx.Conn
	limit     *limiter.Limiter[string]
	globalPow string
)

func Start(ep string, m *log.Logger, w *log.Logger, e *log.Logger) error {
	endPoint = ep
	mlog = m
	wlog = w
	elog = e

	err := cryptograph.Init()
	if err != nil {
		elog.Printf("%s | cryptograph error: %v", endPoint, err)
		return err
	}

	dbConn, err = pgx.Connect(context.Background(), utils.GetDbUrl())
	if err != nil {
		elog.Printf("%s | database connection failed: %v", endPoint, err)
		return err
	}

	limit = limiter.New[string](10, 1800, 2048, 4096, 20)
	globalPow, err = utils.GetGlobalPow()
	if err != nil {
		elog.Printf("%s | pow error: %v", endPoint, err)
		return err
	}

	mlog.Printf("%s | reg module inited\n", endPoint)
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
		mlog.Printf("%s %s | action limited", endPoint, r.RemoteAddr)
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
		len(in.Nick) > constant.C.RegMaxNicknameLen ||
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

	localPow, err := cryptograph.GenRandPow(constant.C.MaxPowLen)
	if err != nil {
		elog.Printf("%s %s | error with pow gen: %v", endPoint, r.RemoteAddr, err)
		out.Err = vars.ErrWithPowGen.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusInternalServerError,
		)
		return
	}

	hashedPass := utils.HashPassWithPows(in.Pass, localPow, globalPow)
	err = db.InsertUser(dbConn, db.User{
		Nick:  in.Nick,
		Pass:  hashedPass,
		Pow:   localPow,
		Email: in.Email,
	})
	if err != nil {
		elog.Printf("%s %s | error with db insert: %v", endPoint, r.RemoteAddr, err)
		out.Err = vars.ErrWithDb.Error()
		utils.WriteJsonAndStatusInRespone(w, &out,
			http.StatusInternalServerError,
		)
		return
	}

	out.Err = "nil"
	utils.WriteJsonAndStatusInRespone(w, &out,
		http.StatusOK,
	)
}

func Stop() error {
	if dbConn != nil {
		dbConn.Close(context.Background())
	}
	mlog.Printf("%s | reg module stoped\n", endPoint)
	return nil
}
