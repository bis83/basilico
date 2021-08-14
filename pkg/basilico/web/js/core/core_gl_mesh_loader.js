
const VS_LAYOUT_POSITION = 0;   // vec3
const VS_LAYOUT_NORMAL = 1;     // vec4

const makeGLMeshLoader = (gl) => {
    const createArrayBuffer = () => {
    };
    const createIndexBuffer = () => {
    };
    const makeMesh = (positions, color) => {
        let vao = gl.createVertexArray();

        const bind = () => {
            gl.bindVertexArray(vao);
        };
        const dispose = () => {
            gl.deleteVertexArray(vao);
            vao = null;
        };
        return {
            bind: bind,
            dispose: dispose,
        };
    };
    return {
        makeMesh: makeMesh,
    };
};
