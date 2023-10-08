
const buffer0struct = `
struct ViewInput {
  viewProj : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  view : mat4x4<f32>,
  eyePosition : vec4<f32>,
  lightDir : vec4<f32>,
  lightColor : vec4<f32>,
  ambientColor0 : vec4<f32>,
  ambientColor1 : vec4<f32>,
}`;

const buffer1struct = `
struct InstanceInput {
  world : mat4x4<f32>,
  factor0 : vec4<f32>,
  factor1 : vec4<f32>,
}`;

const bindGroupLayout0 = buffer0struct + buffer1struct + `
@group(0) @binding(0) var<uniform> view : ViewInput;
@group(0) @binding(1) var<storage, read> inst : array<InstanceInput>;
`;
const bindGroupLayout1 = buffer0struct + `
@group(0) @binding(0) var<uniform> view : ViewInput;
@group(0) @binding(1) var zbuffer : texture_depth_2d;
@group(0) @binding(2) var gbuffer0 : texture_2d<f32>;
@group(0) @binding(3) var gbuffer1 : texture_2d<f32>;
@group(0) @binding(4) var gbuffer2 : texture_2d<f32>;
@group(0) @binding(5) var sampler0 : sampler;
`;

const shaderModule0 = bindGroupLayout0 + `
struct VertexInput {
  @location(0) id: u32,
  @location(1) position: vec3<f32>,
  @location(2) normal : vec3<f32>,
};
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) normal : vec3<f32>,
  @location(1) @interpolate(flat) id : u32,
};
struct FragmentOutput {
  @location(0) gbuffer0 : vec4<f32>,
  @location(1) gbuffer1 : vec4<f32>,
  @location(2) gbuffer2 : vec4<f32>,
};

@vertex
fn VS(input : VertexInput) -> VertexOutput {
  var world = inst[input.id].world;
  var nWorld = mat3x3<f32>(world[0].xyz, world[1].xyz, world[2].xyz);

  var output : VertexOutput;
  output.position = (view.viewProj * world * vec4(input.position, 1.0));
  output.normal = normalize(nWorld * input.normal);
  output.id = input.id;
  return output;
}

@fragment
fn FS(input : VertexOutput) -> FragmentOutput {
  var output : FragmentOutput;
  output.gbuffer0 = vec4(normalize(input.normal) * 0.5 + 0.5, 0);
  output.gbuffer1 = inst[input.id].factor0.xyzw;
  output.gbuffer2 = inst[input.id].factor1.xyzw;
  return output;
}
`;

