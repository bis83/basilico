package build

type Mesh struct {
	Name       string  `json:"name"`
	Buffer     *string `json:"b"`
	BufferView []int   `json:"bv"`
	Index      *string `json:"i"`
	IndexView  []int   `json:"iv"`
}

type Texture struct {
	Name   string `json:"name"`
	Text   string `json:"text"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type Shader struct {
	Name           string   `json:"name"`
	VertexShader   string   `json:"vs"`
	FragmentShader string   `json:"fs"`
	Uniform        []string `json:"u"`
	UniformBlock   []string `json:"ub"`
}

type Bundle struct {
	Update  []*Update  `json:"update"`
	Draw    []*Draw    `json:"draw"`
	Mesh    []*Mesh    `json:"mesh"`
	Texture []*Texture `json:"texture"`
	Shader  []*Shader  `json:"shader"`
}
