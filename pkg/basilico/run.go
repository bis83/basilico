package basilico

import (
	"log"
	"net/http"
	"path/filepath"
)

func Run(cfg *Config, basePath string) error {
	absPath, err := filepath.Abs(basePath)
	if err != nil {
		return err
	}
	log.Printf("basilico start. addr=%v, dir=%v", cfg.Addr, absPath)
	http.Handle("/", http.FileServer(http.Dir(absPath)))
	return http.ListenAndServe(cfg.Addr, nil)
}

func InitBuildRun() error {
	basePath, err := GetBasePath()
	if err != nil {
		return err
	}
	cfg, err2 := Init(basePath)
	if err2 != nil {
		return err2
	}
	if err := Build(cfg, basePath); err != nil {
		return err
	}
	return Run(cfg, basePath)
}
