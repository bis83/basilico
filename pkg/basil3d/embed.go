package basil3d

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/pack.js",
	"web/js/basil3d.js",
}
