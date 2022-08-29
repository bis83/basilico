package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Pack struct {
	Mesh      []*Mesh      `json:"mesh"`
	Texture   []*Texture   `json:"texture"`
	Shader    []*Shader    `json:"shader"`
	Draw      []*Draw      `json:"draw"`
	Item      []*Item      `json:"item"`
	Tile      []*Tile      `json:"tile"`
	Component []*Component `json:"component"`
	View      []*View      `json:"view"`
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
	for _, v := range prj.Item {
		var item Item
		if err := item.Set(prj, v); err != nil {
			return err
		}
		p.Item = append(p.Item, &item)
	}
	for _, v := range prj.Tile {
		var tile Tile
		if err := tile.Set(prj, v); err != nil {
			return err
		}
		p.Tile = append(p.Tile, &tile)
	}
	for _, v := range prj.Component {
		var c Component
		if err := c.Set(prj, v); err != nil {
			return err
		}
		p.Component = append(p.Component, &c)
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
