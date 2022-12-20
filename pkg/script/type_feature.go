package script

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Feature struct {
	Title  string
	Minify bool
}

func (p *Feature) Set(prj *project.Project) {
	p.Title = prj.Setup.Title
	p.Minify = prj.Setup.Minify
}
