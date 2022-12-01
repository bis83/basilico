package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Shader struct {
	VertexShader   int      `json:"vs"`
	FragmentShader int      `json:"fs"`
	Uniform        []string `json:"u"`
	UniformBlock   []string `json:"ub"`
}

func (p *Shader) Set(pack *Pack, s *project.Shader) error {
	p.VertexShader = pack.AppendContent(s.VertexShader)
	p.FragmentShader = pack.AppendContent(s.FragmentShader)
	p.Uniform = s.Uniform
	p.UniformBlock = s.UniformBlock
	return nil
}
