
const makeCoreGraphics = () => {
    const canvas = document.getElementById("main")
    const gl = canvas.getContext("webgl2");
    
    const linker = makeGLShaderLinker(gl);
    const meshLoader = makeGLMeshLoader(gl);
    const texLoader = makeGLTexLoader(gl);

    let currentCamera = null;
    let currentScene = null;

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

    const makeCamera = () => {
        const view = makeMat44();
        const proj = makeMat44();

        identityMat44(view);
        identityMat44(proj);

        const set = (x, y, z, az, al) => {
        };
        const show = () => {
            currentCamera = {
                view: () => { return view; },
                proj: () => { return proj; }
            };
        }
        return {
            set: set,
            show: show
        };
    };
    const makeScene = () => {
        let boxes = [];

        const makeBox = (x, y, z) => {
            const prog = linker("basic");
            const render = () => {
                prog.use();
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            };
            boxes.push(render);
            return {
                dispose: () => {
                },
                set: (nx, ny, nz) => {
                    x = nx, y = ny, z = nz;
                }
            }
        };

        const render = () => {
            for(let b of boxes) {
                b();
            }
        };
        const show = () => {
            currentScene = render;
        };
        return {
            show: show,
            makeBox: makeBox,
        };
    };

    const begin = () => {
        fitCanvasSize();
        clearCanvas();
    };
    const end = () => {
        if(currentScene) {
            currentScene();
        }
    };
    return {
        begin: begin,
        end: end,
        makeCamera: makeCamera,
        makeScene: makeScene,
    };
};
