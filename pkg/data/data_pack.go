package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

func makePack(prj *project.Project) (*Pack, error) {
	var b Pack

	draw, err := makeDraw(prj)
	if err != nil {
		return nil, err
	}
	b.Draw = draw

	update, err2 := makeUpdate(prj)
	if err2 != nil {
		return nil, err2
	}
	b.Update = update

	for _, v := range prj.Mesh {
		mesh, err := makeMesh(v)
		if err != nil {
			return nil, err
		}
		b.Mesh = append(b.Mesh, mesh)
	}
	for _, v := range prj.Texture {
		tex, err := makeTexture(v)
		if err != nil {
			return nil, err
		}
		b.Texture = append(b.Texture, tex)
	}
	for _, v := range prj.Shader {
		shader, err := makeShader(v)
		if err != nil {
			return nil, err
		}
		b.Shader = append(b.Shader, shader)
	}
	return &b, nil
}
