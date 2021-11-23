package script

var scripts = []string{
	// math
	"web/js/math/base64.js",
	"web/js/math/angle.js",
	"web/js/math/vec3.js",
	"web/js/math/mat4.js",
	"web/js/math/shape.js",
	"web/js/math/intersect.js",
	"web/js/math/dynamics.js",

	// core
	"web/js/core/listen.js",
	"web/js/core/localstorage.js",
	"web/js/core/graphics.js",
	"web/js/core/graphics_create.js",
	"web/js/core/graphics_command.js",
	"web/js/core/audio.js",

	// decode
	"web/js/decode/decode_draw.js",
	"web/js/decode/decode_mesh.js",
	"web/js/decode/decode_shader.js",
	"web/js/decode/decode_texture.js",
	"web/js/decode/decode_update.js",

	// data
	"web/js/data.js",
	"web/js/data/data_update_ground.js",

	// store
	"web/js/store/store_input_mouse.js",
	"web/js/store/store_input_keyboard.js",
	"web/js/store/store_input_gamepad.js",
	"web/js/store/store_input_touch.js",
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
	"web/js/draw/draw_static_mesh.js",
	"web/js/draw/draw_reticle.js",
	"web/js/draw/draw.js",

	// main
	"web/js/main.js",
}
