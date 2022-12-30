package basil

import (
	"bytes"
	"fmt"
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type Config struct {
	Title      string   `toml:"title"`
	Message    string   `toml:"message"`
	Minify     bool     `toml:"minify"`
	Middleware []string `toml:"middleware"`
	Script     []string `toml:"script"`
	Resource   []string `toml:"resource"`
}

func (p *Config) Read(path string) error {
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
