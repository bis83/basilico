
var $gl = null;

const gl_init = () => {
  const canvas = html_canvas();
  $gl = canvas.getContext("webgl2");
};
