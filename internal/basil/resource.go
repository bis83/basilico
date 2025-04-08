package basil

import (
	"os"
	"path/filepath"
)

func (p *Basil) makeResource() error {
	for _, rsc := range p.config.Resource {
		data, err := os.ReadFile(filepath.Join(p.baseDir, rsc))
		if err != nil {
			return err
		}
		p.AddFile(rsc, data)
	}
	return nil
}
