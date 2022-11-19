package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Mob struct {
	Draw   int        `json:"draw"`
	Radius float32    `json:"r"`
	Mass   float32    `json:"m"`
	Hp     int        `json:"hp"`
	Action [][]string `json:"action"`
}

func (p *Mob) Set(prj *project.Project, s *project.Mob) error {
	p.Draw = prj.FindDraw(s.Draw)
	p.Radius = s.Radius
	if s.Mass != nil {
		p.Mass = *s.Mass
	} else {
		p.Mass = 1.0
	}
	p.Hp = s.Hp
	p.Action = s.Action
	return nil
}
