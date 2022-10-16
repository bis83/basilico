package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Base struct {
	Draw int `json:"draw"`
	Item int `json:"item"`
}

func (p *Base) Set(prj *project.Project, s *project.Base) error {
	p.Draw = prj.FindDraw(s.Draw)
	if p.Draw < 0 {
		return fmt.Errorf("Draw Not Found: %s", s.Draw)
	}
	p.Item = prj.FindItem(s.Item)

	return nil
}
