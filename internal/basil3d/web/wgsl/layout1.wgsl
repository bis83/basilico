@group(1) @binding(0) var zbuffer : texture_depth_2d;
@group(1) @binding(1) var gbuffer0 : texture_2d<f32>;
@group(1) @binding(2) var gbuffer1 : texture_2d<f32>;
@group(1) @binding(3) var gbuffer2 : texture_2d<f32>;
@group(1) @binding(4) var sampler0 : sampler;