package basil

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

func (p *Basil) loadScript() error {
	for _, path := range scriptCore {
		data, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		p.AddScript(data)
	}
	if p.config.CoreOnly {
		return nil
	}

	// extera core
	for _, path := range scriptEx {
		data, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		p.AddScript(data)
	}
	return nil
}

func (p *Basil) loadAppScript() error {
	for _, path := range p.config.Use {
		data, err := os.ReadFile(filepath.Join(p.baseDir, path))
		if err != nil {
			return err
		}
		p.AddScript(data)
	}
	return nil
}

func (p *Basil) bundleAppJs() error {
	// esbuild
	result := esbuild.Transform(p.script.String(), esbuild.TransformOptions{
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

func (p *Basil) makeAppJs() error {
	if err := p.loadScript(); err != nil {
		return err
	}
	if err := p.loadAppScript(); err != nil {
		return err
	}
	if err := p.bundleAppJs(); err != nil {
		return err
	}
	return nil
}
