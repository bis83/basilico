package project

import (
	toml "github.com/pelletier/go-toml/v2"
	"os"
	"path/filepath"
)

func readConfig(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := toml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func readCoreSpec() (*Specification, error) {
	data, err := fs.ReadFile("toml/core.toml")
	if err != nil {
		return nil, err
	}
	var spec Specification
	if err := toml.Unmarshal(data, &spec); err != nil {
		return nil, err
	}
	return &spec, nil	
}

func readSpec(path string) (*Specification, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var spec Specification
	if err := toml.Unmarshal(data, &spec); err != nil {
		return nil, err
	}
	return &spec, nil
}

func listSpecFiles(dir string) ([]string, error) {
	var files []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		files = append(files, path)
		return nil
	})
	if err != nil {
		return nil, err
	}
	return files, nil
}

func Read(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "_config.toml")
	cfg, err := readConfig(tomlPath)
	if err != nil {
		return nil, err
	}
	specDir := filepath.Join(baseDir, "_spec")
	specs, err2 := listSpecFiles(specDir)
	if err2 != nil {
		return nil, err2
	}
	var prj Project
	prj.Cfg = cfg
	prj.Spec = make(map[string]*Specification)
	for _, file := range specs {
		spec, err3 := readSpec(file)
		if err3 != nil {
			return nil, err3
		}
		name := filepath.Base(file[:len(file)-len(filepath.Ext(file))])
		prj.Spec[name] = spec
	}
	spec, err3 := readCoreSpec()
	if err3 != nil {		
		return nil, err
	}
	prj.Spec["core"] = spec
	return &prj, nil
}
