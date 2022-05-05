package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Pack struct {
	Mesh    []*Mesh    `json:"mesh"`
	Texture []*Texture `json:"texture"`
	Shader  []*Shader  `json:"shader"`
	Stack   []*Stack   `json:"stack"`
}

func (p *Pack) Set(prj *project.Project) error {
	for _, v := range prj.Mesh {
		var mesh Mesh
		if err := mesh.Set(v); err != nil {
			return err
		}
		p.Mesh = append(p.Mesh, &mesh)
	}
	for _, v := range prj.Texture {
		var tex Texture
		if err := tex.Set(v); err != nil {
			return err
		}
		p.Texture = append(p.Texture, &tex)
	}
	for _, v := range prj.Shader {
		var shader Shader
		if err := shader.Set(v); err != nil {
			return err
		}
		p.Shader = append(p.Shader, &shader)
	}
	for _, v := range prj.Stack {
		var stack Stack
		if err := stack.Set(prj, v); err != nil {
			return err
		}
		p.Stack = append(p.Stack, &stack)
	}
	return nil
}
