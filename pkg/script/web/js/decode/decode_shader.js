
const decodeShader = (data) => {
    data.vs = gl_createGLShader($gl.VERTEX_SHADER, data.vs);
    data.fs = gl_createGLShader($gl.FRAGMENT_SHADER, data.fs);
    data.prog = gl_createGLProgram(data.vs, data.fs);

    if(data.u) {
        const umap = {};
        for(let u of data.u) {
            umap[u] = $gl.getUniformLocation(data.prog, u);
        }
        data.u = umap;
    }
    if(data.ub) {
        const umap = {};
        let bindIndex = 0;
        for(let u of data.ub) {
            const index = $gl.getUniformBlockIndex(data.prog, u);
            $gl.uniformBlockBinding(data.prog, index, bindIndex);
            umap[u] = bindIndex;
            bindIndex += 1;
        }
        data.ub = umap;
    }
    
    return data;
};
