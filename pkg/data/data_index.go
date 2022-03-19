package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

func makeIndex(prj *project.Project) (*Index, error) {
	var idx Index

	// CoreStart
	if _, i := prj.FindScene(prj.Setup.Start.Scene); i >= 0 {
		idx.Start.Scene = i
	} else {
		return nil, fmt.Errorf("Scene Not Found: %s", prj.Setup.Start.Scene)
	}
	idx.Start.Position = prj.Setup.Start.Position
	idx.Start.Angle = prj.Setup.Start.Angle

	// CoreData
	if _, i := prj.FindMesh("reticle"); i >= 0 {
		idx.Data.Reticle = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: reticle")
	}
	if _, i := prj.FindShader("mesh_pc"); i >= 0 {
		idx.Data.MeshPC = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: mesh_pc")
	}
	if _, i := prj.FindShader("mesh_pnc"); i >= 0 {
		idx.Data.MeshPNC = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: mesh_pnc")
	}

	// CoreScene
	for _, v := range prj.Scene {
		var s IndexScene
		s.Name = v.Name
		idx.Scene = append(idx.Scene, &s)
	}

	return &idx, nil
}
