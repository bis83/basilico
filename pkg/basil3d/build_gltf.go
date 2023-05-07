package basil3d

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"

	"github.com/go-gl/mathgl/mgl32"
	"github.com/qmuntal/gltf"
	"github.com/x448/float16"
)

func getBytes(doc *gltf.Document, index uint32) []byte {
	ac := doc.Accessors[index]
	bv := doc.BufferViews[*ac.BufferView]
	b := doc.Buffers[bv.Buffer].Data[bv.ByteOffset : bv.ByteOffset+bv.ByteLength]
	return b
}

func toFloat32Array(buf []byte) ([]float32, error) {
	p := make([]float32, len(buf)/4)
	r := bytes.NewReader(buf)
	if err := binary.Read(r, binary.LittleEndian, p); err != nil {
		return nil, err
	}
	return p, nil
}

func normalizeVector3(v []float32) []float32 {
	var vv []float32
	for i := 0; i < len(v)/3; i++ {
		n := mgl32.Vec3{v[i*3+0], v[i*3+1], v[i*3+2]}.Normalize()
		vv = append(vv, n[0], n[1], n[2])
	}
	return vv
}

func toFloat16Array(data []float32) []uint16 {
	var data2 []uint16
	for _, v := range data {
		data2 = append(data2, float16.Fromfloat32(v).Bits())
	}
	return data2
}

func (p *Builder) importGLTF(pack *Pack) error {
	for _, doc := range p.GLTF {
		for _, mesh := range doc.Meshes {
			var packLabel PackGPULabel
			pack.GPU.Label = append(pack.GPU.Label, &packLabel)
			packLabel.Name = mesh.Name
			for _, prim := range mesh.Primitives {
				// mesh
				var packMesh PackGPUMesh
				pack.GPU.Mesh = append(pack.GPU.Mesh, &packMesh)
				packLabel.Mesh = append(packLabel.Mesh, len(pack.GPU.Mesh)-1)

				// buffer
				var packBuffer PackGPUBuffer
				pack.GPU.Buffer = append(pack.GPU.Buffer, &packBuffer)
				bufferIndex := len(pack.GPU.Buffer) - 1

				// convert vertex
				var vb bytes.Buffer
				if attr, ok := prim.Attributes["POSITION"]; ok {
					packMesh.Hint |= HasPosition
					packMesh.VertexBuffer0 = []int{bufferIndex, vb.Len()}
					buf, err := toFloat32Array(getBytes(doc, attr))
					if err != nil {
						return err
					}
					if err := binary.Write(&vb, binary.LittleEndian, buf); err != nil {
						return err
					}
				}
				if attr, ok := prim.Attributes["NORMAL"]; ok {
					packMesh.Hint |= HasNormal
					packMesh.VertexBuffer1 = []int{bufferIndex, vb.Len()}
					buf, err := toFloat32Array(getBytes(doc, attr))
					if err != nil {
						return err
					}
					buf2 := toFloat16Array(normalizeVector3(buf))
					if err := binary.Write(&vb, binary.LittleEndian, buf2); err != nil {
						return err
					}
				}
				if attr, ok := prim.Attributes["TEXCOORD_0"]; ok {
					packMesh.Hint |= HasTexcoord0
					packMesh.VertexBuffer3 = []int{bufferIndex, vb.Len()}
					buf, err := toFloat32Array(getBytes(doc, attr))
					if err != nil {
						return err
					}
					buf2 := toFloat16Array(buf)
					if err := binary.Write(&vb, binary.LittleEndian, buf2); err != nil {
						return err
					}
				}
				if prim.Indices != nil {
					packMesh.IndexBuffer = []int{bufferIndex, vb.Len()}
					ib := getBytes(doc, *prim.Indices)
					if err := binary.Write(&vb, binary.LittleEndian, ib); err != nil {
						return err
					}
					packMesh.First = 0
					packMesh.Count = len(ib) / 2
				}
				packBuffer.Content = pack.AddContent(base64.StdEncoding.EncodeToString(vb.Bytes()))

				// Material
				material := doc.Materials[*prim.Material]
				packMesh.Factor0 = []float64{
					float64(material.PBRMetallicRoughness.BaseColorFactor[0]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[1]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[2]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[3]),
				}
				packMesh.Factor1 = []float64{
					float64(0),
					float64(*material.PBRMetallicRoughness.MetallicFactor),
					float64(*material.PBRMetallicRoughness.RoughnessFactor),
					0,
				}
			}
		}
	}
	return nil
}
