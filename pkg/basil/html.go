package basil

import (
	"bytes"
	"html/template"
)

func (p *Basil) makeIndexHtml() error {
	var b bytes.Buffer

	fr, err := fs.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("index").Parse(string(fr)))
	if err := tpl.Execute(&b, p.config); err != nil {
		return err
	}
	p.AddFile("index.html", b.Bytes())

	return nil
}
