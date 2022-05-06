package project

import (
	"embed"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
)

//go:embed toml
var fs embed.FS

func writeSetup(path string) error {
	if file.Exists(path) {
		return nil
	}
	data, err := fs.ReadFile("toml/setup.toml")
	if err != nil {
		return err
	}
	if err := file.WriteFile(path, data); err != nil {
		return err
	}
	return nil
}

func writeBasePage(path string) error {
	if err := file.MakeDir(path); err != nil {
		return err
	}
	emptyPath := filepath.Join(path, "base.toml")
	data, err := fs.ReadFile("toml/base.toml")
	if err != nil {
		return err
	}
	if err := file.WriteFile(emptyPath, data); err != nil {
		return err
	}
	return nil
}

func New(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "setup.toml")
	if !file.Exists(tomlPath) {
		if err := writeSetup(tomlPath); err != nil {
			return nil, err
		}
	}
	pagePath := filepath.Join(baseDir, "pages")
	if !file.Exists(pagePath) {
		if err := writeBasePage(pagePath); err != nil {
			return nil, err
		}
	}
	return Read(baseDir)
}
