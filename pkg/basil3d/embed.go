package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/math.js",
	"web/js/gpu.js",
	"web/js/listen.js",
	"web/js/app.js",
	"web/js/view.js",
	"web/js/gpu_frame.js",
	"web/js/basil3d.js",
}
