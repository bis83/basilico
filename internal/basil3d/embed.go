package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/math.js",
	"web/js/gpu.js",
	"web/js/gpu_gbuffer.js",
	"web/js/gpu_buffer_view.js",
	"web/js/gpu_buffer_mesh.js",
	"web/js/gpu_buffer_tile.js",
	"web/js/gpu_pipeline.js",
	"web/js/gpu_pass.js",
	"web/js/hid.js",
	"web/js/stage.js",
	"web/js/get.js",
	"web/js/onload.js",
	"web/js/onload_decode.js",
	"web/js/api.js",
}
