package data

type UI struct {
	Mesh   int `json:"mesh"`
	Shader int `json:"shader"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

type Index struct {
	UI []*UI `json:"ui"`
}
