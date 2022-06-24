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
	IsLine   bool      `toml:"is_line"`
}

type TextureCanvas struct {
	Text   string `toml:"text"`
	Width  int    `toml:"width"`
	Height int    `toml:"height"`
}

type Texture struct {
	Name    string         `toml:"name"`
	Source  string         `toml:"src"`
	Canvas  *TextureCanvas `toml:"canvas"`
	Sampler int            `toml:"sampler"`
}

type Shader struct {
	Name           string   `toml:"name"`
	VertexShader   string   `toml:"vertex_shader"`
	FragmentShader string   `toml:"fragment_shader"`
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform_block"`
}

type Draw struct {
	Name    string `toml:"name"`
	Mesh    string `toml:"mesh"`
	Shader  string `toml:"shader"`
	Texture string `toml:"texture"`
	Ortho   bool   `toml:"ortho"`
	Depth   bool   `toml:"depth"`
	Alpha   bool   `toml:"alpha"`
}

type Item struct {
	Name string `toml:"name"`
	Text string `toml:"text"`
	Desc string `toml:"desc"`
	Icon int    `toml:"icon"`

	SaveID int `toml:"save-id"`
}

type Tile struct {
	Name string `toml:"name"`
	Text string `toml:"text"`
	Desc string `toml:"desc"`

	Draw   string `toml:"draw"`
	Height int    `toml:"height"`

	SaveID int `toml:"save-id"`
}

type UI struct {
	Name string `toml:"name"`
	Draw string `toml:"draw"`

	Width  int   `toml:"width"`
	Height int   `toml:"height"`
	Offset []int `toml:"offset"`

	Interact string `toml:"interact"`
	Gamepad  string `toml:"gamepad"`
	Keyboard string `toml:"keyboard"`
}

type Event struct {
	Name    string     `toml:"name"`
	Trigger string     `toml:"trigger"`
	Target  string     `toml:"target"`
	Action  [][]string `toml:"action"`
}

type View struct {
	Name   string   `toml:"name"`
	Draw3D bool     `toml:"draw3d"`
	SkyBox string   `toml:"skybox"`
	UI     []string `toml:"ui"`
	Event  []string `toml"event"`
}

type Page struct {
	Mesh    []*Mesh    `toml:"mesh"`
	Texture []*Texture `toml:"texture"`
	Shader  []*Shader  `toml:"shader"`
	Draw    []*Draw    `toml:"draw"`
	Item    []*Item    `toml:"item"`
	Tile    []*Tile    `toml:"tile"`
	UI      []*UI      `toml:"ui"`
	Event   []*Event   `toml:"event"`
	View    []*View    `toml:"view"`
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
