package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Tile struct {
	Draw   int `json:"draw"`
	Height int `json:"height"`
	SaveID int `json:"sid"`
}

func (p *Tile) Set(prj *project.Project, s *project.Tile) error {
	p.Draw = prj.FindDraw(s.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Height = s.Height
	p.SaveID = s.SaveID
	return nil
}
