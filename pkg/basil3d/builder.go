package basil3d

import (
	"github.com/qmuntal/gltf"
)

type Builder struct {
	GLTF []*gltf.Document
	JSON map[string]*interface{}
	Room map[string]*AppRoom
}

func (p *Builder) read(baseDir string) error {
	if err := p.readGLTF(baseDir); err != nil {
		return err
	}
	if err := p.readJSON(baseDir); err != nil {
		return err
	}
	if err := p.readRoom(baseDir); err != nil {
		return err
	}
	return nil
}

func (p *Builder) build() (*App, error) {
	var app App
	app.Embed = append(app.Embed, nil)
	if err := p.importWGSL(&app); err != nil {
		return nil, err
	}
	if err := p.importGLTF(&app); err != nil {
		return nil, err
	}
	if err := p.importJSON(&app); err != nil {
		return nil, err
	}
	if err := p.importRoom(&app); err != nil {
		return nil, err
	}
	return &app, nil
}
