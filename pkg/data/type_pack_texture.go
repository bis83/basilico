package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type TextureCanvas struct {
	Text   string `json:"text"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type Texture struct {
	Source string         `json:"src"`
	Canvas *TextureCanvas `json:"cvs"`
}

func (p *Texture) Set(tex *project.Texture) error {
	p.Source = tex.Source
	if tex.Canvas != nil {
		p.Canvas = &TextureCanvas{
			Text:   tex.Canvas.Text,
			Width:  tex.Canvas.Width,
			Height: tex.Canvas.Height,
		}
	}
	return nil
}
