package build

import (
	"embed"
	project "github.com/bis83/basilico/pkg/project"
	"path/filepath"
)

//go:embed web
var fs embed.FS

func Build(prj *project.Project, baseDir string) error {
	htmlFile := filepath.Join(baseDir, "index.html")
	if err := buildIndexHtml(prj.Cfg, htmlFile); err != nil {
		return err
	}
	jsFile := filepath.Join(baseDir, "basilico.js")
	if err := buildBasilicoJs(prj.Cfg, jsFile); err != nil {
		return err
	}
	dataDir := filepath.Join(baseDir, "data")
	if err := buildDataJson(prj, dataDir); err != nil {
		return err
	}
	return nil
}
