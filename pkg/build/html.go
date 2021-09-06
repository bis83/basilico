package build

import (
	project "github.com/bis83/basilico/pkg/project"
	"html/template"
	"os"
)

func writeIndexHtml(prj *project.Project, path string) error {
	html, err := fs.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("index").Parse(string(html)))
	fp, err2 := os.Create(path)
	if err2 != nil {
		return err
	}
	defer fp.Close()
	if err := tpl.Execute(fp, prj); err != nil {
		return err
	}
	return nil
}
