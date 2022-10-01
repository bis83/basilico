package build

import (
	"os"
	"path/filepath"

	data "github.com/bis83/basilico/pkg/data"
	file "github.com/bis83/basilico/pkg/file"
	project "github.com/bis83/basilico/pkg/project"
	script "github.com/bis83/basilico/pkg/script"
)

func Clean(baseDir string) error {
	dir := filepath.Join(baseDir, "dist")
	if err := os.RemoveAll(dir); err != nil {
		return err
	}
	return nil
}

func buildScript(prj *project.Project, baseDir string) error {
	var err error

	var feat script.Feature
	feat.Set(prj)

	var b []byte
	b, err = script.MakeIndexHtml(&feat)
	if err != nil {
		return err
	}
	err = file.WriteFile(filepath.Join(baseDir, "index.html"), b)
	if err != nil {
		return err
	}
	b, err = script.MakeAppJs(&feat, prj.Script)
	if err != nil {
		return err
	}
	err = file.WriteFile(filepath.Join(baseDir, "app.js"), b)
	if err != nil {
		return err
	}

	return nil
}

func buildData(prj *project.Project, baseDir string) error {
	fs, err := data.MakeData(prj)
	if err != nil {
		return err
	}
	for _, f := range fs {
		err = file.WriteFile(filepath.Join(baseDir, f.Name), f.Data)
		if err != nil {
			return err
		}
	}
	return nil
}

func copyImage(prj *project.Project, srcDir string, dstDir string) error {
	for _, v := range prj.Image {
		if v == nil {
			continue
		}
		if len(v.Source) <= 0 {
			continue
		}
		err := file.CopyFile(filepath.Join(srcDir, v.Source), filepath.Join(dstDir, v.Source))
		if err != nil {
			return err
		}
	}
	return nil
}

func Build(prj *project.Project, baseDir string) error {
	var err error
	err = Clean(baseDir)
	if err != nil {
		return err
	}

	var path string
	path = filepath.Join(baseDir, "dist")
	err = file.MakeDir(path)
	if err != nil {
		return err
	}
	err = buildScript(prj, path)
	if err != nil {
		return err
	}

	path = filepath.Join(baseDir, "dist", "data")
	err = file.MakeDir(path)
	if err != nil {
		return err
	}
	err = buildData(prj, path)
	if err != nil {
		return err
	}

	path = filepath.Join(baseDir, "dist", "img")
	err = file.MakeDir(path)
	if err != nil {
		return err
	}
	err = copyImage(prj, filepath.Join(baseDir, "img"), filepath.Join(baseDir, "dist", "img"))
	if err != nil {
		return err
	}

	return nil
}
