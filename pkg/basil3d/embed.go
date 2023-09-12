package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/math.js",
	"web/js/gpu.js",
	"web/js/gpu_buffer.js",
	"web/js/gpu_gbuffer.js",
	"web/js/listen.js",
	"web/js/app.js",
	"web/js/view.js",
	"web/js/view_camera.js",
	"web/js/view_light.js",
	"web/js/view_room.js",
	"web/js/basil3d.js",
}
