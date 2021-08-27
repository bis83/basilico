package project

type Prop struct {
	Name     string
	Mesh     string
	Material string
	Position [][]float64
	Scale    [][]float64
	Rotation [][]float64
}

type Mesh struct {
	Name     string
	Position []float64
	Color    []float64
	Uv       []float64
	Index    []uint32
}

type Specification struct {
	// Configure
	Type   string
	Import []string

	// Entity
	Prop []*Prop

	// Resources
	Mesh []*Mesh
}
