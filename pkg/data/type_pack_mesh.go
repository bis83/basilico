package data

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"

	project "github.com/bis83/basilico/pkg/project"
)

type Mesh struct {
	Buffer     *string `json:"b"`
	BufferView []int   `json:"bv"`
	Index      *string `json:"i"`
	IndexView  []int   `json:"iv"`
}

func (p *Mesh) Set(mesh *project.Mesh) error {
	// Buffer
	var b bytes.Buffer
	if len(mesh.Position) > 0 {
		p.BufferView = append(p.BufferView, 0, b.Len())
		if err := binary.Write(&b, binary.LittleEndian, mesh.Position); err != nil {
			return err
		}
	}
	if len(mesh.Normal) > 0 {
		p.BufferView = append(p.BufferView, 1, b.Len())
		nn := toFloat16Array(normalizeVector3(mesh.Normal))
		if err := binary.Write(&b, binary.LittleEndian, nn); err != nil {
			return err
		}
	}
	if len(mesh.Color) > 0 {
		p.BufferView = append(p.BufferView, 2, b.Len())
		if err := binary.Write(&b, binary.LittleEndian, mesh.Color); err != nil {
			return err
		}
	}
	if len(mesh.Uv) > 0 {
		p.BufferView = append(p.BufferView, 3, b.Len())
		nn := toFloat16Array(normalizeVector3(mesh.Uv))
		if err := binary.Write(&b, binary.LittleEndian, nn); err != nil {
			return err
		}
	}
	bb := base64.StdEncoding.EncodeToString(b.Bytes())
	p.Buffer = &bb

	// Index
	if len(mesh.Index) > 0 {
		str, err := encodeUint16Array(mesh.Index)
		if err != nil {
			return err
		}
		p.Index = &str
	}
	var mode int
	if mesh.IsLine {
		mode = 2
	} else {
		mode = 3
	}
	var count int
	if len(mesh.Index) > 0 {
		count = len(mesh.Index)
	} else {
		count = len(mesh.Position) / 3
	}
	p.IndexView = []int{mode, 0, count}
	return nil
}
