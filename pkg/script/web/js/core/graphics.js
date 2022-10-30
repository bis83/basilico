
var $gl = null;

const gl_init = () => {
  const canvas = document.getElementById("main");
  ASSERT && console.assert(canvas !== null);
  $gl = canvas.getContext("webgl2");
  ASSERT && console.assert($gl !== null);
};
