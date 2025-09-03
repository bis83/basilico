package basil3d

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/internal/basil"
	"github.com/qmuntal/gltf"
)

type Source struct {
	GLTF []*gltf.Document
	JSON map[string]*interface{}
}

func (p *Source) read(baseDir string) error {
	if err := p.readGLTF(baseDir); err != nil {
		return err
	}
	if err := p.readJSON(baseDir); err != nil {
		return err
	}
	return nil
}

func (p *Source) readGLTF(baseDir string) error {
	dir := filepath.Join(baseDir, "gltf")
	if !basil.Exists(dir) {
		return nil
	}
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
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

func (p *Source) readJSON(baseDir string) error {
	dir := filepath.Join(baseDir, "json")
	if !basil.Exists(dir) {
		return nil
	}

	p.JSON = make(map[string]*interface{}, 0)
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".json" {
			return nil
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		var doc interface{}
		if err := json.Unmarshal(data, &doc); err != nil {
			return fmt.Errorf("decode %s: %w", path, err)
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.JSON[name] = &doc
		fmt.Printf("JSON: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}
