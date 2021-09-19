package build

var scripts = []string{
	// math
	"web/js/math/base64.js",
	"web/js/math/angle.js",
	"web/js/math/vec3.js",
	"web/js/math/mat4.js",
	"web/js/math/collision.js",

	// misc
	"web/js/misc/localstorage.js",
	"web/js/misc/graphics.js",

	// load
	"web/js/load/load_gl_mesh.js",
	"web/js/load/load_gl_shader.js",
	"web/js/load/load_gl_texture.js",
	"web/js/load/load_scene_billboard.js",
	"web/js/load/load_scene_prop.js",
	"web/js/load/load_bundle.js",

	// store
	"web/js/store/store_gamepad.js",
	"web/js/store/store_config.js",
	"web/js/store/store_save.js",
	"web/js/store/store_frame.js",

	// update
	"web/js/update/update_player.js",
	"web/js/update/update_camera.js",

	// draw
	"web/js/draw/draw_billboard.js",
	"web/js/draw/draw_prop.js",

	// main
	"web/js/main.js",
}
