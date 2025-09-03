
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
    pass3d: [],
    stage: {
      camera: {
        x: 0,
        y: 0,
        z: 0,
        ha: 0,
        va: 0,
        fov: 0,
        near: 0,
        far: 0
      },
      light: {
        ha: 0,
        va: 0,
        color: 0,
        ambient0: 0,
        ambient1: 0
      }
    }
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

const $submitCamera = (x, y, z, ha, va, fov, near, far) => {
  const camera = $$.gpu.stage.camera;
  camera.x = x;
  camera.y = y;
  camera.z = z;
  camera.ha = ha;
  camera.va = va;
  camera.fov = fov;
  camera.near = near;
  camera.far = far;
};

const $submitLightDirectional = (ha, va, color) => {
  const light = $$.gpu.stage.light;
  light.ha = ha;
  light.va = va;
  light.color = color;
};

const $submitLightAmbient = (color0, color1) => {
  const light = $$.gpu.stage.light;
  light.ambient0 = color0;
  light.ambient1 = color1;
};

const $submitMesh = (id, items) => {
  const gpu = $$.gpu;
  const device = $$.gpu.device;
  const gltf = $$.data.gltf;

  const mesh = gltf.mesh[id];
  if (!mesh) {
    return;
  }
  if (items.length <= 0) {
    return;
  }

  const startIndexOfMeshID = gpu.indexOfMeshID;
  const ids = new Uint32Array(items.length);
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];

    const matrix = mat4angle(item.ha, item.va);
    mat4translated(matrix, item.x, item.y, item.z);
    const factor0 = item.factor0;
    const factor1 = item.factor1;
    const factor2 = item.factor2;
    const factor3 = item.factor3;

    const buf = new Float32Array(__strideOfMeshInput / 4);
    buf.set(matrix, 0);
    buf.set(factor0, 16); // xyzw: BaseColor
    buf.set(factor1, 20); // x:Occlusion, y:Metallic, z:Roughness, w:reserved
    buf.set(factor2, 24); // reserved
    buf.set(factor3, 28); // reserved
    device.queue.writeBuffer(gpu.cbuffer[1], gpu.indexOfMeshInput * __strideOfMeshInput, buf);
    ids[i] = gpu.indexOfMeshInput;
    gpu.indexOfMeshInput += 1;
  }
  device.queue.writeBuffer(gpu.cbuffer[2], gpu.indexOfMeshID * __strideOfMeshID, ids);
  gpu.indexOfMeshID += items.length;

  for (const sid of mesh.segment) {
    const segment = gltf.segment[sid];
    if (!segment) {
      continue;
    }

    const args = new Uint32Array(20 / 4);
    args[0] = segment.count;  // indexCount
    args[1] = items.length;   // instanceCount
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
