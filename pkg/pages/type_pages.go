package project

import (
	"github.com/qmuntal/gltf"
	"path/filepath"
)

type Pages struct {
	Mesh   []*Mesh
	Image  []*Image
	Shader []*Shader
	Draw   []*Draw
	Item   []*Item
	Base   []*Base
	Tile   []*Tile
	Mob    []*Mob
	Hit    []*Hit
	Grid   []*Grid
	Com    []*Com
	View   []*View

	BaseDir     string
	InitialView string
	GLTF        []*gltf.Document
}

func (p *Pages) Read(baseDir string) error {
	var err error
	var pages []*Page
	pages, err = listPages(baseDir)
	if err != nil {
		return err
	}
	if err := p.Set(pages, baseDir); err != nil {
		return err
	}
	return nil
}

func (p *Pages) Set(pages []*Page, baseDir string) error {
	p.BaseDir = baseDir
	p.Mesh = append(p.Mesh, nil)
	p.Image = append(p.Image, nil)
	p.Shader = append(p.Shader, nil)
	p.Draw = append(p.Draw, nil)
	p.Item = append(p.Item, nil)
	p.Base = append(p.Base, nil)
	p.Tile = append(p.Tile, nil)
	p.Mob = append(p.Mob, nil)
	p.Hit = append(p.Hit, nil)
	p.Grid = append(p.Grid, nil)
	p.Com = append(p.Com, nil)
	p.View = append(p.View, nil)
	for _, page := range pages {
		if page.Index != nil {
			p.InitialView = page.Index.InitialView
			for _, path := range page.Index.GLTF {
				doc, err := gltf.Open(filepath.Join(baseDir, path))
				if err != nil {
					return err
				}
				p.GLTF = append(p.GLTF, doc)
			}
		}
		for _, mesh := range page.Mesh {
			p.Mesh = append(p.Mesh, mesh)
		}
		for _, image := range page.Image {
			p.Image = append(p.Image, image)
		}
		for _, shader := range page.Shader {
			p.Shader = append(p.Shader, shader)
		}
		for _, draw := range page.Draw {
			p.Draw = append(p.Draw, draw)
		}
		for _, item := range page.Item {
			p.Item = append(p.Item, item)
		}
		for _, base := range page.Base {
			p.Base = append(p.Base, base)
		}
		for _, tile := range page.Tile {
			p.Tile = append(p.Tile, tile)
		}
		for _, mob := range page.Mob {
			p.Mob = append(p.Mob, mob)
		}
		for _, hit := range page.Hit {
			p.Hit = append(p.Hit, hit)
		}
		for _, grid := range page.Grid {
			p.Grid = append(p.Grid, grid)
		}
		for _, com := range page.Com {
			p.Com = append(p.Com, com)
		}
		for _, view := range page.View {
			p.View = append(p.View, view)
		}
	}
	return nil
}

func (p *Pages) FindMesh(name string) int {
	for i, v := range p.Mesh {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindImage(name string) int {
	for i, v := range p.Image {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindShader(name string) int {
	for i, v := range p.Shader {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindDraw(name string) int {
	for i, v := range p.Draw {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindItem(name string) int {
	for i, v := range p.Item {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindBase(name string) int {
	for i, v := range p.Base {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindTile(name string) int {
	for i, v := range p.Tile {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindMob(name string) int {
	for i, v := range p.Mob {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindHit(name string) int {
	for i, v := range p.Hit {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindGrid(name string) int {
	for i, v := range p.Grid {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindCom(name string) int {
	for i, v := range p.Com {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}

func (p *Pages) FindView(name string) int {
	for i, v := range p.View {
		if v == nil {
			continue
		}
		if v.Name == name {
			return i
		}
	}
	return 0
}
