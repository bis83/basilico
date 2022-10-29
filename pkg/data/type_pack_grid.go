package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Grid struct {
	Width  int         `json:"w"`
	Height int         `json:"h"`
	Grid   []*GridBase `json:"b"`
	Tile   []*GridTile `json:"t"`
	Mob    []*GridMob  `json:"m"`
}

type GridBase struct {
	Base   int `json:"no"`
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"w"`
	Height int `json:"h"`
}

type GridTile struct {
	Tile   int `json:"no"`
	X      int `json:"x"`
	Y      int `json:"y"`
	HAngle int `json:"ha"`
}

type GridMob struct {
	Mob    int `json:"no"`
	X      int `json:"x"`
	Y      int `json:"y"`
	HAngle int `json:"ha"`
	VAngle int `json:"va"`
}

func (p *Grid) Set(prj *project.Project, c *project.Grid) error {
	p.Width = c.Width
	p.Height = c.Height
	for _, a := range c.Grid {
		var m GridBase
		m.Base = prj.FindBase(a.Base)
		m.X = a.X
		m.Y = a.Y
		m.Width = a.Width
		m.Height = a.Height
		p.Grid = append(p.Grid, &m)
	}
	for _, a := range c.Tile {
		var m GridTile
		m.Tile = prj.FindTile(a.Tile)
		m.X = a.X
		m.Y = a.Y
		m.HAngle = a.HAngle
		p.Tile = append(p.Tile, &m)
	}
	for _, a := range c.Mob {
		var m GridMob
		m.Mob = prj.FindMob(a.Mob)
		m.X = a.X
		m.Y = a.Y
		m.HAngle = a.HAngle
		m.VAngle = a.VAngle
		p.Mob = append(p.Mob, &m)
	}
	return nil
}