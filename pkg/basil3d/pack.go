package basil3d

type Pack struct {
	Content []string `json:"content"`

	Mesh struct {
		VertexBuffer []int `json:"vertex_buffer,omitempty"`
		IndexBuffer  []int `json:"index_buffer,omitempty"`
		Texture      []struct {
			Content int `json:"content"`
			Sampler int `json:"sampler"`
		} `json:"texture,omitempty"`
		Shader []struct {
			Content int `json:"content"`
			Type    int `json:"type"`
		} `json:"shader,omitempty"`
		Program []struct {
			VertexShader   int `json:"vertex_shader"`
			FragmentShader int `json:"fragment_shader"`
		} `json:"program,omitempty"`
		VAO []struct {
			VertexBuffer int `json:"vertex_buffer"`
			IndexBuffer  int `json:"index_buffer"`
			Attribute    []struct {
				Type   int
				Offset int
			} `json:"attribute"`
		} `json:"vao,omitempty"`
		Pipeline []struct {
			Program int  `json:"program"`
			VAO     int  `json:"vao"`
			Cull    bool `json:"cull"`
			Depth   bool `json:"depth"`
			Alpha   bool `json:"alpha"`
		} `json:"pipeline,omitempty"`
		Primitive []struct {
			Pipeline                 int       `json:"pipeline"`
			Mode                     int       `json:"mode"`
			First                    int       `json:"first"`
			Count                    int       `json:"count"`
			BaseColorFactor          []float64 `json:"base_color_factor"`
			MetallicFactor           float64   `json:"metallic_factor"`
			RoughnessFactor          float64   `json:"roughness_factor"`
			BaseColorTexture         int       `json:"base_color_texture"`
			MetallicRoughnessTexture int       `json:"metallic_roughness_texture"`
		} `json:"primitive,omitempty"`
		Key map[string]struct {
			Primitives []int `json:"primitives"`
		} `json:"key,omitempty"`
	} `json:"mesh,omitempty"`
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
