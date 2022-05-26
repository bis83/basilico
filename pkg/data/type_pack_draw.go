package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Draw struct {
	Mesh   int    `json:"mesh"`
	Shader int    `json:"shader"`
	Camera string `json:"camera"`
	Ortho  string `json:"ortho"`
	Depth  bool   `json:"depth"`
	Alpha  bool   `json:"alpha"`
}

func (p *Draw) Set(prj *project.Project, s *project.Draw) error {
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
	p.Camera = s.Camera
	p.Ortho = s.Ortho
	p.Depth = s.Depth
	p.Alpha = s.Alpha
	return nil
}
