@group(0) @binding(0) var<uniform> stage : StageInput;
@group(0) @binding(1) var zbuffer : texture_depth_2d;
@group(0) @binding(2) var gbuffer0 : texture_2d<f32>;
@group(0) @binding(3) var gbuffer1 : texture_2d<f32>;
@group(0) @binding(4) var gbuffer2 : texture_2d<f32>;
@group(0) @binding(5) var sampler0 : sampler;