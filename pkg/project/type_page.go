package project

import (
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

type Texture struct {
	Name   string `toml:"name"`
	Text   string `toml:"text"`
	Width  int    `toml:"width"`
	Height int    `toml:"height"`
}

type Shader struct {
	Name           string   `toml:"name"`
	VertexShader   string   `toml:"vertex_shader"`
	FragmentShader string   `toml:"fragment_shader"`
	Uniform        []string `toml:"uniform"`
	UniformBlock   []string `toml:"uniform_block"`
}

type Stack struct {
	ID     int    `toml:"id"`
	Mesh   string `toml:"mesh"`
	Shader string `toml:"shader"`
	Height int    `toml:"height"`
}

type UI struct {
	Name     string `toml:"name"`
	Mesh     string `toml:"mesh"`
	Shader   string `toml:"shader"`
	Width    int    `toml:"width"`
	Height   int    `toml:"height"`
	Interact string `toml:"interact"`
	Offset   []int  `toml:"offset"`
}

type Page struct {
	Mesh    []*Mesh    `toml:"mesh"`
	Texture []*Texture `toml:"texture"`
	Shader  []*Shader  `toml:"shader"`
	Stack   []*Stack   `toml:"stack"`
	UI      []*UI      `toml:"ui"`
}

func (p *Page) ReadFS(path string) error {
	data, err := fs.ReadFile(path)
	if err != nil {
		return err
	}
	if err := toml.Unmarshal(data, p); err != nil {
		return err
	}
	return nil
}

func (p *Page) ReadOS(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	if err := toml.Unmarshal(data, p); err != nil {
		return err
	}
	return nil
}
