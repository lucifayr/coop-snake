/**
 * Checks if the provided condition is `true`. Throws an error with the given
 * message (if any) if the condition is `false`.
 */
export function assert(predicat: boolean, msg?: string) {
  if (!predicat) {
    throw new Error(msg ? `ASSERTION FAILED: ${msg}` : "ASSERTION FAILED!");
  }
}
