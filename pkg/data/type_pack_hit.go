package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Hit struct {
	Draw   int        `json:"draw"`
	Action [][]string `json:"action"`
}

func (p *Hit) Set(prj *project.Project, s *project.Hit) error {
	p.Draw = prj.FindDraw(s.Draw)
	p.Action = s.Action
	return nil
}
