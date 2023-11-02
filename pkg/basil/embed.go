package basil

import (
	"embed"
)

//go:embed web
var fs embed.FS

var scripts = []string{
	"web/js/html.js",
	"web/js/localstorage.js",
	"web/js/alias.js",
}
