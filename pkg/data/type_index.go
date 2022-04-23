package data

type IndexData struct {
	Reticle   int `json:"reticle"`
	DebugGrid int `json:"debug_grid"`
	MeshPC    int `json:"mesh_pc"`
}

type Index struct {
	Data IndexData `json:"data"`
}
