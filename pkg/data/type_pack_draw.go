package data

type DrawStaticMesh struct {
	Mesh   int     `json:"mesh"`
	Matrix *string `json:"matrix"`
}

type Draw struct {
	StaticMesh []*DrawStaticMesh `json:"static"`
}
