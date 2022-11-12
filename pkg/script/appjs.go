package script

import (
	"bytes"
	"errors"
	"io"
	"strconv"
	"strings"
	"text/template"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

func executeFS(feat *Feature, wr io.Writer, path string) error {
	js, err := fs.ReadFile(path)
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("js").Parse(string(js)))
	if err := tpl.Execute(wr, feat); err != nil {
		return err
	}
	return nil
}

func execute(feat *Feature, wr io.Writer, js string) error {
	tpl := template.Must(template.New("js").Parse(js))
	if err := tpl.Execute(wr, feat); err != nil {
		return err
	}
	return nil
}

func makeAppJs(feat *Feature, addons []string) ([]byte, error) {
	var b bytes.Buffer
	for _, path := range scripts {
		if err := executeFS(feat, &b, path); err != nil {
			return nil, err
		}
	}
	for _, js := range addons {
		if err := execute(feat, &b, js); err != nil {
			return nil, err
		}
	}
	defines := map[string]string{
		"LOGGING": strconv.FormatBool(feat.Logging),
		"ASSERT":  strconv.FormatBool(feat.Assert),
	}
	result := esbuild.Transform(string(b.Bytes()), esbuild.TransformOptions{
		MinifyWhitespace:  feat.Minify,
		MinifyIdentifiers: feat.Minify,
		MinifySyntax:      feat.Minify,
		Format:            esbuild.FormatIIFE,
		Define:            defines,
	})
	if len(result.Errors) > 0 || len(result.Warnings) > 0 {
		e := esbuild.FormatMessages(result.Errors, esbuild.FormatMessagesOptions{})
		w := esbuild.FormatMessages(result.Warnings, esbuild.FormatMessagesOptions{})
		return nil, errors.New(strings.Join(append(e, w...), "\n"))
	}
	return result.Code, nil
}
