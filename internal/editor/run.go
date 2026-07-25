package editor

import (
	"github.com/bis83/basilico/internal/basil"
)

func Run(dir string, args []string) error {
	var bsl basil.Basil
	bsl.SetDir(dir)
	if err := bsl.Read(); err != nil {
		return err
	}

	if len(args) == 0 {
		args = []string{"clean", "build", "serve"}
	}

	for _, cmd := range args {
		switch cmd {
		case "clean":
			if err := bsl.Clean(); err != nil {
				return err
			}
		case "build":
			if err := bsl.Build(); err != nil {
				return err
			}
		case "serve":
			if err := serve(&bsl); err != nil {
				return err
			}
		}
	}

	return nil
}
