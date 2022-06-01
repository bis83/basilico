package main

import (
	"errors"
	"fmt"

	args "github.com/bis83/basilico/pkg/args"
	build "github.com/bis83/basilico/pkg/build"
	project "github.com/bis83/basilico/pkg/project"
	serve "github.com/bis83/basilico/pkg/serve"

	toml "github.com/pelletier/go-toml/v2"
)

func steps() error {
	arg, err := args.Parse()
	if err != nil {
		return err
	}
	var prj *project.Project
	if arg.DoInit {
		prj, err = project.New(arg.BaseDir)
	} else {
		prj, err = project.Read(arg.BaseDir)
	}
	if err != nil {
		return err
	}
	if arg.DoClean {
		err = build.Clean(arg.BaseDir)
		if err != nil {
			return err
		}
	}
	if arg.DoBuild {
		err = build.Build(prj, arg.BaseDir)
		if err != nil {
			return err
		}
	}
	if arg.DoServe {
		err = serve.Serve(prj.Setup, arg.BaseDir)
		if err != nil {
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
