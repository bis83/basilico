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
	if err := writeIndexHtml(prj.Cfg, htmlFile); err != nil {
		return err
	}
	jsFile := filepath.Join(baseDir, "basilico.js")
	if err := writeBasilicoJs(prj.Cfg, jsFile); err != nil {
		return err
	}
	dataDir := filepath.Join(baseDir, "data")
	if err := writeBundleJsons(prj, dataDir); err != nil {
		return err
	}
	return nil
}
