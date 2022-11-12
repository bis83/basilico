package data

import (
	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
)

func Make(prj *project.Project) ([]file.File, error) {
	minify := prj.Setup.Minify

	var fs []file.File
	var err error
	var b []byte

	var i Index
	var p Pack

	if err = i.Set(prj); err != nil {
		return nil, err
	}
	if err = p.Set(prj, &i, 0); err != nil {
		return nil, err
	}

	b, err = marshalJSON(i, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, file.File{"index.json", b})

	b, err = marshalJSON(p, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, file.File{"pack0.json", b})

	return fs, nil
}
