package basil3d

type App struct {
	Embed []*string `json:"embed"`
	GPU   AppGPU    `json:"gpu"`
	Audio AppAudio  `json:"audio"`
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

type AppGPU struct {
	Buffer  []*AppGPUBuffer  `json:"buffer,omitempty"`
	Texture []*AppGPUTexture `json:"texture,omitempty"`
	Mesh    []*AppGPUMesh    `json:"mesh,omitempty"`
	ID      []*AppGPUID      `json:"id,omitempty"`
}
type AppGPUBuffer struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUTexture struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUMesh struct {
	Hint int `json:"hint"`

	// Input
	VertexBuffer0 []int `json:"vb0,omitempty"` // [buffer, offset, size], slot: 0, shaderLocation: 0, format: float32x3 (position)
	VertexBuffer1 []int `json:"vb1,omitempty"` // [buffer, offset, size], slot: 1, shaderLocation: 1, format: float32x3 (normal)
	VertexBuffer2 []int `json:"vb2,omitempty"` // [buffer, offset, size], slot: 2, shaderLocation: 2
	VertexBuffer3 []int `json:"vb3,omitempty"` // [buffer, offset, size], slot: 3, shaderLocation: 3, format: float16x2 (texcoord0)
	VertexBuffer4 []int `json:"vb4,omitempty"` // [buffer, offset, size], slot: 4, shaderLocation: 4
	VertexBuffer5 []int `json:"vb5,omitempty"` // [buffer, offset, size], slot: 5, shaderLocation: 5
	IndexBuffer   []int `json:"ib,omitempty"`  // [buffer, offset, size], format: uint16

	// Uniform
	Factor0  []float64 `json:"factor0,omitempty"`  // [Color.r, Color.g, Color.b, Color.a]
	Factor1  []float64 `json:"factor1,omitempty"`  // [Occlusion, Metallic, Roughness, unused]
	Texture0 int       `json:"texture0,omitempty"` // BaseColorTexture
	Texture1 int       `json:"texture1,omitempty"` // ParameterTexture(OcclusionMetallicRoughness)
	Texture2 int       `json:"texture2,omitempty"` // NormalTexture

	Count int `json:"count"`
}
type AppGPUID struct {
	Name string `json:"name"`
	Mesh []int  `json:"mesh"`
}

type AppAudio struct {
}

func (p *App) AddEmbed(buf string) int {
	for i, v := range p.Embed {
		if v != nil && *v == buf {
			return i
		}
	}
	i := len(p.Embed)
	p.Embed = append(p.Embed, &buf)
	return i
}
