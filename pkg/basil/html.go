package basil

import (
	"bytes"
	"html/template"

	file "github.com/bis83/basilico/pkg/file"
)

func (p *Basil) makeIndexHtml() error {
	var b bytes.Buffer

	fr, err := fs.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("index").Parse(string(fr)))
	if err := tpl.Execute(&b, p.Config); err != nil {
		return err
	}

	var file file.File
	file.Name = "index.html"
	file.Data = b.Bytes()
	p.Dist = append(p.Dist, &file)
	return nil
}
