package args

import (
	"os"
	"path/filepath"
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
	info, err := os.Stat(path)
	if err != nil {
		if err2 := os.MkdirAll(path, 0777); err2 != nil {
			return nil, err2
		}
		return &Args{BaseDir: filepath.Clean(path)}, nil
	} else {
		if info.IsDir() {
			return &Args{BaseDir: filepath.Clean(path)}, nil
		} else {
			return &Args{BaseDir: filepath.Clean(filepath.Dir(path))}, nil
		}
	}
}
