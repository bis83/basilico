
const gl_createContext = () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    return gl;
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
