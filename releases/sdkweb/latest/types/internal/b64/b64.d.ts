/**
 * @fileoverview Base64 URL safe encoding utilities.
 */
/**
 * Encodes a string or Uint8Array to a Base64 URL safe string.
 * @param {string|Uint8Array|ArrayBuffer} data
 * @returns {string}
 */
export declare function encodeUrlSafe(data: string | Uint8Array | ArrayBuffer): string;
/**
 * Decodes a Base64 URL safe string to a Uint8Array.
 * @param {string} b64UrlSafe
 * @returns {Uint8Array}
 */
export declare function decodeUrlSafeToBytes(b64UrlSafe: string): Uint8Array;
/**
 * Decodes a Base64 URL safe string to a UTF-8 string.
 * @param {string} b64UrlSafe
 * @returns {string}
 */
export declare function decodeUrlSafe(b64UrlSafe: string): string;
