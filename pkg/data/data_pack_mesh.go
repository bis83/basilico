package data

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"

	project "github.com/bis83/basilico/pkg/project"
)

func makeMesh(mesh *project.Mesh) (*Mesh, error) {
	var mm Mesh

	// Buffer
	var b bytes.Buffer
	if len(mesh.Position) > 0 {
		mm.BufferView = append(mm.BufferView, 0, b.Len())
		if err := binary.Write(&b, binary.LittleEndian, mesh.Position); err != nil {
			return nil, err
		}
	}
	if len(mesh.Normal) > 0 {
		mm.BufferView = append(mm.BufferView, 1, b.Len())
		nn := toFloat16Array(normalizeVector3(mesh.Normal))
		if err := binary.Write(&b, binary.LittleEndian, nn); err != nil {
			return nil, err
		}
	}
	if len(mesh.Color) > 0 {
		mm.BufferView = append(mm.BufferView, 2, b.Len())
		if err := binary.Write(&b, binary.LittleEndian, mesh.Color); err != nil {
			return nil, err
		}
	}
	if len(mesh.Uv) > 0 {
		mm.BufferView = append(mm.BufferView, 3, b.Len())
		nn := toFloat16Array(normalizeVector3(mesh.Uv))
		if err := binary.Write(&b, binary.LittleEndian, nn); err != nil {
			return nil, err
		}
	}
	bb := base64.StdEncoding.EncodeToString(b.Bytes())
	mm.Buffer = &bb

	// Index
	if len(mesh.Index) > 0 {
		str, err := encodeUint16Array(mesh.Index)
		if err != nil {
			return nil, err
		}
		mm.Index = &str
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
	mm.IndexView = []int{mode, 0, count}
	return &mm, nil
}
