package build

var scripts = []string{
	// misc
	"web/js/misc/base64.js",
	"web/js/misc/angle.js",
	"web/js/misc/vec3.js",
	"web/js/misc/mat4.js",
	"web/js/misc/collision.js",
	"web/js/misc/listen.js",
	"web/js/misc/localstorage.js",
	"web/js/misc/graphics.js",
	"web/js/misc/audio.js",

	// store
	"web/js/store/store_data.js",
	"web/js/store/store_gamepad.js",
	"web/js/store/store_config.js",
	"web/js/store/store_save.js",
	"web/js/store/store_frame.js",

	// update
	"web/js/update/update_start_game.js",
	"web/js/update/update_start_frame.js",
	"web/js/update/update_player.js",
	"web/js/update/update_camera.js",

	// draw
	"web/js/draw/draw_start_frame.js",
	"web/js/draw/draw_prop.js",

	// main
	"web/js/main.js",
}
