package data

import (
	mgl "github.com/go-gl/mathgl/mgl32"
)

func layoutMatrix(t []float32) mgl.Mat4 {
	l := len(t)
	if l == 3 {
		// NOTE: Translate [x, y, z]
		return mgl.Translate3D(t[0], t[1], t[2])
	} else if l == 4 {
		// NOTE: Translate + Y-axis Rotate [x, y, z, deg]
		a := mgl.Translate3D(t[0], t[1], t[2])
		r := mgl.HomogRotate3D(mgl.DegToRad(t[3]), mgl.Vec3{0, 1, 0})
		return a.Mul4(r)
	} else if l == 7 {
		// NOTE: Translate + Rotate [x, y, z, deg, ax, ay, az]
		a := mgl.Translate3D(t[0], t[1], t[2])
		r := mgl.HomogRotate3D(mgl.DegToRad(t[3]), mgl.Vec3{t[4], t[5], t[6]})
		return a.Mul4(r)
	} else if l == 10 {
		// NOTE: Translate + Rotate + Scale [x, y, z, deg, ax, ay, az, sx, sy, sz]
		a := mgl.Translate3D(t[0], t[1], t[2])
		r := mgl.HomogRotate3D(mgl.DegToRad(t[3]), mgl.Vec3{t[4], t[5], t[6]})
		s := mgl.Scale3D(t[7], t[8], t[9])
		return a.Mul4(r).Mul4(s)
	}
	return mgl.Ident4()
}
