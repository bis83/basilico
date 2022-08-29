package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

type Image struct {
	Source  string `json:"src"`
	Sampler int    `json:"s"`
}

func (p *Image) Set(img *project.Image) error {
	p.Source = img.Source
	p.Sampler = img.Sampler
	return nil
}
