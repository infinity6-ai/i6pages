/**
 * @fileoverview Debug logging of the SDK. Set `window.I6_DEBUG = true` to see it in the console.
 */
/**
 * @param {string} prefix - Printed first, followed by ":" (e.g. "infer").
 * @returns {(...args: *) => void} A logger that prints only when `window.I6_DEBUG` is true.
 */
declare const debugLogger: (prefix: string) => (...args: any) => void;
export { debugLogger };
