/**
 * @fileoverview Compact variable-length bitmask operations, serialization, and deserialization.
 * Direct JavaScript port of commonz/bitmapz.
 */
/**
 * Combines all given values into a single bitmask using bitwise OR.
 * @param {...(number|bigint)} values - Bitmask values to combine.
 * @returns {number} The combined bitmask.
 */
declare function join(...values: (number | bigint)[]): number;
/**
 * Reports whether current contains all bits in expected.
 * If expected is empty, returns true.
 * @param {number|bigint} current - Bitmask to inspect.
 * @param {...(number|bigint)} expected - Required bits.
 * @returns {boolean} True if current contains all expected bits.
 */
declare function containsAll(current: number | bigint, ...expected: (number | bigint)[]): boolean;
/**
 * Reports whether current contains at least one of the bits in expected.
 * If expected is empty or current is 0, returns false.
 * @param {number|bigint} current - Bitmask to inspect.
 * @param {...(number|bigint)} expected - Expected bits.
 * @returns {boolean} True if current contains any expected bit.
 */
declare function containsAny(current: number | bigint, ...expected: (number | bigint)[]): boolean;
/**
 * Decomposes current into an array of individual set bits in ascending order.
 * If current is 0, returns an empty array.
 * @param {number|bigint} current - Bitmask to split.
 * @returns {number[]} Array of individual set bits.
 */
declare function split(current: number | bigint): number[];
/**
 * Adds or removes the given values from current based on enable.
 * @param {number|bigint} current - Starting bitmask.
 * @param {boolean} enable - True to set bits, false to clear them.
 * @param {...(number|bigint)} values - Bitmask flags to add or remove.
 * @returns {number} The updated bitmask.
 */
declare function set(current: number | bigint, enable: boolean, ...values: (number | bigint)[]): number;
/**
 * Encodes the bitmask v into a compact variable-length byte array (Uint8Array).
 * If v fits in 4 bits (0..15), it is serialized in 1 byte:
 * upper 4 bits are 0000, lower 4 bits store the value.
 * Otherwise, upper 4 bits specify the number of payload bytes (1..8),
 * lower 4 bits are 0000, followed by payload bytes in little-endian order.
 * @param {number|bigint} v - Bitmask value to serialize.
 * @returns {Uint8Array} The serialized bytes.
 */
declare function serialize(v: number | bigint): Uint8Array;
/**
 * Decodes a bitmask from data according to the variable-length encoding.
 * Throws an Error if data is empty, has an invalid length, invalid size,
 * or non-zero lower nibble when size > 0.
 * @param {Uint8Array} data - Binary encoded bitmask.
 * @returns {number|bigint} The decoded bitmask.
 */
declare function deserialize(data: Uint8Array): number | bigint;
declare const bitmapz: Readonly<{
    join: typeof join;
    containsAll: typeof containsAll;
    containsAny: typeof containsAny;
    split: typeof split;
    set: typeof set;
    serialize: typeof serialize;
    deserialize: typeof deserialize;
}>;
export { bitmapz, join, containsAll, containsAny, split, set, serialize, deserialize };
