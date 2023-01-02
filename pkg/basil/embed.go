package basil

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/core.js",
}
