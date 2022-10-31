package data

import (
	"encoding/base64"
	"os"
	"path/filepath"

	project "github.com/bis83/basilico/pkg/project"
)

type Image struct {
	Source  string `json:"src"`
	Sampler int    `json:"s"`
}

func (p *Image) Set(prj *project.Project, img *project.Image) error {
	b, err := os.ReadFile(filepath.Join(prj.BaseDir, img.Source))
	if err != nil {
		return err
	}
	p.Source = base64.StdEncoding.EncodeToString(b)
	p.Sampler = img.Sampler
	return nil
}
