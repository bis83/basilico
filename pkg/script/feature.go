package script

import (
	project "github.com/bis83/basilico/pkg/project"
)

func MakeFeature(prj *project.Project) (*Feature, error) {
	var f Feature
	f.Title = prj.Cfg.Title
	f.Logging = prj.Cfg.Logging
	f.Assert = prj.Cfg.Assert
	f.Minify = prj.Cfg.Minify

	return &f, nil
}
