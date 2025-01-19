package basil3d

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
)

func openMob(path string) (*SrcMob, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc SrcMob
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}

func (p *Builder) readMob(baseDir string) error {
	dir := filepath.Join(baseDir, "mob")
	if !basil.Exists(dir) {
		return nil
	}

	p.Mob = make(map[string]*SrcMob, 0)
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

		doc, err := openMob(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Mob[name] = doc
		fmt.Printf("Mob: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) importMob(app *App) error {
	app.Mob = make(map[string]*AppMob, len(p.Mob))
	for k, v := range p.Mob {
		var p AppMob
		p.Mesh = make([]*AppMesh, 0, len(v.Mesh))
		for _, x := range v.Mesh {
			var m AppMesh
			m.Data = x.Data
			m.X = x.X
			m.Y = x.Y
			m.Z = x.Z
			m.HA = x.HA
			m.VA = x.VA
			m.Factor0 = x.Factor0.toFloat()
			m.Factor1 = x.Factor1.toFloat()
			m.Factor2 = x.Factor2.toFloat()
			p.Mesh = append(p.Mesh, &m)
		}
		p.Mass = v.Mass
		p.Radius = v.Radius
		p.Height = v.Height
		app.Mob[k] = &p
	}
	return nil
}
