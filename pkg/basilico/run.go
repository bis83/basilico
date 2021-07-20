package basilico

import (
	"log"
	"net/http"
)

func Run(cfg *Config, basePath string) error {
	log.Printf("basilico start. addr=%v, dir=%v", cfg.Addr, basePath)
	http.Handle("/", http.FileServer(http.Dir(basePath)))
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
