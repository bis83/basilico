package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

func makeShader(s *project.Shader) (*Shader, error) {
	var ss Shader
	ss.VertexShader = s.VertexShader
	ss.FragmentShader = s.FragmentShader
	ss.Uniform = s.Uniform
	ss.UniformBlock = s.UniformBlock
	return &ss, nil
}
