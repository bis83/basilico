package pack

import (
	"bytes"
	"encoding/binary"
	"fmt"

	pages "github.com/bis83/basilico/pkg/pages"
	"github.com/qmuntal/gltf"
)

func findMeshFromGLTF(src *pages.Pages, name string) (*pages.MeshBuffer, error) {
	for _, doc := range src.GLTF {
		for _, mesh := range doc.Meshes {
			if mesh.Name != name {
				continue
			}

			var buffer pages.MeshBuffer

			prim := mesh.Primitives[0] // FIXME:
			for attr, i := range prim.Attributes {
				access := doc.Accessors[i]
				bv := doc.BufferViews[*access.BufferView]
				b := doc.Buffers[bv.Buffer].Data[bv.ByteOffset : bv.ByteOffset+bv.ByteLength]
				r := bytes.NewReader(b)
				if attr == "POSITION" {
					p := make([]float32, len(b)/4)
					if err := binary.Read(r, binary.LittleEndian, p); err != nil {
						return nil, err
					}
					buffer.Position = p
				} else if attr == "NORMAL" {
					p := make([]float32, len(b)/4)
					if err := binary.Read(r, binary.LittleEndian, p); err != nil {
						return nil, err
					}
					buffer.Normal = p
				} else if attr == "TEXCOORD_0" {
					p := make([]float32, len(b)/4)
					if err := binary.Read(r, binary.LittleEndian, p); err != nil {
						return nil, err
					}
					buffer.Uv = p
				} else {
					return nil, fmt.Errorf("Unsupported Attribute: %v", attr)
				}
			}
			if prim.Mode != gltf.PrimitiveTriangles {
				return nil, fmt.Errorf("Unsupported PrimitiveType: %v", prim.Mode)
			}
			if prim.Indices != nil {
				access := doc.Accessors[*prim.Indices]
				bv := doc.BufferViews[*access.BufferView]
				b := doc.Buffers[bv.Buffer].Data[bv.ByteOffset : bv.ByteOffset+bv.ByteLength]
				r := bytes.NewReader(b)

				p := make([]uint16, len(b)/2)
				if err := binary.Read(r, binary.LittleEndian, p); err != nil {
					return nil, err
				}
				buffer.Index = p

				buffer.View = append(buffer.View, &pages.MeshView{3, 0, int(access.Count)})
			}

			return &buffer, nil
		}
	}
	return nil, nil
}
