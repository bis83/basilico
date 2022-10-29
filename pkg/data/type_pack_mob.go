package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Mob struct {
	Draw   int        `json:"draw"`
	Action [][]string `json:"action"`
}

func (p *Mob) Set(prj *project.Project, s *project.Mob) error {
	p.Draw = prj.FindDraw(s.Draw)
	p.Action = s.Action

	return nil
}