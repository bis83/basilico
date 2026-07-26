let $__loading = 0;
let $ar = [];

const $__arInit = () => {
  $__loading += 1;
  (async () => {
    const path = "ar0.json";
    const res = await fetch(path);
    const json = await res.json();

    $ar[0] = {};
    Object.assign($ar[0], json);
    if ($ar[0].wgsl) {
      await $__onloadWGSL($ar[0].wgsl, $ar[0].embed);
    }
    if ($ar[0].gltf) {
      await $__onloadGLTF($ar[0].gltf, $ar[0].embed);
    }
    delete $ar[0].embed;

    $__loading -= 1;
  })();
};

const $__arLoadCompleted = () => {
  return $__loading <= 0;
};

const $json = (name) => {
  return $ar[0].json[name];
};
