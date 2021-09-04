package project

type Prop struct {
	Mesh     string      `toml:"mesh"`
	Material string      `toml:"material"`
	Position [][]float32 `toml:"position"`
	Scale    [][]float32 `toml:"scale"`
	Rotation [][]float32 `toml:"rotation"`
}

type Mesh struct {
	Name     string    `toml:"name"`
	Position []float32 `toml:"position"`
	Color    []uint8   `toml:"color"`
	Uv       []float32 `toml:"uv"`
	Index    []uint16  `toml:"index"`
	IsLine   bool      `toml:"is_line"`
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
