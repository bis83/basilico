package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

func makeCore(prj *project.Project) (*Core, error) {
	var c Core

	// CoreStart
	if _, i := prj.FindScene(prj.Cfg.Start.Scene); i >= 0 {
		c.Start.Scene = i
	} else {
		return nil, fmt.Errorf("Scene Not Found: %s", c.Start.Scene)
	}
	c.Start.Position = prj.Cfg.Start.Position
	c.Start.Angle = prj.Cfg.Start.Angle

	// CoreData
	if _, i := prj.FindMesh("reticle"); i >= 0 {
		c.Data.Reticle = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: reticle")
	}
	if _, i := prj.FindShader("mesh_pc"); i >= 0 {
		c.Data.MeshPC = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: mesh_pc")
	}
	if _, i := prj.FindShader("mesh_pnc"); i >= 0 {
		c.Data.MeshPNC = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: mesh_pnc")
	}

	// CoreScene
	for _, v := range prj.Scene {
		var s CoreScene
		s.Name = v.Name
		c.Scene = append(c.Scene, &s)
	}

	return &c, nil
}
