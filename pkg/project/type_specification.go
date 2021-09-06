package project

type Screen struct {
	Mesh     string      `toml:"mesh"`
	Material string      `toml:"material"`
	Layout   [][]float32 `toml:"layout"`
	IsPause  bool        `toml:"is_pause"`
}

type Prop struct {
	Mesh     string      `toml:"mesh"`
	Material string      `toml:"material"`
	Layout   [][]float32 `toml:"layout"`
}

type Mesh struct {
	Name     string    `toml:"name"`
	Position []float32 `toml:"position"`
	Color    []uint8   `toml:"color"`
	Uv       []float32 `toml:"uv"`
	Index    []uint16  `toml:"index"`
	IsLine   bool      `toml:"is_line"`
}

type Texture struct {
	Name   string `toml:"name"`
	Text   string `toml:"text"`
	Width  int    `toml:"width"`
	Height int    `toml:"height"`
}

type Shader struct {
	Name           string   `toml:"name"`
	VertexShader   string   `toml:"vertex_shader"`
	FragmentShader string   `toml:"fragment_shader"`
	Attribute      []string `toml:"attribute"`
	Uniform        []string `toml:"uniform"`
}

type Specification struct {
	// Configure
	Type           string    `toml:"type"`
	Import         []string  `toml:"import"`
	PlayerPosition []float32 `toml:"player_position"`

	// Entity
	Screen []*Screen `toml:"screen"`
	Prop   []*Prop   `toml:"prop"`

	// Resources
	Mesh    []*Mesh    `toml:"mesh"`
	Texture []*Texture `toml:"texture"`
	Shader  []*Shader  `toml:"shader"`
}
