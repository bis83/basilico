package data

import (
	mgl "github.com/go-gl/mathgl/mgl32"
	float16 "github.com/x448/float16"
)

func normalizeVector3(v []float32) []float32 {
	var vv []float32
	for i := 0; i < len(v)/3; i++ {
		n := mgl.Vec3{v[i*3+0], v[i*3+1], v[i*3+2]}.Normalize()
		vv = append(vv, n[0], n[1], n[2])
	}
	return vv
}

func toFloat16Array(data []float32) []uint16 {
	var data2 []uint16
	for _, v := range data {
		data2 = append(data2, float16.Fromfloat32(v).Bits())
	}
	return data2
}
