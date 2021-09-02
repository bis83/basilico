
const base64ToArrayBuffer = (base64) => {
    const b = window.atob(base64);
    const a = new ArrayBuffer(b.length);
    const v = new DataView(a);
    for(let i = 0; i < b.length; ++i) {
        v.setUint8(i, b.charCodeAt(i));
    }
    return a;
};

const base64ToFloat32Array = (base64) => {
    return new Float32Array(base64ToArrayBuffer(base64));
};
const base64ToUint8Array = (base64) => {
    return new Uint8Array(base64ToArrayBuffer(base64));
};
const base64ToUint16Array = (base64) => {
    return new Uint16Array(base64ToArrayBuffer(base64));
};
