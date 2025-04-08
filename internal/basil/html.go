package basil

import (
	"bytes"
	"html/template"
)

func (p *Basil) makeStyleCss() error {
	fr, err := fs.ReadFile("web/style.css")
	if err != nil {
		return err
	}
	p.AddFile("style.css", fr)

	return nil
}

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
