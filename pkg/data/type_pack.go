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

type Stack struct {
	ID     int `json:"id"`
	Mesh   int `json:"mesh"`
	Shader int `json:"shader"`
	Height int `json:"height"`
}

type UI struct {
	Mesh   int       `json:"mesh"`
	Shader int       `json:"shader"`
	Width  int       `json:"width"`
	Height int       `json:"height"`
}

type Pack struct {
	Mesh    []*Mesh    `json:"mesh"`
	Texture []*Texture `json:"texture"`
	Shader  []*Shader  `json:"shader"`
	Stack   []*Stack   `json:"stack"`
	UI      []*UI      `json:"ui"`
}
