package basil

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scriptCore = []string{
	"web/js/core/html.js",
	"web/js/core/localstorage.js",
	"web/js/core/alias.js",
}

var scriptEx = []string{
	"web/js/ex/math.js",
	"web/js/ex/onload.js",
	"web/js/ex/onload_decode.js",
	"web/js/ex/gpu.js",
	"web/js/ex/audio.js",
	"web/js/ex/api.js",
}

var wgsl = [][]string{
	{
		"web/wgsl/layout0.wgsl",
		"web/wgsl/module0.wgsl",
	},
	{
		"web/wgsl/layout0.wgsl",
		"web/wgsl/layout1.wgsl",
		"web/wgsl/module1.wgsl",
	},
	{
		"web/wgsl/layout0.wgsl",
		"web/wgsl/module2.wgsl",
	},
}
