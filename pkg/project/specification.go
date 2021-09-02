package project

type Prop struct {
	Name     string      `toml:"name"`
	Mesh     string      `toml:"mesh"`
	Material string      `toml:"material"`
	Position [][]float64 `toml:"position"`
	Scale    [][]float64 `toml:"scale"`
	Rotation [][]float64 `toml:"rotation"`
}

type Mesh struct {
	Name     string    `toml:"name"`
	Position []float32 `toml:"position"`
	Color    []uint8   `toml:"color"`
	Uv       []float32 `toml:"uv"`
	Index    []uint32  `toml:"index"`
}

type Specification struct {
	// Configure
	Type   string   `toml:"type"`
	Import []string `toml:"import"`

	// Entity
	Prop []*Prop `toml:"prop"`

	// Resources
	Mesh []*Mesh `toml:"mesh"`
}
