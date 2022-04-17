package data

type IndexData struct {
	Reticle   int `json:"reticle"`
	Box       int `json:"box"`
	Stack     int `json:"stack"`
	DebugGrid int `json:"debug_grid"`
	MeshPC    int `json:"mesh_pc"`
	MeshPNC   int `json:"mesh_pnc"`
}

type Index struct {
	Data IndexData `json:"data"`
}
