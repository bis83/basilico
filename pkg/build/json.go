package build

import (
	"encoding/json"
	"os"
	"path/filepath"

	mgl "github.com/go-gl/mathgl/mgl32"

	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
)

func buildMesh(mesh *project.Mesh) (*Mesh, error) {
	var mm Mesh
	mm.Name = mesh.Name
	if len(mesh.Position) > 0 {
		str, err := encodeFloat32Array(mesh.Position)
		if err != nil {
			return nil, err
		}
		mm.Position = &str
	}
	if len(mesh.Color) > 0 {
		str, err := encodeUint8Array(mesh.Color)
		if err != nil {
			return nil, err
		}
		mm.Color = &str
	}
	if len(mesh.Uv) > 0 {
		str, err := encodeFloat32Array(mesh.Uv)
		if err != nil {
			return nil, err
		}
		mm.Uv = &str
	}
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
	mm.View = []int{mode, 0, count}
	return &mm, nil
}

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

func layoutMatrix(t []float32) mgl.Mat4 {
	l := len(t)
	if l == 3 {
		return mgl.Translate3D(t[0], t[1], t[2])
	} else if l == 7 {
		a := mgl.Translate3D(t[0], t[1], t[2])
		r := mgl.HomogRotate3D(mgl.DegToRad(t[3]), mgl.Vec3{t[4], t[5], t[6]})
		return a.Mul4(r)
	} else if l == 10 {
		a := mgl.Translate3D(t[0], t[1], t[2])
		r := mgl.HomogRotate3D(mgl.DegToRad(t[3]), mgl.Vec3{t[4], t[5], t[6]})
		s := mgl.Scale3D(t[7], t[8], t[9])
		return a.Mul4(r).Mul4(s)
	}
	return mgl.Ident4()
}

func buildBillboard(b *project.Billboard) (*Billboard, error) {
	var bb Billboard
	bb.Mesh = b.Mesh
	bb.Texture = b.Texture
	bb.IsPause = b.IsPause
	bb.IsOrtho = b.IsOrtho

	var matrix []float32
	for _, l := range b.Layout {
		m := layoutMatrix(l)
		matrix = append(matrix, m[:]...)
	}
	if len(matrix) > 0 {
		str, err := encodeFloat32Array(matrix)
		if err != nil {
			return nil, err
		}
		bb.Matrix = &str
	}
	return &bb, nil
}

func buildProp(prop *project.Prop) (*Prop, error) {
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

func isEmptyScene(s *Scene) bool {
	if len(s.Prop) > 0 {
		return false
	}
	if len(s.Billboard) > 0 {
		return false
	}
	return true
}

func buildScene(spec *project.Specification) (*Scene, error) {
	var s Scene
	for _, v := range spec.Scene.Billboard {
		billboard, err := buildBillboard(v)
		if err != nil {
			return nil, err
		}
		s.Billboard = append(s.Billboard, billboard)
	}
	for _, v := range spec.Scene.Prop {
		prop, err := buildProp(v)
		if err != nil {
			return nil, err
		}
		s.Prop = append(s.Prop, prop)
	}
	if isEmptyScene(&s) {
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
