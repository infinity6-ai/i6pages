import { I6Error } from "../errors.js";
import { fs } from "../internal/fs/fs.js";
const LITERT_VERSION = "2.5.3";
const LITERT_WASM_URL = `https://cdn.jsdelivr.net/npm/@litertjs/core@${LITERT_VERSION}/wasm/`;
const DTYPE_CTORS = { float32: Float32Array, int32: Int32Array, uint8: Uint8Array };
let loadedModel = null;
async function loadModel(opts) {
  const key = `${opts.ref.name}@${opts.ref.version}`;
  if (loadedModel?.key === key) return loadedModel.compiled;
  const bytes = await fs.read(opts.ref);
  if (new TextDecoder().decode(bytes.subarray(4, 8)) !== "TFL3") {
    throw new I6Error(`infer: ${opts.ref.name} is not a tflite file`, { code: "asset" });
  }
  const litert = await import("@litertjs/core");
  const loading = litert.getGlobalLiteRtPromise();
  if (loading) await loading;
  else await litert.loadLiteRt(opts.wasmUrl ?? LITERT_WASM_URL);
  const compiled = await litert.loadAndCompile(bytes, { accelerator: "wasm" });
  if (loadedModel) loadedModel.compiled.delete();
  loadedModel = { key, litert, compiled };
  return compiled;
}
function describeModel(model) {
  const describe = (d) => ({ name: d.name, dtype: d.dtype, shape: Array.from(d.shape) });
  return { inputs: model.getInputDetails().map(describe), outputs: model.getOutputDetails().map(describe) };
}
function toTensorData(name, input, modelShape) {
  const invalid = (msg) => new I6Error(`infer: input "${name}" ${msg}`, { code: "invalid_argument" });
  const { data, shape } = input;
  if (!Array.isArray(data)) throw invalid("has no data array");
  if (!Array.isArray(shape)) throw invalid("has no shape");
  if (shape.length !== modelShape.length || shape.some((n, i) => modelShape[i] !== -1 && modelShape[i] !== n)) {
    throw invalid(`has shape [${shape}], the model needs [${modelShape}]`);
  }
  const size = shape.reduce((a, n) => a * n, 1);
  if (data.length !== size) throw invalid(`has ${data.length} values, its shape [${shape}] needs ${size}`);
  return { flat: data, shape: [...shape] };
}
async function runModel(model, inputs) {
  const tensors = {};
  let raw = {};
  try {
    for (const detail of model.getInputDetails()) {
      const input = inputs?.[detail.name];
      if (!input) throw new I6Error(`infer: input "${detail.name}" is missing`, { code: "invalid_argument" });
      const { flat, shape } = toTensorData(detail.name, input, Array.from(detail.shape));
      tensors[detail.name] = new loadedModel.litert.Tensor(new DTYPE_CTORS[detail.dtype](flat), shape);
    }
    raw = await model.run(tensors);
    const outputs = {};
    for (const [name, tensor] of Object.entries(raw)) outputs[name] = await tensor.data();
    return outputs;
  } finally {
    Object.values(raw).forEach((t) => t.delete());
    Object.values(tensors).forEach((t) => t.delete());
  }
}
export { loadModel, describeModel, runModel, toTensorData };
