
const $$ = {
  dt: 0,
  now: 0,
  data: {
    loading: 0,
  },
  gpu: {
    adapter: null,
    device: null,
    canvasFormat: null,
    canvas: null,
    context: null,
    bindGroupLayout: [],
    pipelineLayout: [],
    sampler: [],
    bindGroup: [],
    cbuffer: [],
    gbuffer: [],
    indexOfMeshInput: 0,
    indexOfMeshID: 0,
    indexOfIndirectArgs: 0,
    pass3d: []
  },
  audio: {
    context: null
  }
};

const $start = async (update) => {
  if (!navigator.gpu) {
    return;
  }
  await $__gpuInit();
  $__audioInit();
  $__onload();

  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
  html_listen(window, "blur", (ev) => {
  });
  html_listen(document, "click", (ev) => {
    $__audioResume();
  });
  html_listen(document, "keydown", (ev) => {
  });
  html_listen(document, "keyup", (ev) => {
  });
  html_listen(document, "mousedown", (ev) => {
  });
  html_listen(document, "mouseup", (ev) => {
  });
  html_listen(document, "mousemove", (ev) => {
  });
  html_listen(document, "touchstart", (ev) => {
  });
  html_listen(document, "touchend", (ev) => {
  });
  html_listen(document, "touchmove", (ev) => {
  });
  html_listen(document, "touchcancel", (ev) => {
  });
  html_listen(document, "gamepadconnected", (ev) => {
  });
  html_listen(document, "gamepaddisconnected", (ev) => {
  });

  const frame = (time) => {
    $$.dt = (time - $$.now) / 1000;
    $$.now = time;
    if ($__onloadDone()) {
      $__gpuFrameBegin();
      if (update) {
        update();
      }
      $__gpuFrameEnd();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

const $json = (name) => {
  return $$.data.json[name];
};

const $dt = () => {
  return $$.dt;
};

const $newCamera = () => {
  return {
    x: 0,
    y: 0,
    z: 0,
    ha: 0,
    va: 0,
    fov: 0,
    near: 0,
    far: 0
  };
};
const $cameraPosition = (camera, x, y, z) => {
  camera.x = x;
  camera.y = y;
  camera.z = z;
};
const $cameraAngle = (camera, ha, va) => {
  camera.ha = ha;
  camera.va = va;
};
const $cameraFov = (camera, fov) => {
  camera.fov = fov;
};
const $cameraZClip = (camera, near, far) => {
  camera.near = near;
  camera.far = far;
};

const $newLight = () => {
  return {
    ha: 0,
    va: 0,
    color: 0,
    ambient0: 0,
    ambient1: 0
  };
};
const $lightDirection = (light, ha, va) => {
  light.ha = ha;
  light.va = va;
};
const $lightColor = (light, r, g, b, a) => {
  light.color = [r, g, b, a];
};
const $lightAmbient0 = (light, r, g, b, a) => {
  light.ambient0 = [r, g, b, a];
};
const $lightAmbient1 = (light, r, g, b, a) => {
  light.ambient1 = [r, g, b, a];
};

const $newMesh = () => {
  return {
    x: 0,
    y: 0,
    z: 0,
    ha: 0,
    va: 0,
    f0: [1, 1, 1, 1],
    f1: [1, 0, 0, 0],
    f2: [0, 0, 0, 0]
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

const $packStage = (camera, light) => {
  const gpu = $$.gpu;

  const pack = new Float32Array(__strideOfStageInput / 4);
  { // camera
    const aspect = gpu.canvas.width / gpu.canvas.height;
    const fovy = deg2rad(camera.fov);
    const x = camera.x;
    const y = camera.y;
    const z = camera.z;
    const ha = camera.ha;
    const va = camera.va;
    const dir = vec3dir(ha, va);
    const eye = [x, y, z];
    const at = vec3add(eye, dir);
    const up = [0, 1, 0];
    const look = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, aspect, camera.near, camera.far);
    const vp = mat4multiply(look, proj);
    const ivp = mat4invert(vp);
    const ortho = mat4ortho(gpu.canvas.width, gpu.canvas.height, 0.0, 1.0);
    pack.set(vp, 0);
    pack.set(ivp, 16);
    pack.set(look, 32);
    pack.set(ortho, 48);
    pack.set(eye, 64);
  }
  { // light
    const ldir = vec3dir(light.ha, light.va);
    const color = light.color;
    const ambient0 = light.ambient0;
    const ambient1 = light.ambient1;
    pack.set(ldir, 68);
    pack.set(color, 72);
    pack.set(ambient0, 76);
    pack.set(ambient1, 80);
  }
  return pack;
};

const $packMesh = (mesh) => {
  const num = 7;
  const pack = new Float32Array(__strideOfMeshInput / 4 * num);

  const matrix = mat4angle(mesh.ha, mesh.va);
  mat4translated(matrix, mesh.x, mesh.y, mesh.z);
  pack.set(matrix, 0);
  pack.set(mesh.f0, 16); // xyzw: BaseColor
  pack.set(mesh.f1, 20); // x:Occlusion, y:Metallic, z:Roughness, w:reserved
  pack.set(mesh.f2, 24); // xyzw: EmissiveColor
  return pack;
};

const $writeStage = (pack) => {
  const gpu = $$.gpu;
  const device = $$.gpu.device;
  device.queue.writeBuffer(gpu.cbuffer[0], 0, pack);
};

const $writeMesh = (pack) => {
  const gpu = $$.gpu;
  const device = $$.gpu.device;

  device.queue.writeBuffer(gpu.cbuffer[1], gpu.indexOfMeshInput * __strideOfMeshInput, pack);
  const startIndexOfMeshInput = gpu.indexOfMeshInput;
  gpu.indexOfMeshInput += (pack.length / 4);
  return startIndexOfMeshInput;
};

const $draw = (id, lst) => {
  const gpu = $$.gpu;
  const device = $$.gpu.device;
  const gltf = $$.data.gltf;

  const mesh = gltf.mesh[id];
  if (!mesh) {
    return;
  }

  const instanceCount = lst.length;
  if (instanceCount <= 0) {
    return;
  }

  const startIndexOfMeshID = gpu.indexOfMeshID;
  device.queue.writeBuffer(gpu.cbuffer[2], gpu.indexOfMeshID * __strideOfMeshID, new Uint32Array(lst));
  gpu.indexOfMeshID += instanceCount;

  for (const sid of mesh.segment) {
    const segment = gltf.segment[sid];
    if (!segment) {
      continue;
    }

    const args = new Uint32Array(20 / 4);
    args[0] = segment.count;  // indexCount
    args[1] = instanceCount;  // instanceCount
    args[2] = 0;              // firstIndex
    args[3] = 0;              // baseVertex
    args[4] = 0;              // firstInstance, need "indirect-first-instance"
    device.queue.writeBuffer(gpu.cbuffer[3], gpu.indexOfIndirectArgs * __strideOfIndirectArgs, args);
    gpu.pass3d.push({
      sid: sid,
      indexOfMeshID: startIndexOfMeshID,
      indexOfIndirectArgs: gpu.indexOfIndirectArgs
    });
    gpu.indexOfIndirectArgs += 1;
  }
};
