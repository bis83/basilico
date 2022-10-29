package project

import (
	"bytes"
	"fmt"
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type Page struct {
	Mesh   []*Mesh   `toml:"mesh"`
	Image  []*Image  `toml:"image"`
	Shader []*Shader `toml:"shader"`
	Draw   []*Draw   `toml:"draw"`
	Item   []*Item   `toml:"item"`
	Base   []*Base   `toml:"base"`
	Tile   []*Tile   `toml:"tile"`
	Mob    []*Mob    `toml:"mob"`
	Grid   []*Grid   `toml:"grid"`
	Com    []*Com    `toml:"com"`
	View   []*View   `toml:"view"`
}

func (p *Page) ReadFS(path string) error {
	data, err := fs.ReadFile(path)
	if err != nil {
		return err
	}
	r := bytes.NewReader(data)
	d := toml.NewDecoder(r)
	d.DisallowUnknownFields()
	if err := d.Decode(p); err != nil {
		return fmt.Errorf("decode %s: %w", path, err)
	}
	return nil
}

func (p *Page) ReadOS(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	r := bytes.NewReader(data)
	d := toml.NewDecoder(r)
	d.DisallowUnknownFields()
	if err := d.Decode(p); err != nil {
		return fmt.Errorf("decode %s: %w", path, err)
	}
	return nil
}
