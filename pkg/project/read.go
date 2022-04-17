package project

import (
	"os"
	"path/filepath"

	toml "github.com/pelletier/go-toml/v2"
)

func readSetup(path string) (*Setup, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var s Setup
	if err := toml.Unmarshal(data, &s); err != nil {
		return nil, err
	}
	return &s, nil
}

func readCorePage() (*Page, error) {
	data, err := fs.ReadFile("toml/core.toml")
	if err != nil {
		return nil, err
	}
	var page Page
	if err := toml.Unmarshal(data, &page); err != nil {
		return nil, err
	}
	return &page, nil
}

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

func readPage(path string) (*Page, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var page Page
	if err := toml.Unmarshal(data, &page); err != nil {
		return nil, err
	}
	return &page, nil
}

func listPages(baseDir string) ([]*Page, error) {
	pageDir := filepath.Join(baseDir, "pages")
	list, err := listPageFiles(pageDir)
	if err != nil {
		return nil, err
	}
	var pages []*Page
	for _, file := range list {
		page, err := readPage(file)
		if err != nil {
			return nil, err
		}
		pages = append(pages, page)
	}
	core, err2 := readCorePage()
	if err2 != nil {
		return nil, err2
	}
	pages = append(pages, core)
	return pages, nil
}

func Read(baseDir string) (*Project, error) {
	tomlPath := filepath.Join(baseDir, "setup.toml")
	setup, err := readSetup(tomlPath)
	if err != nil {
		return nil, err
	}
	var prj Project
	prj.Setup = setup
	pages, err2 := listPages(baseDir)
	if err2 != nil {
		return nil, err2
	}
	for _, page := range pages {
		for _, mesh := range page.Mesh {
			prj.Mesh = append(prj.Mesh, mesh)
		}
		for _, texture := range page.Texture {
			prj.Texture = append(prj.Texture, texture)
		}
		for _, shader := range page.Shader {
			prj.Shader = append(prj.Shader, shader)
		}
	}
	return &prj, nil
}
