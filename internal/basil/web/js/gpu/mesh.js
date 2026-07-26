const $newMesh = () => {
  return {
    x: 0,
    y: 0,
    z: 0,
    ha: 0,
    va: 0,
    f0: [1, 1, 1, 1],
    f1: [1, 0, 0, 0],
    f2: [0, 0, 0, 0],
  };
};

const $meshPosition = (mesh, x, y, z) => {
  mesh.x = x;
  mesh.y = y;
  mesh.z = z;
};

const $meshAngle = (mesh, ha, va) => {
  mesh.ha = ha;
  mesh.va = va;
};

const $meshBaseColor = (mesh, r, g, b, a) => {
  mesh.f0[0] = r;
  mesh.f0[1] = g;
  mesh.f0[2] = b;
  mesh.f0[3] = a;
};

const $meshOcclusion = (mesh, v) => {
  mesh.f1[0] = v;
};

const $meshMetallicRoughness = (mesh, metallic, roughness) => {
  mesh.f1[1] = metallic;
  mesh.f1[2] = raoughness;
};

const $meshEmissive = (mesh, r, g, b, a) => {
  mesh.f2[0] = r;
  mesh.f2[1] = g;
  mesh.f2[2] = b;
  mesh.f2[3] = a;
};

const $packMesh = (mesh) => {
  const matrix = mat4angle(mesh.ha, mesh.va);
  mat4translated(matrix, mesh.x, mesh.y, mesh.z);

  const pack = new Float32Array(4 * 7);
  pack.set(matrix, 0);
  pack.set(mesh.f0, 16); // xyzw: BaseColor
  pack.set(mesh.f1, 20); // x:Occlusion, y:Metallic, z:Roughness, w:reserved
  pack.set(mesh.f2, 24); // xyzw: EmissiveColor
  return pack;
};

const $meshInput = (name) => {
  const gltf = $ar[0].gltf;

  const mesh = gltf.mesh[name];
  if (!mesh) {
    return [];
  }
  return mesh.input || [];
};
