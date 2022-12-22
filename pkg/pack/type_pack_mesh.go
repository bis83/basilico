package pack

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"fmt"

	pages "github.com/bis83/basilico/pkg/pages"
)

type Mesh struct {
	Buffer     int   `json:"b"`
	BufferView []int `json:"bv"`
	Index      int   `json:"i"`
	IndexView  []int `json:"iv"`
}

func (p *Mesh) Set(pack *Pack, src *pages.Pages, mesh *pages.Mesh) error {
	var b bytes.Buffer
	var err error

	var buffer *pages.MeshBuffer
	if buffer, err = findMeshFromGLTF(src, mesh.Source); err != nil {
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
	p.Buffer = pack.AppendContent(base64.StdEncoding.EncodeToString(b.Bytes()))
	if len(buffer.Index) > 0 {
		str, err := encodeUint16Array(buffer.Index)
		if err != nil {
			return err
		}
		p.Index = pack.AppendContent(str)
	} else {
		p.Index = -1
	}
	for _, view := range buffer.View {
		p.IndexView = append(p.IndexView, view.Mode, view.Start, view.Count)
	}
	return nil
}
