package basil3d

type Pack struct {
	Content []string `json:"content"`
	Mesh    PackMesh `json:"mesh,omitempty"`
}
type PackMesh struct {
	VertexBuffer []int                     `json:"vertex_buffer,omitempty"`
	IndexBuffer  []int                     `json:"index_buffer,omitempty"`
	Texture      []*PackMeshTexture        `json:"texture,omitempty"`
	Shader       []*PackMeshShader         `json:"shader,omitempty"`
	Program      []*PackMeshProgram        `json:"program,omitempty"`
	VAO          []*PackMeshVAO            `json:"vao,omitempty"`
	Pipeline     []*PackMeshPipeline       `json:"pipeline,omitempty"`
	Primitive    []*PackMeshPrimitive      `json:"primitive,omitempty"`
	Key          map[string]*PackMeshEntry `json:"key,omitempty"`
}
type PackMeshTexture struct {
	Content int `json:"content"`
	Sampler int `json:"sampler"`
}
type PackMeshShader struct {
	Content int `json:"content"`
	Type    int `json:"type"`
}
type PackMeshProgram struct {
	VertexShader   int `json:"vertex_shader"`
	FragmentShader int `json:"fragment_shader"`
}
type PackMeshVAO struct {
	VertexBuffer int `json:"vertex_buffer"`
	IndexBuffer  int `json:"index_buffer"`
	Position     int `json:"position"`
	Normal       int `json:"normal"`
	UV0          int `json:"uv0"`
}
type PackMeshPipeline struct {
	Program int  `json:"program"`
	VAO     int  `json:"vao"`
	Cull    bool `json:"cull"`
	Depth   bool `json:"depth"`
	Alpha   bool `json:"alpha"`
}
type PackMeshPrimitive struct {
	Pipeline                 int       `json:"pipeline"`
	Mode                     int       `json:"mode"`
	First                    int       `json:"first"`
	Count                    int       `json:"count"`
	BaseColorFactor          []float64 `json:"base_color_factor"`
	MetallicFactor           float64   `json:"metallic_factor"`
	RoughnessFactor          float64   `json:"roughness_factor"`
	BaseColorTexture         int       `json:"base_color_texture"`
	MetallicRoughnessTexture int       `json:"metallic_roughness_texture"`
}
type PackMeshEntry struct {
	Primitives []int `json:"primitives"`
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
