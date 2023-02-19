package pack

import (
	basil "github.com/bis83/basilico/pkg/basil"
)

func writePageScript(bsl *basil.Basil) error {
	for _, path := range scripts {
		js, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		bsl.AddScript(js)
	}
	return nil
}
