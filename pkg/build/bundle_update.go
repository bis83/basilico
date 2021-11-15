package build

import (
	project "github.com/bis83/basilico/pkg/project"
)

func buildUpdate(prj *project.Project) ([]*Update, error) {
	var data []*Update
	for _, s := range prj.Scene {
		var u Update
		u.Name = s.Name
		data = append(data, &u)
	}
	return data, nil
}
