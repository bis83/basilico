package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

func makeUpdateGround(prj *project.Project, prop []*project.Prop) (*UpdateGround, error) {
	var m UpdateGround

	var data []float32
	var dop6 []int32
	var dop8 []int32
	var dop12 []int32

	for _, p := range prop {
		if p.Collision == "" {
			continue
		}
		mp, _ := prj.FindMesh(p.Mesh)
		if mp == nil {
			continue
		}
		mesh := toVec3Array(mp.Position)
		for _, l := range p.Layout {
			points := transformPosition(mesh, layoutMatrix(l))
			// DOP-6
			if p.Collision == "dop6" {
				d6 := calcDOP6(points)
				dop6 = append(dop6, int32(len(data)))
				data = append(data, d6...)
			}
			// DOP-8
			if p.Collision == "dop8" {
				d8 := calcDOP8(points)
				dop8 = append(dop8, int32(len(data)))
				data = append(data, d8...)
			}
			// DOP-12
			if p.Collision == "dop12" {
				d12 := calcDOP12(points)
				dop12 = append(dop12, int32(len(data)))
				data = append(data, d12...)
			}
		}
	}
	if len(data) > 0 {
		str, err := encodeFloat32Array(data)
		if err != nil {
			return nil, err
		}
		m.Buffer = &str
	}
	if len(dop6) > 0 {
		str, err := encodeInt32Array(dop6)
		if err != nil {
			return nil, err
		}
		m.DOP6 = &str
	}
	if len(dop8) > 0 {
		str, err := encodeInt32Array(dop8)
		if err != nil {
			return nil, err
		}
		m.DOP8 = &str
	}
	if len(dop12) > 0 {
		str, err := encodeInt32Array(dop12)
		if err != nil {
			return nil, err
		}
		m.DOP12 = &str
	}
	return &m, nil
}

func makeUpdate(prj *project.Project) ([]*Update, error) {
	var data []*Update
	for _, s := range prj.Scene {
		var u Update
		if len(s.Prop) > 0 {
			m, err := makeUpdateGround(prj, s.Prop)
			if err != nil {
				return nil, err
			}
			u.Ground = append(u.Ground, m)
		}
		data = append(data, &u)
	}
	return data, nil
}
