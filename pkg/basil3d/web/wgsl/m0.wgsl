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
  @location(3) gbuffer3 : vec4<f32>,
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
  output.gbuffer3 = inst[input.id].factor2.xyzw;
  return output;
}