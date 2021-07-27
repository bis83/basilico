package basilico

import (
	"log"
	"net/http"
	"path/filepath"
)

func Run(cfg *Config, baseDir string) error {
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

func InitBuildRun() error {
	baseDir, err := CreateBaseDirectory()
	if err != nil {
		return err
	}
	cfg, err2 := Init(baseDir)
	if err2 != nil {
		return err2
	}
	if err := Build(cfg, baseDir); err != nil {
		return err
	}
	return Run(cfg, baseDir)
}
