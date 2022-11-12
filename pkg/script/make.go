package script

import (
	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
)

func Make(prj *project.Project) ([]file.File, error) {
	var feat Feature
	feat.Set(prj)

	var fs []file.File
	var err error
	var b []byte

	b, err = makeIndexHtml(&feat)
	if err != nil {
		return nil, err
	}
	fs = append(fs, file.File{"index.html", b})

	b, err = makeAppJs(&feat, prj.Script)
	if err != nil {
		return nil, err
	}
	fs = append(fs, file.File{"app.js", b})

	return fs, nil
}
