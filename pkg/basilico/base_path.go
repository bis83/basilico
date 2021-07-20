package basilico

import (
	"os"
	"path/filepath"
)

func GetBasePath() (string, error) {
	if len(os.Args) > 1 {
		return filepath.Clean(os.Args[1]), nil
	}
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	return filepath.Clean(cwd), nil
}
