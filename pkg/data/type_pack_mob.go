package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Mob struct {
	Draw   int        `json:"draw"`
	Radius float32    `json:"r"`
	Mass   float32    `json:"m"`
	Hp     int        `json:"hp"`
	Item   []*MobItem `json:"item"`
	Action [][]string `json:"action"`
}

type MobItem struct {
	Item  int `json:"no"`
	Count int `json:"n"`
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
	for _, a := range s.Item {
		var u MobItem
		u.Item = prj.FindItem(a.Item)
		u.Count = a.Count
		p.Item = append(p.Item, &u)
	}
	p.Action = s.Action
	return nil
}
