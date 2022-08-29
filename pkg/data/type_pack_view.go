package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	SkyBox    int   `json:"skybox"`
	Draw3D    bool  `json:"draw3d"`
	Component []int `json:"component"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Draw3D = view.Draw3D
	p.SkyBox = prj.FindDraw(view.SkyBox)
	for _, v := range view.Component {
		i := prj.FindComponent(v)
		if i < 0 {
			return fmt.Errorf("Component Not Found: %s", v)
		}
		p.Component = append(p.Component, i)
	}
	return nil
}
