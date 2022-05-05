package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Shader struct {
	VertexShader   string   `json:"vs"`
	FragmentShader string   `json:"fs"`
	Uniform        []string `json:"u"`
	UniformBlock   []string `json:"ub"`
}

func (p *Shader) Set(s *project.Shader) error {
	p.VertexShader = s.VertexShader
	p.FragmentShader = s.FragmentShader
	p.Uniform = s.Uniform
	p.UniformBlock = s.UniformBlock
	return nil
}
