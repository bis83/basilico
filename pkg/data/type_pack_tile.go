package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Tile struct {
	ID     int `json:"id"`
	Draw   int `json:"draw"`
	Height int `json:"height"`
}

func (p *Tile) Set(prj *project.Project, s *project.Tile) error {
	p.ID = s.ID
	p.Draw = prj.FindDraw(s.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Height = s.Height
	return nil
}
