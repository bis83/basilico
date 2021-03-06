package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

func MakeData(prj *project.Project) ([]File, error) {
	minify := prj.Setup.Minify

	var fs []File
	var err error
	var b []byte

	var i Index
	if err = i.Set(prj); err != nil {
		return nil, err
	}
	b, err = marshalJSON(i, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, File{"index.json", b})

	var p Pack
	if err = p.Set(prj); err != nil {
		return nil, err
	}
	b, err = marshalJSON(p, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, File{"pack0.json", b})

	return fs, nil
}
