
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
    gbuffer: []
  },
  audio: {
    context: null
  }
};

const $dataJson = (name) => {
  return $$.data.json[name];
};

const $start = async () => {
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

  const frame = (time) => {
    $$.dt = (time - $$.now) / 1000;
    $$.now = time;
    if ($__onloadDone()) {
      $__gpuFrameBegin();
      $__gpuFrameEnd();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
