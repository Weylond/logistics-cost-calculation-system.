// /refreshendpoint

package refresh

import (
	"fmt"
	"log"
	"net/http"
)

type input struct {
	AccessToken  uint64 `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type output struct {
	Err          string `json:"err"`
	AccessToken  uint64 `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

var (
	endPoint string
	mlog     *log.Logger
	wlog     *log.Logger
	elog     *log.Logger
)

func Start(ep string, m *log.Logger, w *log.Logger, e *log.Logger) error {
	endPoint = ep
	mlog = m
	wlog = w
	elog = e

	mlog.Printf("%s test module inited\n", endPoint)
	return nil
}

// http handler that used as callback for http.HandleFunc()
func Handler(w http.ResponseWriter, r *http.Request) {
	mlog.Printf("%s connected %s\n", r.URL.Path, r.RemoteAddr)
	fmt.Fprintf(w, "Test Endpoint finded!!! %s", r.URL.Path)
}

func Stop() error {
	mlog.Printf("%s test module stoped\n", endPoint)
	return nil
}
