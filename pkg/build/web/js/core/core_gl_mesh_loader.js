
const VS_LAYOUT_POSITION = 0;
const VS_LAYOUT_COLOR = 1;

const makeGLMeshLoader = (gl) => {
    const TYPES = [null, gl.POINTS, gl.LINES, gl.TRIANGLES];

    const createArrayBuffer = (data) => {
        let b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return b;
    };
    const bindAttribArray = (location, buffer, size, type, normalized, stride) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, type, normalized, stride, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    const makeMesh = (view, index, positions, colors) => {
        let pb = null;
        let cb = null;
        let ib = null;
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        if(positions) {
            pb = createArrayBuffer(positions);
            bindAttribArray(VS_LAYOUT_POSITION, pb, 3, gl.FLOAT, false, 12);
        }
        if(colors) {
            cb = createArrayBuffer(colors);
            bindAttribArray(VS_LAYOUT_COLOR, cb, 4, gl.UNSIGNED_BYTE, true, 4);
        }
        if(index) {
            ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
        }
        gl.bindVertexArray(null);

        const draw = (no) => {
            no = no || 0;
            const mode = view[no*3+0];
            const first = view[no*3+1];
            const count = view[no*3+2];
            gl.bindVertexArray(vao);
            if(ib) {
                gl.drawElements(TYPES[mode], count, gl.UNSIGHED_SHORT, 2*first);
            } else {
                gl.drawArrays(TYPES[mode], first, count);
            }
        };
        const dispose = () => {
            gl.deleteVertexArray(vao);
            gl.deleteBuffer(pb);
            gl.deleteBuffer(cb);
            gl.deleteBuffer(ib);
            pb = null;
            cb = null;
            ib = null;
            vao = null;
        };
        return {
            draw: draw,
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
