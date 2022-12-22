package main

import (
	"errors"
	"fmt"

	basil "github.com/bis83/basilico/pkg/basil"
	serve "github.com/bis83/basilico/pkg/serve"

	toml "github.com/pelletier/go-toml/v2"
)

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
		if err := bsl.Build(); err != nil {
			return err
		}
	}
	if args.doServe {
		var srv serve.Serve
		srv.Set(&bsl)
		srv.Start()
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
