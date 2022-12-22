package pack

import (
	pages "github.com/bis83/basilico/pkg/pages"
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

func (p *Mob) Set(src *pages.Pages, s *pages.Mob) error {
	p.Draw = src.FindDraw(s.Draw)
	p.Radius = s.Radius
	if s.Mass != nil {
		p.Mass = *s.Mass
	} else {
		p.Mass = 1.0
	}
	p.Hp = s.Hp
	for _, a := range s.Item {
		var u MobItem
		u.Item = src.FindItem(a.Item)
		u.Count = a.Count
		p.Item = append(p.Item, &u)
	}
	p.Action = s.Action
	return nil
}
