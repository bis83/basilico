
const $data = {
  index: null,
  pack: [],
};

const data_loadIndex = () => {
  const path = "data/index.json";
  fetch(path).then(res => res.json()).then((json) => {
    $data.index = json;
    for (const no of $data.index.pack) {
      data_loadPack(no);
    }
  });
};

const data_loadPack = (no) => {
  const path = "data/pack" + no + ".json";
  fetch(path).then(res => res.json()).then((json) => {
    if (json.mesh) {
      json.mesh = json.mesh.map(data => decodeMesh(data));
    }
    if (json.image) {
      json.image = json.image.map(data => decodeImage(data));
    }
    if (json.shader) {
      json.shader = json.shader.map(data => decodeShader(data));
    }
    $data.pack[no] = json;
  });
};

const data_loaded = () => {
  if ($data.index === null) {
    return false;
  }
  if ($data.pack.length <= 0) {
    return false;
  }
  if ($imageLoading > 0) {
    return false;
  }
  return true;
};
