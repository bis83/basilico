package data

import (
	mgl "github.com/go-gl/mathgl/mgl32"
)

func toVec3Array(pos []float32) []mgl.Vec3 {
	l := len(pos)
	var v []mgl.Vec3
	for i := 0; i < l; i += 3 {
		v = append(v, mgl.Vec3{pos[i+0], pos[i+1], pos[i+2]})
	}
	return v
}

func transformPosition(pos []mgl.Vec3, mat mgl.Mat4) []mgl.Vec3 {
	var v []mgl.Vec3
	for _, p := range pos {
		v = append(v, mgl.TransformCoordinate(p, mat))
	}
	return v
}

func mins(v []float32) float32 {
	if len(v) <= 0 {
		return 0
	}
	x := v[0]
	for _, a := range v {
		if a < x {
			x = a
		}
	}
	return x
}

func maxs(v []float32) float32 {
	if len(v) <= 0 {
		return 0
	}
	x := v[0]
	for _, a := range v {
		if x < a {
			x = a
		}
	}
	return x
}

func calcMinMax(pos []mgl.Vec3, n mgl.Vec3) (float32, float32) {
	var d []float32
	for _, p := range pos {
		d = append(d, p.Dot(n))
	}
	return mins(d), maxs(d)
}

var kDOP6 = []mgl.Vec3{
	mgl.Vec3{1, 0, 0}.Normalize(),
	mgl.Vec3{0, 1, 0}.Normalize(),
	mgl.Vec3{0, 0, 1}.Normalize(),
}

func calcDOP6(pos []mgl.Vec3) []float32 {
	var v []float32
	for _, n := range kDOP6 {
		min, max := calcMinMax(pos, n)
		v = append(v, min, max)
	}
	return v
}

var kDOP8 = []mgl.Vec3{
	mgl.Vec3{1, 1, 1}.Normalize(),
	mgl.Vec3{1, -1, -1}.Normalize(),
	mgl.Vec3{1, -1, 1}.Normalize(),
	mgl.Vec3{1, 1, -1}.Normalize(),
}

func calcDOP8(pos []mgl.Vec3) []float32 {
	var v []float32
	for _, n := range kDOP8 {
		min, max := calcMinMax(pos, n)
		v = append(v, min, max)
	}
	return v
}

var kDOP12 = []mgl.Vec3{
	mgl.Vec3{1, 1, 0}.Normalize(),
	mgl.Vec3{1, -1, 0}.Normalize(),
	mgl.Vec3{1, 0, 1}.Normalize(),
	mgl.Vec3{1, 0, -1}.Normalize(),
	mgl.Vec3{0, 1, 1}.Normalize(),
	mgl.Vec3{0, 1, -1}.Normalize(),
}

func calcDOP12(pos []mgl.Vec3) []float32 {
	var v []float32
	for _, n := range kDOP12 {
		min, max := calcMinMax(pos, n)
		v = append(v, min, max)
	}
	return v
}
