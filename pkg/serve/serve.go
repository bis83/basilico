package run

import (
	"log"
	"net/http"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
)

type Serve struct {
	RootDir string
	Addr    string
}

func (p *Serve) Set(bsl *basil.Basil) {
	p.RootDir = bsl.DistDir()
	p.Addr = bsl.Addr()
}

func (p *Serve) Start() error {
	absPath, err := filepath.Abs(p.RootDir)
	if err != nil {
		return err
	}
	log.Printf("basilico start. addr=%v, dir=%v", p.Addr, absPath)
	http.Handle("/", http.FileServer(http.Dir(absPath)))
	return http.ListenAndServe(p.Addr, nil)
}
