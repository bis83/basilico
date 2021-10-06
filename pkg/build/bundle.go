package build

import (
	"encoding/json"
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
)

func buildBundle(prj *project.Project) (*Bundle, error) {
	var b Bundle
	for _, s := range prj.Scene {
		var d Draw
		d.Name = s.Name
		for _, p := range s.Prop {
			dp, err := buildDrawProp(p)
			if err != nil {
				return nil, err
			}
			d.Prop = append(d.Prop, dp)
		}
		var u Update
		u.Name = s.Name
		b.Draw = append(b.Draw, &d)
		b.Update = append(b.Update, &u)
	}
	for _, v := range prj.Mesh {
		mesh, err := buildMesh(v)
		if err != nil {
			return nil, err
		}
		b.Mesh = append(b.Mesh, mesh)
	}
	for _, v := range prj.Texture {
		tex, err := buildTexture(v)
		if err != nil {
			return nil, err
		}
		b.Texture = append(b.Texture, tex)
	}
	for _, v := range prj.Shader {
		shader, err := buildShader(v)
		if err != nil {
			return nil, err
		}
		b.Shader = append(b.Shader, shader)
	}
	return &b, nil
}

func marshalJson(bundle *Bundle, minify bool) ([]byte, error) {
	if minify {
		data, err := json.Marshal(bundle)
		if err != nil {
			return nil, err
		}
		return data, nil
	} else {
		data, err := json.MarshalIndent(bundle, "", "    ")
		if err != nil {
			return nil, err
		}
		return data, nil
	}
}

func writeBundle(prj *project.Project, dir string) error {
	bundle, err := buildBundle(prj)
	if err != nil {
		return err
	}
	data, err2 := marshalJson(bundle, prj.Cfg.Minify)
	if err2 != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(dir, "core.json"), data, 0666); err != nil {
		return err
	}
	return nil
}

func writeBundleJsons(prj *project.Project, dir string) error {
	if err := file.MakeDir(dir); err != nil {
		return err
	}
	if err := writeBundle(prj, dir); err != nil {
		return err
	}
	return nil
}
