
const makeCoreGraphics = () => {
    const canvas = document.getElementById("main")
    const gl = canvas.getContext("webgl2");
    
    const linker = makeGLShaderLinker(gl);
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
    const clearCanvas = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.2, 0.2, 0.2, 0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    const begin = () => {
        fitCanvasSize();
        clearCanvas();
    };

    const draw3d = makeDraw3d(gl, linker, meshLoader, texLoader);
    const draw2d = makeDraw2d(gl, linker, texLoader);
    const end = () => {
        const vp = { x: 0, y: 0, w: gl.canvas.width, h: gl.canvas.height };
        draw3d.render();
        draw2d.render(vp);
    };
    return {
        begin: begin,
        end: end,
        d3d: draw3d,
        d2d: draw2d,
    };
};
