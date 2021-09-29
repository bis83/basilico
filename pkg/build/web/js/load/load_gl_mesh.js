
const VS_LAYOUT_POSITION = 0;
const VS_LAYOUT_NORMAL = 1;
const VS_LAYOUT_COLOR = 2;
const VS_LAYOUT_UV = 3;

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
    const makeMesh = (view, index, position, normal, color, uv) => {
        let pb = null;
        let nb = null;
        let cb = null;
        let ub = null;
        let ib = null;
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        if(position) {
            pb = createArrayBuffer(position);
            bindAttribArray(VS_LAYOUT_POSITION, pb, 3, gl.FLOAT, false, 0);
        }
        if(normal) {
            nb = createArrayBuffer(normal);
            bindAttribArray(VS_LAYOUT_NORMAL, nb, 3, gl.HALF_FLOAT, false, 0);
        }
        if(color) {
            cb = createArrayBuffer(color);
            bindAttribArray(VS_LAYOUT_COLOR, cb, 4, gl.UNSIGNED_BYTE, true, 0);
        }
        if(uv) {
            ub = createArrayBuffer(uv);
            bindAttribArray(VS_LAYOUT_UV, ub, 2, gl.HALF_FLOAT, false, 0);
        }
        if(index) {
            ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
        }
        gl.bindVertexArray(null);

        const use = () => {
            gl.bindVertexArray(vao);
        }
        const draw = (no) => {
            no = no || 0;
            const mode = view[no*3+0];
            const first = view[no*3+1];
            const count = view[no*3+2];
            if(ib) {
                gl.drawElements(TYPES[mode], count, gl.UNSIGNED_SHORT, 2*first);
            } else {
                gl.drawArrays(TYPES[mode], first, count);
            }
        };
        const dispose = () => {
            gl.deleteVertexArray(vao);
            gl.deleteBuffer(pb);
            gl.deleteBuffer(nb);
            gl.deleteBuffer(cb);
            gl.deleteBuffer(ub);
            gl.deleteBuffer(ib);
            pb = null;
            nb = null;
            cb = null;
            ub = null;
            ib = null;
            vao = null;
        };
        return {
            use: use,
            draw: draw,
            dispose: dispose,
        };
    };

    // loader
    const map = {};
    const get = (name) => {
        return map[name];
    };
    const load = (data) => {
        const loadOne = (data) => {
            const ib = data.index ? base64ToUint16Array(data.index) : null;
            const pb = data.position ? base64ToFloat32Array(data.position) : null;
            const nb = data.normal ? base64ToUint16Array(data.normal) : null;
            const cb = data.color ? base64ToUint8Array(data.color) : null;
            const ub = data.uv ? base64ToUint16Array(data.uv) : null;
            map[data.name] = makeMesh(data.view, ib, pb, nb, cb, ub);
        };
        if(!data) {
            return;
        }
        for(let item of data) {
            loadOne(item);
        }
    };
    return {
        get: get,
        load: load,
    };
};
