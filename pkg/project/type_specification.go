package project

type Billboard struct {
	Mesh    string      `toml:"mesh"`
	Texture string      `toml:"texture"`
	Layout  [][]float32 `toml:"layout"`
	IsPause bool        `toml:"is_pause"`
	IsOrtho bool        `toml:"is_ortho"`
}

type Prop struct {
	Mesh     string      `toml:"mesh"`
	Material string      `toml:"material"`
	Layout   [][]float32 `toml:"layout"`
}

type Scene struct {
	Billboard []*Billboard `toml:"billboard"`
	Prop      []*Prop      `toml:"prop"`
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
	Import []string `toml:"import"`
	Scene  Scene    `toml:"scene"`

	// Resources
	Mesh    []*Mesh    `toml:"mesh"`
	Texture []*Texture `toml:"texture"`
	Shader  []*Shader  `toml:"shader"`
}
