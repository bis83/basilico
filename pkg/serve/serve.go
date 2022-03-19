package run

import (
	"log"
	"net/http"
	"path/filepath"

	project "github.com/bis83/basilico/pkg/project"
)

func Serve(setup *project.Setup, baseDir string) error {
	if len(setup.Addr) == 0 {
		return nil
	}
	absPath, err := filepath.Abs(filepath.Join(baseDir, "dist"))
	if err != nil {
		return err
	}
	log.Printf("basilico start. addr=%v, dir=%v", setup.Addr, absPath)
	http.Handle("/", http.FileServer(http.Dir(absPath)))
	return http.ListenAndServe(setup.Addr, nil)
}
