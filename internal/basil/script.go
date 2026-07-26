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
	"math": {
		"web/js/math/math.js",
	},
	"ar": {
		"web/js/ar/onload.js",
		"web/js/ar/decode.js",
		"web/js/ar/gltf.js",
		"web/js/ar/wgsl.js",
	},
	"gpu": {
		"web/js/gpu/device.js",
		"web/js/gpu/cbuffer.js",
		"web/js/gpu/gbuffer.js",
		"web/js/gpu/mesh.js",
		"web/js/gpu/camera.js",
		"web/js/gpu/light.js",
		"web/js/gpu/draw.js",
		"web/js/gpu/onpaint.js",
		"web/js/gpu/pass_gbuffer.js",
		"web/js/gpu/pass_ssao.js",
		"web/js/gpu/pass_hdr.js",
		"web/js/gpu/pass_ldr.js",
	},
	"audio": {
		"web/js/audio/device.js",
	},
	"event": {
		"web/js/event/onload.js",
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

	for _, key := range []string{"math", "ar", "gpu", "audio", "event"} {
		if err := p.loadEmbedScript(key); err != nil {
			return nil
		}
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
