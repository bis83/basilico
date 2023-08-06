package basil3d

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"os"
	"path/filepath"

	"github.com/go-gl/mathgl/mgl32"
	"github.com/qmuntal/gltf"
	"github.com/x448/float16"

	basil "github.com/bis83/basilico/pkg/basil"
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

func (p *Builder) readGLTF(baseDir string) error {
	dir := filepath.Join(baseDir, "gltf")
	if !basil.Exists(dir) {
		return nil
	}
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) != ".gltf" {
			return nil
		}

		doc, err := gltf.Open(path)
		if err != nil {
			return err
		}
		p.GLTF = append(p.GLTF, doc)
		fmt.Printf("GLTF: %v\n", path)

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func (p *Builder) importGLTF(app *App) error {
	for _, doc := range p.GLTF {
		for _, mesh := range doc.Meshes {
			var appID AppGPUID
			app.GPU.ID = append(app.GPU.ID, &appID)
			appID.Name = mesh.Name
			for _, prim := range mesh.Primitives {
				// mesh
				var appMesh AppGPUMesh
				app.GPU.Mesh = append(app.GPU.Mesh, &appMesh)
				appID.Mesh = append(appID.Mesh, len(app.GPU.Mesh)-1)

				// buffer
				var appBuffer AppGPUBuffer
				app.GPU.Buffer = append(app.GPU.Buffer, &appBuffer)
				bufferIndex := len(app.GPU.Buffer) - 1

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
					appMesh.Hint |= HasPosition
					appMesh.VertexBuffer0 = []int{bufferIndex, offset, size}
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
					appMesh.Hint |= HasNormal
					appMesh.VertexBuffer1 = []int{bufferIndex, offset, size}
				}
				if attr, ok := prim.Attributes["TEXCOORD_0"]; ok {
					offset := vb.Len()
					buf, err := toFloat32Array(getBytes(doc, attr))
					if err != nil {
						return err
					}
					buf2 := toFloat16Array(buf)
					if err := binary.Write(&vb, binary.LittleEndian, buf2); err != nil {
						return err
					}
					size := vb.Len() - offset
					appMesh.Hint |= HasTexcoord0
					appMesh.VertexBuffer3 = []int{bufferIndex, offset, size}
				}
				if prim.Indices != nil {
					offset := vb.Len()
					ib := getBytes(doc, *prim.Indices)
					if err := binary.Write(&vb, binary.LittleEndian, ib); err != nil {
						return err
					}
					size := vb.Len() - offset
					appMesh.IndexBuffer = []int{bufferIndex, offset, size}
					appMesh.Count = len(ib) / 2
				}
				appBuffer.Embed = app.AddEmbed(base64.StdEncoding.EncodeToString(vb.Bytes()))

				// Material
				material := doc.Materials[*prim.Material]
				appMesh.Factor0 = []float64{
					float64(material.PBRMetallicRoughness.BaseColorFactor[0]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[1]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[2]),
					float64(material.PBRMetallicRoughness.BaseColorFactor[3]),
				}
				appMesh.Factor1 = []float64{
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
