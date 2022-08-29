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
	VertexShader   string   `toml:"vertex-shader"`
	FragmentShader string   `toml:"fragment-shader"`
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform-block"`
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

type Component struct {
	Name string `toml:"name"`
	Draw string `toml:"draw"`

	X       int     `toml:"x"`
	Y       int     `toml:"y"`
	Width   int     `toml:"width"`
	Height  int     `toml:"height"`
	OriginX float64 `toml:"origin-x"`
	OriginY float64 `toml:"origin-y"`

	Interact string `toml:"interact"`
	Gamepad  string `toml:"gamepad"`
	Keyboard string `toml:"keyboard"`

	Action [][]string `toml:"action"`
}

type View struct {
	Name      string   `toml:"name"`
	Draw3D    bool     `toml:"draw3d"`
	SkyBox    string   `toml:"skybox"`
	Component []string `toml:"component"`
}

type Page struct {
	Mesh      []*Mesh      `toml:"mesh"`
	Texture   []*Texture   `toml:"texture"`
	Shader    []*Shader    `toml:"shader"`
	Draw      []*Draw      `toml:"draw"`
	Item      []*Item      `toml:"item"`
	Tile      []*Tile      `toml:"tile"`
	Component []*Component `toml:"component"`
	View      []*View      `toml:"view"`
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
