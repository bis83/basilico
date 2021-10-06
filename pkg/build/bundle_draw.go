package build

import (
	project "github.com/bis83/basilico/pkg/project"
)

func buildDrawProp(prop *project.Prop) (*DrawProp, error) {
	var pp DrawProp
	pp.Mesh = prop.Mesh

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
		pp.Matrix = &str
	}

	return &pp, nil
}
