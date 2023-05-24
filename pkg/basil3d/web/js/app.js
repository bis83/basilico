
const basil3d_app_load = (device) => {
  const obj = {};

  const path = "app.json";
  fetch(path).then(res => res.json()).then((json) => {
    if (json.gpu) {
    }
    if (json.audio) {
    }
  });

  return obj;
};
