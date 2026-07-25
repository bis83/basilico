package basil

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

var script = map[string][]string{
	"core": {
		"web/js/core/html.js",
		"web/js/core/localstorage.js",
		"web/js/core/alias.js",
	},
	"ex": {
		"web/js/ex/math.js",
		"web/js/ex/onload.js",
		"web/js/ex/onload_decode.js",
		"web/js/ex/gpu.js",
		"web/js/ex/audio.js",
		"web/js/ex/api.js",
	},
}

func (p *Basil) loadEmbedScript(key string) error {
	for _, path := range script[key] {
		data, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		p.AddScript(data)
	}
	return nil
}

func (p *Basil) loadScript() error {
	if err := p.loadEmbedScript("core"); err != nil {
		return nil
	}
	if p.config.CoreOnly {
		return nil
	}

	// load extra script
	if err := p.loadEmbedScript("ex"); err != nil {
		return nil
	}
	return nil
}

func (p *Basil) loadUserScript() error {
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
	if err := p.loadUserScript(); err != nil {
		return err
	}
	if err := p.bundleScript(); err != nil {
		return err
	}
	return nil
}
