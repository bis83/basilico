package main

import (
	"errors"
	"fmt"

	basil "github.com/bis83/basilico/pkg/basil"
	basil3d "github.com/bis83/basilico/pkg/basil3d"
	serve "github.com/bis83/basilico/pkg/serve"

	toml "github.com/pelletier/go-toml/v2"
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

func steps() error {
	var args cmdArgs
	if err := args.parse(); err != nil {
		return err
	}

	var bsl basil.Basil
	if err := bsl.Read(args.baseDir); err != nil {
		return err
	}

	if args.doClean {
		if err := bsl.Clean(); err != nil {
			return err
		}
	}
	if args.doBuild {
		mdls, err := getMiddlewares(bsl.Middlewares())
		if err != nil {
			return err
		}
		if err := bsl.Build(mdls); err != nil {
			return err
		}
	}
	if args.doServe {
		if err := serve.Serve(&bsl); err != nil {
			return err
		}
	}
	return nil
}

func logError(err error) {
	fmt.Println(err)

	var derr1 *toml.DecodeError
	if errors.As(err, &derr1) {
		fmt.Println(derr1.String())
	}
	var derr2 *toml.StrictMissingError
	if errors.As(err, &derr2) {
		fmt.Println(derr2.String())
	}
}

func main() {
	err := steps()
	if err != nil {
		logError(err)
	}
}
