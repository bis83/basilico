
const VS_LAYOUT_POSITION = 0;
const VS_LAYOUT_COLOR = 1;

const makeGLMeshLoader = (gl) => {
    const createArrayBuffer = (data) => {
        let b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return b;
    };
    const createIndexBuffer = () => {
    };
    const bindAttribArray = (location, buffer, size, type, normalized, stride) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, type, normalized, stride, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };

    const makeMesh = (positions, colors) => {
        let pos = createArrayBuffer(positions);        
        let color = createArrayBuffer(colors);

        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        bindAttribArray(VS_LAYOUT_POSITION, pos, 3, gl.FLOAT, false, 12);
        bindAttribArray(VS_LAYOUT_COLOR, color, 4, gl.UNSIGNED_BYTE, true, 4);
        gl.bindVertexArray(null);

        const bind = () => {
            gl.bindVertexArray(vao);
        };
        const dispose = () => {
            gl.deleteVertexArray(vao);
            gl.deleteBuffer(color);
            gl.deleteBuffer(pos);
            pos = null;
            color = null;
            vao = null;
        };
        return {
            bind: bind,
            dispose: dispose,
        };
    };

    const meshes = {};
    const loadMesh = (data) => {
    };
    const getMesh = (name) => {
        return meshes[name];
    };

    return {
        makeMesh: makeMesh,
        loadMesh: loadMesh,
        getMesh: getMesh,
    };
};
