package basil

import (
	"bytes"
	"os"
	"path/filepath"
)

type Middleware interface {
	PreBuild(bsl *Basil) error
}

type Basil struct {
	baseDir string
	config  Config

	script bytes.Buffer
	dist   []*File
}

func (p *Basil) ConfigJson() string {
	return filepath.Join(p.baseDir, "basilconfig.json")
}

func (p *Basil) BaseDir() string {
	return p.baseDir
}

func (p *Basil) DistDir() string {
	return filepath.Join(p.baseDir, "dist")
}

func (p *Basil) Minify() bool {
	return p.config.Minify
}

func (p *Basil) Middlewares() []string {
	return p.config.Middleware
}

func (p *Basil) SetDir(path string) error {
	if Exists(path) {
		if IsDir(path) {
			p.baseDir = filepath.Clean(path)
		} else {
			p.baseDir = filepath.Clean(filepath.Dir(path))
		}
	} else {
		if err := MakeDir(path); err != nil {
			return err
		}
		p.baseDir = filepath.Clean(path)
	}
	return nil
}

func (p *Basil) Read() error {
	if err := p.config.Read(p.ConfigJson()); err != nil {
		return err
	}
	return nil
}

func (p *Basil) Clean() error {
	if err := os.RemoveAll(p.DistDir()); err != nil {
		return err
	}
	p.script.Reset()
	p.dist = make([]*File, 0)
	return nil
}

func (p *Basil) Build(middleware []Middleware) error {
	if err := p.loadCoreScript(); err != nil {
		return err
	}
	for _, mdl := range middleware {
		if err := mdl.PreBuild(p); err != nil {
			return err
		}
	}
	if err := p.loadAppScript(); err != nil {
		return err
	}
	if err := p.makeAppJs(); err != nil {
		return err
	}
	if err := p.makeStyleCss(); err != nil {
		return err
	}
	if err := p.makeIndexHtml(); err != nil {
		return err
	}
	if err := p.makeResource(); err != nil {
		return err
	}
	if err := MakeDir(p.DistDir()); err != nil {
		return err
	}
	for _, file := range p.dist {
		if err := file.Write(p.DistDir()); err != nil {
			return err
		}
	}
	return nil
}

func (p *Basil) AddScript(src []byte) {
	p.script.Write(src)
}

func (p *Basil) AddFile(path string, data []byte) {
	p.dist = append(p.dist, &File{path, data})
}
