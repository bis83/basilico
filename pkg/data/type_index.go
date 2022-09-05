package data

import (
	"fmt"

	project "github.com/bis83/basilico/pkg/project"
)

type Entry struct {
	Name   string `json:"n"`
	Pack   int    `json:"p"`
	Index  int    `json:"i"`
	SaveID int    `json:"sid,omitempty"`
}

type Index struct {
	InitialView int      `json:"initial_view"`
	Mesh        []*Entry `json:"mesh"`
	Image       []*Entry `json:"image"`
	Shader      []*Entry `json:"shader"`
	Draw        []*Entry `json:"draw"`
	Item        []*Entry `json:"item"`
	Tile        []*Entry `json:"tile"`
	Com         []*Entry `json:"com"`
	View        []*Entry `json:"view"`
}

func (p *Index) Set(prj *project.Project) error {
	p.InitialView = prj.FindView(prj.Setup.InitialView)
	if p.InitialView < 0 {
		return fmt.Errorf("View Not Found: %s", prj.Setup.InitialView)
	}
	for i, v := range prj.Mesh {
		p.Mesh = append(p.Mesh, &Entry{Name: v.Name, Pack: 0, Index: i})
	}
	for i, v := range prj.Image {
		p.Image = append(p.Image, &Entry{Name: v.Name, Pack: 0, Index: i})
	}
	for i, v := range prj.Shader {
		p.Shader = append(p.Shader, &Entry{Name: v.Name, Pack: 0, Index: i})
	}
	for i, v := range prj.Draw {
		p.Draw = append(p.Draw, &Entry{Name: v.Name, Pack: 0, Index: i})
	}
	for i, v := range prj.Item {
		p.Item = append(p.Item, &Entry{Name: v.Name, Pack: 0, Index: i, SaveID: v.SaveID})
	}
	for i, v := range prj.Tile {
		p.Tile = append(p.Tile, &Entry{Name: v.Name, Pack: 0, Index: i, SaveID: v.SaveID})
	}
	for i, v := range prj.Com {
		p.Com = append(p.Com, &Entry{Name: v.Name, Pack: 0, Index: i})
	}
	for i, v := range prj.View {
		p.View = append(p.View, &Entry{Name: v.Name, Pack: 0, Index: i})
	}
	return nil
}
