package project

type Mesh struct {
	Name     string    `toml:"name"`
	Position []float32 `toml:"position"`
	Normal   []float32 `toml:"normal"`
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
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform_block"`
}

type Spec struct {
	Scene   Scene      `toml:"scene"`
	Mesh    []*Mesh    `toml:"mesh"`
	Texture []*Texture `toml:"texture"`
	Shader  []*Shader  `toml:"shader"`
}
