package pack

import (
	pages "github.com/bis83/basilico/pkg/oldpack/pages"
)

type Shader struct {
	VertexShader   int      `json:"vs"`
	FragmentShader int      `json:"fs"`
	Uniform        []string `json:"u"`
	UniformBlock   []string `json:"ub"`
}

func (p *Shader) Set(pack *Pack, s *pages.Shader) error {
	p.VertexShader = pack.AppendContent(s.VertexShader)
	p.FragmentShader = pack.AppendContent(s.FragmentShader)
	p.Uniform = s.Uniform
	p.UniformBlock = s.UniformBlock
	return nil
}
