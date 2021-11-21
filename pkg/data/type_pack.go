package data

type Mesh struct {
	Buffer     *string `json:"b"`
	BufferView []int   `json:"bv"`
	Index      *string `json:"i"`
	IndexView  []int   `json:"iv"`
}

type Texture struct {
	Text   string `json:"text"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type Shader struct {
	VertexShader   string   `json:"vs"`
	FragmentShader string   `json:"fs"`
	Uniform        []string `json:"u"`
	UniformBlock   []string `json:"ub"`
}

type Pack struct {
	Update  []*Update  `json:"update"`
	Draw    []*Draw    `json:"draw"`
	Mesh    []*Mesh    `json:"mesh"`
	Texture []*Texture `json:"texture"`
	Shader  []*Shader  `json:"shader"`
}
