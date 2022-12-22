package basil

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"

	file "github.com/bis83/basilico/pkg/file"
)

func (p *Basil) loadScript() error {
	for _, path := range p.Setup.Script {
		data, err := os.ReadFile(filepath.Join(p.BaseDir, path))
		if err != nil {
			return err
		}
		p.Script.Write(data)
	}
	return nil
}

func (p *Basil) makeAppJs() error {
	// esbuild
	result := esbuild.Transform(string(p.Script.Bytes()), esbuild.TransformOptions{
		MinifyWhitespace:  p.Setup.Minify,
		MinifyIdentifiers: p.Setup.Minify,
		MinifySyntax:      p.Setup.Minify,
		Format:            esbuild.FormatIIFE,
	})
	if len(result.Errors) > 0 || len(result.Warnings) > 0 {
		e := esbuild.FormatMessages(result.Errors, esbuild.FormatMessagesOptions{})
		w := esbuild.FormatMessages(result.Warnings, esbuild.FormatMessagesOptions{})
		return errors.New(strings.Join(append(e, w...), "\n"))
	}

	var file file.File
	file.Name = "app.js"
	file.Data = result.Code
	p.Dist = append(p.Dist, &file)
	return nil
}
