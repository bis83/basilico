package project

import (
	"os"
	"path/filepath"
)

type Project struct {
	Setup   *Setup
	Mesh    []*Mesh
	Texture []*Texture
	Shader  []*Shader
	Stack   []*Stack
	UI      []*UI
	Event   []*Event

	Script []string
}

func (p *Project) Set(setup *Setup, pages []*Page, baseDir string) error {
	p.Setup = setup
	for _, page := range pages {
		for _, mesh := range page.Mesh {
			p.Mesh = append(p.Mesh, mesh)
		}
		for _, texture := range page.Texture {
			p.Texture = append(p.Texture, texture)
		}
		for _, shader := range page.Shader {
			p.Shader = append(p.Shader, shader)
		}
		for _, stack := range page.Stack {
			p.Stack = append(p.Stack, stack)
		}
		for _, ui := range page.UI {
			p.UI = append(p.UI, ui)
		}
		for _, ev := range page.Event {
			p.Event = append(p.Event, ev)
		}
	}
	for _, path := range p.Setup.Script {
		data, err := os.ReadFile(filepath.Join(baseDir, path))
		if err != nil {
			return err
		}
		p.Script = append(p.Script, string(data))
	}
	return nil
}

func (p *Project) FindView(name string) (*View, int) {
	for i, v := range p.Setup.View {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindMesh(name string) (*Mesh, int) {
	for i, v := range p.Mesh {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindTexture(name string) (*Texture, int) {
	for i, v := range p.Texture {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindShader(name string) (*Shader, int) {
	for i, v := range p.Shader {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindUI(name string) (*UI, int) {
	for i, v := range p.UI {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}

func (p *Project) FindEvent(name string) (*Event, int) {
	for i, v := range p.Event {
		if v.Name == name {
			return v, i
		}
	}
	return nil, -1
}
