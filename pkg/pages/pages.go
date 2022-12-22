package project

import (
	"os"
	"path/filepath"
)

func listPageFiles(dir string) ([]string, error) {
	var files []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		files = append(files, path)
		return nil
	})
	if err != nil {
		return nil, err
	}
	return files, nil
}

func listPages(baseDir string) ([]*Page, error) {
	var pages []*Page

	pageDir := filepath.Join(baseDir, "pages")
	list, err := listPageFiles(pageDir)
	if err != nil {
		return nil, err
	}
	for _, file := range list {
		var page Page
		if err := page.ReadOS(file); err != nil {
			return nil, err
		}
		pages = append(pages, &page)
	}

	return pages, nil
}
