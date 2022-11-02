package data

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Mesh struct {
	Buffer     *string `json:"b"`
	BufferView []int   `json:"bv"`
	Index      *string `json:"i"`
	IndexView  []int   `json:"iv"`
}

func (p *Mesh) Set(prj *project.Project, mesh *project.Mesh) error {
	var b bytes.Buffer
	var err error

	var buffer *project.MeshBuffer
	if buffer, err = findMeshFromGLTF(prj, mesh.Source); err != nil {
		return err
	}
	if mesh.Buffer != nil {
		buffer = mesh.Buffer
	}
	if buffer == nil {
		return fmt.Errorf("MeshBuffer Not Found: %s", mesh.Name)
	}

	if len(buffer.Position) > 0 {
		p.BufferView = append(p.BufferView, 0, b.Len())
		if err := binary.Write(&b, binary.LittleEndian, buffer.Position); err != nil {
			return err
		}
	}
	if len(buffer.Normal) > 0 {
		p.BufferView = append(p.BufferView, 1, b.Len())
		nn := toFloat16Array(normalizeVector3(buffer.Normal))
		if err := binary.Write(&b, binary.LittleEndian, nn); err != nil {
			return err
		}
	}
	if len(buffer.Color) > 0 {
		p.BufferView = append(p.BufferView, 2, b.Len())
		if err := binary.Write(&b, binary.LittleEndian, buffer.Color); err != nil {
			return err
		}
	}
	if len(buffer.Uv) > 0 {
		p.BufferView = append(p.BufferView, 3, b.Len())
		nn := toFloat16Array(buffer.Uv)
		if err := binary.Write(&b, binary.LittleEndian, nn); err != nil {
			return err
		}
	}
	bb := base64.StdEncoding.EncodeToString(b.Bytes())
	p.Buffer = &bb
	if len(buffer.Index) > 0 {
		str, err := encodeUint16Array(buffer.Index)
		if err != nil {
			return err
		}
		p.Index = &str
	}
	for _, view := range buffer.View {
		p.IndexView = append(p.IndexView, view.Mode, view.Start, view.Count)
	}
	return nil
}
