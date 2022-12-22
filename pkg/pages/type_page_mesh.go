package project

type Mesh struct {
	Name   string      `toml:"name"`
	Source string      `toml:"src"`
	Buffer *MeshBuffer `toml:"buffer"`
}

type MeshBuffer struct {
	Position []float32   `toml:"position"`
	Normal   []float32   `toml:"normal"`
	Color    []uint8     `toml:"color"`
	Uv       []float32   `toml:"uv"`
	Index    []uint16    `toml:"index"`
	View     []*MeshView `toml:"view"`
}

type MeshView struct {
	Mode  int `toml:"mode"`
	Start int `toml:"start"`
	Count int `toml:"count"`
}
