package basil3d

type Pack struct {
	Content []string  `json:"content"`
	Draw    PackDraw  `json:"draw"`
	Audio   PackAudio `json:"audio"`
}

const (
	HasPosition int = 1 << iota
	HasNormal
	HasTangent
	HasTexcoord0
	HasBlendWeight0
	HasWeightIndices0
	HasTexture0
	HasTexture1
	HasTexture2
	HasDoubleSided
	HasAlphaBlend
)

type PackDraw struct {
	VertexBuffer []int              `json:"vertex_buffer,omitempty"`
	IndexBuffer  []int              `json:"index_buffer,omitempty"`
	Texture      []*PackDrawTexture `json:"texture,omitempty"`
	VAO          []*PackDrawVAO     `json:"vao,omitempty"`
	Mesh         []*PackDrawMesh    `json:"mesh,omitempty"`
	Index        []*PackDrawIndex   `json:"index,omitempty"`
}
type PackDrawTexture struct {
	Content int `json:"content"`
	Sampler int `json:"sampler"`
}
type PackDrawVAO struct {
	VertexBuffer   int   `json:"vb"`
	IndexBuffer    int   `json:"ib"`
	Position       []int `json:"position,omitempty"`       // [stride, offset]
	Normal         []int `json:"normal,omitempty"`         // [stride, offset]
	Tangent        []int `json:"tangent,omitempty"`        // [stride, offset]
	Texcoord0      []int `json:"texcoord0,omitempty"`      // [stride, offset]
	BlendWeight0   []int `json:"blendweight0,omitempty"`   // [stride, offset]
	WeightIndices0 []int `json:"weightindices0,omitempty"` // [stride, offset]
}
type PackDrawMesh struct {
	Hint     int       `json:"hint"`
	VAO      int       `json:"vao"`
	Mode     int       `json:"mode"`
	First    int       `json:"first"`
	Count    int       `json:"count"`
	Factor0  []float64 `json:"factor0,omitempty"`  // [Color.r, Color.g, Color.b, Color.a]
	Factor1  []float64 `json:"factor1,omitempty"`  // [Occlusion, Metallic, Roughness, unused]
	Texture0 int       `json:"texture0,omitempty"` // BaseColorTexture
	Texture1 int       `json:"texture1,omitempty"` // ParameterTexture(OcclusionMetallicRoughness)
	Texture2 int       `json:"texture2,omitempty"` // NormalTexture
}
type PackDrawIndex struct {
	Name string `json:"name"`
	Mesh []int  `json:"mesh"`
}

type PackAudio struct {
}

func (p *Pack) AddContent(buf string) int {
	for i, v := range p.Content {
		if v == buf {
			return i
		}
	}
	i := len(p.Content)
	p.Content = append(p.Content, buf)
	return i
}
