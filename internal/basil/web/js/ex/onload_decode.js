const $__decodeBufferEmbed = async (str) => {
  const bytes = Uint8Array.fromBase64(str);
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const $__decodeShaderEmbed = async (str) => {
  const bytes = Uint8Array.fromBase64(str);
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const text = await new Response(stream).text();
  return text;
};
