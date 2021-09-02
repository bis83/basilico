package project

import (
	"embed"
	"os"
	"path/filepath"
)

//go:embed toml
var fs embed.FS

func writeConfig(path string) error {
	_, err := os.Stat(path)
	if err == nil {
		return nil
	}
	data, err2 := fs.ReadFile("toml/config.toml")
	if err2 != nil {
		return err
	}
	if err := os.WriteFile(path, data, 0666); err != nil {
		return err
	}
	return nil
}

func New(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "_config.toml")
	if err := writeConfig(tomlPath); err != nil {
		return nil, err
	}
	return Read(baseDir)
}
