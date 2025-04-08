struct VertexInput {
  @location(0) position: vec2<f32>,
  @location(1) color : vec4<f32>,
};
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) color : vec4<f32>,
};

@vertex
fn VS(input : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = stage.ortho * vec4<f32>(input.position, 1.0, 1.0);
  output.color = input.color;
  return output;
}
@fragment
fn FS(input : VertexOutput) -> @location(0) vec4<f32> {
  return input.color;
}