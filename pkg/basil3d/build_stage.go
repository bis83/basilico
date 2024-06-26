package basil3d

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
)

func openStage(path string) (*AppStage, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc AppStage
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}

func (p *Builder) readStage(baseDir string) error {
	dir := filepath.Join(baseDir, "stage")
	if !basil.Exists(dir) {
		return nil
	}

	p.Stage = make(map[string]*AppStage, 0)
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

		doc, err := openStage(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Stage[name] = doc
		fmt.Printf("Stage: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) importStage(app *App) error {
	app.Stage = p.Stage
	return nil
}
