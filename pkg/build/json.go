package build

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	project "github.com/bis83/basilico/pkg/project"
	mgl "github.com/go-gl/mathgl/mgl32"
	"os"
	"path/filepath"
)

func encodeFloat32Array(data []float32) ([]byte, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

func encodeUint8Array(data []uint8) ([]byte, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

func encodeUint16Array(data []uint16) ([]byte, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

func buildMesh(mesh *project.Mesh) (*Mesh, error) {
	var mm Mesh
	mm.Name = mesh.Name
	if len(mesh.Position) > 0 {
		bytes, err := encodeFloat32Array(mesh.Position)
		if err != nil {
			return nil, err
		}
		str := base64.StdEncoding.EncodeToString(bytes)
		mm.Position = &str
	}
	if len(mesh.Color) > 0 {
		bytes, err := encodeUint8Array(mesh.Color)
		if err != nil {
			return nil, err
		}
		str := base64.StdEncoding.EncodeToString(bytes)
		mm.Color = &str
	}
	if len(mesh.Uv) > 0 {
		bytes, err := encodeFloat32Array(mesh.Uv)
		if err != nil {
			return nil, err
		}
		str := base64.StdEncoding.EncodeToString(bytes)
		mm.Uv = &str
	}
	if len(mesh.Index) > 0 {
		bytes, err := encodeUint16Array(mesh.Index)
		if err != nil {
			return nil, err
		}
		str := base64.StdEncoding.EncodeToString(bytes)
		mm.Index = &str
	}
	var count int
	if len(mesh.Index) > 0 {
		count = len(mesh.Index)
	} else {
		count = len(mesh.Position) / 3
	}
	mm.View = []int{3, 0, count}
	return &mm, nil
}

func buildProp(prop *project.Prop) (*Prop, error) {
	var pp Prop
	pp.Mesh = prop.Mesh

	var matrix []float32
	var aabb []float32
	for _, pos := range prop.Position {
		m := mgl.Translate3D(pos[0], pos[1], pos[2])
		matrix = append(matrix, m[:]...)
	}

	if len(matrix) > 0 {
		bytes, err := encodeFloat32Array(matrix)
		if err != nil {
			return nil, err
		}
		str := base64.StdEncoding.EncodeToString(bytes)
		pp.Matrix = &str
	}
	if len(aabb) > 0 {
		bytes, err := encodeFloat32Array(aabb)
		if err != nil {
			return nil, err
		}
		str := base64.StdEncoding.EncodeToString(bytes)
		pp.AABB = &str
	}
	return &pp, nil
}

func buildBundle(prj *project.Project, name string) (*Bundle, error) {
	spec := prj.Spec[name]
	var b Bundle
	for _, v := range spec.Mesh {
		mesh, err := buildMesh(v)
		if err != nil {
			return nil, err
		}
		b.Mesh = append(b.Mesh, mesh)
	}
	for _, v := range spec.Prop {
		prop, err := buildProp(v)
		if err != nil {
			return nil, err
		}
		b.Prop = append(b.Prop, prop)
	}
	return &b, nil
}

func marshalJson(bundle *Bundle, minify bool) ([]byte, error) {
	if minify {
		data, err := json.Marshal(bundle)
		if err != nil {
			return nil, err
		}
		return data, nil
	} else {
		data, err := json.MarshalIndent(bundle, "", "    ")
		if err != nil {
			return nil, err
		}
		return data, nil
	}
}

func writeBundle(prj *project.Project, name string, dir string) error {
	bundle, err := buildBundle(prj, name)
	if err != nil {
		return err
	}
	data, err2 := marshalJson(bundle, prj.Cfg.Minify)
	if err2 != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(dir, name+".json"), data, 0666); err != nil {
		return err
	}
	return nil
}

func makeDir(dir string) error {
	_, err := os.Stat(dir)
	if err == nil {
		return nil
	}
	if err2 := os.Mkdir(dir, 0777); err2 != nil {
		return err2
	}
	return nil
}

func writeBundleJsons(prj *project.Project, dir string) error {
	if err := makeDir(dir); err != nil {
		return err
	}
	for name, spec := range prj.Spec {
		if spec.Type != "scene" {
			continue
		}
		if err := writeBundle(prj, name, dir); err != nil {
			return err
		}
	}
	return nil
}
