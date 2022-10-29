package project

type Mesh struct {
	Name     string    `toml:"name"`
	Position []float32 `toml:"position"`
	Normal   []float32 `toml:"normal"`
	Color    []uint8   `toml:"color"`
	Uv       []float32 `toml:"uv"`
	Index    []uint16  `toml:"index"`
	IsLine   bool      `toml:"is-line"`
}

type Image struct {
	Name    string `toml:"name"`
	Source  string `toml:"src"`
	Sampler int    `toml:"sampler"`
}

type Shader struct {
	Name           string   `toml:"name"`
	VertexShader   string   `toml:"vertex-shader"`
	FragmentShader string   `toml:"fragment-shader"`
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform-block"`
}

type Draw struct {
	Name   string `toml:"name"`
	Mesh   string `toml:"mesh"`
	Shader string `toml:"shader"`
	Image  string `toml:"image"`
	Ortho  bool   `toml:"ortho"`
	Depth  bool   `toml:"depth"`
	Alpha  bool   `toml:"alpha"`
}
