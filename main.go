package main

import (
	args "github.com/bis83/basilico/pkg/args"
	run "github.com/bis83/basilico/pkg/run"
	"log"
)

func main() {
	arg, err := args.Parse()
	if err != nil {
		log.Print(err)
		return
	}
	if err := run.NewBuildRun(arg.BaseDir); err != nil {
		log.Print(err)
	}
}
