package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Item struct {
	Text string `json:"text"`
	Desc string `json:"desc"`
	Icon int    `json:"icon"`

	Hand *ItemHand `json:"hand,omitempty"`
}

type ItemHand struct {
	Hit int `json:"hit"`
}

func toHitNo(s string) int {
	switch s {
	case "activate":
		return 1
	case "mining":
		return 2
	default:
		return 0
	}
}

func (p *Item) Set(prj *project.Project, s *project.Item) error {
	p.Text = s.Text
	p.Desc = s.Desc
	p.Icon = s.Icon

	if s.Hand != nil {
		var h ItemHand
		h.Hit = toHitNo(s.Hand.Hit)
		p.Hand = &h
	}

	return nil
}
