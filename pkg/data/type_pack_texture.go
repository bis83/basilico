package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Texture struct {
	Text   string `json:"text"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

func (p *Texture) Set(tex *project.Texture) error {
	p.Text = tex.Text
	p.Width = tex.Width
	p.Height = tex.Height
	return nil
}
