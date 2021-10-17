package build

import (
	project "github.com/bis83/basilico/pkg/project"
)

func buildShader(s *project.Shader) (*Shader, error) {
	var ss Shader
	ss.Name = s.Name
	ss.VertexShader = s.VertexShader
	ss.FragmentShader = s.FragmentShader
	ss.Uniform = s.Uniform
	ss.UniformBlock = s.UniformBlock
	return &ss, nil
}
