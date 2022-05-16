package script

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Feature struct {
	Title   string
	Logging bool
	Minify  bool
	Assert  bool
}

func (p *Feature) Set(prj *project.Project) {
	p.Title = prj.Setup.Title
	p.Logging = prj.Setup.Logging
	p.Assert = prj.Setup.Assert
	p.Minify = prj.Setup.Minify
}
