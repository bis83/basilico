@group(0) @binding(0) var<storage, read> pack : array<vec4<f32>>;
@group(0) @binding(1) var<uniform> slot : vec4<u32>;

fn viewProj() -> mat4x4<f32> {
  return mat4x4<f32>(
    pack[slot[0] + 0],
    pack[slot[0] + 1],
    pack[slot[0] + 2],
    pack[slot[0] + 3]);
}
fn invViewProj() -> mat4x4<f32> {
  return mat4x4<f32>(
    pack[slot[0] + 4],
    pack[slot[0] + 5],
    pack[slot[0] + 6],
    pack[slot[0] + 7]);
}
fn view() -> mat4x4<f32> {
  return mat4x4<f32>(
    pack[slot[0] + 8],
    pack[slot[0] + 9],
    pack[slot[0] + 10],
    pack[slot[0] + 11]);
}
fn ortho() -> mat4x4<f32> {
  return mat4x4<f32>(
    pack[slot[0] + 12],
    pack[slot[0] + 13],
    pack[slot[0] + 14],
    pack[slot[0] + 15]);
}
fn eyePosition() -> vec3<f32> {
  return pack[slot[0] + 16].xyz;
}
fn normalView() -> mat3x3<f32> {
  return mat3x3<f32>(
    pack[slot[0] + 8].xyz,
    pack[slot[0] + 9].xyz,
    pack[slot[0] + 10].xyz);
}

fn lightDir() -> vec3<f32> {
  return pack[slot[1] + 0].xyz;
}
fn lightColor() -> vec3<f32> {
  var v = pack[slot[1] + 1];
  return v.rgb * v.a;
}
fn ambientColor0() -> vec3<f32> {
  var v = pack[slot[1] + 2];
  return v.rgb * v.a;
}
fn ambientColor1() -> vec3<f32> {
  var v = pack[slot[1] + 3];
  return v.rgb * v.a;
}
