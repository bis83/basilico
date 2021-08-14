
const makeCoreGraphics = () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    
    const shaderLinker = makeGLShaderLinker(gl);
    const meshLoader = makeGLMeshLoader(gl);
    const texLoader = makeGLTexLoader(gl);

    const fitCanvasSize = () => {
        const width = window.innerWidth;
        if(width !== gl.canvas.width) {
            gl.canvas.width = width;
        }
        const height = window.innerHeight;
        if(height !== gl.canvas.height) {
            gl.canvas.height = height;
        }
    };

    const clearColor = [0, 0, 0];
    const clearCanvas = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    const setClearColor = (r, g, b) => {
        clearColor[0] = r;
        clearColor[1] = g;
        clearColor[2] = b;
    };

    const reset = () => {
        fitCanvasSize();
        clearCanvas();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    };
    const viewport = () => {
        return { x: 0, y: 0, w: gl.canvas.width, h: gl.canvas.height };
    };
    return {
        reset: reset,
        viewport: viewport,
        shader: shaderLinker,
        mesh: meshLoader,
        texture: texLoader,
        gl: () => { return gl; },
    };
};
