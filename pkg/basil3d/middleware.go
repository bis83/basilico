package basil3d

import (
	"io"
	
	basil "github.com/bis83/basilico/pkg/basil"
)

type Middleware struct {
}

func (p Middleware) PreBuild(bsl *basil.Basil) error {
	if err := writeScripts(&bsl.Script); err != nil {
		return err
	}
	return nil
}

func writeScripts(wr io.Writer) error {
	for _, path := range scripts {
		js, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		wr.Write(js)
	}
	return nil
}
