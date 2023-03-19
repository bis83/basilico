package basil3d

import (
	"fmt"

	basil "github.com/bis83/basilico/pkg/basil"
)

type Middleware struct {
}

func (p Middleware) PreBuild(bsl *basil.Basil) error {
	if err := addScript(bsl); err != nil {
		return err
	}
	if err := addPack(bsl); err != nil {
		return err
	}
	return nil
}

func addScript(bsl *basil.Basil) error {
	for _, path := range scripts {
		js, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		bsl.AddScript(js)
	}
	return nil
}

func addPack(bsl *basil.Basil) error {
	var builder Builder
	if err := builder.read(bsl.BaseDir()); err != nil {
		return err
	}
	packs, err := builder.build()
	if err != nil {
		return err
	}
	for i, p := range packs {
		path := fmt.Sprintf("pack%v.json", i)
		data, err := marshalJSON(p, bsl.Minify())
		if err != nil {
			return err
		}
		bsl.AddFile(path, data)
	}
	return nil
}
