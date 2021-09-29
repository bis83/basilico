package build

import (
	mgl "github.com/go-gl/mathgl/mgl32"
)

func normalizeVector3(v []float32) []float32 {
	var vv []float32
	for i := 0; i < len(v)/3; i++ {
		n := mgl.Vec3{v[i*3+0], v[i*3+1], v[i*3+2]}.Normalize()
		vv = append(vv, n[0], n[1], n[2])
	}
	return vv
}
