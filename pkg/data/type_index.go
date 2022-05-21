package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Index struct {
	InitialView int `json:"initial_view"`
}

func (p *Index) Set(prj *project.Project) error {
	if _, i := prj.FindView(prj.Setup.InitialView); i >= 0 {
		p.InitialView = i
	} else {
		return fmt.Errorf("View Not Found: %s", prj.Setup.InitialView)
	}
	return nil
}
