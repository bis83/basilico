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