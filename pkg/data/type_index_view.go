package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	Draw3D bool  `json:"draw3d"`
	UI     []int `json:"ui"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Draw3D = view.Draw3D
	for _, v := range view.UI {
		if _, i := prj.FindUI(v); i >= 0 {
			p.UI = append(p.UI, i)
		} else {
			return fmt.Errorf("UI Not Found: %s", v)
		}
	}
	return nil
}
