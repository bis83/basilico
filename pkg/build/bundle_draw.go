package build

import (
	project "github.com/bis83/basilico/pkg/project"
)

func buildDrawStaticMesh(prop *project.Prop) (*DrawStaticMesh, error) {
	var m DrawStaticMesh
	m.Mesh = prop.Mesh

	var matrix []float32
	for _, l := range prop.Layout {
		m := layoutMatrix(l)
		matrix = append(matrix, m[:]...)
	}
	if len(matrix) > 0 {
		str, err := encodeFloat32Array(matrix)
		if err != nil {
			return nil, err
		}
		m.Matrix = &str
	}

	return &m, nil
}

func buildDraw(prj *project.Project) ([]*Draw, error) {
	var data []*Draw
	for _, s := range prj.Scene {
		var d Draw
		d.Name = s.Name
		for _, p := range s.Prop {
			m, err := buildDrawStaticMesh(p)
			if err != nil {
				return nil, err
			}
			d.StaticMesh = append(d.StaticMesh, m)
		}
		data = append(data, &d)
	}
	return data, nil
}
