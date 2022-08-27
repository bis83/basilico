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
}

func (p *Tile) Set(prj *project.Project, s *project.Tile) error {
	p.Text = s.Text
	p.Desc = s.Desc
	p.Draw = prj.FindDraw(s.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Height = s.Height

	return nil
}
