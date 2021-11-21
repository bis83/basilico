package data

import (
	project "github.com/bis83/basilico/pkg/project"
)

func MakeData(prj *project.Project) ([]File, error) {
	minify := prj.Cfg.Minify

	var fs []File
	var err error
	var b []byte

	var c *Core
	c, err = makeCore(prj)
	if err != nil {
		return nil, err
	}
	b, err = marshalJSON(c, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, File{"core.json", b})

	var p *Pack
	p, err = makePack(prj)
	if err != nil {
		return nil, err
	}
	b, err = marshalJSON(p, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, File{"pack0.json", b})

	return fs, nil
}
