package basil

import (
	"os"
	"path/filepath"
)

func (p *Basil) makeResource() error {
	for _, rsc := range p.Config.Resource {
		data, err := os.ReadFile(filepath.Join(p.BaseDir, rsc))
		if err != nil {
			return err
		}

		var file File
		file.Name = rsc
		file.Data = data
		p.Dist = append(p.Dist, &file)
	}
	return nil
}
