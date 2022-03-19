package script

import (
	project "github.com/bis83/basilico/pkg/project"
)

func MakeFeature(prj *project.Project) (*Feature, error) {
	var f Feature
	f.Title = prj.Setup.Title
	f.Logging = prj.Setup.Logging
	f.Assert = prj.Setup.Assert
	f.Minify = prj.Setup.Minify

	return &f, nil
}
