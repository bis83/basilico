package build

type DrawProp struct {
	Mesh   string  `json:"mesh"`
	Matrix *string `json:"matrix"`
}

type Draw struct {
	Name string      `json:"name"`
	Prop []*DrawProp `json:"prop"`
}
