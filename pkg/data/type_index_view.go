package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	Name   string `json:"name"`
	Draw3D bool   `json:"draw3d"`
	UI     []int  `json:"ui"`
	Event  []int  `json:"event"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Name = view.Name
	p.Draw3D = view.Draw3D
	for _, v := range view.UI {
		if _, i := prj.FindUI(v); i >= 0 {
			p.UI = append(p.UI, i)
		} else {
			return fmt.Errorf("UI Not Found: %s", v)
		}
	}
	for _, v := range view.Event {
		if _, i := prj.FindEvent(v); i >= 0 {
			p.Event = append(p.Event, i)
		} else {
			return fmt.Errorf("Event Not Found: %s", v)
		}
	}
	return nil
}
