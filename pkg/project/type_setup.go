package project

import (
	"bytes"
	"fmt"
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type Setup struct {
	Title       string   `toml:"title"`
	Addr        string   `toml:"addr"`
	Logging     bool     `toml:"logging"`
	Assert      bool     `toml:"assert"`
	Minify      bool     `toml:"minify"`
	InitialView string   `toml:"initial-view"`
	Script      []string `toml:"script"`
}

func (p *Setup) Read(path string) error {
	var err error
	var data []byte
	data, err = os.ReadFile(path)
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
