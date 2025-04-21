package editor

import (
	"fmt"

	"github.com/bis83/basilico/internal/basil"
	"github.com/bis83/basilico/internal/basil3d"
)

func getMiddlewares(middlewares []string) ([]basil.Middleware, error) {
	var mdls []basil.Middleware
	for _, m := range middlewares {
		switch m {
		case "basil3d":
			mdls = append(mdls, basil3d.Middleware{})
		default:
			return nil, fmt.Errorf("UnsupportMiddleware: %v", m)
		}
	}
	return mdls, nil
}

func Run(dir string, args []string) error {
	var bsl basil.Basil
	bsl.SetDir(dir)
	if err := bsl.Read(); err != nil {
		return err
	}

	for _, cmd := range args {
		switch cmd {
		case "clean":
			if err := bsl.Clean(); err != nil {
				return err
			}
		case "build":
			mdls, err := getMiddlewares(bsl.Middlewares())
			if err != nil {
				return err
			}
			if err := bsl.Build(mdls); err != nil {
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
