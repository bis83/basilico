const $newLight = () => {
  return {
    ha: 0,
    va: 0,
    color: 0,
    ambient0: 0,
    ambient1: 0,
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

const $packLight = (light) => {
  const ldir = vec3dir(light.ha, light.va);
  const color = light.color;
  const ambient0 = light.ambient0;
  const ambient1 = light.ambient1;

  const pack = new Float32Array(4 * 4);
  pack.set(ldir, 0);
  pack.set(color, 4);
  pack.set(ambient0, 8);
  pack.set(ambient1, 12);
  return pack;
};
