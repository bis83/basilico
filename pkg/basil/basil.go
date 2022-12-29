package basil

import (
	"bytes"
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
)

type Basil struct {
	BaseDir string
	Config  Config

	Script bytes.Buffer
	Dist   []*file.File
}

func (p *Basil) Read(baseDir string) error {
	p.BaseDir = baseDir
	if err := p.Config.Read(p.ConfigToml()); err != nil {
		return err
	}
	return nil
}

func (p *Basil) Clean() error {
	if err := os.RemoveAll(p.DistDir()); err != nil {
		return err
	}
	p.Script.Reset()
	p.Dist = make([]*file.File, 0)
	return nil
}

func (p *Basil) Build() error {
	// build core
	if err := p.loadScript(); err != nil {
		return err
	}
	if err := p.makeAppJs(); err != nil {
		return err
	}
	if err := p.makeIndexHtml(); err != nil {
		return err
	}

	// write dist files
	if err := file.MakeDir(p.DistDir()); err != nil {
		return err
	}
	for _, file := range p.Dist {
		if err := file.Write(p.DistDir()); err != nil {
			return err
		}
	}
	return nil
}

func (p *Basil) ConfigToml() string {
	return filepath.Join(p.BaseDir, "config.toml")
}

func (p *Basil) DistDir() string {
	return filepath.Join(p.BaseDir, "dist")
}

func (p *Basil) Addr() string {
	return ":8080"
}
