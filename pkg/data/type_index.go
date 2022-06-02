package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Index struct {
	InitialView int `json:"initial_view"`
}

func (p *Index) Set(prj *project.Project) error {
	p.InitialView = prj.FindView(prj.Setup.InitialView)
	if p.InitialView < 0 {
		return fmt.Errorf("View Not Found: %s", prj.Setup.InitialView)
	}
	return nil
}
