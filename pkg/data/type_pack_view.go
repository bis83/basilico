package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	SkyBox int   `json:"skybox"`
	Draw3D bool  `json:"draw3d"`
	Com    []int `json:"com"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Draw3D = view.Draw3D
	p.SkyBox = prj.FindDraw(view.SkyBox)
	for _, v := range view.Com {
		i := prj.FindCom(v)
		if i < 0 {
			return fmt.Errorf("Com Not Found: %s", v)
		}
		p.Com = append(p.Com, i)
	}
	return nil
}
