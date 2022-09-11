package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Tile struct {
	Text string `json:"text"`
	Desc string `json:"desc"`

	Draw   int `json:"draw"`
	Height int `json:"height"`

	Mine *TileMine `json:"mine,omitempty"`
}

type TileMine struct {
	Item  int `json:"item"`
	Count int `json:"count"`
}

func (p *Tile) Set(prj *project.Project, s *project.Tile) error {
	p.Text = s.Text
	p.Desc = s.Desc
	p.Draw = prj.FindDraw(s.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Height = s.Height

	if s.Mine != nil {
		var m TileMine
		m.Item = prj.FindItem(s.Mine.Item)
		m.Count = s.Mine.Count
		p.Mine = &m
	}

	return nil
}
