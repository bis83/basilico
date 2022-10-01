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
	for _, v := range prj.Mesh {
		if v != nil {
			p.Mesh = append(p.Mesh, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Mesh = append(p.Mesh, nil)
		}
	}
	for _, v := range prj.Image {
		if v != nil {
			p.Image = append(p.Image, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Image = append(p.Image, nil)
		}
	}
	for _, v := range prj.Shader {
		if v != nil {
			p.Shader = append(p.Shader, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Shader = append(p.Shader, nil)
		}
	}
	for _, v := range prj.Draw {
		if v != nil {
			p.Draw = append(p.Draw, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Draw = append(p.Draw, nil)
		}
	}
	for _, v := range prj.Item {
		if v != nil {
			p.Item = append(p.Item, &Entry{Name: v.Name, Pack: 0, Index: 0, SaveID: v.SaveID})
		} else {
			p.Item = append(p.Item, nil)
		}
	}
	for _, v := range prj.Tile {
		if v != nil {
			p.Tile = append(p.Tile, &Entry{Name: v.Name, Pack: 0, Index: 0, SaveID: v.SaveID})
		} else {
			p.Tile = append(p.Tile, nil)
		}
	}
	for _, v := range prj.Com {
		if v != nil {
			p.Com = append(p.Com, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Com = append(p.Com, nil)
		}
	}
	for _, v := range prj.View {
		if v != nil {
			p.View = append(p.View, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.View = append(p.View, nil)
		}
	}
	return nil
}
