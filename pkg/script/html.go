package script

import (
	"bytes"
	"html/template"
	"io"
)

func executeHtml(feat *Feature, wr io.Writer) error {
	f, err := fs.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("index").Parse(string(f)))
	if err := tpl.Execute(wr, feat); err != nil {
		return err
	}
	return nil
}

func makeIndexHtml(feat *Feature) ([]byte, error) {
	var b bytes.Buffer
	if err := executeHtml(feat, &b); err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}
