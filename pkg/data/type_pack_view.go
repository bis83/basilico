package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type View struct {
	Com []int `json:"com"`

	Draw3D    bool  `json:"draw3d"`
	CameraMob int   `json:"cam"`
	Draw      []int `json:"draw"`
}

func (p *View) Set(prj *project.Project, view *project.View) error {
	p.Draw3D = view.Draw3D
	p.CameraMob = prj.FindMob(view.CameraMob)
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
