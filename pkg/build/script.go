package build

import (
	"bytes"
	"encoding/json"
	"errors"
	htmlT "html/template"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	textT "text/template"

	esbuild "github.com/evanw/esbuild/pkg/api"

	project "github.com/bis83/basilico/pkg/project"
)

func makeFeature(prj *project.Project) (*Feature, error) {
	var f Feature
	f.Title = prj.Cfg.Title
	f.Logging = prj.Cfg.Logging
	f.Assert = prj.Cfg.Assert
	f.Minify = prj.Cfg.Minify

	var embed Embed
	embed.Start.Scene = prj.Cfg.Start.Scene
	embed.Start.Position = prj.Cfg.Start.Position
	embed.Start.Angle = prj.Cfg.Start.Angle
	data, err := json.Marshal(embed)
	if err != nil {
		return nil, err
	}
	f.Embed = string(data)

	return &f, nil
}

func writeIndexHtml(feat *Feature, path string) error {
	html, err := fs.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := htmlT.Must(htmlT.New("index").Parse(string(html)))
	fp, err2 := os.Create(path)
	if err2 != nil {
		return err
	}
	defer fp.Close()
	if err := tpl.Execute(fp, feat); err != nil {
		return err
	}
	return nil
}

func executeJs(feat *Feature, wr io.Writer, path string) error {
	js, err := fs.ReadFile(path)
	if err != nil {
		return err
	}
	tpl := textT.Must(textT.New("js").Parse(string(js)))
	if err := tpl.Execute(wr, feat); err != nil {
		return err
	}
	return nil
}

func makeScriptJs(feat *Feature) ([]byte, error) {
	var b bytes.Buffer
	for _, path := range scripts {
		if err := executeJs(feat, &b, path); err != nil {
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

func writeAppJs(feat *Feature, path string) error {
	data, err2 := makeScriptJs(feat)
	if err2 != nil {
		return err2
	}
	if err := os.WriteFile(path, data, 0666); err != nil {
		return err
	}
	return nil
}

func writeCoreScripts(prj *project.Project, baseDir string) error {
	feat, err := makeFeature(prj)
	if err != nil {
		return err
	}
	if err := writeIndexHtml(feat, filepath.Join(baseDir, "index.html")); err != nil {
		return err
	}
	if err := writeAppJs(feat, filepath.Join(baseDir, "app.js")); err != nil {
		return err
	}
	return nil
}
