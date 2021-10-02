
const VS_LAYOUT_POSITION = 0;
const VS_LAYOUT_NORMAL = 1;
const VS_LAYOUT_COLOR = 2;
const VS_LAYOUT_UV = 3;

const makeGLMeshLoader = (gl) => {
    const TYPES = [null, gl.POINTS, gl.LINES, gl.TRIANGLES];

    const createBuffer = (type, data) => {
        let b = gl.createBuffer();
        gl.bindBuffer(type, b);
        gl.bufferData(type, data, gl.STATIC_DRAW);
        return b;
    };
    const bindAttribArray = (location, size, type, normalized, stride, offset) => {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
    };
    const createMeshBuffer = (data) => {
        if(!data.b) {
            return null;
        }
        const vb = createBuffer(gl.ARRAY_BUFFER, base64ToArrayBuffer(data.b));
        if(data.bv) {
            for(let i=0; i<data.bv.length; i+=2) {
                switch(data.bv[i]) {
                    case VS_LAYOUT_POSITION:
                        bindAttribArray(VS_LAYOUT_POSITION, 3, gl.FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_NORMAL:
                        bindAttribArray(VS_LAYOUT_NORMAL, 3, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_COLOR:
                        bindAttribArray(VS_LAYOUT_COLOR, 4, gl.UNSIGNED_BYTE, true, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_UV:
                        bindAttribArray(VS_LAYOUT_UV, 2, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                }
            }
        }
        return vb;
    };
    const createMeshIndexBuffer = (data) => {
        if(!data.i) {
            return null;
        }
        const ib = createBuffer(gl.ELEMENT_ARRAY_BUFFER, base64ToArrayBuffer(data.i));
        return ib;
    };
    const makeMesh = (data) => {
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        let b = createMeshBuffer(data);
        let ib = createMeshIndexBuffer(data);
        gl.bindVertexArray(null);

        const use = () => {
            gl.bindVertexArray(vao);
        }
        const draw = (no) => {
            no = no || 0;
            const mode = data.iv[no*3+0];
            const first = data.iv[no*3+1];
            const count = data.iv[no*3+2];
            if(ib) {
                gl.drawElements(TYPES[mode], count, gl.UNSIGNED_SHORT, 2*first);
            } else {
                gl.drawArrays(TYPES[mode], first, count);
            }
        };
        const dispose = () => {
            gl.deleteVertexArray(vao);
            vao = null;
            gl.deleteBuffer(b);
            b = null;
            gl.deleteBuffer(ib);
            ib = null;
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
            map[data.name] = makeMesh(data);
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
