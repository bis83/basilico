package project

import (
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type UILayout struct {
	Pause []string `toml:"pause"`
	Main  []string `toml:"main"`
}

type Setup struct {
	Title    string    `toml:"title"`
	Addr     string    `toml:"addr"`
	Logging  bool      `toml:"logging"`
	Assert   bool      `toml:"assert"`
	Minify   bool      `toml:"minify"`
	Script   []string  `toml:"script"`
	UILayout *UILayout `toml:"ui-layout"`
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
