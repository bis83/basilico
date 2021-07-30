
const makeCoreGraphics = () => {
    const canvas = document.getElementById("main")
    const gl = canvas.getContext("webgl2");

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
    const end = () => {
    };
    return {
        begin: begin,
        end: end
    };
};
