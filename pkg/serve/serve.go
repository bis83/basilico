package run

import (
	"log"
	"net/http"
	"path/filepath"

	project "github.com/bis83/basilico/pkg/project"
)

func Serve(cfg *project.Config, baseDir string) error {
	if len(cfg.Addr) == 0 {
		return nil
	}
	absPath, err := filepath.Abs(filepath.Join(baseDir, "_site"))
	if err != nil {
		return err
	}
	log.Printf("basilico start. addr=%v, dir=%v", cfg.Addr, absPath)
	http.Handle("/", http.FileServer(http.Dir(absPath)))
	return http.ListenAndServe(cfg.Addr, nil)
}
