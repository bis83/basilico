
const decodeMesh = (data) => {
    data.vao = $gl.createVertexArray();
    $gl.bindVertexArray(data.vao);
    if(data.b) {
        data.b = gl_staticBuffer($gl.ARRAY_BUFFER, base64ToArrayBuffer(data.b));
        if(data.bv) {
            for(let i=0; i<data.bv.length; i+=2) {
                switch(data.bv[i]) {
                    case VS_LAYOUT_POSITION:
                        gl_bindVertexAttribArray(VS_LAYOUT_POSITION, 3, $gl.FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_NORMAL:
                        gl_bindVertexAttribArray(VS_LAYOUT_NORMAL, 3, $gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_COLOR:
                        gl_bindVertexAttribArray(VS_LAYOUT_COLOR, 4, $gl.UNSIGNED_BYTE, true, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_UV:
                        gl_bindVertexAttribArray(VS_LAYOUT_UV, 2, $gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                }
            }
        }
    }
    if(data.i) {
        data.i = gl_staticBuffer($gl.ELEMENT_ARRAY_BUFFER, base64ToArrayBuffer(data.i));
    }
    $gl.bindVertexArray(null);
    return data;
};
