package project

import (
	"os"
	"path/filepath"

	toml "github.com/pelletier/go-toml/v2"
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

func listSpecs(baseDir string) ([]*Specification, error) {
	specDir := filepath.Join(baseDir, "_spec")
	list, err := listSpecFiles(specDir)
	if err != nil {
		return nil, err
	}
	var s []*Specification
	for _, file := range list {
		spec, err := readSpec(file)
		if err != nil {
			return nil, err
		}
		s = append(s, spec)
	}
	core, err2 := readCoreSpec()
	if err2 != nil {
		return nil, err2
	}
	s = append(s, core)
	return s, nil
}

func Read(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "_config.toml")
	cfg, err := readConfig(tomlPath)
	if err != nil {
		return nil, err
	}
	var prj Project
	prj.Cfg = cfg
	prj.Scene = make(map[string]*Scene)
	prj.Mesh = make(map[string]*Mesh)
	prj.Texture = make(map[string]*Texture)
	prj.Shader = make(map[string]*Shader)
	specs, err2 := listSpecs(baseDir)
	if err2 != nil {
		return nil, err2
	}
	for _, spec := range specs {
		if spec.Scene.Name != "" {
			prj.Scene[spec.Scene.Name] = &spec.Scene
		}
		for _, mesh := range spec.Mesh {
			prj.Mesh[mesh.Name] = mesh
		}
		for _, texture := range spec.Texture {
			prj.Texture[texture.Name] = texture
		}
		for _, shader := range spec.Shader {
			prj.Shader[shader.Name] = shader
		}
	}
	return &prj, nil
}
