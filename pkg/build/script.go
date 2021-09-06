package build

import (
	"bytes"
	"errors"
	project "github.com/bis83/basilico/pkg/project"
	esbuild "github.com/evanw/esbuild/pkg/api"
	"io"
	"os"
	"strconv"
	"strings"
	"text/template"
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

func writeBasilicoJs(prj *project.Project, path string) error {
	filePaths := []string{
		"web/js/math/base64.js",
		"web/js/math/angle.js",
		"web/js/math/vec3.js",
		"web/js/math/mat4.js",
		"web/js/math/collision.js",
		"web/js/core/core_audio.js",
		"web/js/core/core_engine.js",
		"web/js/core/core_gamepad.js",
		"web/js/core/core_graphics.js",
		"web/js/core/core_scene.js",
		"web/js/core/core_userdata.js",
		"web/js/bundle/bundle_gl_mesh.js",
		"web/js/bundle/bundle_gl_shader.js",
		"web/js/bundle/bundle_gl_texture.js",
		"web/js/bundle/bundle_loader.js",
		"web/js/layer/layer_billboard.js",
		"web/js/layer/layer_menu.js",
		"web/js/layer/layer_player.js",
		"web/js/layer/layer_prop.js",
		"web/js/main.js",
	}
	var b bytes.Buffer
	for _, path := range filePaths {
		if err := executeJs(prj, &b, path); err != nil {
			return err
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
		return errors.New(strings.Join(append(e, w...), "\n"))
	}
	if err := os.WriteFile(path, result.Code, 0666); err != nil {
		return err
	}
	return nil
}
