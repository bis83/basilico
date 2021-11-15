package project

type Prop struct {
	Mesh      string      `toml:"mesh"`
	Material  string      `toml:"material"`
	Collision string      `toml:"collision"`
	Layout    [][]float32 `toml:"layout"`
}

type Scene struct {
	Name string  `toml:"name"`
	Prop []*Prop `toml:"prop"`
}
