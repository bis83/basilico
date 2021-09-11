package args

import (
	"os"
	"path/filepath"

	file "github.com/bis83/basilico/pkg/file"
)

func Parse() (*Args, error) {
	if len(os.Args) <= 1 {
		cwd, err := os.Getwd()
		if err != nil {
			return nil, err
		}
		return &Args{BaseDir: filepath.Clean(cwd)}, nil
	}
	path := os.Args[1]
	if file.Exists(path) {
		if err := file.MakeDir(path); err != nil {
			return nil, err
		}
		return &Args{BaseDir: filepath.Clean(path)}, nil
	} else {
		if file.IsDir(path) {
			return &Args{BaseDir: filepath.Clean(path)}, nil
		} else {
			return &Args{BaseDir: filepath.Clean(filepath.Dir(path))}, nil
		}
	}
}
