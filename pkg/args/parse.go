package args

import (
	"errors"
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
)

func Parse() (*Args, error) {
	var args Args

	// Default BaseDir
	cwd, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	args.BaseDir = filepath.Clean(cwd)

	// No Arguments
	if len(os.Args) <= 1 {
		args.DoInit = true
		args.DoBuild = true
		args.DoServe = true
		return &args, nil
	}
	if len(os.Args) >= 2 {
		command := os.Args[1]
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
	}
	if len(os.Args) >= 3 {
		path := os.Args[2]
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
	}
	return &args, nil
}
