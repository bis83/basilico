
const VS_LAYOUT_POSITION = 0;
const VS_LAYOUT_NORMAL = 1;
const VS_LAYOUT_COLOR = 2;
const VS_LAYOUT_UV = 3;

const gl_createContext = () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    return gl;
};

const gl_createGLTexture2D = (gl, img) => {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.bindTexture(gl.TEXTURE_2D, null);
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

const gl_createGLShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!success) {
        LOGGING && console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

const gl_createGLProgram = (gl, vs, fs) => {
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    const success = gl.getProgramParameter(prog, gl.LINK_STATUS);
    if(!success) {
        LOGGING && console.log(gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
    }
    return prog;
};

const gl_resizeCanvas = (gl) => {
    const width = window.innerWidth;
    if(width !== gl.canvas.width) {
        gl.canvas.width = width;
    }
    const height = window.innerHeight;
    if(height !== gl.canvas.height) {
        gl.canvas.height = height;
    }
};

const gl_clear = (gl) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

const gl_state = (gl, depth, alpha) => {
    gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    // gl.frontFace(gl.CCW);
    if(depth) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    } else {
        gl.disable(gl.DEPTH_TEST);
    }
    if(alpha) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else {
        gl.disable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
};

const gl_staticBuffer = (gl, type, data) => {
    let b = gl.createBuffer();
    gl.bindBuffer(type, b);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return b;
};

const gl_bindVertexAttribArray = (gl, location, size, type, normalized, stride, offset) => {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
};

const gl_drawMesh = (gl, mesh, no) => {
    no = no || 0;
    const mode = mesh.iv[no*3+0];
    const first = mesh.iv[no*3+1];
    const count = mesh.iv[no*3+2];

    const TYPES = [null, gl.POINTS, gl.LINES, gl.TRIANGLES];
    if(mesh.i) {
        gl.drawElements(TYPES[mode], count, gl.UNSIGNED_SHORT, 2*first);
    } else {
        gl.drawArrays(TYPES[mode], first, count);
    }
};

const gl_useTexture = (gl, texture, location) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);
    gl.uniform1i(location, 0);
};
