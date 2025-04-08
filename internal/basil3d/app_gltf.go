package basil3d

import (
	"bytes"
	"encoding/binary"

	"github.com/qmuntal/gltf"
	"github.com/x448/float16"
)

type AppGPU struct {
	Shader  []*AppGPUShader        `json:"shader,omitempty"`
	Buffer  []*AppGPUBuffer        `json:"buffer,omitempty"`
	Texture []*AppGPUTexture       `json:"texture,omitempty"`
	Segment []*AppGPUSegment       `json:"segment,omitempty"`
	Mesh    map[string]*AppGPUMesh `json:"mesh,omitempty"`
}
type AppGPUShader struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUBuffer struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUTexture struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUSegment struct {
	Hint int `json:"hint"`

	// Input
	VertexBuffer0 []int `json:"vb0,omitempty"` // [buffer, offset, size], slot: 0, shaderLocation: 0, format: float32x3 (position)
	VertexBuffer1 []int `json:"vb1,omitempty"` // [buffer, offset, size], slot: 1, shaderLocation: 1, format: float32x3 (normal)
	VertexBuffer2 []int `json:"vb2,omitempty"` // [buffer, offset, size], slot: 2, shaderLocation: 2
	VertexBuffer3 []int `json:"vb3,omitempty"` // [buffer, offset, size], slot: 3, shaderLocation: 3
	VertexBuffer4 []int `json:"vb4,omitempty"` // [buffer, offset, size], slot: 4, shaderLocation: 4
	VertexBuffer5 []int `json:"vb5,omitempty"` // [buffer, offset, size], slot: 5, shaderLocation: 5
	IndexBuffer   []int `json:"ib,omitempty"`  // [buffer, offset, size], format: uint16

	// Uniform
	Factor0  []float64 `json:"factor0,omitempty"`  // [Color.r, Color.g, Color.b, Color.a]
	Factor1  []float64 `json:"factor1,omitempty"`  // [Occlusion, Metallic, Roughness, unused]
	Factor2  []float64 `json:"factor2,omitempty"`  // [Emissive.r, Emissive.g, Emissive.b, unused]
	Texture0 int       `json:"texture0,omitempty"` // BaseColorTexture
	Texture1 int       `json:"texture1,omitempty"` // ParameterTexture(OcclusionMetallicRoughness)
	Texture2 int       `json:"texture2,omitempty"` // NormalTexture

	Count int `json:"count"`
}
type AppGPUMesh struct {
	Segment []int `json:"segment"`
}

const (
	HasPosition int = 1 << iota
	HasNormal
	HasTangent
	HasTexcoord0
	HasBlendWeight0
	HasWeightIndices0
	HasTexture0
	HasTexture1
	HasTexture2
	HasDoubleSided
	HasAlphaBlend
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

func toFloat16Array(data []float32) []uint16 {
	var data2 []uint16
	for _, v := range data {
		data2 = append(data2, float16.Fromfloat32(v).Bits())
	}
	return data2
}

func (p *App) buildGLTF(src *Source) error {
	p.GPU.Mesh = make(map[string]*AppGPUMesh)
	for _, doc := range src.GLTF {
		for _, mesh := range doc.Meshes {
			var appMesh AppGPUMesh
			p.GPU.Mesh[mesh.Name] = &appMesh
			for _, prim := range mesh.Primitives {
				// segment
				var appSegment AppGPUSegment
				p.GPU.Segment = append(p.GPU.Segment, &appSegment)
				appMesh.Segment = append(appMesh.Segment, len(p.GPU.Segment)-1)

				// buffer
				var appBuffer AppGPUBuffer
				p.GPU.Buffer = append(p.GPU.Buffer, &appBuffer)
				bufferIndex := len(p.GPU.Buffer) - 1

				// convert vertex
				var vb bytes.Buffer
				if attr, ok := prim.Attributes["POSITION"]; ok {
					offset := vb.Len()
					buf, err := toFloat32Array(getBytes(doc, attr))
					if err != nil {
						return err
					}
					if err := binary.Write(&vb, binary.LittleEndian, buf); err != nil {
						return err
					}
					size := vb.Len() - offset
					appSegment.Hint |= HasPosition
					appSegment.VertexBuffer0 = []int{bufferIndex, offset, size}
				}
				if attr, ok := prim.Attributes["NORMAL"]; ok {
					offset := vb.Len()
					buf, err := toFloat32Array(getBytes(doc, attr))
					if err != nil {
						return err
					}
					if err := binary.Write(&vb, binary.LittleEndian, buf); err != nil {
						return err
					}
					size := vb.Len() - offset
					appSegment.Hint |= HasNormal
					appSegment.VertexBuffer1 = []int{bufferIndex, offset, size}
				}
				if prim.Indices != nil {
					offset := vb.Len()
					ib := getBytes(doc, *prim.Indices)
					if err := binary.Write(&vb, binary.LittleEndian, ib); err != nil {
						return err
					}
					size := vb.Len() - offset
					appSegment.IndexBuffer = []int{bufferIndex, offset, size}
					appSegment.Count = len(ib) / 2
				}

				var err error
				appBuffer.Embed, err = p.addEmbedBase64(vb.Bytes(), true)
				if err != nil {
					return err
				}

				// Material
				material := doc.Materials[*prim.Material]
				appSegment.Factor0 = []float64{
					float64(material.PBRMetallicRoughness.BaseColorFactor[0]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[1]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[2]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[3]),
				}
				appSegment.Factor1 = []float64{
					float64(1),
					float64(*material.PBRMetallicRoughness.MetallicFactor),
					float64(*material.PBRMetallicRoughness.RoughnessFactor),
					float64(0),
				}
			}
		}
	}
	return nil
}
