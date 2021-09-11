package build

type Billboard struct {
	Mesh    string  `json:"mesh"`
	Matrix  *string `json:"matrix"`
	IsPause bool    `json:"is_pause"`
	IsOrtho bool    `json:"is_ortho"`
}

type Prop struct {
	Mesh   string  `json:"mesh"`
	Matrix *string `json:"matrix"`
	AABB   *string `json:"aabb"`
}

type Scene struct {
	Billboard []*Billboard `json:"billboard"`
	Prop      []*Prop      `json:"prop"`
}

type Mesh struct {
	Name     string  `json:"name"`
	View     []int   `json:"view"`
	Position *string `json:"position"`
	Color    *string `json:"color"`
	Uv       *string `json:"uv"`
	Index    *string `json:"index"`
}

type Texture struct {
	Name   string `json:"name"`
	Text   string `json:"text"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type Shader struct {
	Name           string   `json:"name"`
	VertexShader   string   `json:"vertex_shader"`
	FragmentShader string   `json:"fragment_shader"`
	Attribute      []string `json:"attribute"`
	Uniform        []string `json:"uniform"`
}

type Bundle struct {
	Scene *Scene `json:"scene"`
	// Resources
	Mesh    []*Mesh    `json:"mesh"`
	Texture []*Texture `json:"texture"`
	Shader  []*Shader  `json:"shader"`
}
