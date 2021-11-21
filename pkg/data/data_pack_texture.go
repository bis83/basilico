package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

func makeTexture(tex *project.Texture) (*Texture, error) {
	var tt Texture
	tt.Text = tex.Text
	tt.Width = tex.Width
	tt.Height = tex.Height
	return &tt, nil
}