// tonemapping: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
const shaderModule1 = bindGroupLayout1 + `
const EPSILON = 0.0001;
const M_PI = 3.141592653589793;

@vertex
fn VS(@builtin(vertex_index) id : u32) -> @builtin(position) vec4<f32> {
  return vec4(2.0f * f32((1 & id) << 1) - 1.0f, -2.0f * f32(2 & id) + 1.0f, 1.0, 1.0);
}

fn decodeWorldPosition(xy : vec2<i32>) -> vec3<f32> {
  var d = textureLoad(zbuffer, xy, 0);
  var uv = vec2<f32>(xy) / vec2<f32>(textureDimensions(zbuffer, 0).xy);
  var posClip = vec4<f32>(uv * vec2(2.0, -2.0) + vec2(-1.0, 1.0), d, 1);
  var posWorldW = view.invViewProj * posClip;
  var posWorld = posWorldW.xyz / posWorldW.www;
  return posWorld;
}
fn decodeNormal(xy : vec2<i32>) -> vec3<f32> {
  return normalize(textureLoad(gbuffer0, xy, 0).xyz * 2.0 - 1.0);
}
fn decodeViewNormal(xy : vec2<i32>) -> vec3<f32> {
  var nView = mat3x3<f32>(view.view[0].xyz, view.view[1].xyz, view.view[2].xyz);
  var N = normalize(textureLoad(gbuffer0, xy, 0).xyz * 2.0 - 1.0);
  N = normalize(nView * N);
  return N;
}
fn sampleEnvMap(R : vec3<f32>) -> vec3<f32> {
  return mix(
    view.ambientColor0.rgb * view.ambientColor0.a,
    view.ambientColor1.rgb * view.ambientColor1.a,
    dot(R, vec3<f32>(0, 1, 0)) * 0.5 + 0.5);
}

fn AO(uv : vec2<f32>, N : vec3<f32>) -> f32 {
  const samples : i32 = 16;
  const sampleSphere = array<vec3<f32>, samples>(
    vec3<f32>( 0.5381, 0.1856,-0.4319),
    vec3<f32>( 0.1379, 0.2486, 0.4430),
    vec3<f32>( 0.3371, 0.5679,-0.0057),
    vec3<f32>(-0.6999,-0.0451,-0.0019),
    vec3<f32>( 0.0689,-0.1598,-0.8547),
    vec3<f32>( 0.0560, 0.0069,-0.1843),
    vec3<f32>(-0.0146, 0.1402, 0.0762),
    vec3<f32>( 0.0100,-0.1924,-0.0344),
    vec3<f32>(-0.3577,-0.5301,-0.4358),
    vec3<f32>(-0.3169, 0.1063, 0.0158),
    vec3<f32>( 0.0103,-0.5869, 0.0046),
    vec3<f32>(-0.0897,-0.4940, 0.3287),
    vec3<f32>( 0.7119,-0.0154,-0.0918),
    vec3<f32>(-0.0533, 0.0596,-0.5411),
    vec3<f32>( 0.0352,-0.0631, 0.5460),
    vec3<f32>(-0.4776, 0.2847,-0.0271));

  var radius = 0.01;
  var depth = textureSample(zbuffer, sampler0, uv);

  var occ : f32 = 0.0;
  for(var i = 0; i < samples; i++) {
    var R = (sampleSphere[i] * radius);
    R *= sign(dot(R, N));
    var uv2 = saturate(uv + vec2(R.x, -R.y));
    var occDepth = textureSample(zbuffer, sampler0, uv2);
    occ += step(occDepth, depth);
  }
  return saturate(1.0 - (occ / f32(samples)) + 0.2);
}
@fragment
fn FS_SSAO(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
  var xy = vec2<i32>(floor(coord.xy));
  var uv = vec2<f32>(xy) / vec2<f32>(textureDimensions(zbuffer, 0).xy);
  var N = decodeViewNormal(xy);
  return vec4(AO(uv, N), 0, 0, 0);
}

fn D_GGX(NdH : f32, roughness : f32) -> f32 {
  var a  = roughness * roughness;
  var a2 = a * a;
  var d  = NdH * NdH * (a2 - 1.0) + 1.0;
  return (a2) / (M_PI * d*d);
}
fn G_SchlicksmithGGX(NdL : f32, NdV : f32, roughness : f32) -> f32 {
  var r = (roughness + 1.0);
  var k = (r * r) / 8.0;
  var GL = NdL / (NdL * (1.0 - k) + k);
  var GV = NdV / (NdV * (1.0 - k) + k);
  return GL * GV;
}
fn F_Schlick(VdH : f32, baseColor : vec3<f32>, metallic : f32) -> vec3<f32> {
  var F0 = mix(vec3(0.04), baseColor, metallic);
  return vec3<f32>(F0 + (1.0 - F0) * pow(1.0 - VdH, 5.0));
}
fn BRDF(N : vec3<f32>, L : vec3<f32>, V : vec3<f32>, baseColor : vec3<f32>, metallic : f32, roughness : f32) -> vec3<f32> {
  var NdL = saturate(dot(N, L));
  if(NdL > 0.0) {
    var NdV = saturate(dot(N, V));
    var H = normalize(V + L);
    var NdH = saturate(dot(N, H));
    var VdH = saturate(dot(V, H));
    
    var D = D_GGX(NdH, roughness);
    var G = G_SchlicksmithGGX(NdL, NdV, roughness);
    var F = F_Schlick(VdH, baseColor, metallic);

    var spec = (F * G * D) / max(4.0 * NdL * NdV, EPSILON);
    var diff = (1.0 - F) * (1.0 - metallic) / M_PI;
    return NdL * (diff + spec);
  } else {
    return vec3<f32>(0);
  }
}
@fragment
fn FS_HDR(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
  var xy = vec2<i32>(floor(coord.xy));
  var F0 = textureLoad(gbuffer1, xy, 0);
  var F1 = textureLoad(gbuffer2, xy, 0);
  var N = decodeNormal(xy);
  var P = decodeWorldPosition(xy);
  var V = normalize(view.eyePosition.xyz - P);
  var R = normalize(reflect(V, N));

  var L = normalize(view.lightDir.xyz);
  var C_L = (view.lightColor.rgb * view.lightColor.a) * BRDF(N, L, V, F0.rgb, F1.y, F1.z);
  var A = sampleEnvMap(R);
  var C_A = A * F1.x * F0.rgb;
  var C_E = F0.rgb * F1.w;
  return vec4(C_L + C_A + C_E, 1.0);
}

@fragment
fn FS_HDRSky(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
  var xy = vec2<i32>(floor(coord.xy));
  var P = decodeWorldPosition(xy);
  var V = normalize(view.eyePosition.xyz - P);
  var C_A = sampleEnvMap(V);
  return vec4(C_A, 1.0);
}

fn toneMapping(x : vec3<f32>) -> vec3<f32> {
  var a = 2.51f;
  var b = 0.03f;
  var c = 2.43f;
  var d = 0.59f;
  var e = 0.14f;
  return saturate((x * (a * x + b)) / (x * (c * x + d) + e));
}
fn vignette(uv : vec2<f32>) -> f32 {
  var a = uv * (1.0 - uv.yx);
  return pow(a.x * a.y * 15.0, 0.25);
}
fn chromaticAberration(uv : vec2<f32>) -> vec3<f32> {
  var redOffset = 0.002;
  var greenOffset = 0.0001;
  var blueOffset = -0.0001;
  var dir = uv - vec2<f32>(0.5, 0.5);
  var r = textureSample(gbuffer0, sampler0, uv + dir * redOffset).r;
  var g = textureSample(gbuffer0, sampler0, uv + dir * greenOffset).g;
  var b = textureSample(gbuffer0, sampler0, uv + dir * blueOffset).b;
  return vec3<f32>(r, g, b);
}
@fragment
fn FS_HDR2LDR(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
  var uv = coord.xy / vec2<f32>(textureDimensions(gbuffer0, 0).xy);
  var color = chromaticAberration(uv);
  color *= vignette(uv);
  return vec4<f32>(toneMapping(color), 1);
}
`;

const shaderModule2 = bindGroupLayout0 + `
struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) color : vec4<f32>,
};
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) color : vec4<f32>,
};

@vertex
fn VS(input : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = view.viewProj * vec4<f32>(input.position, 1.0);
  output.color = input.color;
  return output;
}
@fragment
fn FS(input : VertexOutput) -> @location(0) vec4<f32> {
  return input.color;
}
`;
