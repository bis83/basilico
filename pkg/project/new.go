package project

import (
	"embed"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
)

//go:embed toml
var fs embed.FS

func writeConfig(path string) error {
	if file.Exists(path) {
		return nil
	}
	data, err := fs.ReadFile("toml/config.toml")
	if err != nil {
		return err
	}
	if err := file.WriteFile(path, data); err != nil {
		return err
	}
	return nil
}

func writeEmptySpec(path string) error {
	if err := file.MakeDir(path); err != nil {
		return err
	}
	emptyPath := filepath.Join(path, "empty.toml")
	data, err := fs.ReadFile("toml/empty.toml")
	if err != nil {
		return err
	}
	if err := file.WriteFile(emptyPath, data); err != nil {
		return err
	}
	return nil
}

func New(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "_config.toml")
	if !file.Exists(tomlPath) {
		if err := writeConfig(tomlPath); err != nil {
			return nil, err
		}
	}
	specPath := filepath.Join(baseDir, "_spec")
	if !file.Exists(specPath) {
		if err := writeEmptySpec(specPath); err != nil {
			return nil, err
		}
	}
	return Read(baseDir)
}
