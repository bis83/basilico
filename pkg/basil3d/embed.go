package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/gpu.js",
	"web/js/scene.js",
	"web/js/app.js",
	"web/js/basil3d.js",
}
