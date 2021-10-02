package build

import (
	"encoding/json"
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
)

func buildTexture(tex *project.Texture) (*Texture, error) {
	var tt Texture
	tt.Name = tex.Name
	tt.Text = tex.Text
	tt.Width = tex.Width
	tt.Height = tex.Height
	return &tt, nil
}

func buildShader(s *project.Shader) (*Shader, error) {
	var ss Shader
	ss.Name = s.Name
	ss.VertexShader = s.VertexShader
	ss.FragmentShader = s.FragmentShader
	ss.Attribute = s.Attribute
	ss.Uniform = s.Uniform
	return &ss, nil
}

func buildSceneProp(prop *project.Prop) (*Prop, error) {
	var pp Prop
	pp.Mesh = prop.Mesh

	var matrix []float32
	var aabb []float32
	for _, l := range prop.Layout {
		m := layoutMatrix(l)
		matrix = append(matrix, m[:]...)
	}

	if len(matrix) > 0 {
		str, err := encodeFloat32Array(matrix)
		if err != nil {
			return nil, err
		}
		pp.Matrix = &str
	}
	if len(aabb) > 0 {
		str, err := encodeFloat32Array(aabb)
		if err != nil {
			return nil, err
		}
		pp.AABB = &str
	}
	return &pp, nil
}

func isSceneEmpty(s *Scene) bool {
	if len(s.Prop) > 0 {
		return false
	}
	return true
}

func buildScene(spec *project.Specification) (*Scene, error) {
	var s Scene
	for _, v := range spec.Scene.Prop {
		prop, err := buildSceneProp(v)
		if err != nil {
			return nil, err
		}
		s.Prop = append(s.Prop, prop)
	}
	if isSceneEmpty(&s) {
		return nil, nil
	}
	return &s, nil
}

func buildBundle(prj *project.Project, name string) (*Bundle, error) {
	spec := prj.Spec[name]

	var b Bundle
	if scene, err := buildScene(spec); err != nil {
		return nil, err
	} else {
		b.Scene = scene
	}
	// Resources
	for _, v := range spec.Mesh {
		mesh, err := buildMesh(v)
		if err != nil {
			return nil, err
		}
		b.Mesh = append(b.Mesh, mesh)
	}
	for _, v := range spec.Texture {
		tex, err := buildTexture(v)
		if err != nil {
			return nil, err
		}
		b.Texture = append(b.Texture, tex)
	}
	for _, v := range spec.Shader {
		shader, err := buildShader(v)
		if err != nil {
			return nil, err
		}
		b.Shader = append(b.Shader, shader)
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

func writeBundleJsons(prj *project.Project, dir string) error {
	if err := file.MakeDir(dir); err != nil {
		return err
	}
	for name, _ := range prj.Spec {
		if err := writeBundle(prj, name, dir); err != nil {
			return err
		}
	}
	return nil
}
