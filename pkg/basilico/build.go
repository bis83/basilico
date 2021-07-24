package basilico

import (
	"embed"

	"os"
	"path/filepath"
	"html/template"
)

//go:embed web
var web embed.FS

func BuildIndexHtml(cfg *Config, path string) error {
	html, err := web.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("index").Parse(string(html)))
	fp, err2 := os.Create(path)
	if err2 != nil {
		return err
	}
	defer fp.Close()
	if err := tpl.Execute(fp, cfg); err != nil {
		return err
	}
	return nil
}
func WriteJs(fp *os.File, path string) error {
	js, err := web.ReadFile(path)
	if err != nil {
		return err;
	}
	if _, err := fp.WriteString(string(js)); err != nil {
		return err
	}
	return nil
}

func BuildBasilicoJs(path string) error {
	fp, err := os.Create(path)
	if err != nil {
		return err
	}
	defer fp.Close()

	filePaths := []string {
		"web/js/header.js",
		"web/js/core/core_canvas.js",
		"web/js/core/core_controller.js",
		"web/js/main.js",
	}
	for _, path := range filePaths {
		if err := WriteJs(fp, path); err != nil {
			return err
		}
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