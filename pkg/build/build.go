package build

import (
	"os"
	"path/filepath"

	data "github.com/bis83/basilico/pkg/data"
	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
	script "github.com/bis83/basilico/pkg/script"
)

func Clean(baseDir string) error {
	dir := filepath.Join(baseDir, "dist")
	if err := os.RemoveAll(dir); err != nil {
		return err
	}
	return nil
}

func buildScript(prj *project.Project, baseDir string) error {
	if err := file.MakeDir(baseDir); err != nil {
		return err
	}
	fs, err := script.Make(prj)
	if err != nil {
		return err
	}
	for _, f := range fs {
		if err := f.Write(baseDir); err != nil {
			return err
		}
	}
	return nil
}

func buildData(prj *project.Project, baseDir string) error {
	if err := file.MakeDir(baseDir); err != nil {
		return err
	}
	fs, err := data.Make(prj)
	if err != nil {
		return err
	}
	for _, f := range fs {
		if err := f.Write(baseDir); err != nil {
			return err
		}
	}
	return nil
}

func Build(prj *project.Project, baseDir string) error {
	if err := Clean(baseDir); err != nil {
		return err
	}
	if err := buildScript(prj, filepath.Join(baseDir, "dist")); err != nil {
		return err
	}
	if err := buildData(prj, filepath.Join(baseDir, "dist", "data")); err != nil {
		return err
	}
	return nil
}
