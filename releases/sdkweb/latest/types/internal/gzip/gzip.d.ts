/**
 * @fileoverview Gzip compression utilities.
 */
/**
 * Compresses data (string, Uint8Array, or ArrayBuffer) using gzip.
 * @param {string|Uint8Array|ArrayBuffer} data - The data to compress.
 * @returns {Promise<Uint8Array>} The gzipped bytes.
 */
export declare function gzip(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array>;
/**
 * Decompresses gzipped bytes to a UTF-8 string.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<string>} The decompressed string.
 */
export declare function gunzipString(compressedBytes: Uint8Array | ArrayBuffer): Promise<string>;
/**
 * Decompresses gzipped bytes and returns raw Uint8Array.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<Uint8Array>} The decompressed bytes.
 */
export declare function gunzip(compressedBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
/**
 * Gzips a string and encodes it as a Base64 URL safe string.
 * @param {string} str - The string to compress and encode.
 * @returns {Promise<string>} The Base64 URL safe string.
 */
export declare function gzipStringToBase64Url(str: string): Promise<string>;
/**
 * Decodes a Base64 URL safe string and decompresses it as a UTF-8 string.
 * @param {string} b64Str - The Base64 URL safe string.
 * @returns {Promise<string>} The decompressed string.
 */
export declare function gunzipStringFromBase64Url(b64Str: string): Promise<string>;
/**
 * Gzips a given JSON object or array.
 * @param {any} obj - The JSON serializable object to compress.
 * @returns {Promise<Uint8Array>} The gzipped bytes.
 */
export declare function gzipJson(obj: any): Promise<Uint8Array>;
/**
 * Decompresses a gzipped byte array into a JSON object.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<any>} The parsed JSON object.
 */
export declare function gunzipJson(compressedBytes: Uint8Array | ArrayBuffer): Promise<any>;
/**
 * Gzips a JSON object and encodes it as a Base64 URL safe string.
 * @param {any} obj - The JSON serializable object.
 * @returns {Promise<string>} The Base64 URL safe encoded string of the gzipped JSON.
 */
export declare function gzipJsonToBase64Url(obj: any): Promise<string>;
/**
 * Decodes a Base64 URL safe string, gunzips it, and parses it as JSON.
 * @param {string} b64Str - The Base64 URL safe string containing gzipped JSON.
 * @returns {Promise<any>} The parsed JSON object.
 */
export declare function gunzipJsonFromBase64Url(b64Str: string): Promise<any>;
