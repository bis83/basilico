package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Pack struct {
	Mesh   []*Mesh   `json:"mesh"`
	Image  []*Image  `json:"image"`
	Shader []*Shader `json:"shader"`
	Draw   []*Draw   `json:"draw"`
	Item   []*Item   `json:"item"`
	Base   []*Base   `json:"base"`
	Tile   []*Tile   `json:"tile"`
	Mob    []*Mob    `json:"mob"`
	Grid   []*Grid   `json:"grid"`
	Com    []*Com    `json:"com"`
	View   []*View   `json:"view"`
}

func (p *Pack) Set(prj *project.Project, index *Index, pack int) error {
	for i, v := range prj.Mesh {
		if v == nil {
			continue
		}
		if index.Mesh[i].Pack != pack {
			continue
		}
		index.Mesh[i].Index = len(p.Mesh)

		var mesh Mesh
		if err := mesh.Set(v); err != nil {
			return err
		}
		p.Mesh = append(p.Mesh, &mesh)
	}
	for i, v := range prj.Image {
		if v == nil {
			continue
		}
		if index.Image[i].Pack != pack {
			continue
		}
		index.Image[i].Index = len(p.Image)

		var img Image
		if err := img.Set(v); err != nil {
			return err
		}
		p.Image = append(p.Image, &img)
	}
	for i, v := range prj.Shader {
		if v == nil {
			continue
		}
		if index.Shader[i].Pack != pack {
			continue
		}
		index.Shader[i].Index = len(p.Shader)

		var shader Shader
		if err := shader.Set(v); err != nil {
			return err
		}
		p.Shader = append(p.Shader, &shader)
	}
	for i, v := range prj.Draw {
		if v == nil {
			continue
		}
		if index.Draw[i].Pack != pack {
			continue
		}
		index.Draw[i].Index = len(p.Draw)

		var draw Draw
		if err := draw.Set(prj, v); err != nil {
			return err
		}
		p.Draw = append(p.Draw, &draw)
	}
	for i, v := range prj.Item {
		if v == nil {
			continue
		}
		if index.Item[i].Pack != pack {
			continue
		}
		index.Item[i].Index = len(p.Item)

		var item Item
		if err := item.Set(prj, v); err != nil {
			return err
		}
		p.Item = append(p.Item, &item)
	}
	for i, v := range prj.Base {
		if v == nil {
			continue
		}
		if index.Base[i].Pack != pack {
			continue
		}
		index.Base[i].Index = len(p.Base)

		var base Base
		if err := base.Set(prj, v); err != nil {
			return err
		}
		p.Base = append(p.Base, &base)
	}
	for i, v := range prj.Tile {
		if v == nil {
			continue
		}
		if index.Tile[i].Pack != pack {
			continue
		}
		index.Tile[i].Index = len(p.Tile)

		var tile Tile
		if err := tile.Set(prj, v); err != nil {
			return err
		}
		p.Tile = append(p.Tile, &tile)
	}
	for i, v := range prj.Mob {
		if v == nil {
			continue
		}
		if index.Mob[i].Pack != pack {
			continue
		}
		index.Mob[i].Index = len(p.Mob)

		var c Mob
		if err := c.Set(prj, v); err != nil {
			return err
		}
		p.Mob = append(p.Mob, &c)
	}
	for i, v := range prj.Grid {
		if v == nil {
			continue
		}
		if index.Grid[i].Pack != pack {
			continue
		}
		index.Grid[i].Index = len(p.Grid)

		var c Grid
		if err := c.Set(prj, v); err != nil {
			return err
		}
		p.Grid = append(p.Grid, &c)
	}
	for i, v := range prj.Com {
		if v == nil {
			continue
		}
		if index.Com[i].Pack != pack {
			continue
		}
		index.Com[i].Index = len(p.Com)

		var c Com
		if err := c.Set(prj, v); err != nil {
			return err
		}
		p.Com = append(p.Com, &c)
	}
	for i, v := range prj.View {
		if v == nil {
			continue
		}
		if index.View[i].Pack != pack {
			continue
		}
		index.View[i].Index = len(p.View)

		var view View
		if err := view.Set(prj, v); err != nil {
			return err
		}
		p.View = append(p.View, &view)
	}
	return nil
}
