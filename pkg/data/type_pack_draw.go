package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Draw struct {
	Mesh   int  `json:"mesh"`
	Shader int  `json:"shader"`
	Image  int  `json:"image"`
	Depth  bool `json:"depth"`
	Alpha  bool `json:"alpha"`
	Cw     bool `json:"cw"`
	Ortho  bool `json:"ortho"`
}

func (p *Draw) Set(prj *project.Project, s *project.Draw) error {
	p.Mesh = prj.FindMesh(s.Mesh)
	if p.Mesh <= 0 {
		return fmt.Errorf("Mesh Not Found: %s", s.Mesh)
	}
	p.Shader = prj.FindShader(s.Shader)
	if p.Shader <= 0 {
		return fmt.Errorf("Shader Not Found: %s", s.Shader)
	}
	p.Image = prj.FindImage(s.Image)
	p.Depth = s.Depth
	p.Alpha = s.Alpha
	p.Cw = s.Cw
	p.Ortho = s.Ortho
	return nil
}
