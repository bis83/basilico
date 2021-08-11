
const makeCoreGraphics = () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    
    const linker = makeGLShaderLinker(gl);
    const meshLoader = makeGLMeshLoader(gl);
    const texLoader = makeGLTexLoader(gl);

    const clearColor = [0, 0, 0];

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

    const draw3d = makeGLDraw3d(gl, linker, meshLoader, texLoader);
    const draw2d = makeGLDraw2d(gl, linker, texLoader);
    const render = () => {
        fitCanvasSize();
        clearCanvas();

        const vp = { x: 0, y: 0, w: gl.canvas.width, h: gl.canvas.height };
        draw3d.render();
        draw2d.render(vp);
    };
    return {
        render: render,
        clearColor: setClearColor,
        d3d: draw3d,
        d2d: draw2d,
    };
};
