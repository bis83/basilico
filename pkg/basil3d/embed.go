package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/math.js",
	"web/js/gpu.js",
	"web/js/gpu_cbuffer.js",
	"web/js/gpu_gbuffer.js",
	"web/js/gpu_pipeline.js",
	"web/js/gpu_pass.js",
	"web/js/hid.js",
	"web/js/func.js",
	"web/js/view_get.js",
	"web/js/onload.js",
	"web/js/onload_decode.js",
	"web/js/api.js",
}
