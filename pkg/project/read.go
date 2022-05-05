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

	var tomls = []string{
		"toml/core.toml",
	}
	for _, file := range tomls {
		var page Page
		if err := page.ReadFS(file); err != nil {
			return nil, err
		}
		pages = append(pages, &page)
	}

	return pages, nil
}

func Read(baseDir string) (*Project, error) {
	var setup Setup
	tomlPath := filepath.Join(baseDir, "setup.toml")
	if err := setup.Read(tomlPath); err != nil {
		return nil, err
	}

	pages, err2 := listPages(baseDir)
	if err2 != nil {
		return nil, err2
	}

	var prj Project
	prj.Set(&setup, pages)
	return &prj, nil
}
