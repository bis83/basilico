package run

import (
	"log"
	"net/http"
	"path/filepath"

	build "github.com/bis83/basilico/pkg/build"
	project "github.com/bis83/basilico/pkg/project"
)

func run(cfg *project.Config, baseDir string) error {
	if len(cfg.Addr) == 0 {
		return nil
	}
	absPath, err := filepath.Abs(baseDir)
	if err != nil {
		return err
	}
	log.Printf("basilico start. addr=%v, dir=%v", cfg.Addr, absPath)
	http.Handle("/", http.FileServer(http.Dir(absPath)))
	return http.ListenAndServe(cfg.Addr, nil)
}

func NewBuildRun(baseDir string) error {
	cfg, err2 := project.New(baseDir)
	if err2 != nil {
		return err2
	}
	if err := build.Build(cfg, baseDir); err != nil {
		return err
	}
	return run(cfg, baseDir)
}
