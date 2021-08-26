package args

import (
	"os"
	"path/filepath"
)

func Parse() (string, error) {
	if len(os.Args) <= 1 {
		cwd, err := os.Getwd()
		if err != nil {
			return "", err
		}
		return filepath.Clean(cwd), nil
	}
	path := os.Args[1]
	info, err := os.Stat(path)
	if err != nil {
		if err2 := os.MkdirAll(path, 0777); err2 != nil {
			return "", err2
		}
		return filepath.Clean(path), nil
	} else {
		if info.IsDir() {
			return filepath.Clean(path), nil
		} else {
			return filepath.Clean(filepath.Dir(path)), nil
		}
	}
}
