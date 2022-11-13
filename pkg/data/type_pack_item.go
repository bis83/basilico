package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Item struct {
	Text string `json:"text"`
	Desc string `json:"desc"`
	Icon int    `json:"icon"`

	Hit     int  `json:"hit"`
	Consume bool `json:"consume"`
}

func (p *Item) Set(prj *project.Project, s *project.Item) error {
	p.Text = s.Text
	p.Desc = s.Desc
	p.Icon = s.Icon
	p.Hit = prj.FindHit(s.Hit)
	p.Consume = s.Consume
	return nil
}
