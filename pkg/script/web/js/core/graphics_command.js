
const gl_resizeCanvas = () => {
    const width = window.innerWidth;
    if(width !== $gl.canvas.width) {
        $gl.canvas.width = width;
    }
    const height = window.innerHeight;
    if(height !== $gl.canvas.height) {
        $gl.canvas.height = height;
    }
};

const gl_clear = () => {
    $gl.viewport(0, 0, $gl.canvas.width, $gl.canvas.height);
    $gl.clearColor(0, 0, 0, 1);
    $gl.clearDepth(1.0);
    $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
};

const gl_state = (depth, alpha) => {
    $gl.enable($gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    // gl.frontFace(gl.CCW);
    if(depth) {
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);
    } else {
        $gl.disable($gl.DEPTH_TEST);
    }
    if(alpha) {
        $gl.enable($gl.BLEND);
        $gl.blendFunc($gl.SRC_ALPHA, $gl.ONE_MINUS_SRC_ALPHA);
    } else {
        $gl.disable($gl.BLEND);
        $gl.blendFunc($gl.SRC_ALPHA, $gl.ONE_MINUS_SRC_ALPHA);
    }
};

const gl_drawMesh = (mesh, no) => {
    no = no || 0;
    const mode = mesh.iv[no*3+0];
    const first = mesh.iv[no*3+1];
    const count = mesh.iv[no*3+2];

    const TYPES = [null, $gl.POINTS, $gl.LINES, $gl.TRIANGLES];
    if(mesh.i) {
        $gl.drawElements(TYPES[mode], count, $gl.UNSIGNED_SHORT, 2*first);
    } else {
        $gl.drawArrays(TYPES[mode], first, count);
    }
};

const gl_useTexture = (texture, location) => {
    $gl.activeTexture($gl.TEXTURE0);
    $gl.bindTexture($gl.TEXTURE_2D, texture.tex);
    $gl.uniform1i(location, 0);
};
