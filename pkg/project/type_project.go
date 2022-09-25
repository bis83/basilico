package project

import (
	"os"
	"path/filepath"
)

type Project struct {
	Setup  *Setup
	Mesh   []*Mesh
	Image  []*Image
	Shader []*Shader
	Draw   []*Draw
	Item   []*Item
	Tile   []*Tile
	Com    []*Com
	View   []*View

	Script []string
}

func (p *Project) Set(setup *Setup, pages []*Page, baseDir string) error {
	p.Setup = setup
	for _, page := range pages {
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
		for _, tile := range page.Tile {
			p.Tile = append(p.Tile, tile)
		}
		for _, com := range page.Com {
			p.Com = append(p.Com, com)
		}
		for _, view := range page.View {
			p.View = append(p.View, view)
		}
	}
	for _, path := range p.Setup.Script {
		data, err := os.ReadFile(filepath.Join(baseDir, path))
		if err != nil {
			return err
		}
		p.Script = append(p.Script, string(data))
	}
	return nil
}

func (p *Project) FindMesh(name string) int {
	for i, v := range p.Mesh {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindImage(name string) int {
	for i, v := range p.Image {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindShader(name string) int {
	for i, v := range p.Shader {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindDraw(name string) int {
	for i, v := range p.Draw {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindItem(name string) int {
	for i, v := range p.Item {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindTile(name string) int {
	for i, v := range p.Tile {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindCom(name string) int {
	for i, v := range p.Com {
		if v.Name == name {
			return i
		}
	}
	return -1
}

func (p *Project) FindView(name string) int {
	for i, v := range p.View {
		if v.Name == name {
			return i
		}
	}
	return -1
}
