
const basil3d_gpu_create = (device, canvasFormat) => {
  const gpu = {
    bindGroupLayout: [],
    pipelineLayout: [],
    shaderModule: [],
    pipeline: [],
    buffer: [],
    sampler: [],
    bindGroup: [],
    gbuffer: [],
  };

  gpu.shaderModule[0] = device.createShaderModule({
    code: `
    struct ViewInput {
      viewProj : mat4x4<f32>,
    }
    @group(0) @binding(0) var<uniform> view : ViewInput;

    struct InstanceInput {
      world : mat4x4<f32>,
      factor0 : vec4<f32>,
      factor1 : vec4<f32>,
    }
    @group(0) @binding(1) var<uniform> inst : InstanceInput;

    struct VertexInput {
      @location(0) position: vec3<f32>,
      @location(1) normal : vec3<f32>,
    };
    struct VertexOutput {
      @builtin(position) position : vec4<f32>,
      @location(0) normal : vec3<f32>,
    };
    struct FragmentOutput {
      @location(0) gbuffer0 : vec4<f32>,
      @location(1) gbuffer1 : vec4<f32>,
      @location(2) gbuffer2 : vec4<f32>,
    };
    @vertex
    fn mainVertex(input : VertexInput) -> VertexOutput {
      var output : VertexOutput;
      output.position = (view.viewProj * inst.world * vec4(input.position, 1.0));
      output.normal = normalize((inst.world * vec4(input.normal, 1.0)).xyz);
      return output;
    }
    @fragment
    fn mainFragment(input : VertexOutput) -> FragmentOutput {
      var output : FragmentOutput;
      output.gbuffer0 = vec4(input.normal * 0.5 + 0.5, 0);
      output.gbuffer1 = inst.factor0.xyzw;
      output.gbuffer2 = inst.factor1.xyzw;
      return output;
    }
    `,
  });
  gpu.shaderModule[1] = device.createShaderModule({
    code: `
    @vertex
    fn mainVertex(@builtin(vertex_index) id : u32) -> @builtin(position) vec4<f32> {
      return vec4(2.0f * f32((1 & id) << 1) - 1.0f, -2.0f * f32(2 & id) + 1.0f, 1.0, 1.0);
    }
    `,
  });
  gpu.shaderModule[2] = device.createShaderModule({
    code: `
    const EPSILON = 0.0001;
    const M_PI = 3.141592653589793;

    struct ViewInput {
      viewProj : mat4x4<f32>,
      invViewProj : mat4x4<f32>,
      eye : vec4<f32>,
    }
    @group(0) @binding(0) var<uniform> view : ViewInput;
    @group(0) @binding(1) var zbuffer : texture_depth_2d;
    @group(0) @binding(2) var gbuffer0 : texture_2d<f32>;
    @group(0) @binding(3) var gbuffer1 : texture_2d<f32>;
    @group(0) @binding(4) var gbuffer2 : texture_2d<f32>;

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
    fn mainFragment(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
      var xy = vec2<i32>(floor(coord.xy));
      var F0 = textureLoad(gbuffer1, xy, 0);
      var F1 = textureLoad(gbuffer2, xy, 0);
      var N = decodeNormal(xy);
      var P = decodeWorldPosition(xy);
      var V = normalize(view.eye.xyz - P);

      var L = vec3<f32>(0.0, 1.0, 0.0);
      var C_L = vec3<f32>(1.0, 1.0, 1.0) * BRDF(N, L, V, F0.rgb, F1.y, F1.z);
      var C_A = vec3<f32>(0.5, 0.5, 0.5) * (F1.x * F0.rgb);
      return vec4(C_L + C_A, 1.0);
    }
    `,
  });
  gpu.shaderModule[3] = device.createShaderModule({
    code: `
    @fragment
    fn mainFragment(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
      var C_A = vec3<f32>(0.1, 0.1, 0.1);
      return vec4(C_A, 1.0);
    }
    `,
  });
  gpu.shaderModule[4] = device.createShaderModule({
    // tonemapping: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
    code: `
    @group(0) @binding(2) var lbuffer0 : texture_2d<f32>;
    @group(0) @binding(5) var sampler0 : sampler;
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
      var r = textureSample(lbuffer0, sampler0, uv + dir * redOffset).r;
      var g = textureSample(lbuffer0, sampler0, uv + dir * greenOffset).g;
      var b = textureSample(lbuffer0, sampler0, uv + dir * blueOffset).b;
      return vec3<f32>(r, g, b);
    }
    @fragment
    fn mainFragment(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
      var uv = coord.xy / vec2<f32>(textureDimensions(lbuffer0, 0).xy);
      var color = chromaticAberration(uv);
      color *= vignette(uv);
      return vec4<f32>(toneMapping(color), 1);
    }
    `,
  });

  gpu.bindGroupLayout[0] = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
      { binding: 1, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { hasDynamicOffset: true } },
    ],
  });
  gpu.bindGroupLayout[1] = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {} },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "depth" } },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
    ],
  });

  gpu.pipelineLayout[0] = device.createPipelineLayout({
    bindGroupLayouts: [
      gpu.bindGroupLayout[0],
    ],
  });
  gpu.pipelineLayout[1] = device.createPipelineLayout({
    bindGroupLayouts: [
      gpu.bindGroupLayout[1],
    ],
  });

  gpu.pipeline[0] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[0],
    vertex: {
      module: gpu.shaderModule[0],
      entryPoint: "mainVertex",
      buffers: [
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 0 }] }, // position
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 1 }] }, // normal
        /*
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 2 }] }, // tangent
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 3 }] }, // texcoord0
        { arrayStride: 8, attributes: [{ format: "uint16x4", offset: 0, shaderLocation: 4 }] }, // joints0
        { arrayStride: 8, attributes: [{ format: "float16x4", offset: 0, shaderLocation: 5 }] }, // weights0
        { arrayStride: 4, attributes: [{ format: "uint32", offset: 0, shaderLocation: 6 }], stepMode: "instance" }, // instance
        */
      ],
    },
    fragment: {
      module: gpu.shaderModule[0],
      entryPoint: "mainFragment",
      targets: [
        { format: "rgb10a2unorm" },
        { format: "rgba8unorm" },
        { format: "rgba8unorm" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus",
    },
  });
  gpu.pipeline[1] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[2],
      entryPoint: "mainFragment",
      targets: [
        { format: "rgba16float" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "not-equal",
      format: "depth24plus",
    },
  });
  gpu.pipeline[2] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[3],
      entryPoint: "mainFragment",
      targets: [
        { format: "rgba16float" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "equal",
      format: "depth24plus",
    },
  });
  gpu.pipeline[3] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[4],
      entryPoint: "mainFragment",
      targets: [
        { format: canvasFormat },
      ],
    },
  });

  gpu.buffer[0] = device.createBuffer({
    size: 256 * 1,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  gpu.buffer[1] = device.createBuffer({
    size: 256 * 1024,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  gpu.sampler[0] = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    mipmapFilter: 'linear',
  });

  gpu.bindGroup[0] = device.createBindGroup({
    layout: gpu.bindGroupLayout[0],
    entries: [
      { binding: 0, resource: { buffer: gpu.buffer[0] }, },
      { binding: 1, resource: { buffer: gpu.buffer[1], size: 256, offset: 0 }, },
    ],
  });

  return gpu;
};
