package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

func makeDrawStaticMesh(prj *project.Project, prop *project.Prop) (*DrawStaticMesh, error) {
	var m DrawStaticMesh

	if _, i := prj.FindMesh(prop.Mesh); i >= 0 {
		m.Mesh = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: %s", prop.Mesh)
	}

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

func makeDraw(prj *project.Project) ([]*Draw, error) {
	var data []*Draw
	for _, s := range prj.Scene {
		var d Draw
		for _, p := range s.Prop {
			m, err := makeDrawStaticMesh(prj, p)
			if err != nil {
				return nil, err
			}
			d.StaticMesh = append(d.StaticMesh, m)
		}
		data = append(data, &d)
	}
	return data, nil
}
