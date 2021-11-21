package data

type CoreStart struct {
	Scene    int       `json:"scene"`
	Position []float32 `json:"position"`
	Angle    []float32 `json:"angle"`
}

type CoreData struct {
	Reticle int `json:"reticle"`
	MeshPC  int `json:"mesh_pc"`
	MeshPNC int `json:"mesh_pnc"`
}

type CoreScene struct {
	Name   string `json:"name"`
	Update []int  `json:"update"`
	Draw   []int  `json:"draw"`
}

type Core struct {
	Start CoreStart    `json:"start"`
	Data  CoreData     `json:"data"`
	Scene []*CoreScene `json:"scene"`
}
