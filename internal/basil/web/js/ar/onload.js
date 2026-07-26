let $__loading = 0;
let $__ar0 = {};

const $__onload = () => {
  $__loading += 1;
  (async () => {
    const path = "ar0.json";
    const res = await fetch(path);
    const json = await res.json();

    Object.assign($__ar0, json);
    if ($__ar0.wgsl) {
      await $__onloadWGSL($__ar0.wgsl, $__ar0.embed);
    }
    if ($__ar0.gltf) {
      await $__onloadGLTF($__ar0.gltf, $__ar0.embed);
    }
    delete $__ar0.embed;

    $__loading -= 1;
  })();
};

const $__onloadDone = () => {
  return $__loading <= 0;
};

const $json = (name) => {
  return $__ar0.json[name];
};
