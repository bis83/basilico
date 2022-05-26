package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Stack struct {
	ID     int `json:"id"`
	Draw   int `json:"draw"`
	Height int `json:"height"`
}

func (p *Stack) Set(prj *project.Project, s *project.Stack) error {
	p.ID = s.ID
	if _, i := prj.FindDraw(s.Draw); i >= 0 {
		p.Draw = i
	} else {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Height = s.Height
	return nil
}
