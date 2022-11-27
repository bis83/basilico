package project

type Shader struct {
	Name           string   `toml:"name"`
	VertexShader   string   `toml:"vertex-shader"`
	FragmentShader string   `toml:"fragment-shader"`
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform-block"`
}

type Draw struct {
	Name   string     `toml:"name"`
	Mesh   string     `toml:"mesh"`
	Shader string     `toml:"shader"`
	Image  string     `toml:"image"`
	Ortho  bool       `toml:"ortho"`
	State  *DrawState `toml:"state"`
}

type DrawState struct {
	Depth bool `toml:"depth"`
	Alpha bool `toml:"alpha"`
	Cw    bool `toml:"cw"`
}
