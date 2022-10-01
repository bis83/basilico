package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	Draw3D bool  `json:"draw3d"`
	Draw   []int `json:"draw"`
	Com    []int `json:"com"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Draw3D = view.Draw3D
	for _, v := range view.Draw {
		i := prj.FindDraw(v)
		if i <= 0 {
			return fmt.Errorf("Draw Not Found: %s", v)
		}
		p.Draw = append(p.Draw, i)
	}
	for _, v := range view.Com {
		i := prj.FindCom(v)
		if i <= 0 {
			return fmt.Errorf("Com Not Found: %s", v)
		}
		p.Com = append(p.Com, i)
	}
	return nil
}
