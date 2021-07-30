package basilico

import (
	"embed"

	"bytes"
	"html/template"
	"io"
	"os"
	"path/filepath"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

//go:embed web
var web embed.FS

func BuildIndexHtml(cfg *Config, path string) error {
	html, err := web.ReadFile("web/index.html")
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("index").Parse(string(html)))
	fp, err2 := os.Create(path)
	if err2 != nil {
		return err
	}
	defer fp.Close()
	if err := tpl.Execute(fp, cfg); err != nil {
		return err
	}
	return nil
}

func WriteJs(cfg *Config, wr io.Writer, path string) error {
	js, err := web.ReadFile(path)
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("js").Parse(string(js)))
	if err := tpl.Execute(wr, cfg); err != nil {
		return err
	}
	return nil
}

func BuildBasilicoJs(cfg *Config, path string) error {
	filePaths := []string{
		"web/js/misc.js",
		"web/js/core/core_audio.js",
		"web/js/core/core_browser.js",
		"web/js/core/core_graphics.js",
		"web/js/core/core_package.js",
		"web/js/core/core_space2d.js",
		"web/js/core/core_space3d.js",
		"web/js/core/core_userdata.js",
		"web/js/level/level_menu.js",
		"web/js/level/level_player.js",
		"web/js/main.js",
	}
	var b bytes.Buffer
	for _, path := range filePaths {
		if err := WriteJs(cfg, &b, path); err != nil {
			return err
		}
	}
	result := esbuild.Transform(string(b.Bytes()), esbuild.TransformOptions{
		MinifyWhitespace:  cfg.Minify,
		MinifyIdentifiers: cfg.Minify,
		MinifySyntax:      cfg.Minify,
		Format:            esbuild.FormatIIFE,
	})
	if err := os.WriteFile(path, result.Code, 0666); err != nil {
		return err
	}
	return nil
}

func BuildDataJson(cfg *Config, path string) error {
	_, err := os.Stat(path)
	if err == nil {
		return nil
	}
	if err2 := os.Mkdir(path, 0777); err2 != nil {
		return err2
	}
	return nil
}

func Build(cfg *Config, baseDir string) error {
	htmlFile := filepath.Join(baseDir, "index.html")
	if err := BuildIndexHtml(cfg, htmlFile); err != nil {
		return err
	}
	jsFile := filepath.Join(baseDir, "basilico.js")
	if err := BuildBasilicoJs(cfg, jsFile); err != nil {
		return err
	}
	dataDir := filepath.Join(baseDir, "data")
	if err := BuildDataJson(cfg, dataDir); err != nil {
		return err
	}
	return nil
}
