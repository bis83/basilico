package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	Name   string `json:"name"`
	SkyBox int    `json:"skybox"`
	Draw3D bool   `json:"draw3d"`
	UI     []int  `json:"ui"`
	Event  []int  `json:"event"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Name = view.Name
	p.Draw3D = view.Draw3D
	p.SkyBox = prj.FindDraw(view.SkyBox)
	for _, v := range view.UI {
		i := prj.FindUI(v)
		if i < 0 {
			return fmt.Errorf("UI Not Found: %s", v)
		}
		p.UI = append(p.UI, i)
	}
	for _, v := range view.Event {
		i := prj.FindEvent(v)
		if i < 0 {
			return fmt.Errorf("Event Not Found: %s", v)
		}
		p.Event = append(p.Event, i)
	}
	return nil
}
