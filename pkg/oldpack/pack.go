package pack

import (
	basil "github.com/bis83/basilico/pkg/basil"
	pages "github.com/bis83/basilico/pkg/oldpack/pages"
)

func makePack(bsl *basil.Basil) error {
	var err error
	var b []byte

	baseDir := bsl.BaseDir()
	minify := bsl.Minify()

	var src pages.Pages
	if err = src.Read(baseDir); err != nil {
		return err
	}

	var i Index
	if err = i.Set(&src); err != nil {
		return err
	}

	var p Pack
	if err = p.Set(&src, &i, 0); err != nil {
		return err
	}

	b, err = marshalJSON(i, minify)
	if err != nil {
		return err
	}
	bsl.AddFile("index.json", b)

	b, err = marshalJSON(p, minify)
	if err != nil {
		return err
	}
	bsl.AddFile("pack0.json", b)

	return nil
}
