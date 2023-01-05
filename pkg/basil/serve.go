package basil

import (
	"log"
	"net/http"
	"path/filepath"
)

func (p *Basil) Serve() error {
	absPath, err := filepath.Abs(p.DistDir())
	if err != nil {
		return err
	}
	addr := p.Addr()

	log.Printf("basilico start. addr=%v, dir=%v", addr, absPath)
	http.Handle("/", http.FileServer(http.Dir(absPath)))
	return http.ListenAndServe(addr, nil)
}

func (p *Basil) Addr() string {
	return ":8080"
}
