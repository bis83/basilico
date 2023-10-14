struct ViewInput {
  viewProj : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  view : mat4x4<f32>,
  eyePosition : vec4<f32>,
  lightDir : vec4<f32>,
  lightColor : vec4<f32>,
  ambientColor0 : vec4<f32>,
  ambientColor1 : vec4<f32>,
}