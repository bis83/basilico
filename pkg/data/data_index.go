package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

func makeUI(prj *project.Project, ui *project.UI) (*UI, error) {
	var u UI
	if _, i := prj.FindMesh(ui.Mesh); i >= 0 {
		u.Mesh = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: %s", ui.Mesh)
	}
	if _, i := prj.FindShader(ui.Shader); i >= 0 {
		u.Shader = i
	} else {
		return nil, fmt.Errorf("Shader Not Found: %s", ui.Shader)
	}
	u.Width = ui.Width
	u.Height = ui.Height
	return &u, nil
}

func makeIndex(prj *project.Project) (*Index, error) {
	var idx Index
	for _, v := range prj.UI {
		ui, err := makeUI(prj, v)
		if err != nil {
			return nil, err
		}
		idx.UI = append(idx.UI, ui)
	}
	return &idx, nil
}
