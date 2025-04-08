package main

import (
	"errors"
	"os"
	"path/filepath"

	basil "github.com/bis83/basilico/internal/basil"
)

type cmdArgs struct {
	baseDir string
	doClean bool
	doBuild bool
	doServe bool
}

func (p *cmdArgs) parse() error {
	// baseDir
	if len(os.Args) >= 2 {
		path := os.Args[1]
		if basil.Exists(path) {
			if basil.IsDir(path) {
				p.baseDir = filepath.Clean(path)
			} else {
				p.baseDir = filepath.Clean(filepath.Dir(path))
			}
		} else {
			if err := basil.MakeDir(path); err != nil {
				return err
			}
			p.baseDir = filepath.Clean(path)
		}
	} else {
		return errors.New("Invalid Directory.")
	}

	// subcommand
	if len(os.Args) >= 3 {
		command := os.Args[2]
		switch command {
		case "clean":
			p.doClean = true
		case "build":
			p.doClean = true
			p.doBuild = true
		case "serve":
			p.doServe = true
		default:
			return errors.New("Invalid Subcommand.")
		}
	} else {
		p.doClean = true
		p.doBuild = true
		p.doServe = true
	}

	return nil
}
