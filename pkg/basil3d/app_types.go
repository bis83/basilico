package basil3d

type AppColor [4]float32

func toAppColor(p *SrcColor, r, g, b, a float32) AppColor {
	if p != nil {
		if p.R != nil {
			r = *p.R
		}
		if p.G != nil {
			g = *p.G
		}
		if p.B != nil {
			b = *p.B
		}
		if p.A != nil {
			a = *p.A
		}
	}
	return AppColor{r, g, b, a}
}
func toAppColor1111(p *SrcColor) AppColor {
	return toAppColor(p, 1, 1, 1, 1)
}
func toAppColor0000(p *SrcColor) AppColor {
	return toAppColor(p, 0, 0, 0, 0)
}

type AppMesh struct {
	Data    string   `json:"data"`
	X       float32  `json:"x"`
	Y       float32  `json:"y"`
	Z       float32  `json:"z"`
	HA      float32  `json:"ha"`
	VA      float32  `json:"va"`
	Factor0 AppColor `json:"factor0"`
	Factor1 AppColor `json:"factor1"`
	Factor2 AppColor `json:"factor2"`
}

func (p *AppMesh) set(a *SrcMesh) {
	p.Data = a.Data
	p.X = a.X
	p.Y = a.Y
	p.Z = a.Z
	p.HA = a.HA
	p.VA = a.VA
	p.Factor0 = toAppColor1111(a.Factor0)
	p.Factor1 = toAppColor1111(a.Factor1)
	p.Factor2 = toAppColor0000(a.Factor2)
}
