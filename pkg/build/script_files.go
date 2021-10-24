package build

var scripts = []string{
	// misc
	"web/js/misc/base64.js",
	"web/js/misc/angle.js",
	"web/js/misc/vec3.js",
	"web/js/misc/mat4.js",
	"web/js/misc/collision.js",
	"web/js/misc/dynamics.js",
	"web/js/misc/listen.js",
	"web/js/misc/localstorage.js",
	"web/js/misc/graphics_create.js",
	"web/js/misc/graphics_command.js",
	"web/js/misc/audio.js",
	"web/js/misc/decode_bundle.js",

	// store
	"web/js/store/store_bundle.js",
	"web/js/store/store_input.js",
	"web/js/store/store_camera.js",
	"web/js/store/store_timer.js",
	"web/js/store/store_save.js",
	"web/js/store/store.js",

	// update
	"web/js/update/update_start_frame.js",
	"web/js/update/update_player.js",
	"web/js/update/update_camera.js",
	"web/js/update/update.js",

	// draw
	"web/js/draw/draw_start_frame.js",
	"web/js/draw/draw_prop.js",
	"web/js/draw/draw.js",

	// main
	"web/js/main.js",
}
