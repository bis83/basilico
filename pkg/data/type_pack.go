package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Pack struct {
	Mesh    []*Mesh    `json:"mesh"`
	Texture []*Texture `json:"texture"`
	Shader  []*Shader  `json:"shader"`
	Draw    []*Draw    `json:"draw"`
	Stack   []*Stack   `json:"stack"`
	UI      []*UI      `json:"ui"`
	Event   []*Event   `json:"event"`
	View    []*View    `json:"view"`
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
	for _, v := range prj.Draw {
		var draw Draw
		if err := draw.Set(prj, v); err != nil {
			return err
		}
		p.Draw = append(p.Draw, &draw)
	}
	for _, v := range prj.Stack {
		var stack Stack
		if err := stack.Set(prj, v); err != nil {
			return err
		}
		p.Stack = append(p.Stack, &stack)
	}
	for _, v := range prj.UI {
		var ui UI
		if err := ui.Set(prj, v); err != nil {
			return err
		}
		p.UI = append(p.UI, &ui)
	}
	for _, v := range prj.Event {
		var ev Event
		if err := ev.Set(prj, v); err != nil {
			return err
		}
		p.Event = append(p.Event, &ev)
	}
	for _, v := range prj.View {
		var view View
		if err := view.Set(prj, v); err != nil {
			return err
		}
		p.View = append(p.View, &view)
	}
	return nil
}
