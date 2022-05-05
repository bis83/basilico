package data

import (
	"fmt"
	project "github.com/bis83/basilico/pkg/project"
)

type UI struct {
	Mesh     int `json:"mesh"`
	Shader   int `json:"shader"`
	Width    int `json:"width"`
	Height   int `json:"height"`
	Interact int `json:"interact"`
}

func toInteractNo(s string) int {
	switch s {
	case "button":
		return 1
	default:
		return 0
	}
}

func (p *UI) Set(prj *project.Project, ui *project.UI) error {
	if _, i := prj.FindMesh(ui.Mesh); i >= 0 {
		p.Mesh = i
	} else {
		return fmt.Errorf("Mesh Not Found: %s", ui.Mesh)
	}
	if _, i := prj.FindShader(ui.Shader); i >= 0 {
		p.Shader = i
	} else {
		return fmt.Errorf("Shader Not Found: %s", ui.Shader)
	}
	p.Width = ui.Width
	p.Height = ui.Height
	p.Interact = toInteractNo(ui.Interact)
	return nil
}
