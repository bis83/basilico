package basilico

import (
	_ "embed"

	"os"
	"path/filepath"
	"html/template"
)

//go:embed web/index.html
var indexHtml string

//go:embed web/basilico.js
var basilicoJs string

func BuildIndexHtml(cfg *Config, path string) error {
	tpl := template.Must(template.New("index").Parse(indexHtml))
	fp, err := os.Create(path)
	if err != nil {
		return err
	}
	defer fp.Close()
	if err := tpl.Execute(fp, cfg); err != nil {
		return err
	}
	return nil
}

func BuildBasilicoJs(path string) error {
	if err := os.WriteFile(path, []byte(basilicoJs), 0666); err != nil {
		return err
	}
	return nil
}

func Build(cfg *Config, basePath string) error {
	if err := BuildIndexHtml(cfg, filepath.Join(basePath, "index.html")); err != nil {
		return err
	}
	if err := BuildBasilicoJs(filepath.Join(basePath, "basilico.js")); err != nil {
		return err
	}
	return nil
}