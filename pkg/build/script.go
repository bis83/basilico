package build

import (
	"bytes"
	"errors"
	"io"
	"os"
	"strconv"
	"strings"
	"text/template"

	esbuild "github.com/evanw/esbuild/pkg/api"

	project "github.com/bis83/basilico/pkg/project"
)

func executeJs(prj *project.Project, wr io.Writer, path string) error {
	js, err := fs.ReadFile(path)
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("js").Parse(string(js)))
	if err := tpl.Execute(wr, prj); err != nil {
		return err
	}
	return nil
}

func makeScriptJs(prj *project.Project) ([]byte, error) {
	var b bytes.Buffer
	for _, path := range scripts {
		if err := executeJs(prj, &b, path); err != nil {
			return nil, err
		}
	}
	defines := map[string]string{
		"LOGGING": strconv.FormatBool(prj.Cfg.Logging),
		"ASSERT":  strconv.FormatBool(prj.Cfg.Assert),
	}
	result := esbuild.Transform(string(b.Bytes()), esbuild.TransformOptions{
		MinifyWhitespace:  prj.Cfg.Minify,
		MinifyIdentifiers: prj.Cfg.Minify,
		MinifySyntax:      prj.Cfg.Minify,
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

func writeScriptJs(prj *project.Project, path string) error {
	data, err := makeScriptJs(prj)
	if err != nil {
		return err
	}
	if err2 := os.WriteFile(path, data, 0666); err2 != nil {
		return err2
	}
	return nil
}
