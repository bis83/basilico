package build

import (
	"embed"
	"os"
	"path/filepath"

	project "github.com/bis83/basilico/pkg/project"
)

//go:embed web
var fs embed.FS

func Clean(baseDir string) error {
	htmlFile := filepath.Join(baseDir, "index.html")
	if err := os.Remove(htmlFile); err != nil {
		return err
	}
	jsFile := filepath.Join(baseDir, "app.js")
	if err := os.Remove(jsFile); err != nil {
		return err
	}
	dataDir := filepath.Join(baseDir, "data")
	if err := os.RemoveAll(dataDir); err != nil {
		return err
	}
	return nil
}

func Build(prj *project.Project, baseDir string) error {
	if err := Clean(baseDir); err != nil {
		return err
	}
	htmlFile := filepath.Join(baseDir, "index.html")
	if err := writeIndexHtml(prj, htmlFile); err != nil {
		return err
	}
	jsFile := filepath.Join(baseDir, "app.js")
	if err := writeScriptJs(prj, jsFile); err != nil {
		return err
	}
	dataDir := filepath.Join(baseDir, "data")
	if err := writeBundleJsons(prj, dataDir); err != nil {
		return err
	}
	return nil
}
