package build

type DrawStaticMesh struct {
	Mesh   string  `json:"mesh"`
	Matrix *string `json:"matrix"`
}

type Draw struct {
	Name       string            `json:"name"`
	StaticMesh []*DrawStaticMesh `json:"static"`
}
