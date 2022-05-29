
const gl_createGLTexture2D = (img) => {
    let texture = $gl.createTexture();
    $gl.bindTexture($gl.TEXTURE_2D, texture);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.LINEAR);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.LINEAR);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
    $gl.texImage2D($gl.TEXTURE_2D, 0, $gl.RGBA, $gl.RGBA, $gl.UNSIGNED_BYTE, img);
    $gl.bindTexture($gl.TEXTURE_2D, null);
    return texture
};

const gl_renderText = (text, width, height) => {
    const canvas = document.createElement("canvas");
    if(!canvas) {
        LOGGING && console.log("FAILED: renderText");
        return null;
    }
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if(!context) {
        LOGGING && console.log("FAILED: renderText");
        return null;
    }
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "24px monospace";
    context.fillText(text, canvas.width/2, canvas.height/2);
    return canvas;
};

const gl_createGLShader = (type, source) => {
    const shader = $gl.createShader(type);
    $gl.shaderSource(shader, source);
    $gl.compileShader(shader);
    const success = $gl.getShaderParameter(shader, $gl.COMPILE_STATUS);
    if(!success) {
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
    if(!success) {
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
