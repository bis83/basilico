
const gl_createGLTexture2D = (img, sampler) => {
  let texture = $gl.createTexture();
  $gl.bindTexture($gl.TEXTURE_2D, texture);
  if (sampler == 0) {
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.NEAREST);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.NEAREST);
  }
  if (sampler == 1) {
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.LINEAR);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.LINEAR);
  }
  $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
  $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
  $gl.texImage2D($gl.TEXTURE_2D, 0, $gl.RGBA, $gl.RGBA, $gl.UNSIGNED_BYTE, img);
  $gl.bindTexture($gl.TEXTURE_2D, null);
  return texture
};

const gl_updateGLTexture2D = (tex, img) => {
  $gl.bindTexture($gl.TEXTURE_2D, tex);
  $gl.texSubImage2D($gl.TEXTURE_2D, 0, 0, 0, $gl.RGBA, $gl.UNSIGNED_BYTE, img);
  $gl.bindTexture($gl.TEXTURE_2D, null);
};

const gl_createGLShader = (type, source) => {
  const shader = $gl.createShader(type);
  $gl.shaderSource(shader, source);
  $gl.compileShader(shader);
  const success = $gl.getShaderParameter(shader, $gl.COMPILE_STATUS);
  if (!success) {
    LOGGING && console.log($gl.getShaderInfoLog(shader));
    $gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const gl_createGLProgram = (vs, fs) => {
  const prog = $gl.createProgram();
  $gl.attachShader(prog, vs);
  $gl.attachShader(prog, fs);
  $gl.linkProgram(prog);
  const success = $gl.getProgramParameter(prog, $gl.LINK_STATUS);
  if (!success) {
    LOGGING && console.log($gl.getProgramInfoLog(prog));
    $gl.deleteProgram(prog);
    return null;
  }
  return prog;
};

const gl_staticBuffer = (type, data) => {
  let b = $gl.createBuffer();
  $gl.bindBuffer(type, b);
  $gl.bufferData(type, data, $gl.STATIC_DRAW);
  return b;
};

const gl_bindVertexAttribArray = (location, size, type, normalized, stride, offset) => {
  $gl.enableVertexAttribArray(location);
  $gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
};
