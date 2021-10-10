package main

import (
	"log"

	args "github.com/bis83/basilico/pkg/args"
	build "github.com/bis83/basilico/pkg/build"
	project "github.com/bis83/basilico/pkg/project"
	run "github.com/bis83/basilico/pkg/run"
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
	if arg.DoRun {
		err = run.Run(prj.Cfg, arg.BaseDir)
		if err != nil {
			return err
		}
	}
	return nil
}

func main() {
	err := steps()
	if err != nil {
		log.Print(err)
	}
}
