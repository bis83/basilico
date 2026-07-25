package basil

import (
	"bytes"
	"html/template"
	"os"
	"path/filepath"
)

func (p *Basil) buildStyleCss() error {
	fr, err := fs.ReadFile("web/style.css")
	if err != nil {
		return err
	}
	p.AddFile("style.css", fr)

	return nil
}

func (p *Basil) buildIndexHtml() error {
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

func (p *Basil) buildExtern() error {
	for _, rsc := range p.config.Extern {
		data, err := os.ReadFile(filepath.Join(p.baseDir, rsc))
		if err != nil {
			return err
		}
		p.AddFile(rsc, data)
	}
	return nil
}
