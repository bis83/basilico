package project

import (
	"embed"
	"os"
	"path/filepath"

	toml "github.com/pelletier/go-toml/v2"
)

//go:embed toml
var fs embed.FS

func createConfigToml(path string) error {
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

func readBasilToml(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return &Config{}, err
	}
	var cfg Config
	if err := toml.Unmarshal(data, &cfg); err != nil {
		return &Config{}, err
	}
	return &cfg, nil
}

func New(baseDir string) (*Config, error) {
	tomlPath := filepath.Join(baseDir, "_config.toml")
	if err := createConfigToml(tomlPath); err != nil {
		return &Config{}, err
	}
	return readBasilToml(tomlPath)
}
