
const decodeUpdateGround = (data) => {
    if(data.b) {
        data.b = base64ToFloat32Array(data.b)
    }
    if(data.dop6) {
        data.dop6 = base64ToInt32Array(data.dop6)
    }
    if(data.dop8) {
        data.dop8 = base64ToInt32Array(data.dop8)
    }
    if(data.dop12) {
        data.dop12 = base64ToInt32Array(data.dop12)
    }
    return data;
};

const decodeUpdate = (data) => {
    if(data.ground) {
        data.ground = data.ground.map(data => decodeUpdateGround(data));
    }
    return data;
};

const decodeDrawStaticMesh = (gl, data) => {
    if(data.matrix) {
        const m = base64ToFloat32Array(data.matrix);
        data.count = Math.floor(m.length / 16);
        // NOTE: gl.bindBufferRange required UNIFORM_BUFFER_OFFSET_ALIGNMENT
        const mAligned = new Float32Array(data.count * 64);
        for(let i=0; i<data.count; ++i) {
            for(j=0; j<16; ++j) {
                mAligned[i*64+j] = m[i*16+j];
            }
        }
        data.size = 64;
        data.stride = 256;
        data.matrix = gl_staticBuffer(gl, gl.UNIFORM_BUFFER, mAligned);
    }
    return data;
};

const decodeDraw = (gl, data) => {
    if(data.static) {
        data.static = data.static.map(data => decodeDrawStaticMesh(gl, data));
    }
    return data;
};

const decodeMesh = (gl, data) => {
    data.vao = gl.createVertexArray();
    gl.bindVertexArray(data.vao);
    if(data.b) {
        data.b = gl_staticBuffer(gl, gl.ARRAY_BUFFER, base64ToArrayBuffer(data.b));
        if(data.bv) {
            for(let i=0; i<data.bv.length; i+=2) {
                switch(data.bv[i]) {
                    case VS_LAYOUT_POSITION:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_POSITION, 3, gl.FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_NORMAL:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_NORMAL, 3, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_COLOR:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_COLOR, 4, gl.UNSIGNED_BYTE, true, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_UV:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_UV, 2, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                }
            }
        }
    }
    if(data.i) {
        data.i = gl_staticBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, base64ToArrayBuffer(data.i));
    }
    gl.bindVertexArray(null);
    return data;
};

const decodeTexture = (gl, data) => {
    data.texture = gl_createGLTexture2D(gl, gl_renderText(data.text, data.width, data.height));
    return data;
};

const decodeShader = (gl, data) => {
    data.vs = gl_createGLShader(gl, gl.VERTEX_SHADER, data.vs);
    data.fs = gl_createGLShader(gl, gl.FRAGMENT_SHADER, data.fs);
    data.prog = gl_createGLProgram(gl, data.vs, data.fs);

    if(data.u) {
        const umap = {};
        for(let u of data.u) {
            umap[u] = gl.getUniformLocation(data.prog, u);
        }
        data.u = umap;
    }
    if(data.ub) {
        const umap = {};
        let bindIndex = 0;
        for(let u of data.ub) {
            const index = gl.getUniformBlockIndex(data.prog, u);
            gl.uniformBlockBinding(data.prog, index, bindIndex);
            umap[u] = bindIndex;
            bindIndex += 1;
        }
        data.ub = umap;
    }
    
    return data;
};
