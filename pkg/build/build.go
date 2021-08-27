package build

import (
	"embed"

	"bytes"
	"errors"
	"html/template"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	project "github.com/bis83/basilico/pkg/project"

	esbuild "github.com/evanw/esbuild/pkg/api"
)

//go:embed web
var fs embed.FS

func buildIndexHtml(cfg *project.Config, path string) error {
	html, err := fs.ReadFile("web/index.html")
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

func writeJs(cfg *project.Config, wr io.Writer, path string) error {
	js, err := fs.ReadFile(path)
	if err != nil {
		return err
	}
	tpl := template.Must(template.New("js").Parse(string(js)))
	if err := tpl.Execute(wr, cfg); err != nil {
		return err
	}
	return nil
}

func buildBasilicoJs(cfg *project.Config, path string) error {
	filePaths := []string{
		"web/js/math/angle.js",
		"web/js/math/vec3.js",
		"web/js/math/mat4.js",
		"web/js/math/collision.js",
		"web/js/core/core_audio.js",
		"web/js/core/core_engine.js",
		"web/js/core/core_gamepad.js",
		"web/js/core/core_gl_mesh_loader.js",
		"web/js/core/core_gl_shader_linker.js",
		"web/js/core/core_gl_tex_loader.js",
		"web/js/core/core_graphics.js",
		"web/js/core/core_resource.js",
		"web/js/core/core_userdata.js",
		"web/js/layer/layer_debug_grid.js",
		"web/js/layer/layer_debug_monitor.js",
		"web/js/layer/layer_menu.js",
		"web/js/layer/layer_player.js",
		"web/js/main.js",
	}
	var b bytes.Buffer
	for _, path := range filePaths {
		if err := writeJs(cfg, &b, path); err != nil {
			return err
		}
	}
	defines := map[string]string{
		"LOGGING": strconv.FormatBool(cfg.Logging),
		"ASSERT":  strconv.FormatBool(cfg.Assert),
	}
	result := esbuild.Transform(string(b.Bytes()), esbuild.TransformOptions{
		MinifyWhitespace:  cfg.Minify,
		MinifyIdentifiers: cfg.Minify,
		MinifySyntax:      cfg.Minify,
		Format:            esbuild.FormatIIFE,
		Define:            defines,
	})
	if len(result.Errors) > 0 || len(result.Warnings) > 0 {
		e := esbuild.FormatMessages(result.Errors, esbuild.FormatMessagesOptions{})
		w := esbuild.FormatMessages(result.Warnings, esbuild.FormatMessagesOptions{})
		return errors.New(strings.Join(append(e, w...), "\n"))
	}
	if err := os.WriteFile(path, result.Code, 0666); err != nil {
		return err
	}
	return nil
}

func buildDataJson(cfg *project.Config, path string) error {
	_, err := os.Stat(path)
	if err == nil {
		return nil
	}
	if err2 := os.Mkdir(path, 0777); err2 != nil {
		return err2
	}
	return nil
}

func Build(prj *project.Project, baseDir string) error {
	htmlFile := filepath.Join(baseDir, "index.html")
	if err := buildIndexHtml(prj.Cfg, htmlFile); err != nil {
		return err
	}
	jsFile := filepath.Join(baseDir, "basilico.js")
	if err := buildBasilicoJs(prj.Cfg, jsFile); err != nil {
		return err
	}
	dataDir := filepath.Join(baseDir, "data")
	if err := buildDataJson(prj.Cfg, dataDir); err != nil {
		return err
	}
	return nil
}
