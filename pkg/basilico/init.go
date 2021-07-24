package basilico

import (
	_ "embed"

	"os"
	"path/filepath"

	toml "github.com/pelletier/go-toml/v2"
)

//go:embed toml/_basil.toml
var basilToml string

func CreateBasilToml(path string) error {
	_, err := os.Stat(path)
	if err == nil {
		return nil
	}
	if err := os.WriteFile(path, []byte(basilToml), 0666); err != nil {
		return err
	}
	return nil
}

func ReadBasilToml(path string) (*Config, error) {
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

func Init(basePath string) (*Config, error) {
	tomlPath := filepath.Join(basePath, "_basil.toml")
	if err := CreateBasilToml(tomlPath); err != nil {
		return &Config{}, err
	}
	return ReadBasilToml(tomlPath)
}
