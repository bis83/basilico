package basilico

import (
	_ "embed"

	"os"
	"path/filepath"

	toml "github.com/pelletier/go-toml/v2"
)

//go:embed toml/basil.toml
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

//go:embed toml/level.toml
var levelToml string

func CreateMainLevelToml(path string) error {
	_, err := os.Stat(path)
	if err == nil {
		return nil
	}
	if err2 := os.WriteFile(path, []byte(levelToml), 0666); err2 != nil {
		return err2
	}
	return nil
}

func CreateLevelDir(path string) error {
	_, err := os.Stat(path)
	if err == nil {
		return nil
	}
	if err2 := os.Mkdir(path, 0777); err2 != nil {
		return err2
	}
	mainLevel := filepath.Join(path, "main.toml")
	return CreateMainLevelToml(mainLevel)
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

func Init(baseDir string) (*Config, error) {
	tomlPath := filepath.Join(baseDir, "_basil.toml")
	if err := CreateBasilToml(tomlPath); err != nil {
		return &Config{}, err
	}
	levelDirPath := filepath.Join(baseDir, "_level")
	if err := CreateLevelDir(levelDirPath); err != nil {
		return &Config{}, err
	}
	return ReadBasilToml(tomlPath)
}
