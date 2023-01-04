package pack

import (
	"encoding/base64"
	"os"
	"path/filepath"

	pages "github.com/bis83/basilico/pkg/pack/pages"
)

type Image struct {
	Buffer  int `json:"b"`
	Sampler int `json:"s"`
}

func (p *Image) Set(pack *Pack, src *pages.Pages, img *pages.Image) error {
	b, err := os.ReadFile(filepath.Join(src.BaseDir, img.Source))
	if err != nil {
		return err
	}
	p.Buffer = pack.AppendContent(base64.StdEncoding.EncodeToString(b))
	p.Sampler = img.Sampler
	return nil
}
