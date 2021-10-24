package build

import (
	"embed"
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
)

//go:embed web
var fs embed.FS

func Clean(baseDir string) error {
	dir := filepath.Join(baseDir, "_site")
	if err := os.RemoveAll(dir); err != nil {
		return err
	}
	return nil
}

func Build(prj *project.Project, baseDir string) error {
	if err := Clean(baseDir); err != nil {
		return err
	}
	if err := file.MakeDir(filepath.Join(baseDir, "_site")); err != nil {
		return err
	}
	if err := writeCoreScripts(prj, filepath.Join(baseDir, "_site")); err != nil {
		return err
	}
	if err := writeBundleJsons(prj, filepath.Join(baseDir, "_site", "data")); err != nil {
		return err
	}
	return nil
}
