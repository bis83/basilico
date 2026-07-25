package basil

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

var scriptCore = []string{
	"web/js/core/html.js",
	"web/js/core/localstorage.js",
	"web/js/core/alias.js",
}

var scriptEx = []string{
	"web/js/ex/math.js",
	"web/js/ex/onload.js",
	"web/js/ex/onload_decode.js",
	"web/js/ex/gpu.js",
	"web/js/ex/audio.js",
	"web/js/ex/api.js",
}

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

func (p *Basil) bundleScript() error {
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

func (p *Basil) buildScript() error {
	if err := p.loadScript(); err != nil {
		return err
	}
	if err := p.loadAppScript(); err != nil {
		return err
	}
	if err := p.bundleScript(); err != nil {
		return err
	}
	return nil
}
