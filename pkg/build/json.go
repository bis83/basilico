package build

import (
	project "github.com/bis83/basilico/pkg/project"
	"os"
	"encoding/json"
	"path/filepath"
)

func buildData(prj *project.Project, name string, dir string) error {
	var bundle Bundle
	// TODO:
	data, err := json.Marshal(bundle)
	if err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(dir, name+".json"), data, 0666); err != nil {
		return err
	}
	return nil
}

func makeDir(dir string) error {
	_, err := os.Stat(dir)
	if err == nil {
		return nil
	}
	if err2 := os.Mkdir(dir, 0777); err2 != nil {
		return err2
	}
	return nil
}

func buildDataJson(prj *project.Project, dir string) error {
	if err := makeDir(dir); err != nil {
		return err
	}
	for name, spec := range prj.Spec {
		if spec.Type != "scene" {
			continue
		}
		if err := buildData(prj, name, dir); err != nil {
			return err
		}
	}
	return nil
}
