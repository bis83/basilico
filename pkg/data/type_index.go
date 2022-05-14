package data

import (
	"fmt"
	
	project "github.com/bis83/basilico/pkg/project"
)

type Index struct {
	UI      []*UI `json:"ui"`
	UIPause []int `json:"ui_pause"`
	UIMain  []int `json:"ui_main"`
}

func (p *Index) Set(prj *project.Project) error {
	for _, v := range prj.UI {
		var ui UI
		if err := ui.Set(prj, v); err != nil {
			return err
		}
		p.UI = append(p.UI, &ui)
	}
	if prj.Setup.UILayout != nil {
		for _, v := range prj.Setup.UILayout.Pause {
			if _, i := prj.FindUI(v); i >= 0 {
				p.UIPause = append(p.UIPause, i)
			} else {
				return fmt.Errorf("UI Not Found: %s", v)
			}
		}
		for _, v := range prj.Setup.UILayout.Main {
			if _, i := prj.FindUI(v); i >= 0 {
				p.UIMain = append(p.UIMain, i)
			} else {
				return fmt.Errorf("UI Not Found: %s", v)
			}
		}
	}
	return nil
}
