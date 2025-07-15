package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/math.js",
	"web/js/onload.js",
	"web/js/onload_decode.js",
	"web/js/gpu.js",
	"web/js/audio.js",
	"web/js/api.js",
}
