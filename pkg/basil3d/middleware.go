package basil3d

import (
	basil "github.com/bis83/basilico/pkg/basil"
)

type Middleware struct {
}

func (p Middleware) PreBuild(bsl *basil.Basil) error {
	var builder Builder
	if err := builder.read(bsl.BaseDir()); err != nil {
		return err
	}

	// generate app.json
	app, err := builder.build()
	if err != nil {
		return err
	}
	path := "app.json"
	data, err := marshalJSON(app, bsl.Minify())
	if err != nil {
		return err
	}
	bsl.AddFile(path, data)

	// generate script
	for _, path := range scripts {
		js, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		bsl.AddScript(js)
	}

	return nil
}
