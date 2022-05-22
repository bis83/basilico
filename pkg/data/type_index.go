package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type SkyBox struct {
	Mesh   int `json:"mesh"`
	Shader int `json:"shader"`
}

type Index struct {
	InitialView int     `json:"initial_view"`
	SkyBox      *SkyBox `json:"skybox"`
}

func (p *Index) Set(prj *project.Project) error {
	if _, i := prj.FindView(prj.Setup.InitialView); i >= 0 {
		p.InitialView = i
	} else {
		return fmt.Errorf("View Not Found: %s", prj.Setup.InitialView)
	}
	if prj.Setup.SkyBox != nil {
		var skybox SkyBox
		if _, i := prj.FindMesh(prj.Setup.SkyBox.Mesh); i >= 0 {
			skybox.Mesh = i
		} else {
			return fmt.Errorf("Mesh Not Found: %s", prj.Setup.SkyBox.Mesh)
		}
		if _, i := prj.FindShader(prj.Setup.SkyBox.Shader); i >= 0 {
			skybox.Shader = i
		} else {
			return fmt.Errorf("Shader Not Found: %s", prj.Setup.SkyBox.Shader)
		}
		p.SkyBox = &skybox
	}
	return nil
}
