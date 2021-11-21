
const decodeDrawStaticMesh = (data) => {
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
        data.matrix = gl_staticBuffer($gl.UNIFORM_BUFFER, mAligned);
    }
    return data;
};

const decodeDraw = (data) => {
    if(data.static) {
        data.static = data.static.map(data => decodeDrawStaticMesh(data));
    }
    return data;
};
