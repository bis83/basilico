package project

import (
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type View struct {
	Name   string   `toml:"name"`
	Draw3D bool     `toml:"draw3d"`
	UI     []string `toml:"ui"`
	Event  []string `toml"event"`
}

type Setup struct {
	Title       string   `toml:"title"`
	Addr        string   `toml:"addr"`
	Logging     bool     `toml:"logging"`
	Assert      bool     `toml:"assert"`
	Minify      bool     `toml:"minify"`
	InitialView string   `toml:"initial-view"`
	View        []*View  `toml:"view"`
	Script      []string `toml:"script"`
}

func (p *Setup) Read(path string) error {
	var err error
	var data []byte
	data, err = os.ReadFile(path)
	if err != nil {
		return err
	}
	if err = toml.Unmarshal(data, p); err != nil {
		return err
	}
	return nil
}
