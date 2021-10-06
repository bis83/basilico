package build

import (
	project "github.com/bis83/basilico/pkg/project"
)

func buildTexture(tex *project.Texture) (*Texture, error) {
	var tt Texture
	tt.Name = tex.Name
	tt.Text = tex.Text
	tt.Width = tex.Width
	tt.Height = tex.Height
	return &tt, nil
}
