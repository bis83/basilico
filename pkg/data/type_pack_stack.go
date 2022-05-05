package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Stack struct {
	ID     int `json:"id"`
	Mesh   int `json:"mesh"`
	Shader int `json:"shader"`
	Height int `json:"height"`
}

func (p *Stack) Set(prj *project.Project, s *project.Stack) error {
	p.ID = s.ID
	if _, i := prj.FindMesh(s.Mesh); i >= 0 {
		p.Mesh = i
	} else {
		return fmt.Errorf("Mesh Not Found: %s", s.Mesh)
	}
	if _, i := prj.FindShader(s.Shader); i >= 0 {
		p.Shader = i
	} else {
		return fmt.Errorf("Shader Not Found: %s", s.Shader)
	}
	p.Height = s.Height
	return nil
}
