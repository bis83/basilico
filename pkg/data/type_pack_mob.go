package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Mob struct {
	Draw   int        `json:"draw"`
	Radius float32    `json:"r"`
	Weight float32    `json:"w"`
	Action [][]string `json:"action"`
}

func (p *Mob) Set(prj *project.Project, s *project.Mob) error {
	p.Draw = prj.FindDraw(s.Draw)
	p.Radius = s.Radius
	p.Weight = s.Weight
	p.Action = s.Action
	return nil
}
