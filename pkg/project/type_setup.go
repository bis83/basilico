package project

import (
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type SkyBox struct {
	Mesh   string `toml:"mesh"`
	Shader string `toml:"shader"`
}

type Setup struct {
	Title       string   `toml:"title"`
	Addr        string   `toml:"addr"`
	Logging     bool     `toml:"logging"`
	Assert      bool     `toml:"assert"`
	Minify      bool     `toml:"minify"`
	InitialView string   `toml:"initial-view"`
	Script      []string `toml:"script"`

	SkyBox *SkyBox `toml:"skybox"`
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
