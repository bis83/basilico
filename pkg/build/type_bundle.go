package build

type Prop struct {
	Mesh   string  `json:"mesh"`
	Matrix *string `json:"matrix"`
	AABB   *string `json:"aabb"`
}

type Mesh struct {
	Name     string  `json:"name"`
	View     []int   `json:"view"`
	Position *string `json:"position"`
	Color    *string `json:"color"`
	Uv       *string `json:"uv"`
	Index    *string `json:"index"`
}

type Bundle struct {
	// Configure
	PlayerPosition []float32 `json:"player_position"`

	// Entity
	Prop []*Prop `json:"prop"`

	// Resources
	Mesh []*Mesh `json:"mesh"`
}
