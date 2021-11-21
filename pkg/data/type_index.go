package data

type IndexStart struct {
	Scene    int       `json:"scene"`
	Position []float32 `json:"position"`
	Angle    []float32 `json:"angle"`
}

type IndexData struct {
	Reticle int `json:"reticle"`
	MeshPC  int `json:"mesh_pc"`
	MeshPNC int `json:"mesh_pnc"`
}

type IndexScene struct {
	Name   string `json:"name"`
	Update []int  `json:"update"`
	Draw   []int  `json:"draw"`
}

type Index struct {
	Start IndexStart    `json:"start"`
	Data  IndexData     `json:"data"`
	Scene []*IndexScene `json:"scene"`
}
