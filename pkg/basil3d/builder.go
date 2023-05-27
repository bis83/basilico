package basil3d

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/qmuntal/gltf"
)

type Builder struct {
	GLTF []*gltf.Document
	TOML []*TomlDoc
}

func (p *Builder) readGLTF(baseDir string) error {
	err := filepath.Walk(filepath.Join(baseDir, "gltf"), func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".gltf" {
			return nil
		}

		doc, err := gltf.Open(path)
		if err != nil {
			return err
		}
		p.GLTF = append(p.GLTF, doc)
		fmt.Printf("GLTF: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) readTOML(baseDir string) error {
	err := filepath.Walk(filepath.Join(baseDir, "toml"), func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".toml" {
			return nil
		}

		doc, err := openTomlDoc(path)
		if err != nil {
			return err
		}
		p.TOML = append(p.TOML, doc)
		fmt.Printf("TOML: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) read(baseDir string) error {
	if err := p.readGLTF(baseDir); err != nil {
		return err
	}
	if err := p.readTOML(baseDir); err != nil {
		return err
	}
	return nil
}

func (p *Builder) build() (*App, error) {
	var app App
	app.Embed = append(app.Embed, nil)

	if err := p.importGLTF(&app); err != nil {
		return nil, err
	}
	return &app, nil
}
