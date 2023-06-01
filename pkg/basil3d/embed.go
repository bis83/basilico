package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/math.js",
	"web/js/gpu.js",
	"web/js/app.js",
	"web/js/scene.js",
	"web/js/scene_render.js",
	"web/js/basil3d.js",
}
