package pack

import (
	"fmt"

	pages "github.com/bis83/basilico/pkg/oldpack/pages"
)

type Entry struct {
	Name   string `json:"n"`
	Pack   int    `json:"p"`
	Index  int    `json:"i"`
	SaveID int    `json:"sid,omitempty"`
}

type Index struct {
	InitialView int      `json:"init"`
	Pack        []int    `json:"pack"`
	Mesh        []*Entry `json:"mesh"`
	Image       []*Entry `json:"image"`
	Shader      []*Entry `json:"shader"`
	Draw        []*Entry `json:"draw"`
	Item        []*Entry `json:"item"`
	Base        []*Entry `json:"base"`
	Tile        []*Entry `json:"tile"`
	Mob         []*Entry `json:"mob"`
	Hit         []*Entry `json:"hit"`
	Grid        []*Entry `json:"grid"`
	Com         []*Entry `json:"com"`
	View        []*Entry `json:"view"`
}

func (p *Index) Set(src *pages.Pages) error {
	p.InitialView = src.FindView(src.InitialView)
	if p.InitialView < 0 {
		return fmt.Errorf("View Not Found: %s", src.InitialView)
	}
	p.Pack = []int{0}
	for _, v := range src.Mesh {
		if v != nil {
			p.Mesh = append(p.Mesh, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Mesh = append(p.Mesh, nil)
		}
	}
	for _, v := range src.Image {
		if v != nil {
			p.Image = append(p.Image, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Image = append(p.Image, nil)
		}
	}
	for _, v := range src.Shader {
		if v != nil {
			p.Shader = append(p.Shader, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Shader = append(p.Shader, nil)
		}
	}
	for _, v := range src.Draw {
		if v != nil {
			p.Draw = append(p.Draw, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Draw = append(p.Draw, nil)
		}
	}
	for _, v := range src.Item {
		if v != nil {
			p.Item = append(p.Item, &Entry{Name: v.Name, Pack: 0, Index: 0, SaveID: v.SaveID})
		} else {
			p.Item = append(p.Item, nil)
		}
	}
	for _, v := range src.Base {
		if v != nil {
			p.Base = append(p.Base, &Entry{Name: v.Name, Pack: 0, Index: 0, SaveID: v.SaveID})
		} else {
			p.Base = append(p.Base, nil)
		}
	}
	for _, v := range src.Tile {
		if v != nil {
			p.Tile = append(p.Tile, &Entry{Name: v.Name, Pack: 0, Index: 0, SaveID: v.SaveID})
		} else {
			p.Tile = append(p.Tile, nil)
		}
	}
	for _, v := range src.Mob {
		if v != nil {
			p.Mob = append(p.Mob, &Entry{Name: v.Name, Pack: 0, Index: 0, SaveID: v.SaveID})
		} else {
			p.Mob = append(p.Mob, nil)
		}
	}
	for _, v := range src.Hit {
		if v != nil {
			p.Hit = append(p.Hit, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Hit = append(p.Hit, nil)
		}
	}
	for _, v := range src.Grid {
		if v != nil {
			p.Grid = append(p.Grid, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Grid = append(p.Grid, nil)
		}
	}
	for _, v := range src.Com {
		if v != nil {
			p.Com = append(p.Com, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.Com = append(p.Com, nil)
		}
	}
	for _, v := range src.View {
		if v != nil {
			p.View = append(p.View, &Entry{Name: v.Name, Pack: 0, Index: 0})
		} else {
			p.View = append(p.View, nil)
		}
	}
	return nil
}
