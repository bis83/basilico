package basil

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

func (p *Basil) loadCoreScript() error {
	for _, path := range scripts {
		data, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		p.AddScript(data)
	}
	return nil
}

func (p *Basil) loadAppScript() error {
	for _, path := range p.config.Script {
		data, err := os.ReadFile(filepath.Join(p.baseDir, path))
		if err != nil {
			return err
		}
		p.AddScript(data)
	}
	return nil
}

func (p *Basil) makeAppJs() error {
	// esbuild
	result := esbuild.Transform(string(p.script.Bytes()), esbuild.TransformOptions{
		MinifyWhitespace:  p.config.Minify,
		MinifyIdentifiers: p.config.Minify,
		MinifySyntax:      p.config.Minify,
		Format:            esbuild.FormatIIFE,
	})
	if len(result.Errors) > 0 || len(result.Warnings) > 0 {
		e := esbuild.FormatMessages(result.Errors, esbuild.FormatMessagesOptions{})
		w := esbuild.FormatMessages(result.Warnings, esbuild.FormatMessagesOptions{})
		return errors.New(strings.Join(append(e, w...), "\n"))
	}
	p.AddFile("app.js", result.Code)

	return nil
}
