package basil3d

type Pack struct {
	Content []string  `json:"content"`
	GPU     PackGPU   `json:"gpu"`
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

type PackGPU struct {
	Buffer  []*PackGPUBuffer  `json:"buffer,omitempty"`
	Texture []*PackGPUTexture `json:"texture,omitempty"`
	Mesh    []*PackGPUMesh    `json:"mesh,omitempty"`
	Label   []*PackGPULabel   `json:"label,omitempty"`
}
type PackGPUBuffer struct {
	Content int `json:"content"`
}
type PackGPUTexture struct {
	Content int `json:"content"`
}
type PackGPUMesh struct {
	Hint int `json:"hint"`

	// Input
	VertexBuffer0 []int `json:"vb0,omitempty"` // [buffer, offset], slot: 0, shaderLocation: 0, format: float32x3
	VertexBuffer1 []int `json:"vb1,omitempty"` // [buffer, offset], slot: 1, shaderLocation: 1, format: float16x2
	VertexBuffer2 []int `json:"vb2,omitempty"` // [buffer, offset], slot: 2, shaderLocation: 2
	VertexBuffer3 []int `json:"vb3,omitempty"` // [buffer, offset], slot: 3, shaderLocation: 3, format: float16x2
	VertexBuffer4 []int `json:"vb4,omitempty"` // [buffer, offset], slot: 4, shaderLocation: 4
	VertexBuffer5 []int `json:"vb5,omitempty"` // [buffer, offset], slot: 5, shaderLocation: 5
	IndexBuffer   []int `json:"ib,omitempty"`  // [buffer, offset], format: uint16

	// Uniform
	Factor0  []float64 `json:"factor0,omitempty"`  // [Color.r, Color.g, Color.b, Color.a]
	Factor1  []float64 `json:"factor1,omitempty"`  // [Occlusion, Metallic, Roughness, unused]
	Texture0 int       `json:"texture0,omitempty"` // BaseColorTexture
	Texture1 int       `json:"texture1,omitempty"` // ParameterTexture(OcclusionMetallicRoughness)
	Texture2 int       `json:"texture2,omitempty"` // NormalTexture

	First int `json:"first"`
	Count int `json:"count"`
}
type PackGPULabel struct {
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
