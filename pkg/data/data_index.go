package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

func makeIndex(prj *project.Project) (*Index, error) {
	var idx Index

	// CoreData
	if _, i := prj.FindMesh("reticle"); i >= 0 {
		idx.Data.Reticle = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: reticle")
	}
	if _, i := prj.FindMesh("box"); i >= 0 {
		idx.Data.Box = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: box")
	}
	if _, i := prj.FindMesh("stack"); i >= 0 {
		idx.Data.Stack = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: stack")
	}
	if _, i := prj.FindMesh("debug_grid"); i >= 0 {
		idx.Data.DebugGrid = i
	} else {
		return nil, fmt.Errorf("Mesh Not Found: debug_grid")
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

	return &idx, nil
}
