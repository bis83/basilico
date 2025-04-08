
const $__decodeBufferEmbed = async (str) => {
  const base64 = window.atob(str);
  const bytes = new Uint8Array(base64.length);
  for (let i = 0; i < base64.length; ++i) {
    bytes[i] = base64.charCodeAt(i);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const $__decodeShaderEmbed = async (str) => {
  const base64 = window.atob(str);
  const bytes = new Uint8Array(base64.length);
  for (let i = 0; i < base64.length; ++i) {
    bytes[i] = base64.charCodeAt(i);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const text = await new Response(stream).text();
  return text;
};
