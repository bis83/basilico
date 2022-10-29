package project

import (
	"bytes"
	"fmt"
	"os"

	toml "github.com/pelletier/go-toml/v2"
)

type Mesh struct {
	Name     string    `toml:"name"`
	Position []float32 `toml:"position"`
	Normal   []float32 `toml:"normal"`
	Color    []uint8   `toml:"color"`
	Uv       []float32 `toml:"uv"`
	Index    []uint16  `toml:"index"`
	IsLine   bool      `toml:"is-line"`
}

type Image struct {
	Name    string `toml:"name"`
	Source  string `toml:"src"`
	Sampler int    `toml:"sampler"`
}

type Shader struct {
	Name           string   `toml:"name"`
	VertexShader   string   `toml:"vertex-shader"`
	FragmentShader string   `toml:"fragment-shader"`
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform-block"`
}

type Draw struct {
	Name   string `toml:"name"`
	Mesh   string `toml:"mesh"`
	Shader string `toml:"shader"`
	Image  string `toml:"image"`
	Ortho  bool   `toml:"ortho"`
	Depth  bool   `toml:"depth"`
	Alpha  bool   `toml:"alpha"`
}

type View struct {
	Name   string   `toml:"name"`
	Draw3D bool     `toml:"draw3d"`
	Draw   []string `toml:"draw"`
	Com    []string `toml:"com"`
}

type Page struct {
	Mesh   []*Mesh   `toml:"mesh"`
	Image  []*Image  `toml:"image"`
	Shader []*Shader `toml:"shader"`
	Draw   []*Draw   `toml:"draw"`
	Item   []*Item   `toml:"item"`
	Base   []*Base   `toml:"base"`
	Tile   []*Tile   `toml:"tile"`
	Mob    []*Mob    `toml:"mob"`
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
