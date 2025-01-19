package basil3d

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/pkg/basil"
)

func openRoom(path string) (*SrcRoom, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var doc SrcRoom
	d := json.NewDecoder(bytes.NewReader(data))
	d.DisallowUnknownFields()
	if err := d.Decode(&doc); err != nil {
		return nil, fmt.Errorf("decode %s: %w", path, err)
	}
	return &doc, nil
}

func (p *Builder) readRoom(baseDir string) error {
	dir := filepath.Join(baseDir, "room")
	if !basil.Exists(dir) {
		return nil
	}

	p.Room = make(map[string]*SrcRoom, 0)
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

		doc, err := openRoom(path)
		if err != nil {
			return err
		}
		name := filepath.Base(path[:len(path)-len(filepath.Ext(path))])

		p.Room[name] = doc
		fmt.Printf("Room: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) importRoom(app *App) error {
	app.Room = make(map[string]*AppRoom, len(p.Room))
	for k, v := range p.Room {
		var p AppRoom

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

		p.Layout = make([]*AppRoomLayout, 0, len(v.Layout))
		for _, x := range v.Layout {
			var m AppRoomLayout
			m.Unit = x.Unit
			m.Divisor = x.Divisor
			m.Indices = x.Indices
			m.Node = make([]*AppRoomNode, 0, len(x.Node))
			for _, a := range x.Node {
				if a == nil {
					m.Node = append(m.Node, nil)
				} else {
					var b AppRoomNode
					b.Mesh = a.Mesh
					b.Height = a.Height
					m.Node = append(m.Node, &b)
				}
			}
			p.Layout = append(p.Layout, &m)
		}

		app.Room[k] = &p
	}
	return nil
}
