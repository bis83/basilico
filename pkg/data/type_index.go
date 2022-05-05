package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Index struct {
	UI []*UI `json:"ui"`
}

func (p *Index) Set(prj *project.Project) error {
	for _, v := range prj.UI {
		var ui UI
		if err := ui.Set(prj, v); err != nil {
			return err
		}
		p.UI = append(p.UI, &ui)
	}
	return nil
}
