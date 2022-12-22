package pack

import (
	pages "github.com/bis83/basilico/pkg/pages"
)

type Item struct {
	Text   string       `json:"text"`
	Desc   string       `json:"desc"`
	Icon   int          `json:"icon"`
	Usable *ItemUsable  `json:"usable"`
	Trait  []*ItemTrait `json:"trait"`
}

type ItemUsable struct {
	Hit     int  `json:"hit"`
	Consume bool `json:"consume"`
}

type ItemTrait struct {
	Type  int `json:"t"`
	Value int `json:"v"`
}

func (p *Item) Set(src *pages.Pages, s *pages.Item) error {
	p.Text = s.Text
	p.Desc = s.Desc
	p.Icon = s.Icon
	if s.Usable != nil {
		var u ItemUsable
		u.Hit = src.FindHit(s.Usable.Hit)
		u.Consume = s.Usable.Consume
		p.Usable = &u
	}
	for _, a := range s.Trait {
		var u ItemTrait
		u.Type = 0
		u.Value = a.Value
		p.Trait = append(p.Trait, &u)
	}
	return nil
}
