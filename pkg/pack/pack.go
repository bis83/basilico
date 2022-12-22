package pack

import (
	file "github.com/bis83/basilico/pkg/file"
	pages "github.com/bis83/basilico/pkg/pages"
)

func MakePack(baseDir string, minify bool) ([]*file.File, error) {
	var fs []*file.File
	var err error
	var b []byte

	var src pages.Pages
	if err = src.Read(baseDir); err != nil {
		return nil, err
	}

	var i Index
	var p Pack

	if err = i.Set(&src); err != nil {
		return nil, err
	}
	if err = p.Set(&src, &i, 0); err != nil {
		return nil, err
	}

	b, err = marshalJSON(i, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, &file.File{"index.json", b})

	b, err = marshalJSON(p, minify)
	if err != nil {
		return nil, err
	}
	fs = append(fs, &file.File{"pack0.json", b})

	return fs, nil
}
