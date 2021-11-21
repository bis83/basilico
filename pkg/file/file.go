package file

import (
	"os"
)

func Exists(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	return false
}

func IsDir(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	return info.IsDir()
}

func MakeDir(dir string) error {
	if Exists(dir) && IsDir(dir) {
		return nil
	}
	if err := os.MkdirAll(dir, 0777); err != nil {
		return err
	}
	return nil
}

func WriteFile(path string, data []byte) error {
	err := os.WriteFile(path, data, 0666)
	if err != nil {
		return err
	}
	return nil
}
