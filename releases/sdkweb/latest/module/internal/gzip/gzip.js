import { encodeUrlSafe, decodeUrlSafeToBytes } from "../b64/b64.js";
export async function gzip(data) {
  let bytes;
  if (typeof data === "string") {
    bytes = new TextEncoder().encode(data);
  } else if (data instanceof ArrayBuffer) {
    bytes = new Uint8Array(data);
  } else {
    bytes = new Uint8Array(data);
  }
  if (typeof CompressionStream === "undefined") {
    throw new Error("CompressionStream is not supported in this environment.");
  }
  const stream = new Response(bytes).body.pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
export async function gunzipString(compressedBytes) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("DecompressionStream is not supported in this environment.");
  }
  const stream = new Response(compressedBytes).body.pipeThrough(new DecompressionStream("gzip"));
  const uncompressedBytes = new Uint8Array(await new Response(stream).arrayBuffer());
  return new TextDecoder().decode(uncompressedBytes);
}
export async function gunzip(compressedBytes) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("DecompressionStream is not supported in this environment.");
  }
  const stream = new Response(compressedBytes).body.pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
export async function gzipStringToBase64Url(str) {
  const compressedBytes = await gzip(str);
  return encodeUrlSafe(compressedBytes);
}
export async function gunzipStringFromBase64Url(b64Str) {
  const compressedBytes = decodeUrlSafeToBytes(b64Str);
  return await gunzipString(compressedBytes);
}
export async function gzipJson(obj) {
  return await gzip(JSON.stringify(obj));
}
export async function gunzipJson(compressedBytes) {
  const str = await gunzipString(compressedBytes);
  return JSON.parse(str);
}
export async function gzipJsonToBase64Url(obj) {
  return await gzipStringToBase64Url(JSON.stringify(obj));
}
export async function gunzipJsonFromBase64Url(b64Str) {
  const str = await gunzipStringFromBase64Url(b64Str);
  return JSON.parse(str);
}
