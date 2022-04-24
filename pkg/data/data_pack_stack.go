package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

func makeStack(prj *project.Project, s *project.Stack) (*Stack, error) {
	var ss Stack
	ss.ID = s.ID
	if _, i := prj.FindMesh(s.Mesh); i >= 0 {
		ss.Mesh = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: %s", s.Mesh)
	}
	if _, i := prj.FindShader(s.Shader); i >= 0 {
		ss.Shader = i
	} else {
		return nil, fmt.Errorf("Shader Not Found: %s", s.Shader)
	}
	ss.Height = s.Height
	return &ss, nil
}
