package project

import (
	toml "github.com/pelletier/go-toml/v2"
	"os"
	"path/filepath"
)

func readConfig(path string) (*Config, error) {
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

func Read(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "_config.toml")
	cfg, err := readConfig(tomlPath)
	if err != nil {
		return nil, err
	}
	return &Project{Cfg: cfg}, nil
}
