package basil3d

import (
	basil "github.com/bis83/basilico/pkg/basil"
)

type Middleware struct {
}

func (p Middleware) PreBuild(bsl *basil.Basil) error {
	if err := writeScripts(bsl); err != nil {
		return err
	}
	return nil
}

func writeScripts(bsl *basil.Basil) error {
	for _, path := range scripts {
		js, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		bsl.AddScript(js)
	}
	return nil
}
