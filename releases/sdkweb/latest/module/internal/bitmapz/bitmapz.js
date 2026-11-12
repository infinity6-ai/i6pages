function join(...values) {
  let result = 0;
  for (const v of values) {
    result |= Number(v);
  }
  return result;
}
function containsAll(current, ...expected) {
  const all = join(...expected);
  const cur = Number(current);
  return (cur & all) === all;
}
function containsAny(current, ...expected) {
  const any = join(...expected);
  const cur = Number(current);
  return (cur & any) !== 0;
}
function split(current) {
  if (!current) return [];
  const result = [];
  let c = BigInt(current);
  while (c > 0n) {
    const bit = c & -c;
    result.push(Number(bit));
    c &= ~bit;
  }
  return result;
}
function set(current, enable, ...values) {
  const mask = join(...values);
  const cur = Number(current);
  return enable ? cur | mask : cur & ~mask;
}
function serialize(v) {
  const u = BigInt(v);
  if (u <= 0x0Fn) {
    return new Uint8Array([Number(u)]);
  }
  let temp = u;
  let bitLen = 0;
  while (temp > 0n) {
    bitLen++;
    temp >>= 1n;
  }
  const size = Math.floor((bitLen + 7) / 8);
  const buf = new Uint8Array(1 + size);
  buf[0] = size << 4;
  for (let i = 0; i < size; i++) {
    buf[1 + i] = Number(u >> BigInt(8 * i) & 0xFFn);
  }
  return buf;
}
function deserialize(data) {
  if (!data || data.length === 0) {
    throw new Error("bitmapz: data is empty");
  }
  const header = data[0];
  const size = header >> 4;
  if (size > 8) {
    throw new Error(`bitmapz: invalid size ${size}: bitmask size cannot exceed 8 bytes`);
  }
  if (size === 0) {
    if (data.length !== 1) {
      throw new Error(`bitmapz: invalid data length: expected 1 byte for 4-bit value, got ${data.length}`);
    }
    return header & 15;
  }
  if ((header & 15) !== 0) {
    throw new Error(`bitmapz: invalid header 0x${header.toString(16).padStart(2, "0")}: lower 4 bits must be 0 when size > 0`);
  }
  const expectedLen = 1 + size;
  if (data.length !== expectedLen) {
    throw new Error(`bitmapz: invalid data length: expected ${expectedLen} bytes for size ${size}, got ${data.length}`);
  }
  let val = 0n;
  for (let i = 0; i < size; i++) {
    val |= BigInt(data[1 + i]) << BigInt(8 * i);
  }
  if (val <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(val);
  }
  return val;
}
const bitmapz = Object.freeze({
  join,
  containsAll,
  containsAny,
  split,
  set,
  serialize,
  deserialize
});
export { bitmapz, join, containsAll, containsAny, split, set, serialize, deserialize };
