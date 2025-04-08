package serve

import (
	"log"
	"net/http"
	"path/filepath"

	basil "github.com/bis83/basilico/internal/basil"
)

func handleAPI(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func Serve(p *basil.Basil) error {
	http.HandleFunc("/api/", handleAPI)

	absPath, err := filepath.Abs(p.DistDir())
	if err != nil {
		return err
	}
	http.Handle("/", http.FileServer(http.Dir(absPath)))

	addr := ":8080"
	log.Printf("basilico start. addr=%v, dir=%v", addr, absPath)
	return http.ListenAndServe(addr, nil)
}
