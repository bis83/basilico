package args

import (
	"errors"
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
)

func Parse() (*Args, error) {
	var args Args

	// Project Directory
	if len(os.Args) >= 2 {
		path := os.Args[1]
		if file.Exists(path) {
			if file.IsDir(path) {
				args.BaseDir = filepath.Clean(path)
			} else {
				args.BaseDir = filepath.Clean(filepath.Dir(path))
			}
		} else {
			if err := file.MakeDir(path); err != nil {
				return nil, err
			}
			args.BaseDir = filepath.Clean(path)
		}
	} else {
		return nil, errors.New("Invalid Directory.")
	}

	// Subcommand
	if len(os.Args) >= 3 {
		command := os.Args[2]
		switch command {
		case "init":
			args.DoInit = true
		case "clean":
			args.DoClean = true
		case "build":
			args.DoBuild = true
		case "serve":
			args.DoBuild = true
			args.DoServe = true
		default:
			return nil, errors.New("Invalid Subcommand.")
		}
	} else {
		args.DoInit = true
		args.DoBuild = true
		args.DoServe = true
	}
	return &args, nil
}
