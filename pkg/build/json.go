package build

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	project "github.com/bis83/basilico/pkg/project"
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

func buildBundle(prj *project.Project, name string) (*Bundle, error) {
	spec := prj.Spec[name]
	var b Bundle
	for _, m := range spec.Mesh {
		var mm Mesh
		mm.Name = m.Name
		mm.Position = nil
		if len(m.Position) > 0 {
			bytes, err := encodeFloat32Array(m.Position)
			if err != nil {
				return nil, err
			}
			str := base64.StdEncoding.EncodeToString(bytes)
			mm.Position = &str
		}
		mm.Color = nil
		if len(m.Color) > 0 {
			bytes, err := encodeUint8Array(m.Color)
			if err != nil {
				return nil, err
			}
			str := base64.StdEncoding.EncodeToString(bytes)
			mm.Color = &str
		}
		mm.Uv = nil
		mm.Index = nil
		b.Mesh = append(b.Mesh, &mm)
	}
	return &b, nil
}

func writeBundle(prj *project.Project, name string, dir string) error {
	bundle, err := buildBundle(prj, name)
	if err != nil {
		return err
	}
	data, err2 := json.Marshal(bundle)
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
