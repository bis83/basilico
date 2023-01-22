package pack

import (
	"fmt"

	pages "github.com/bis83/basilico/pkg/oldpack/pages"
)

type View struct {
	Com  []int     `json:"com"`
	Grid *ViewGrid `json:"grid"`
}

type ViewGrid struct {
	CameraMob int   `json:"cam"`
	Draw      []int `json:"draw"`
}

func (p *View) Set(src *pages.Pages, view *pages.View) error {
	for _, v := range view.Com {
		i := src.FindCom(v)
		if i <= 0 {
			return fmt.Errorf("Com Not Found: %s", v)
		}
		p.Com = append(p.Com, i)
	}
	if view.Grid != nil {
		var g ViewGrid
		g.CameraMob = src.FindMob(view.Grid.CameraMob)
		for _, v := range view.Grid.Draw {
			i := src.FindDraw(v)
			if i <= 0 {
				return fmt.Errorf("Draw Not Found: %s", v)
			}
			g.Draw = append(g.Draw, i)
		}
		p.Grid = &g
	}
	return nil
}
